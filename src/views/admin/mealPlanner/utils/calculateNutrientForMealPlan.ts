import { Recipe, MealPlan, CustomServings, SuggestedMaxServings, NutrientState } from "../variables/mealPlaner";

export const calculateNutrientForMealPlan = (
  setNutrient: React.Dispatch<React.SetStateAction<NutrientState>>,
  suggestedMaxServings: SuggestedMaxServings,
  customServings: CustomServings,
  mealPlan: MealPlan,
  nutrientType: string // e.g., 'Calories', 'Protein', 'Carbohydrates', 'Fat'
) => {
  const { breakfast, lunch, dinner } = mealPlan;

  const calculatedBreakfastNutrient = calculateNutrientWithCustomServing(
    breakfast,
    customServings.breakfast || suggestedMaxServings.breakfast,
    nutrientType
  );
  const calculatedLunchNutrient = lunch
    ? calculateNutrientWithCustomServing(lunch, customServings.lunch || suggestedMaxServings.lunch, nutrientType)
    : 0;
  const calculatedDinnerNutrient = dinner
    ? calculateNutrientWithCustomServing(dinner, customServings.dinner || suggestedMaxServings.dinner, nutrientType)
    : 0;

  const totalNutrient = calculatedBreakfastNutrient + calculatedLunchNutrient + calculatedDinnerNutrient;

  setNutrient({
    summed: totalNutrient,
    breakfast: calculatedBreakfastNutrient,
    lunch: calculatedLunchNutrient,
    dinner: calculatedDinnerNutrient,
  });
};

export const calculateNutrientWithCustomServing = (recipe: Recipe | null, suggestedMaxServing: number, nutrientType: string) => {
  if (recipe && recipe.nutrientsForTheRecipe && recipe.nutrientsForTheRecipe.main) {
    const nutrient = recipe.nutrientsForTheRecipe.main[nutrientType];
    if (nutrient && nutrient.value) {
      return nutrient.value * suggestedMaxServing;
    }
  }
  return 0;
};