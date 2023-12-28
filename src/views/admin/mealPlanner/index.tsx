// Chakra imports
import {
  Box,
  VStack, 
  Input,
  Button
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Recipe {
  id: string;
  title: string;
  isForBreakfast: boolean;
  ingredients: Array<{
    id: number,
    image: string;
    ingredient: string;
    quantity: number;
  }>;
  instructions: Array<{
    number: number;
    step: string;
  }>;
  nutrientsForEveryIngredient: {
    main: {
        ingredient: string;
        amount: number;
        unit: string;
        nutrients: object[]; // Replace 'any' with the actual type of the 'nutrients' array
    }[];
    otherNutrients: {
        ingredient: string;
        amount: number;
        unit: string;
        nutrients: object[]; // Replace 'any' with the actual type of the 'nutrients' array
    }[];
  };
  nutrientsForTheRecipe: {
    weightPerServing: {
      amount: number;
      unit: string;
    }; 
    main: {
      [nutrientName: string]: {
        amount: number; 
        unit: string;
        percentOfDailyNeeds: number; 
      };
    };
    otherNutrients: {
      [nutrientName: string]: {
        amount: number; 
        unit: string;
        percentOfDailyNeeds: number;
      };
    };
  };
  caloricBreakdown: {
    percentFat: number,
    percentCarbs: number,
    percentProtein: number
  }
};


interface UserPreferences {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export default function MealPlanner() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    calories: 2000,
    protein: 150,
    fat: 70,
    carbs: 200,
  });

  const [mealPlan, setMealPlan] = useState<{ breakfast: Recipe | null; lunch: Recipe | null; dinner: Recipe | null }>({
    breakfast: null,
    lunch: null,
    dinner: null,
  });
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: parseFloat(value),
    }));
  };  

  const generateMealPlan = async () => {
    const db = getFirestore();
    const recipesCollection = collection(db, 'recipesEnglish');

    try {
      const recipesSnapshot = await getDocs(recipesCollection);

      const filteredRecipes = recipesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Recipe))
        .filter(
          (recipe) =>
            recipe.nutrientsForTheRecipe.main.calories.amount <= userPreferences.calories &&
            recipe.nutrientsForTheRecipe.main.protein.amount <= userPreferences.protein &&
            recipe.nutrientsForTheRecipe.main.fat.amount <= userPreferences.fat &&
            recipe.nutrientsForTheRecipe.main.carbohydrates.amount <= userPreferences.carbs
        )

      const breakfastRecipes = filteredRecipes.filter(recipe => recipe.isForBreakfast);
      const nonBreakfastRecipes = filteredRecipes.filter(recipe => !recipe.isForBreakfast);  

      // Randomly select ONE breakfast recipe
      const selectedBreakfastRecipe = breakfastRecipes.length > 0 ? breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)] : null;

      // Randomly select TWO nonbreakfast recipes
      nonBreakfastRecipes.sort(() => Math.random() - 0.5);
      const selectedNonBreakfastRecipes = nonBreakfastRecipes.slice(0, 2);

      const selectedRecipes = {
        breakfast: selectedBreakfastRecipe,
        lunch: selectedNonBreakfastRecipes[0] || null,
        dinner: selectedNonBreakfastRecipes[1] || null,
      };

      setMealPlan(selectedRecipes);
    } catch (error) {
      console.error('Error getting recipes:', error);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <h1>babati</h1>
      <VStack spacing={4} align="stretch">
        <label>
          Calories:
          <Input type="number" name="calories" value={userPreferences.calories} onChange={handleInputChange} />
        </label>
        <label>
          Protein:
          <Input type="number" name="protein" value={userPreferences.protein} onChange={handleInputChange} />
        </label>
        <label>
          Fat:
          <Input type="number" name="fat" value={userPreferences.fat} onChange={handleInputChange} />
        </label>
        <label>
          Carbs:
          <Input type="number" name="carbs" value={userPreferences.carbs} onChange={handleInputChange} />
        </label>
        <Button onClick={() => generateMealPlan()}>Generate Meal Plan</Button>
        <ul>
          <li>Breakfast: {mealPlan.breakfast?.title || 'No recipe available'}</li>
          <li>Lunch: {mealPlan.lunch?.title || 'No recipe available'}</li>
          <li>Dinner: {mealPlan.dinner?.title || 'No recipe available'}</li>
        </ul>
      </VStack>
    </Box>
  );
}
