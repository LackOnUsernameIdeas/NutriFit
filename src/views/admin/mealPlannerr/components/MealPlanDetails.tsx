import React from "react";
import { MealPlan, NutrientState } from "../../../../types/weightStats";
import { Box, Text, Flex, SimpleGrid, Tooltip } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import RecipeWidget from "components/card/NFT";
import Card from "components/card/Card";

interface MealPlanDetailsProps {
  mealPlan: MealPlan;
  mealPlanImages: {
    breakfast: string;
    lunch: string;
    dinner: string;
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
              console.log("meal:", mealType, meal);
              return (
                <Box key={mealType}>
                  <RecipeWidget
                    name={
                      <Flex justify="center" w="100%" overflow="hidden">
                        <Tooltip label={meal?.name} borderRadius="10px">
                          <Text
                            fontSize="2xl"
                            whiteSpace="nowrap"
                            maxW="360px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {bulgarianMealType[index]}:{" "}
                            {meal?.name || "Няма рецепта"}
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
                    image={(mealPlanImages as any)[mealType]}
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
                              {`${meal?.totals.grams.toFixed(2)} g` || "N/A"}
                            </Text>
                            <Text
                              textStyle="italic"
                              fontSize={{ base: "sm", md: "md", lg: "lg" }}
                              mb={{ base: "2%", md: 0, lg: "3%" }}
                              fontStyle="italic"
                            >
                              Въглехидрати:{" "}
                              {meal?.totals.carbohydrates.toFixed(2) || "N/A"}
                            </Text>
                            <Text
                              textStyle="italic"
                              fontSize={{ base: "sm", md: "md", lg: "lg" }}
                              fontStyle="italic"
                            >
                              Протеин:{" "}
                              {meal?.totals.protein.toFixed(2) || "N/A"}
                            </Text>
                            <Text
                              textStyle="italic"
                              fontSize={{ base: "sm", md: "md", lg: "lg" }}
                              mb={{ base: "2%", md: 0, lg: "3%" }}
                              fontStyle="italic"
                            >
                              Мазнини: {meal?.totals.fat.toFixed(2) || "N/A"}
                            </Text>
                            <Text
                              textStyle="italic"
                              fontSize={{ base: "sm", md: "md", lg: "lg" }}
                              fontStyle="italic"
                            >
                              Калории:{" "}
                              {meal?.totals.calories.toFixed(2) || "N/A"}
                            </Text>
                          </SimpleGrid>
                        </Flex>
                      </Box>
                    }
                  />
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
