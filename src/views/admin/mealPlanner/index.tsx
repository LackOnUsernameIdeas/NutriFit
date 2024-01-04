import React, { useState, useEffect } from "react";

// Chakra imports
import { Box, SimpleGrid, Text, Flex } from "@chakra-ui/react";

import { HSeparator } from "components/separator/Separator";
import { UserPreferences, MealPlan, Nutrient, NutrientState, SuggestedMaxServings, CustomServings } from "./variables/mealPlaner";
import { generateMealPlan } from "./utils/generateMealPlan";
import { calculateNutrientForMealPlan } from "./utils/calculateNutrientForMealPlan";
import UserPreferencesInput from "./components/UserPreferencesInput";
import MealPlanDetails from "./components/MealPlanDetails";
import Card from "components/card/Card";
import RecipeWidget from 'components/card/NFT';
import Pancakes from 'assets/img/nfts/pancakes.jpg';
import Shkembe from 'assets/img/nfts/shkembe-chorba.jpg';
import Sarma from 'assets/img/nfts/sarma.jpg';
import Avatar1 from 'assets/img/avatars/avatar1.png';
import Avatar2 from 'assets/img/avatars/avatar2.png';
import Avatar3 from 'assets/img/avatars/avatar3.png';
import Avatar4 from 'assets/img/avatars/avatar4.png';

export default function MealPlanner() {
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    Calories: 2000,
    Protein: 150,
    Fat: 70,
    Carbohydrates: 200,
  });
  
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    breakfast: null,
    lunch: null,
    dinner: null
  });

  const [calories, setCalories] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  
  const [protein, setProtein] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  
  const [carbs, setCarbs] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });
  
  const [fat, setFat] = useState<NutrientState>({
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
    setCustomServings((prevServing) => {
      const newValue = prevServing[mealType] + 1;
  
      // Calculate the total nutrient values based on the new serving count
      const newTotalCalories =
        newValue * mealPlan[mealType].nutrientsForTheRecipe.main.Calories.value;
      const newTotalProtein =
        newValue * mealPlan[mealType].nutrientsForTheRecipe.main.Protein.value;
      const newTotalCarbs =
        newValue * mealPlan[mealType].nutrientsForTheRecipe.main.Carbohydrates.value;
      const newTotalFat = newValue * mealPlan[mealType].nutrientsForTheRecipe.main.Fat.value;
  
      // Check if the new total nutrient values comply with user preferences
      if (
        newTotalCalories <= userPreferences.Calories &&
        newTotalProtein <= userPreferences.Protein &&
        newTotalCarbs <= userPreferences.Carbohydrates &&
        newTotalFat <= userPreferences.Fat
      ) {
        return {
          ...prevServing,
          [mealType]: newValue,
        };
      }
  
      return prevServing;
    });
  };
    
  const handleDecrement = (mealType: keyof typeof customServings) => {
    setCustomServings((prevServing) => ({
        ...prevServing,
        [mealType]: Math.max(1, prevServing[mealType] - 1),
    }));
  };

  const nutrientTypes: Nutrient[] = [
    { type: 'Calories', label: 'Calories', setter: setCalories },
    { type: 'Protein', label: 'Protein', setter: setProtein },
    { type: 'Carbohydrates', label: 'Carbohydrates', setter: setCarbs },
    { type: 'Fat', label: 'Fat', setter: setFat },
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
    } catch (error) {
      console.error('Error generating meal plan:', error);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        <Card minH="200px">
          <Flex justify="center" pt="5px" w="100%">
            <Text fontSize="5xl" fontStyle="italic">
              Generate a meal plan with NutriFit!
            </Text>
          </Flex>
          <HSeparator />
          <Flex justify="center" mt="1%" pt="10px">
            <Text fontSize="3xl">
                Please input the fields on the left with your desired limits. The meal plan will be generated on the right.
            </Text>
          </Flex>
        </Card>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px" mb="20px">
        <UserPreferencesInput
          userPreferences={userPreferences}
          handleInputChange={handleInputChange}
          generatePlan={generatePlan}
        />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 1 }} gap="20px" mb="20px">
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
			</SimpleGrid>
    </Box>
  );
}