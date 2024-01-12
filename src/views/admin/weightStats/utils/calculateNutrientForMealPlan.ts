import {
  Recipe,
  MealPlan,
  WeightPerServing,
  CustomServings,
  SuggestedMaxServings,
  NutrientState
} from "../../../../types/weightStats";

export const calculateNutrientForMealPlan = (
  setNutrient: React.Dispatch<React.SetStateAction<NutrientState>>,
  suggestedMaxServings: SuggestedMaxServings,
  customServings: CustomServings,
  mealPlan: MealPlan,
  nutrientType: string, // e.g., 'Calories', 'Protein', 'Carbohydrates', 'Fat'
  setWeightPerServing: React.Dispatch<React.SetStateAction<WeightPerServing>>
) => {
  const { breakfast, lunch, dinner } = mealPlan;

  const calculatedBreakfastNutrient = calculateNutrientWithCustomServing(
    breakfast,
    customServings.breakfast || suggestedMaxServings.breakfast,
    nutrientType
  );
  const calculatedLunchNutrient = lunch
    ? calculateNutrientWithCustomServing(
        lunch,
        customServings.lunch || suggestedMaxServings.lunch,
        nutrientType
      )
    : 0;
  const calculatedDinnerNutrient = dinner
    ? calculateNutrientWithCustomServing(
        dinner,
        customServings.dinner || suggestedMaxServings.dinner,
        nutrientType
      )
    : 0;

  const totalNutrient =
    calculatedBreakfastNutrient +
    calculatedLunchNutrient +
    calculatedDinnerNutrient;

  setNutrient({
    summed: totalNutrient,
    breakfast: calculatedBreakfastNutrient,
    lunch: calculatedLunchNutrient,
    dinner: calculatedDinnerNutrient
  });

  // Update the weight per serving based on custom servings
  const updatedWeightPerServing = {
    breakfast: {
      amount: breakfast
        ? breakfast.weightPerServing.amount * customServings.breakfast || 0
        : 0,
      unit: breakfast ? breakfast.weightPerServing.unit : ""
    },
    lunch: {
      amount: lunch
        ? lunch.weightPerServing.amount * customServings.lunch || 0
        : 0,
      unit: lunch ? lunch.weightPerServing.unit : ""
    },
    dinner: {
      amount: dinner
        ? dinner.weightPerServing.amount * customServings.dinner || 0
        : 0,
      unit: dinner ? dinner.weightPerServing.unit : ""
    }
  };

  setWeightPerServing(updatedWeightPerServing);
};

export const calculateNutrientWithCustomServing = (
  recipe: Recipe | null,
  suggestedMaxServing: number,
  nutrientType: string
) => {
  if (
    recipe &&
    recipe.nutrientsForTheRecipe &&
    recipe.nutrientsForTheRecipe.main
  ) {
    const nutrient = recipe.nutrientsForTheRecipe.main[nutrientType];
    if (nutrient && nutrient.value) {
      return nutrient.value * suggestedMaxServing;
    }
  }
  return 0;
};
