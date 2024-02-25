import React, { useState, useEffect } from "react";
import { Spinner, Box, Text } from "@chakra-ui/react";
import MealPlanDetails from "./MealPlanDetails";
import {
  UserPreferencesForMealPlan,
  MealPlan2
} from "../../../../types/weightStats";
import { getAllMealPlans } from "database/getAdditionalUserData";

interface Props {
  userPreferences: UserPreferencesForMealPlan;
}

const MealLoading: React.FC<Props> = ({ userPreferences }) => {
  const [mealPlan, setMealPlan] = useState<MealPlan2 | null>(null);
  const [mealPlanImages, setMealPlanImages] = useState<{
    breakfast: { main: string };
    lunch: { appetizer: string; main: string; dessert: string };
    dinner: { main: string; dessert: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveMealPlanData = async () => {
      try {
        const mealPlans = await getAllMealPlans();
        const randomIndex = Math.floor(Math.random() * mealPlans.length);
        const randomMealPlan = mealPlans[randomIndex];
        const images = {
          breakfast: {
            main: randomMealPlan.breakfast.main.image
          },
          lunch: {
            appetizer: randomMealPlan.lunch.appetizer.image,
            main: randomMealPlan.lunch.main.image,
            dessert: randomMealPlan.lunch.dessert.image
          },
          dinner: {
            main: randomMealPlan.dinner.main.image,
            dessert: randomMealPlan.dinner.dessert.image
          }
        };
        setMealPlan(randomMealPlan);
        setMealPlanImages(images);
      } catch (error) {
        console.error("Error saving meal plan:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    saveMealPlanData();
  }, []);

  return (
    <Box
      textAlign="center"
      mt="10"
      backgroundImage="none"
      transition="background-image 0.2s ease-in-out"
    >
      <Spinner size="xl" color="brand.500" />
      <Text mt="4" fontSize="3xl" color="gray.600">
        Докато се генерира хранителният план, нека погледнем пример...
      </Text>

      {/* Conditionally render MealPlanDetails */}
      {!loading && mealPlan && mealPlanImages && (
        <MealPlanDetails
          mealPlan={mealPlan}
          mealPlanImages={mealPlanImages}
          userPreferences={userPreferences}
        />
      )}
    </Box>
  );
};

export default MealLoading;
