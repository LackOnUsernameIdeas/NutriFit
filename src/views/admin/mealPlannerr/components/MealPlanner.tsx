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
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setUserPreferences((prevState) => ({
      ...prevState,
      Cuisine: checked ? name : prevState.Cuisine
    }));
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
            //sk-14yD7Jthy49wCjUxHFIIT3Blbk(!!!MAHASH TOVA!!!)FJEs1Rgs3TpvI2c3dllWcI"
            Authorization: "Bearer kuromiyanko"
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content: `You are an experienced nutritionist that supervises patients to eat only edible food that is ONLY from Bulgarian cuisine. Focus on creating an ACCURATE, diverse and delicious meal plan for the day that is comprised of the following limits: calories(${userPreferences.Calories}), protein(${userPreferences.Protein}), fat(${userPreferences.Fat}) and carbohydrates(${userPreferences.Carbohydrates}). Never go above or below the provided limits, and make SURE that the calories and fat are ALWAYS the same as the provided limits. Ensure the accuracy of the quantities. Ensure that you refrain from including the specified items. Export in JSON EXACTLY LIKE THE PROVIDED STRUCTURE in the content property in the body of this request without adding 'json' keyword with backticks. The response should only be pure json, nothing else.`
              },
              {
                role: "user",
                content: `Създайте ми дневно меню с ниско съдържание на мазнини, включващо едно ястие за закуска, три за обяд (третото трябва да е десерт) и две за вечеря (второто да бъде десерт). Менюто трябва стриктно да спазва следните лимити: да съдържа ${userPreferences.Calories} калории, ${userPreferences.Protein} грама протеин, ${userPreferences.Fat} грама мазнини и ${userPreferences.Carbohydrates} грама въглехидрати. НЕ Предоставяйте храни, които накрая имат значително по-малко количество калории, въглехидрати, протеин и мазнини в сравнение с посочените общи лимити (${userPreferences.Calories} калории, ${userPreferences.Protein} грама протеин, ${userPreferences.Fat} грама мазнини и ${userPreferences.Carbohydrates} грама въглехидрати) и НЕ давай Таратор, Мусака, Кадаиф и Баница, както и измислени рецепти. Включвай само съществуващи рецепти в хранителният план. Предоставете точни мерки и точни стойности за калории, протеин, въглехидрати и мазнини за закуска, обяд, вечеря и общо. Предоставете реалистични рецепти, подходящи за консумация; не оставяйте празни места или предоставяйте предмети, дейности или каквото и да е, вместо храни за консумация. Имената на храните трябва да бъдат адекватно преведени и написани на български език и да са реални ястия за консумация. Вмъкни в менюто всички останали изисквания, но стриктно избягвай да добавяш следните елементи в хранителнато меню: ${userPreferences.Exclude}. Имената на храните трябва да са адекватно преведени и написани, така че да са съществуващи храни. Форматирай общата информацията за калориите, протеина, въглехидратите и мазнините по следния начин И ВНИМАВАЙ ТЯ ДА НЕ Е РАЗЛИЧНА ОТ ОБЩАТА СТОЙНОСТ НА КАЛОРИИТЕ, ВЪГЛЕХИДРАТИТЕ, ПРОТЕИНА И МАЗНИНИТЕ НА ЯСТИЯТА: 'totals: {calories: number,protein: number,fat: number,carbohydrates: number,grams:number}'. Форматирай сумираните стойности по абсолютно същият начин: 'totals: {calories: number,protein: number,fat: number,carbohydrates: number}'. Форматирай ЦЯЛАТА информация в JSON по АБСОЛЮТНО ИДЕНТИЧЕН начин: '{breakfast':{'main':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}},'lunch':{'appetizer':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}, 'main':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}, 'dessert':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}}, 'dinner':{'main':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}, 'dessert':{'name':'string','totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number','grams':'number'}}},'totals':{'calories':'number','protein':'number','fat':'number','carbohydrates':'number'}}', като не превеждаш имената на нито едно property (ТЕ ТРЯБВА ДА СА САМО НА АНГЛИЙСКИ ЕЗИК). Преведи САМО стойностите на БЪЛГАРСКИ, без нито едно property. Те трябва ЗАДЪЛЖИТЕЛНО да са на английски. Грамажът на ястията е ЗАДЪЛЖИТЕЛНА стойност, която НЕ трябва да е повече от 500 грама. Не включвай грамажа в името на ястието, а го дай САМО като стойност в totals. Името на ястието е ЗАДЪЛЖИТЕЛНО на български`
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
              `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=10030740e88c842af&q=${encodeURIComponent(
                name
              )}&searchType=image`
            );
            if (response.status === 429) {
              let response = await fetch(
                `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA&cx=258e213112b4b4492&q=${encodeURIComponent(
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
                        handleCheckboxChange={handleCheckboxChange}
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
                        handleCheckboxChange={handleCheckboxChange}
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
                  handleCheckboxChange={handleCheckboxChange}
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
