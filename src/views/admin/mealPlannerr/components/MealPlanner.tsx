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
      Carbohydrates: 0
    });

  const [mealPlan, setMealPlan] = useState<MealPlan>({
    breakfast: null,
    lunch: null,
    dinner: null
  });
  const [mealPlanImages, setMealPlanImages] = useState<{
    breakfast: string;
    lunch: string;
    dinner: string;
  }>({
    breakfast: null,
    lunch: null,
    dinner: null
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: parseFloat(value)
    }));
  };

  useEffect(() => {
    setUserPreferences({
      Calories: chosenCalories,
      Protein: chosenNutrients.protein,
      Fat: chosenNutrients.fat,
      Carbohydrates: chosenNutrients.carbs
    });
  }, [chosenCalories, chosenNutrients]);

  const generatePlan = async () => {
    try {
      setIsSubmitted(true);
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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"
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content:
                  "You are an experienced chef specializing in Bulgarian cuisine. Focus on creating a diverse and delicious meal plan for the day. Be creative with the recipes and provide clear instructions. Pay attention to the nutrient limits mentioned by the user and ensure the accuracy of the quantities. Export in JSON EXACTLY LIKE I will provide without adding `json` keyword with backticks."
              },
              {
                role: "user",
                content: `Generate me a meal plan for the day with 3 meals based on the following nutrients limits without straying too far away from the provided limits: 'calories: ${userPreferences.Calories}, protein: ${userPreferences.Protein}, fat: ${userPreferences.Fat}, carbohydrates: ${userPreferences.Carbohydrates}'. If possible use recipes that are usual for the Bulgarian cuisine but try to give different recipes from the previous request. Don't round the values as you like and use the actual and exact nutrient values. Put the nutrients values and the quantity in grams in ratio with the nutrients after each meal in this format: 'totals: {calories: number,protein: number,fat: number,carbohydrates: number,grams:number}'. Put the summed values for the day in this format: 'totals: {calories: number,protein: number,fat: number,carbohydrates: number}'. Give instructions on how to prepare(with structure: ['1.Something', '2.Something', ...]) and the ingredients of the meals as well(with structure: ['1.Something', '2.Something', ...]). Translate the meals names, ingredients and instructions in Bulgarian. Export in JSON exactly like this: '{'breakfast':{'name':'string','ingredients':['string','string','string','string','string'],'instructions':['1.string','2.string','3.string','4.string'],'totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}},'lunch':{'likebreakfast'},'dinner':{'likebreakfast'},'totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number'}}' WITHOUT ADDING 'json' keyword with backticks!!! Don't translate the properties, only the values.`
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate meal plan");
      }

      const responseData = await response.json();
      // Process the data returned by OpenAI API
      const data = JSON.parse(
        responseData.choices[0].message.content
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
      );

      console.log("CHATGPT: ", data);

      const filteredArr = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== "totals")
      );

      const mealPlanImagesData: {
        breakfast: string;
        lunch: string;
        dinner: string;
      } = {
        breakfast: null,
        lunch: null,
        dinner: null
      };

      // Iterate over each meal and make a separate image generation request
      for (const mealKey of Object.keys(filteredArr)) {
        const meal = (filteredArr as any)[mealKey];

        console.log("meal: ", meal);
        console.log("meal name: ", meal.name);

        // Now make a request to the "images/generations" endpoint for each meal's name
        const imageResponse = await fetch(
          `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=10030740e88c842af&q=${encodeURIComponent(
            meal.name
          )}&searchType=image&siteSearch=facebook.com&siteSearchFilter=e`
        );

        if (!imageResponse.ok) {
          throw new Error("Failed to generate image");
        }

        const imageResponseData = await imageResponse.json();
        console.log(
          `Image Generation Response for ${meal.name}: `,
          imageResponseData.items[0].link
        );
        (mealPlanImagesData as any)[mealKey] = imageResponseData.items[0].link;
      }

      console.log("mealPlanImagesData:", mealPlanImagesData);

      setMealPlanImages(mealPlanImagesData);

      setMealPlan({
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner,
        totals: data.totals
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  console.log("mealPlan: ", mealPlan);

  // const filteredArr = Object.keys(mealPlan).map((mealType: any, index) => {
  //   console.log((mealPlan as any)[mealType]?.name, index);
  // });
  // console.log("filteredArr: ", filteredArr);
  console.log("totals: ", mealPlan.totals);
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
                            mealPlan={mealPlan}
                            mealPlanImages={mealPlanImages}
                          />
                          <h1>Generated Meal Plan!</h1>
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
