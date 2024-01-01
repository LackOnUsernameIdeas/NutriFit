import React from "react";
import { recipesCollection } from '../../../../database/getCollection';
import { getDocs } from 'firebase/firestore';
import { Recipe, UserPreferences, Nutrient, MealPlan, CustomServings, SuggestedMaxServings, Nutrients } from "../variables/mealPlaner";

export const generateMealPlan = async (
  userPreferences: UserPreferences,
  nutrientTypes: Nutrient[],
  setSuggestedMaxServings: React.Dispatch<React.SetStateAction<SuggestedMaxServings>>,
  setCustomServings: React.Dispatch<React.SetStateAction<CustomServings>>,
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan>>,
  setNutrient: React.Dispatch<React.SetStateAction<Nutrients>>,
  customServings: CustomServings
) => {
    try {
      const recipesSnapshot = await getDocs(recipesCollection);
      const allRecipes = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recipe));

      // Randomly select breakfast recipe
      const selectedBreakfastRecipe = getRandomRecipe(allRecipes.filter(recipe => recipe.isForBreakfast));

      // Calculate remaining daily limits for lunch and dinner
      const remainingNutrients = nutrientTypes.reduce((remaining, { type }) => {
        remaining[type] = (userPreferences as any)[type] - calculateNutrient(selectedBreakfastRecipe, type);
        return remaining;
      }, {} as { [key: string]: number });
  
      // Randomly select lunch recipe
      const selectedLunchRecipe = getRandomRecipe(
        allRecipes.filter(
          recipe => !recipe.isForBreakfast
          && nutrientTypes.every(({ type }) => calculateNutrient(recipe, type) <= remainingNutrients[type])
        )
      );

      // Calculate remaining daily caloric limit for dinner
      const remainingNutrientsForDinner = nutrientTypes.reduce((remaining, { type }) => {
        remaining[type] = remainingNutrients[type] - (selectedLunchRecipe ? calculateNutrient(selectedLunchRecipe, type) : 0);
        return remaining;
      }, {} as { [key: string]: number });
  

      // Randomly select dinner recipe
      const selectedDinnerRecipe = getRandomRecipe(
        allRecipes.filter(
          recipe => !recipe.isForBreakfast
            && recipe !== selectedLunchRecipe
            && nutrientTypes.every(({ type }) => calculateNutrient(recipe, type) <= remainingNutrientsForDinner[type])
        )
      );

      const suggestedMaxServings = {
        breakfast: selectedBreakfastRecipe.suggestedMaxServing || 0,
        lunch: selectedLunchRecipe.suggestedMaxServing || 0,
        dinner: selectedDinnerRecipe.suggestedMaxServing || 0
      };

      setSuggestedMaxServings(suggestedMaxServings);
      setCustomServings(suggestedMaxServings);

      const selectedRecipes = {
        breakfast: selectedBreakfastRecipe,
        lunch: selectedLunchRecipe || null,
        dinner: selectedDinnerRecipe || null
      };

      setMealPlan(selectedRecipes);
      

      const calculatedNutrients: Partial<Nutrients> = nutrientTypes.reduce((calculated, { type }) => {
        const customServingValue = (customServings as { [key: string]: number })[type] || 0;
        const nutrientValue = calculateNutrientWithCustomServing(selectedBreakfastRecipe, type, customServingValue);
        
        console.log(`Type: ${type}, Custom Serving: ${customServingValue}, Nutrient Value: ${nutrientValue}`);
        
        (calculated as any)[type] = nutrientValue;
        return calculated;
      }, {});
      
      console.log('Calculated Nutrients:', calculatedNutrients);

      const totalNutrients = nutrientTypes.reduce((total, { type }) => total + (calculatedNutrients as any)[type], 0);

      setNutrient((prevNutrient) => ({
        ...prevNutrient,
        summed: totalNutrients,
        ...calculatedNutrients
      }));

    } catch (error) {
      console.error('Error getting recipes:', error);
    }
};

const getRandomRecipe = (recipes: Recipe[]) => {
  return recipes[Math.floor(Math.random() * recipes.length)];
};

const calculateNutrient = (recipe: Recipe | null, nutrientType: string) => {
  if (recipe && recipe.nutrientsForTheRecipe && recipe.nutrientsForTheRecipe.main) {
    const nutrient = recipe.nutrientsForTheRecipe.main[nutrientType];
    if (nutrient && nutrient.value) {
      return nutrient.value * recipe.suggestedMaxServing;
    }
  }
  return 0;
};

export const calculateNutrientWithCustomServing = (recipe: Recipe | null, nutrientType: string, suggestedMaxServing: number,) => {
  const nutrient = recipe?.nutrientsForTheRecipe?.main?.[nutrientType];
  if (nutrient?.value) {
    return nutrient.value * suggestedMaxServing;
  } else {
    console.error(`Error calculating nutrient for ${nutrientType} - recipe or nutrient data missing.`);
    return 0;
  }
};