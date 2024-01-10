import React from "react";
import { recipesCollection } from '../../../../database/getCollection';
import { getDocs } from 'firebase/firestore';
import { Recipe, UserPreferencesForMealPlan, Nutrient, MealPlan, CustomServings, SuggestedMaxServings, NutrientState } from "../variables/mealPlaner";

export const generateMealPlan = async (
  userPreferences: UserPreferencesForMealPlan,
  nutrientTypes: Nutrient[],
  setSuggestedMaxServings: React.Dispatch<React.SetStateAction<SuggestedMaxServings>>,
  setCustomServings: React.Dispatch<React.SetStateAction<CustomServings>>,
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan>>,
  setNutrient: React.Dispatch<React.SetStateAction<NutrientState>>,
  customServings: CustomServings
) => {
  try {
    const recipesSnapshot = await getDocs(recipesCollection);
    const allRecipes = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Recipe));

    // Randomly select breakfast recipe
    const selectedBreakfastRecipe = getRandomRecipe(allRecipes.filter(recipe => recipe.isForBreakfast));

    // Calculate remaining daily limits for lunch and dinner
    const remainingNutrients: { [key: string]: number } = nutrientTypes.reduce((remaining, { type }) => {
      remaining[type] = userPreferences[type] - calculateNutrient(selectedBreakfastRecipe, type);
      return remaining;
    }, {} as { [key: string]: number });

    console.log(selectedBreakfastRecipe);

    // Randomly select lunch recipe
    const selectedLunchRecipe = getRandomRecipe(
      allRecipes.filter(
        recipe => !recipe.isForBreakfast
          && nutrientTypes.every(({ type }) => calculateNutrient(recipe, type) <= remainingNutrients[type])
      )
    );

    console.log(selectedLunchRecipe, remainingNutrients);

    // Calculate remaining daily caloric limit for dinner
    const remainingNutrientsForDinner: { [key: string]: number } = nutrientTypes.reduce((remaining, { type }) => {
      remaining[type] = remainingNutrients[type] - calculateNutrient(selectedLunchRecipe, type);
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

    console.log(selectedDinnerRecipe, remainingNutrientsForDinner);

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

    const calculatedNutrients: Partial<NutrientState> = nutrientTypes.reduce((calculated, { type }) => {
      const customServingValue = (customServings as { [key: string]: number })[type] || 0;
      const nutrientValue = calculateNutrientWithCustomServing(selectedBreakfastRecipe, type, customServingValue);

      (calculated as any)[type] = nutrientValue;
      return calculated;
    }, {});

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

const calculateNutrient = (recipe: Recipe | null, nutrientType: string): number => {
  return recipe.nutrientsForTheRecipe.main[nutrientType].value * recipe.suggestedMaxServing;
};

export const calculateNutrientWithCustomServing = (recipe: Recipe | null, nutrientType: string, suggestedMaxServing: number): number => {
  return recipe.nutrientsForTheRecipe.main[nutrientType].value * suggestedMaxServing;
};