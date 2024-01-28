import React from "react";
import { generateMealPlan } from "../generateMealPlan";
import { render, act } from "@testing-library/react";
import { initializeFirestore } from "firebase/firestore";

import { Nutrient } from "types/weightStats";

jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  initializeFirestore: jest.fn()
}));

// Mocking the firestore app
jest.mock("firebase/app", () => ({
  ...jest.requireActual("firebase/app"),
  initializeApp: jest.fn()
}));

// Mocking the Firestore collection
jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  collection: jest.fn()
}));

describe("generateMealPlan", () => {
  it("should generate a meal plan based on user preferences", async () => {
    const userPreferences = {
      Calories: 0,
      Protein: 0,
      Fat: 0,
      Carbohydrates: 0
    };

    const nutrientTypes: Nutrient[] = [
      { type: "Calories", label: "Calories" },
      { type: "Protein", label: "Protein" },
      { type: "Carbohydrates", label: "Carbohydrates" },
      { type: "Fat", label: "Fat" }
    ];

    const setSuggestedMaxServings = jest.fn();
    const setCustomServings = jest.fn();
    const setMealPlan = jest.fn();
    const setWeightPerServing = jest.fn();

    const customServings = {
      breakfast: 0,
      lunch: 0,
      dinner: 0
    };

    await act(async () => {
      await generateMealPlan(
        userPreferences,
        nutrientTypes,
        setSuggestedMaxServings,
        setCustomServings,
        setMealPlan,
        setWeightPerServing,
        customServings
      );
    });

    expect(setSuggestedMaxServings).toHaveBeenCalledWith({
      breakfast: 1,
      lunch: 1,
      dinner: 1
    });

    expect(setCustomServings).toHaveBeenCalledWith({
      breakfast: 1,
      lunch: 1,
      dinner: 1
    });

    expect(setMealPlan).toHaveBeenCalledWith({
      breakfast: expect.any(Object),
      lunch: expect.any(Object),
      dinner: expect.any(Object)
    });

    expect(setWeightPerServing).toHaveBeenCalledWith({
      breakfast: { amount: 487.68, unit: "g" },
      lunch: expect.any(Object),
      dinner: expect.any(Object)
    });
  });
});
