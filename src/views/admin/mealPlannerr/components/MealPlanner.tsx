import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  SimpleGrid,
  Text,
  Flex,
  useColorModeValue
} from "@chakra-ui/react";

import Loading from "views/admin/weightStats/components/Loading";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { HSeparator } from "components/separator/Separator";
import {
  UserPreferencesForMealPlan,
  WeightPerServing,
  MealPlan2,
  Nutrient,
  NutrientState,
  SuggestedMaxServings,
  CustomServings,
  UserIntakes
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
  userIntakes: UserIntakes;
  setUserIntakes?: React.Dispatch<React.SetStateAction<UserIntakes>>;
}) {
  const { chosenCalories, chosenNutrients, userIntakes, setUserIntakes } =
    props;

  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradientNutri = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requestFailed, setRequestFailed] = useState(false);

  const [userPreferences, setUserPreferences] =
    useState<UserPreferencesForMealPlan>({
      Calories: 0,
      Protein: 0,
      Fat: 0,
      Carbohydrates: 0,
      Cuisine: "Българска"
    });

  const [mealPlan, setMealPlan] = useState<MealPlan2>({
    breakfast: null,
    lunch: null,
    dinner: null
  });
  const [mealPlanImages, setMealPlanImages] = useState<{
    breakfast: {
      main: string;
    };
    lunch: {
      appetizer: string;
      main: string;
      dessert: string;
    };
    dinner: {
      main: string;
      dessert: string;
    };
  }>({
    breakfast: null,
    lunch: null,
    dinner: null
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "Cuisine") {
      setUserPreferences((prevPreferences) => ({
        ...prevPreferences,
        [name]: parseFloat(value)
      }));
    } else {
      setUserPreferences((prevPreferences) => ({
        ...prevPreferences,
        [name]: value
      }));
    }
  };

  useEffect(() => {
    setUserPreferences({
      Calories: chosenCalories,
      Protein: chosenNutrients.protein,
      Fat: chosenNutrients.fat,
      Carbohydrates: chosenNutrients.carbs,
      Cuisine: userPreferences.Cuisine
    });
  }, [chosenCalories, chosenNutrients]);

  console.log(userPreferences);
  const generatePlan = async () => {
    try {
      setIsSubmitted(true);
      setIsLoading(true);
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
                content: `You are an experienced chef specializing in a cuisine that is called '${userPreferences.Cuisine}' in Bulgarian. Focus on creating a diverse and delicious meal plan for the day. Be creative with the recipes and provide clear instructions. Pay attention to the nutrient limits mentioned by the user and ensure the accuracy of the quantities. Export in JSON EXACTLY LIKE I will provide without adding 'json' keyword with backticks.`
              },
              {
                role: "user",
                content: `Generate me a meal plan for the day with 3 meals based on the following nutrients limits WITHOUT CROSSING the provided limits: 
                'calories: ${userPreferences.Calories}, protein: ${userPreferences.Protein}, fat: ${userPreferences.Fat}, carbohydrates: ${userPreferences.Carbohydrates}'. 
                If possible use recipes that are usual for the cuisine that is called '${userPreferences.Cuisine}' in Bulgarian but try to give DIFFERENT recipes from the previous request. 
                Don't round the values as you like and use the EXACT and THE ACTUAL nutrient values. Provide main course for breakfast. Provide appetizer, main course, and dessert for lunch.
                Provide main course and dessert for dinner. 
                Add small things to be eaten with the main food, like a slice of bread for the soups and etc. Please, provide different foods and don't repeat yourself. 
                Give actual and eatable foods. Give approximately NORMAL quantities for an avarage person so that the users don't think it's too much or too less(up to 500 grams but don't give ONLY 500, give as much as you need but 500 is the limit). 
                Also, put the grams and the nutrient values IN RATIO WITH EACH OTHER. After each food, provide the information in this format: 
                'totals: {calories: number,protein: number,fat: number,carbohydrates: number,grams:number}'. Put the summed values for the day in this format: 
                'totals: {calories: number,protein: number,fat: number,carbohydrates: number}'. 
                Give instructions on how to prepare(with structure: ['1.Something', '2.Something', ...]), the ingredients of the meals as well(with structure: 
                  ['1.Something', '2.Something', ...]). Translate the meals names, ingredients and instructions in Bulgarian. Export in JSON EXACTLY like this: 
                  '{breakfast':{'main':{'name':'string','ingredients':['string','string','string','string','string'],'instructions':['1.string','2.string','3.string','4.string'],'totals':{'calories':'number','protein':'number','fat':'number','carbohydrate':'number','grams':'number'}}},
                  'lunch':{'appetizer':{'name':'string','ingredients':['string','string','string','string','string'],'instructions':['1.string','2.string','3.string','4.string'],'totals':{'calories':'number','protein':'number','fat':'number','carbohydrate':'number','grams':'number'}},                 
                    'likebreakfast',
                    'dessert':{'name':'string','ingredients':['string','string','string','string','string'],'instructions':['1.string','2.string','3.string','4.string'],'totals':{'calories':'number','protein':'number','fat':'number','carbohydrate':'number','grams':'number'}}
                  },
                  'dinner':{'likebreakfast', 
                  'dessert':{'name':'string','ingredients':['string','string','string','string','string'],'instructions':['1.string','2.string','3.string','4.string'],'totals':{'calories':'number','protein':'number','fat':'number','carbohydrate':'number','grams':'number'}}
                },'totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number'}}' WITHOUT ADDING 'json' keyword with backticks!!!
                   Don't translate the properties, only the values.`
              }
            ]
          })
        }
      );

      if (!response.ok) {
        setRequestFailed(true);
        setIsLoading(false);
        throw new Error("Failed to generate meal plan");
      }

      const responseData = await response.json();
      console.log("responseData: ", responseData);

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
        breakfast: {
          main: string;
        };
        lunch: {
          appetizer: string;
          main: string;
          dessert: string;
        };
        dinner: {
          main: string;
          dessert: string;
        };
      } = {
        breakfast: {
          main: ""
        },
        lunch: {
          appetizer: "",
          main: "",
          dessert: ""
        },
        dinner: {
          main: "",
          dessert: ""
        }
      };

      // Iterate over each meal and make a separate image generation request
      for (const mealKey of Object.keys(filteredArr)) {
        const mealAppetizer = (filteredArr as any)[mealKey].appetizer;
        const mealMain = (filteredArr as any)[mealKey].main;
        const mealDessert = (filteredArr as any)[mealKey].dessert;

        // console.log("meal: ", meal);
        // console.log("meal name: ", meal.name);

        // Now make a request to the "images/generations" endpoint for each meal's name
        const imageAppetizer =
          mealKey === "lunch"
            ? await fetch(
                `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=10030740e88c842af&q=${encodeURIComponent(
                  mealAppetizer.name
                )}&searchType=image`
              )
            : null;

        const imageMain = await fetch(
          `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=10030740e88c842af&q=${encodeURIComponent(
            mealMain.name
          )}&searchType=image`
        );

        const imageDessert =
          mealKey === "lunch" || mealKey === "dinner"
            ? await fetch(
                `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=10030740e88c842af&q=${encodeURIComponent(
                  mealDessert.name
                )}&searchType=image`
              )
            : null;

        const imageAppetizerResponseData =
          imageAppetizer !== null ? await imageAppetizer.json() : null;
        const imageMainResponseData = await imageMain.json();
        const imageDessertResponseData =
          imageDessert !== null ? await imageDessert.json() : null;

        console.log("imageDessert: ", imageDessert, mealKey);
        // console.log(
        //   `Image Generation Response for ${mealAppetizer.name}: `,
        //   imageAppetizerResponseData.items[0].link
        // );
        if (imageAppetizerResponseData !== null) {
          (mealPlanImagesData as any)[mealKey].appetizer =
            imageAppetizerResponseData.items[0].link;
        }

        (mealPlanImagesData as any)[mealKey].main =
          imageMainResponseData.items[0].link;

        if (imageDessertResponseData !== null) {
          (mealPlanImagesData as any)[mealKey].dessert =
            imageDessertResponseData.items[0].link;
        }
      }

      console.log("mealPlanImagesData:", mealPlanImagesData);

      setMealPlanImages(mealPlanImagesData);

      setMealPlan({
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner,
        totals: data.totals
      });

      setUserIntakes({
        Calories: data.totals.calories,
        Protein: data.totals.protein,
        Fat: data.totals.fat,
        Carbohydrates: data.totals.carbohydrates
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating meal plan:", error);
    }
  };

  console.log("mealPlan: ", mealPlan);
  console.log("mealPlanImages: ", mealPlanImages);
  // const filteredArr = Object.keys(mealPlan).map((mealType: any, index) => {
  //   console.log((mealPlan as any)[mealType]?.name, index);
  // });
  // console.log("filteredArr: ", filteredArr);
  console.log("totals: ", mealPlan.totals);

  interface LinearGradientTextProps {
    text: any;
    gradient: string;
    fontSize?: string;
    fontFamily?: string;
    mr?: string;
  }

  const LinearGradientText: React.FC<LinearGradientTextProps> = ({
    text,
    gradient,
    fontSize,
    fontFamily,
    mr
  }) => (
    <Text
      as="span"
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight="bold"
      mr={mr}
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        color: "transparent"
      }}
    >
      {text}
    </Text>
  );

  return (
    <FadeInWrapper>
      <Box mb="20px">
        <Card>
          <Card>
            <Flex justify="center" w="100%" mb="5px">
              <Text fontSize="5xl" mr="2">
                Създайте хранителен план с{" "}
              </Text>
              <LinearGradientText
                text={<b>Nutri</b>}
                gradient={gradientNutri}
                fontSize="5xl"
                fontFamily="DM Sans"
              />
              <LinearGradientText
                text={<b>Fit</b>}
                gradient={gradientFit}
                fontFamily="Leckerli One"
                fontSize="5xl"
                mr="1px"
              />
              <Text fontSize="5xl">:</Text>
            </Flex>
            <HSeparator />
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
                    {(mealPlan.lunch !== null && mealPlan.dinner !== null) ||
                    requestFailed == false ? (
                      <Flex justify="center" w="100%" mb="5px">
                        <SimpleGrid
                          columns={{ base: 1, md: 1, xl: 1 }}
                          gap="20px"
                        >
                          <MealPlanDetails
                            mealPlan={mealPlan}
                            mealPlanImages={mealPlanImages}
                          />
                        </SimpleGrid>
                      </Flex>
                    ) : (
                      <Text
                        textAlign="center"
                        fontSize="4xl"
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
