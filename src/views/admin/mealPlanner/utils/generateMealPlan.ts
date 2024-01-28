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
    // Издърпване на всички рецепти от базата данни

    console.log("Before initializing Firestore");
    const recipesSnapshot = await getDocs(recipesCollection);
    console.log("After initializing Firestore");

    const allRecipes = recipesSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Recipe)
    );

    // Избиране на рецепта за закуска
    const selectedBreakfastMeal = getRandomRecipe(
      allRecipes.filter((recipe) => recipe.isForBreakfast)
    );

    //Калкулиране на оставащите калории за обяд и вечеря
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

    // Избиране на рецепта за обяд
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

    //Калкулиране на оставащите калории за вечеря
    const remainingNutrientsForDinner: { [key: string]: number } =
      nutrientTypes.reduce((remaining, { type }) => {
        remaining[type] =
          remainingNutrients[type] - calculateNutrient(selectedLunchMeal, type);
        return remaining;
      }, {} as { [key: string]: number });

    console.log(selectedLunchMeal);
    console.log(remainingNutrientsForDinner);

    // Избиране на рецепта за вечеря
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

    // Задаване на предложени максимални порции и персонализирани порции въз основа на избрани рецепти
    const suggestedMaxServings = {
      breakfast: selectedBreakfastMeal.suggestedMaxServing || 0,
      lunch: selectedLunchMeal.suggestedMaxServing || 0,
      dinner: selectedDinnerMeal.suggestedMaxServing || 0
    };

    setSuggestedMaxServings(suggestedMaxServings);
    setCustomServings(suggestedMaxServings);

    // Задаване на избрани ястия в mealPlan state
    const selectedMeals = {
      breakfast: selectedBreakfastMeal,
      lunch: selectedLunchMeal || null,
      dinner: selectedDinnerMeal || null
    };

    setMealPlan(selectedMeals);

    // Задаване на грамаж на всяко ядене
    setWeightPerServing({
      breakfast: {
        amount: selectedMeals.breakfast.weightPerServing.amount,
        unit: selectedMeals.breakfast.weightPerServing.unit
      },
      lunch: {
        amount: selectedMeals.lunch.weightPerServing.amount,
        unit: selectedMeals.lunch.weightPerServing.unit
      },
      dinner: {
        amount: selectedMeals.dinner.weightPerServing.amount,
        unit: selectedMeals.dinner.weightPerServing.unit
      }
    });

    // Изчислете стойностите на хранителните вещества за всеки тип хранителни вещества въз основа на избраните ястия и персонализирани порции
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

    // Изчислете общата хранителна стойност за всички избрани типове хранителни вещества
    const totalNutrients = nutrientTypes.reduce(
      (total, { type }) => total + (calculatedNutrients as any)[type],
      0
    );
  } catch (error) {
    console.error("Error getting recipes:", error);
  }
};

// Функция за избиране на рецепта
const getRandomRecipe = (recipes: Recipe[]) => {
  return recipes[Math.floor(Math.random() * recipes.length)];
};

// Функция за изчисляване на хранителната стойност за дадена рецепта и тип хранителни вещества
const calculateNutrient = (
  recipe: Recipe | null,
  nutrientType: string
): number => {
  return (
    recipe.nutrientsForTheRecipe.main[nutrientType].value *
    recipe.suggestedMaxServing
  );
};

// Функция за изчисляване на хранителната стойност за дадена рецепта и тип хранителни вещества персонализиран брой на порции
export const calculateNutrientWithCustomServing = (
  recipe: Recipe | null,
  nutrientType: string,
  suggestedMaxServing: number
): number => {
  return (
    recipe.nutrientsForTheRecipe.main[nutrientType].value * suggestedMaxServing
  );
};
