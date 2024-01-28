import React from "react";
import { render, act } from "@testing-library/react";
import { generateMealPlan } from "../generateMealPlan"; // Adjust the path based on your project structure
import * as firestore from "firebase/firestore";

// Mock the database functions
jest.mock("../../../../../database/getCollection", () => ({
  recipesCollection: {
    getDocs: jest.fn()
  }
}));

jest.mock("firebase/firestore", () => ({
  ...jest.requireActual("firebase/firestore"),
  getDocs: jest.fn()
}));

describe("generateMealPlan", () => {
  // Define reusable constants and functions
  const mockedRecipes = [
    {
      id: "1",
      name: "Recipe 1",
      isForBreakfast: true,
      suggestedMaxServing: 1,
      nutrientsForTheRecipe: { main: { Calories: { value: 100 } } }
    }
    // Add more mocked recipes as needed for testing
  ];

  const setSuggestedMaxServings = jest.fn();
  const setCustomServings = jest.fn();
  const setMealPlan = jest.fn();
  const setWeightPerServing = jest.fn();

  const setupFirestoreMock = () => {
    const mockedGetDocs = jest.spyOn(firestore, "getDocs");
    mockedGetDocs.mockResolvedValue({
      docs: mockedRecipes.map((recipe) => ({
        id: recipe.id,
        data: () => recipe
      })) as firestore.QueryDocumentSnapshot<unknown, firestore.DocumentData>[]
    } as firestore.QuerySnapshot<unknown, firestore.DocumentData>);
  };

  it("should generate a meal plan based on user preferences", async () => {
    // Arrange
    setupFirestoreMock();

    // Act
    await act(async () => {
      try {
        await generateMealPlan(
          {
            Calories: 1000, // Adjust based on your actual preferences
            Protein: 50,
            Fat: 30,
            Carbohydrates: 150
          },
          [
            { type: "Calories", label: "Calories" },
            { type: "Protein", label: "Protein" },
            { type: "Carbohydrates", label: "Carbohydrates" },
            { type: "Fat", label: "Fat" }
          ],
          setSuggestedMaxServings,
          setCustomServings,
          setMealPlan,
          setWeightPerServing,
          {
            breakfast: 0,
            lunch: 0,
            dinner: 0
          }
        );
      } catch (error) {
        console.error("Test Error:", error);
      }
    });

    // Assert
    // Check if the mocked functions were called
    expect(setSuggestedMaxServings).toHaveBeenCalled();
    expect(setCustomServings).toHaveBeenCalled();
    expect(setMealPlan).toHaveBeenCalled();
    expect(setWeightPerServing).toHaveBeenCalled();
  });
});
