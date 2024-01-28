import React from "react";
import { recipesCollection } from "../../../../database/getCollection";
import { getDocs } from "firebase/firestore";
import {
  Recipe,
  UserPreferencesForMealPlan,
  Nutrient,
  MealPlan,
  WeightPerServing,
  CustomServings,
  SuggestedMaxServings,
  NutrientState
} from "../../../../types/weightStats";

// Функция за генериране на план за хранене въз основа на потребителските предпочитания и наличните рецепти
export const generateMealPlan = async (
  userPreferences: UserPreferencesForMealPlan,
  nutrientTypes: Nutrient[],
  setSuggestedMaxServings: React.Dispatch<
    React.SetStateAction<SuggestedMaxServings>
  >,
  setCustomServings: React.Dispatch<React.SetStateAction<CustomServings>>,
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan>>,
  setWeightPerServing: React.Dispatch<React.SetStateAction<WeightPerServing>>,
  customServings: CustomServings
) => {
  try {
    // Fetch all recipes from the database
    const recipesSnapshot = await getDocs(recipesCollection);
    const allRecipes = recipesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Recipe)
    );

    // Select a breakfast recipe
    const selectedBreakfastMeal = getRandomRecipe(
      allRecipes.filter((recipe) => recipe.isForBreakfast)
    );

    // Calculate remaining nutrients for lunch and dinner
    const remainingNutrients: { [key: string]: number } = nutrientTypes.reduce(
      (remaining, { type }) => {
        remaining[type] =
          userPreferences[type] -
          calculateNutrient(selectedBreakfastMeal, type);
        return remaining;
      },
      {} as { [key: string]: number }
    );

    console.log(selectedBreakfastMeal);
    console.log(remainingNutrients);

    // Select a lunch recipe
    const selectedLunchMeal = getRandomRecipe(
      allRecipes.filter(
        (recipe) =>
          !recipe.isForBreakfast &&
          nutrientTypes.every(
            ({ type }) =>
              calculateNutrient(recipe, type) <= remainingNutrients[type]
          )
      )
    );

    // Calculate remaining nutrients for dinner
    const remainingNutrientsForDinner: { [key: string]: number } =
      nutrientTypes.reduce((remaining, { type }) => {
        remaining[type] =
          remainingNutrients[type] - calculateNutrient(selectedLunchMeal, type);
        return remaining;
      }, {} as { [key: string]: number });

    console.log(selectedLunchMeal);
    console.log(remainingNutrientsForDinner);

    // Select a dinner recipe
    const selectedDinnerMeal = getRandomRecipe(
      allRecipes.filter(
        (recipe) =>
          !recipe.isForBreakfast &&
          recipe !== selectedLunchMeal &&
          nutrientTypes.every(
            ({ type }) =>
              calculateNutrient(recipe, type) <=
              remainingNutrientsForDinner[type]
          )
      )
    );

    console.log(selectedDinnerMeal);

    // Set suggested max servings and custom servings based on selected recipes
    const suggestedMaxServings = {
      breakfast: selectedBreakfastMeal?.suggestedMaxServing || 0,
      lunch: selectedLunchMeal?.suggestedMaxServing || 0,
      dinner: selectedDinnerMeal?.suggestedMaxServing || 0
    };

    setSuggestedMaxServings(suggestedMaxServings);
    setCustomServings(suggestedMaxServings);

    // Set selected meals in mealPlan state
    const selectedMeals = {
      breakfast: selectedBreakfastMeal,
      lunch: selectedLunchMeal || null,
      dinner: selectedDinnerMeal || null
    };

    setMealPlan(selectedMeals);

    // Set weight per serving for each meal
    setWeightPerServing({
      breakfast: {
        amount: selectedMeals.breakfast?.weightPerServing?.amount || 0,
        unit: selectedMeals.breakfast?.weightPerServing?.unit || ""
      },
      lunch: {
        amount: selectedMeals.lunch?.weightPerServing?.amount || 0,
        unit: selectedMeals.lunch?.weightPerServing?.unit || ""
      },
      dinner: {
        amount: selectedMeals.dinner?.weightPerServing?.amount || 0,
        unit: selectedMeals.dinner?.weightPerServing?.unit || ""
      }
    });

    // Calculate nutrient values for each nutrient type based on selected meals and custom servings
    const calculatedNutrients: Partial<NutrientState> = nutrientTypes.reduce(
      (calculated, { type }) => {
        const customServingValue =
          (customServings as { [key: string]: number })[type] || 0;
        const nutrientValue = calculateNutrientWithCustomServing(
          selectedBreakfastMeal,
          type,
          customServingValue
        );

        (calculated as any)[type] = nutrientValue;
        return calculated;
      },
      {}
    );

    // Calculate total nutrient value for all selected nutrient types
    const totalNutrients = nutrientTypes.reduce(
      (total, { type }) => total + (calculatedNutrients as any)[type],
      0
    );
  } catch (error) {
    console.error("Error getting recipes:", error);
  }
};

// Функция за избиране на рецепта
const getRandomRecipe = (recipes: Recipe[]): Recipe | null => {
  return recipes.length > 0
    ? recipes[Math.floor(Math.random() * recipes.length)]
    : null;
};

// Функция за изчисляване на хранителната стойност за дадена рецепта и тип хранителни вещества
const calculateNutrient = (
  recipe: Recipe | null,
  nutrientType: string
): number => {
  if (!recipe || !recipe.nutrientsForTheRecipe?.main?.[nutrientType]?.value) {
    return 0;
  }

  return (
    recipe.nutrientsForTheRecipe.main[nutrientType].value *
    (recipe.suggestedMaxServing || 0)
  );
};

// Функция за изчисляване на хранителната стойност за дадена рецепта и тип хранителни вещества персонализиран брой на порции
const calculateNutrientWithCustomServing = (
  recipe: Recipe | null,
  nutrientType: string,
  suggestedMaxServing: number
): number => {
  if (!recipe || !recipe.nutrientsForTheRecipe?.main?.[nutrientType]?.value) {
    return 0;
  }

  return (
    recipe.nutrientsForTheRecipe.main[nutrientType].value * suggestedMaxServing
  );
};
