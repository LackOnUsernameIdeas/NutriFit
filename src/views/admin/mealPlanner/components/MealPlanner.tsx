import React, { useState, useEffect } from "react";

// Chakra imports
import { Box, SimpleGrid, Text, Flex } from "@chakra-ui/react";

import Loading from "views/admin/weightStats/components/Loading";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { HSeparator } from "components/separator/Separator";
import {
  UserPreferencesForMealPlan,
  WeightPerServing,
  MealPlan,
  Nutrient,
  NutrientState,
  SuggestedMaxServings,
  CustomServings
} from "../../../../types/weightStats";
import { generateMealPlan } from "../utils/generateMealPlan";
import { calculateNutrientForMealPlan } from "../utils/calculateNutrientForMealPlan";
import UserPreferencesForMealPlanForm from "./UserPreferencesForMealPlanForm";
import MealPlanDetails from "./MealPlanDetails";
import Card from "components/card/Card";

export default function MealPlanner(props: {
  chosenCalories: number | null;
  chosenNutrients: {
    name: string;
    protein: number;
    fat: number;
    carbs: number;
  };
}) {
  const { chosenCalories, chosenNutrients } = props;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userPreferences, setUserPreferences] =
    useState<UserPreferencesForMealPlan>({
      Calories: 0,
      Protein: 0,
      Fat: 0,
      Carbohydrates: 0,
      Cuisine: "Bulgarian"
    });

  const [mealPlan, setMealPlan] = useState<MealPlan>({
    breakfast: null,
    lunch: null,
    dinner: null
  });

  const [weightPerServing, setWeightPerServing] = useState<WeightPerServing>({
    breakfast: {
      amount: 0,
      unit: "g"
    },
    lunch: {
      amount: 0,
      unit: "g"
    },
    dinner: {
      amount: 0,
      unit: "g"
    }
  });

  const [calories, setCalories] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const [protein, setProtein] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const [carbs, setCarbs] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const [fat, setFat] = useState<NutrientState>({
    summed: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0
  });

  const [suggestedMaxServings, setSuggestedMaxServings] =
    useState<SuggestedMaxServings>({
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

      // Check if the new total nutrient values comply with user preferences
      if (newValue <= 20) {
        return {
          ...prevServing,
          [mealType]: newValue
        };
      }

      return prevServing;
    });
  };

  const handleDecrement = (mealType: keyof typeof customServings) => {
    setCustomServings((prevServing) => ({
      ...prevServing,
      [mealType]: Math.max(1, prevServing[mealType] - 1)
    }));
  };

  const nutrientTypes: Nutrient[] = [
    { type: "Calories", label: "Calories", setter: setCalories },
    { type: "Protein", label: "Protein", setter: setProtein },
    { type: "Carbohydrates", label: "Carbohydrates", setter: setCarbs },
    { type: "Fat", label: "Fat", setter: setFat }
  ];

  useEffect(() => {
    setUserPreferences({
      Calories: chosenCalories,
      Protein: chosenNutrients.protein,
      Fat: chosenNutrients.fat,
      Carbohydrates: chosenNutrients.carbs,
      Cuisine: "Bulgarian"
    });
  }, [chosenCalories, chosenNutrients]);

  useEffect(() => {
    calculateNutrientForMealPlan(
      setCalories,
      suggestedMaxServings,
      customServings,
      mealPlan,
      "Calories",
      setWeightPerServing
    );
  }, [customServings, suggestedMaxServings, mealPlan]);

  useEffect(() => {
    calculateNutrientForMealPlan(
      setProtein,
      suggestedMaxServings,
      customServings,
      mealPlan,
      "Protein",
      setWeightPerServing
    );
  }, [customServings, suggestedMaxServings, mealPlan]);

  useEffect(() => {
    calculateNutrientForMealPlan(
      setCarbs,
      suggestedMaxServings,
      customServings,
      mealPlan,
      "Carbohydrates",
      setWeightPerServing
    );
  }, [customServings, suggestedMaxServings, mealPlan]);

  useEffect(() => {
    calculateNutrientForMealPlan(
      setFat,
      suggestedMaxServings,
      customServings,
      mealPlan,
      "Fat",
      setWeightPerServing
    );
  }, [customServings, suggestedMaxServings, mealPlan]);

  const generatePlan = async () => {
    try {
      setIsSubmitted(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      await generateMealPlan(
        userPreferences,
        nutrientTypes,
        setSuggestedMaxServings,
        setCustomServings,
        setMealPlan,
        setWeightPerServing,
        customServings
      );
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  return (
    <FadeInWrapper>
      <Box mb="20px">
        <Card>
          <Card>
            <Flex justify="center" w="100%" mb="5px">
              <Text fontSize="5xl" fontStyle="italic">
                Създайте хранителен план с NutriFit!
              </Text>
            </Flex>
            <HSeparator />
            <Flex justify="center" mt="1%" pt="10px">
              <Text fontSize="3xl">
                Моля попълнете редовете с предпочитаните от вас лимити, след
                което вашият план ще бъде създаден.
              </Text>
            </Flex>
          </Card>
          <Card>
            {isSubmitted ? (
              <Box>
                {isLoading ? (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px">
                      <UserPreferencesForMealPlanForm
                        userPreferences={userPreferences}
                        handleInputChange={handleInputChange}
                        generatePlan={generatePlan}
                      />
                    </SimpleGrid>
                    <Loading />
                  </>
                ) : (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px">
                      <UserPreferencesForMealPlanForm
                        userPreferences={userPreferences}
                        handleInputChange={handleInputChange}
                        generatePlan={generatePlan}
                      />
                    </SimpleGrid>
                    {mealPlan.lunch !== null && mealPlan.dinner !== null ? (
                      <Flex justify="center" w="100%" mb="5px">
                        <SimpleGrid
                          columns={{ base: 1, md: 1, xl: 1 }}
                          gap="20px"
                        >
                          <MealPlanDetails
                            customServings={customServings}
                            suggestedMaxServings={suggestedMaxServings}
                            mealPlan={mealPlan}
                            calories={calories}
                            protein={protein}
                            carbs={carbs}
                            fat={fat}
                            weight={weightPerServing}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                          />
                        </SimpleGrid>
                      </Flex>
                    ) : (
                      <Text
                        textAlign="center"
                        fontSize="4xl"
                        fontStyle="italic"
                        mt="20px"
                        transition="0.25s ease-in-out"
                      >
                        Не намерихме хранителен план за вас :( Опитайте отново.
                      </Text>
                    )}
                  </>
                )}
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px">
                <UserPreferencesForMealPlanForm
                  userPreferences={userPreferences}
                  handleInputChange={handleInputChange}
                  generatePlan={generatePlan}
                />
              </SimpleGrid>
            )}
          </Card>
        </Card>
      </Box>
    </FadeInWrapper>
  );
}
