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
      Cuisine: "Българска",
      Exclude: ""
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
    if (name !== "Cuisine" && name !== "Exclude") {
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
      Cuisine: userPreferences.Cuisine,
      Exclude: userPreferences.Exclude
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
          // Hosting: sk-14yD7Jthy49wCjUxHFIIT3BlbkFJEs1Rgs3TpvI2c3dllWcII(without the second I)
          body: JSON.stringify({
            model: "gpt-3.5-turbo-16k-0613",
            messages: [
              {
                role: "system",
                content: `You are an experienced nutritionist that supervises the patients to eat an actual and edible food ONLY from the following cuisines that are called '${userPreferences.Cuisine}' in Bulgarian. Focus on creating a diverse and delicious meal plan for the day that is complied with the limits for calories, protein, fat and carbohydrates so that the difference is NO MORE than 200 for the calories, 50 for the protein, 50 for carbohydrates and 30 for the fat. Pay attention to the limits that will be mentioned and ensure the accuracy of the quantities. Ensure that you refrain from including the specified items. Export in JSON EXACTLY LIKE THE PROVIDED STRUCTURE in the content property in the body of this request without adding 'json' keyword with backticks.`
              },
              {
                role: "user",
                content: `Създай ми дневно меню с ниско съдържание на мазнини, което да включва едно ястие за закуса, 3 за обяд (третото трябва да е десерт) и 2 за вечеря (второто да е десерт). 
                Не повече, не по-малко. Менюто трябва ЗАДЪЛЖИТЕЛНО да включва  ${userPreferences.Calories} калории, ${userPreferences.Protein} протеини, ${userPreferences.Fat} мазнини и ${userPreferences.Carbohydrates} въглехидрати като е допустимо сумата на калориите да се разминава до НАЙ-МНОГО, НЕ ПОВЕЧЕ ОТ 200, а тази на мазнините да се разминава до НАЙ-МНОГО, НЕ ПОВЕЧЕ ОТ 30. Недей да даваш твърде малко или твърде много калории, въглехидрати, протеин и мазнини в сравнение с лимитите, които предоставих в предното изречение. 
                Разликата между подадените стойности и тези които връщаш трябва да са ЕДНАКВИ. 
                Подавай точен грамаж и точни калории, протеин, въглехидрати и мазнини за закуска, обяд, вечеря и всички общо. 
                Подсигури реални рецепти, които да са адекватни за консумация, недей да оставяш празни места или да даваш предмети или дейности или каквото и да е вместо храни за ядене.
                Имената на храните трябва да бъдат адекватно преведени и написани на български език и да са реални ястия за консумация.
                Вмъкни в менюто всички останали изисквания, но стриктно избягвай да добавяш следните елементи в хранителнато меню: ${userPreferences.Exclude}.
                Имената на храните трябва да са адекватно преведени и написани, така че да са съществуващи храни.
                Форматирай общата информацията за калориите, протеина, въглехидратите и мазнините по следния начин И ВНИМАВАЙ ТЯ ДА НЕ Е РАЗЛИЧНА ОТ ОБЩАТА СТОЙНОСТ НА КАЛОРИИТЕ, ВЪГЛЕХИДРАТИТЕ, ПРОТЕИНА И МАЗНИНИТЕ НА ЯСТИЯТА: 'totals: {calories: number,protein: number,fat: number,carbohydrates: number,grams:number}'. 
                Форматирай сумираните стойности по абсолютно същият начин: 'totals: {calories: number,protein: number,fat: number,carbohydrates: number}'. 
                Форматирай ЦЯЛАТА информация в JSON по АБСОЛЮТНО ИДЕНТИЧЕН начин: '{breakfast':{'main':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}},'lunch':{'appetizer':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}},'likebreakfast','dessert':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}},'dinner':{'likebreakfast', 'dessert':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}},'totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number'}}', като не превеждаш имената на нито едно property (ТЕ ТРЯБВА ДА СА САМО НА АНГЛИЙСКИ ЕЗИК). 
                Преведи САМО стойностите на БЪЛГАРСКИ, без нито едно property. Те трябва ЗАДЪЛЖИТЕЛНО да са на английски. 
                Грамажът на ястията е ЗАДЪЛЖИТЕЛНА стойност, която НЕ трябва да е повече от 500 грама. Не включвай грамажа в името на ястието, а го дай САМО като стойност в totals. 
                Името на ястието е ЗАДЪЛЖИТЕЛНО на български`
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
      const unescapedData = responseData.choices[0].message.content;
      console.log("unescapedData: ", unescapedData);
      const escapedData = decodeURIComponent(unescapedData);
      console.log("escapedData: ", escapedData);
      const data = JSON.parse(escapedData);
      console.log("Parsed data: ", data);

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

        //NutriFit: cx=10030740e88c842af, key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw
        //NutriFit2: cx=258e213112b4b4492, key=AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA
        // Now make a request to the "images/generations" endpoint for each meal's name
        async function fetchImage(name: string): Promise<any> {
          try {
            let response = await fetch(
              `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBGskRKof9dkcoXtReamm4-h7UorF1G7yM&cx=10030740e88c842af&q=${encodeURIComponent(
                name
              )}&searchType=image`
            );
            if (response.status === 429) {
              let response = await fetch(
                `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyBGskRKof9dkcoXtReamm4-h7UorF1G7yM&cx=258e213112b4b4492&q=${encodeURIComponent(
                  name
                )}&searchType=image`
              );
              return response;
            } else {
              return response;
            }
          } catch (error) {
            console.error("Error fetching image:", error);
            return null;
          }
        }

        const imageAppetizer =
          mealKey === "lunch" ? await fetchImage(mealAppetizer.name) : null;

        const imageMain = await fetchImage(mealMain.name);

        const imageDessert =
          mealKey === "lunch" || mealKey === "dinner"
            ? await fetchImage(mealDessert.name)
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
        if (
          imageAppetizerResponseData !== null &&
          imageAppetizerResponseData?.items?.[0]?.link
        ) {
          (mealPlanImagesData as any)[mealKey].appetizer =
            imageAppetizerResponseData.items[0].link;
        }

        if (imageMainResponseData?.items?.[0]?.link) {
          (mealPlanImagesData as any)[mealKey].main =
            imageMainResponseData.items[0].link;
        }

        if (
          imageDessertResponseData !== null &&
          imageDessertResponseData?.items?.[0]?.link
        ) {
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
