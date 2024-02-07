import React from "react";
import { MealPlan2, NutrientState } from "../../../../types/weightStats";
import { Box, Text, Flex, SimpleGrid, Tooltip, Link } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import RecipeWidget from "components/card/NFT";
import Card from "components/card/Card";

interface MealPlanDetailsProps {
  mealPlan: MealPlan2;
  mealPlanImages: {
    breakfast: {
      appetizer: string;
      main: string;
      dessert: string;
    };
    lunch: {
      appetizer: string;
      main: string;
      dessert: string;
    };
    dinner: {
      appetizer: string;
      main: string;
      dessert: string;
    };
  };
}

const bulgarianMealType: string[] = ["Закуска", "Обяд", "Вечеря"];

const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({
  mealPlan,
  mealPlanImages
}) => {
  console.log("unfiltered Array: ", mealPlan);

  const filteredArr = Object.fromEntries(
    Object.entries(mealPlan).filter(([key]) => key !== "totals")
  );

  console.log("filteredArr: ", filteredArr);
  return (
    <FadeInWrapper>
      <Card>
        <Flex direction="column">
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap="20px"
            mt="40px"
            mb="40px"
          >
            {Object.keys(filteredArr).map((mealType, index) => {
              const meal = (mealPlan as any)[mealType];
              const appetizer = meal.appetizer;
              const main = meal.main;
              const dessert = meal.dessert;

              console.log("meal:", mealType, meal);
              return (
                <Box key={mealType}>
                  <Box key="appetizer">
                    <Link
                      href={(mealPlanImages as any)[mealType].appetizer}
                      target="_blank"
                    >
                      <RecipeWidget
                        name={
                          <Flex justify="center" w="100%" overflow="hidden">
                            <Tooltip
                              label={appetizer?.name}
                              borderRadius="10px"
                            >
                              <Text
                                fontSize="2xl"
                                whiteSpace="nowrap"
                                maxW="360px"
                                overflow="hidden"
                                textOverflow="ellipsis"
                              >
                                {bulgarianMealType[index]}:{" "}
                                {appetizer?.name || "Няма рецепта"}
                              </Text>
                            </Tooltip>
                          </Flex>
                        }
                        author={
                          <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            pt="2px"
                            w="100%"
                            mt="5px"
                          ></Flex>
                        }
                        image={(mealPlanImages as any)[mealType].appetizer}
                        currentbid={
                          <Box>
                            <Flex
                              direction={{ base: "column", md: "row" }}
                              justify="center"
                              pt="5px"
                              w="100%"
                              mb="2%"
                              mt="2%"
                            >
                              <SimpleGrid
                                columns={{ base: 2, md: 2, lg: 2 }}
                                gap="10px"
                              >
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Грамаж:{" "}
                                  {`${appetizer?.totals.grams.toFixed(2)} g` ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Въглехидрати:{" "}
                                  {appetizer?.totals.carbohydrates.toFixed(2) ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  fontStyle="italic"
                                >
                                  Протеин:{" "}
                                  {appetizer?.totals.protein.toFixed(2) ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Мазнини:{" "}
                                  {appetizer?.totals.fat.toFixed(2) || "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  fontStyle="italic"
                                >
                                  Калории:{" "}
                                  {appetizer?.totals.calories.toFixed(2) ||
                                    "N/A"}
                                </Text>
                              </SimpleGrid>
                            </Flex>
                          </Box>
                        }
                      />
                    </Link>
                  </Box>
                  <Box key="main">
                    <Link
                      href={(mealPlanImages as any)[mealType].main}
                      target="_blank"
                    >
                      <RecipeWidget
                        name={
                          <Flex justify="center" w="100%" overflow="hidden">
                            <Tooltip label={main?.name} borderRadius="10px">
                              <Text
                                fontSize="2xl"
                                whiteSpace="nowrap"
                                maxW="360px"
                                overflow="hidden"
                                textOverflow="ellipsis"
                              >
                                {bulgarianMealType[index]}:{" "}
                                {main?.name || "Няма рецепта"}
                              </Text>
                            </Tooltip>
                          </Flex>
                        }
                        author={
                          <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            pt="2px"
                            w="100%"
                            mt="5px"
                          ></Flex>
                        }
                        image={(mealPlanImages as any)[mealType].main}
                        currentbid={
                          <Box>
                            <Flex
                              direction={{ base: "column", md: "row" }}
                              justify="center"
                              pt="5px"
                              w="100%"
                              mb="2%"
                              mt="2%"
                            >
                              <SimpleGrid
                                columns={{ base: 2, md: 2, lg: 2 }}
                                gap="10px"
                              >
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Грамаж:{" "}
                                  {`${main?.totals.grams.toFixed(2)} g` ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Въглехидрати:{" "}
                                  {main?.totals.carbohydrates.toFixed(2) ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  fontStyle="italic"
                                >
                                  Протеин:{" "}
                                  {main?.totals.protein.toFixed(2) || "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Мазнини:{" "}
                                  {main?.totals.fat.toFixed(2) || "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  fontStyle="italic"
                                >
                                  Калории:{" "}
                                  {main?.totals.calories.toFixed(2) || "N/A"}
                                </Text>
                              </SimpleGrid>
                            </Flex>
                          </Box>
                        }
                      />
                    </Link>
                  </Box>
                  <Box key="dessert">
                    <Link
                      href={(mealPlanImages as any)[mealType].dessert}
                      target="_blank"
                    >
                      <RecipeWidget
                        name={
                          <Flex justify="center" w="100%" overflow="hidden">
                            <Tooltip label={dessert?.name} borderRadius="10px">
                              <Text
                                fontSize="2xl"
                                whiteSpace="nowrap"
                                maxW="360px"
                                overflow="hidden"
                                textOverflow="ellipsis"
                              >
                                {bulgarianMealType[index]}:{" "}
                                {dessert?.name || "Няма рецепта"}
                              </Text>
                            </Tooltip>
                          </Flex>
                        }
                        author={
                          <Flex
                            direction="column"
                            justify="center"
                            align="center"
                            pt="2px"
                            w="100%"
                            mt="5px"
                          ></Flex>
                        }
                        image={(mealPlanImages as any)[mealType].dessert}
                        currentbid={
                          <Box>
                            <Flex
                              direction={{ base: "column", md: "row" }}
                              justify="center"
                              pt="5px"
                              w="100%"
                              mb="2%"
                              mt="2%"
                            >
                              <SimpleGrid
                                columns={{ base: 2, md: 2, lg: 2 }}
                                gap="10px"
                              >
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Грамаж:{" "}
                                  {`${dessert?.totals.grams.toFixed(2)} g` ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Въглехидрати:{" "}
                                  {dessert?.totals.carbohydrates.toFixed(2) ||
                                    "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  fontStyle="italic"
                                >
                                  Протеин:{" "}
                                  {dessert?.totals.protein.toFixed(2) || "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  mb={{ base: "2%", md: 0, lg: "3%" }}
                                  fontStyle="italic"
                                >
                                  Мазнини:{" "}
                                  {dessert?.totals.fat.toFixed(2) || "N/A"}
                                </Text>
                                <Text
                                  textStyle="italic"
                                  fontSize={{ base: "sm", md: "md", lg: "lg" }}
                                  fontStyle="italic"
                                >
                                  Калории:{" "}
                                  {dessert?.totals.calories.toFixed(2) || "N/A"}
                                </Text>
                              </SimpleGrid>
                            </Flex>
                          </Box>
                        }
                      />
                    </Link>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        </Flex>
        <HSeparator />
        <Flex justify="center" pt="5px" w="100%" mt="20px">
          <SimpleGrid
            columns={{ base: 2, lg: 4 }}
            spacing="3%"
            alignItems="center"
          >
            <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              Сумирани Калории: {mealPlan.totals.calories.toFixed(2) || "N/A"}
            </Text>
            <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              Сумирани Протеин: {mealPlan.totals.protein.toFixed(2) || "N/A"}
            </Text>
            <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              Сумирани Въглехидрати:{" "}
              {mealPlan.totals.carbohydrates.toFixed(2) || "N/A"}
            </Text>
            <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
              Сумирани Мазнини: {mealPlan.totals.fat.toFixed(2) || "N/A"}
            </Text>
          </SimpleGrid>
        </Flex>
      </Card>
    </FadeInWrapper>
  );
};

export default MealPlanDetails;
