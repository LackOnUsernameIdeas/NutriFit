import { MealPlan } from "types/weightStats";
import {
  calculateNutrientForMealPlan,
  calculateNutrientWithCustomServing
} from "../calculateNutrientForMealPlan";

// Mocking the useState function for testing
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}));

describe("calculateNutrientForMealPlan", () => {
  it("should calculate nutrient for meal plan and update state", () => {
    const setNutrientMock = jest.fn();
    const setWeightPerServingMock = jest.fn();

    const mealPlan: MealPlan = {
      breakfast: null,
      lunch: null,
      dinner: null
    };

    const suggestedMaxServings = {
      breakfast: 2,
      lunch: 2,
      dinner: 2
    };

    const customServings = {
      breakfast: 3,
      lunch: 3,
      dinner: 3
    };

    calculateNutrientForMealPlan(
      setNutrientMock,
      suggestedMaxServings,
      customServings,
      mealPlan,
      "Calories",
      setWeightPerServingMock
    );

    // Add your assertions here
    expect(setNutrientMock).toHaveBeenCalledWith(expect.any(Object));
    expect(setWeightPerServingMock).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe("calculateNutrientWithCustomServing", () => {
  it("should calculate nutrient with custom serving", () => {
    const recipe = {
      title: "Баница",
      isForBreakfast: true,
      photo:
        "https://recepti.gotvach.bg/files/lib/600x350/nai-balgarska-banica.webp",
      ingredients: [
        { quantity: "6 листа", ingredient: "фило блатове" }
        // Include other ingredients as needed
      ],
      instructions: [
        { number: 1, step: "Загрейте фурната до 190°C" }
        // Include other instructions as needed
      ],
      nutrientsForTheRecipe: {
        main: {
          ["Calories"]: {
            value: 1434.5926,
            unit: "kcal"
          }
          // Include other nutrients as needed
        }
        // Include other nutrient types if available
      },
      weightPerServing: {
        amount: 487.68,
        unit: "g"
      },
      suggestedMaxServing: 1
    };

    const suggestedMaxServing = 2;
    const nutrientType = "Calories";

    const result = calculateNutrientWithCustomServing(
      recipe as any,
      suggestedMaxServing,
      nutrientType
    );

    // Add your assertions here
    expect(result).toBe(2869.1852);
  });

  it("should return 0 when recipe or nutrient is not present", () => {
    const recipe = {};
    const suggestedMaxServing = 2;
    const nutrientType = "Calories";

    const result = calculateNutrientWithCustomServing(
      recipe as any,
      suggestedMaxServing,
      nutrientType
    );

    // Add your assertions here
    expect(result).toBe(0);
  });
});
