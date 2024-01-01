import React, { useState, useEffect } from "react";

// Chakra imports
import { Box } from "@chakra-ui/react";

import { Recipe, UserPreferences, MealPlan, Nutrient, Nutrients, SuggestedMaxServings, CustomServings } from "./variables/mealPlaner";
import { generateMealPlan } from "./utils/generateMealPlan";
import { calculateNutrientForMealPlan } from "./utils/calculateNutrientForMealPlan";
import UserPreferencesInput from "./components/UserPreferencesInput";
import MealPlanDetails from "./components/MealPlanDetails";

export default function MealPlanner() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    calories: 2000,
    protein: 150,
    fat: 70,
    carbs: 200,
  });
  
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    breakfast: null,
    lunch: null,
    dinner: null
  });

  const [nutrients, setNutrients] = useState<Nutrients>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  const [calories, setCalories] = useState<Nutrients>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  
  const [protein, setProtein] = useState<Nutrients>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  
  const [carbs, setCarbs] = useState<Nutrients>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  
  const [fat, setFat] = useState<Nutrients>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  const [suggestedMaxServings, setSuggestedMaxServings] = useState<SuggestedMaxServings>({
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const [customServings, setCustomServings] = useState<CustomServings>({
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: parseFloat(value)
    }));
  };  

  const handleIncrement = (mealType: keyof typeof customServings) => {
    setCustomServings((prevServing) => ({
        ...prevServing,
        [mealType]: prevServing[mealType] + 1,
    }));
  };
    
  const handleDecrement = (mealType: keyof typeof customServings) => {
    setCustomServings((prevServing) => ({
        ...prevServing,
        [mealType]: Math.max(1, prevServing[mealType] - 1),
    }));
  };

  const nutrientTypes: Nutrient[] = [
    { type: 'calories', label: 'Calories', setter: setCalories },
    { type: 'protein', label: 'Protein', setter: setProtein },
    { type: 'carbs', label: 'Carbohydrates', setter: setCarbs },
    { type: 'fat', label: 'Fat', setter: setFat },
  ];
  
  useEffect(() => {
    calculateNutrientForMealPlan(setCalories, suggestedMaxServings, customServings, mealPlan, 'Calories');
  }, [customServings, suggestedMaxServings, mealPlan]);
  
  useEffect(() => {
    calculateNutrientForMealPlan(setProtein, suggestedMaxServings, customServings, mealPlan, 'Protein');
  }, [customServings, suggestedMaxServings, mealPlan]);
  
  useEffect(() => {
    calculateNutrientForMealPlan(setCarbs, suggestedMaxServings, customServings, mealPlan, 'Carbohydrates');
  }, [customServings, suggestedMaxServings, mealPlan]);
  
  useEffect(() => {
    calculateNutrientForMealPlan(setFat, suggestedMaxServings, customServings, mealPlan, 'Fat');
  }, [customServings, suggestedMaxServings, mealPlan]);

  const generatePlan = async () => {
    try {
      await generateMealPlan(
        userPreferences,
        nutrientTypes,
        setSuggestedMaxServings,
        setCustomServings,
        setMealPlan,
        setProtein,
        customServings
      );
  
      // Access the calculated values after state updates
      console.log('Calories:', calories);
      console.log('Protein:', protein);
      console.log('Carbs:', carbs);
      console.log('Fat:', fat);
  
    } catch (error) {
      console.error('Error generating meal plan:', error);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <UserPreferencesInput
        userPreferences={userPreferences}
        handleInputChange={handleInputChange}
        generatePlan={generatePlan}
      />
      <MealPlanDetails
        customServings={customServings}
        suggestedMaxServings={suggestedMaxServings}
        mealPlan={mealPlan}
        calories={calories}
        protein={protein}
        carbs={carbs}
        fat={fat}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
      />
    </Box>
  );
}