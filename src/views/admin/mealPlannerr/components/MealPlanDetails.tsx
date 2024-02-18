import React from "react";
import {
  MealPlan2,
  UserPreferencesForMealPlan
} from "../../../../types/weightStats";
import {
  Box,
  Text,
  Flex,
  SimpleGrid,
  Tooltip,
  Link,
  IconButton,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import RecipeWidget from "components/card/NFT";
import Card from "components/card/Card";
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowLeft,
  MdFlatware
} from "react-icons/md";
interface MealPlanDetailsProps {
  mealPlan: MealPlan2;
  mealPlanImages: {
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
  };
  userPreferences: UserPreferencesForMealPlan;
}

const bulgarianMealType: string[] = ["Закуска", "Обяд", "Вечеря"];

const calculateMealTotals = (mealPlan: MealPlan2) => {
  // Initialize totals for the meal type
  const totals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbohydrates: 0
  };

  // Iterate over each meal type
  Object.entries(mealPlan).forEach(([mealType, meal]) => {
    if (mealType !== "totals") {
      // Iterate over each food item in the meal type
      Object.values(meal).forEach((foodItem: any) => {
        console.log("foodItem", foodItem);
        // Add the nutrients of the food item to the totals for the day
        totals.calories += foodItem.totals.calories;
        totals.protein += foodItem.totals.protein;
        totals.fat += foodItem.totals.fat;
        totals.carbohydrates += foodItem.totals.carbohydrates;
      });
    }
  });

  return totals;
};

const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({
  mealPlan,
  mealPlanImages,
  userPreferences
}) => {
  const [currentPage, setCurrentPage] = React.useState("закуска");
  const [showDessertInstructions, setShowDessertInstructions] =
    React.useState(false);
  const [showMainInstructions, setShowMainInstructions] = React.useState(false);
  const [showAppetizerInstructions, setShowAppetizerInstructions] =
    React.useState(false);

  const toggleDessertInstructions = () => {
    setShowDessertInstructions(!showDessertInstructions);
  };
  const toggleMainInstructions = () => {
    setShowMainInstructions(!showMainInstructions);
  };
  const toggleAppetizerInstructions = () => {
    setShowAppetizerInstructions(!showAppetizerInstructions);
  };
  // Function to handle next page
  const nextPage = () => {
    if (currentPage === "закуска") setCurrentPage("обяд");
    else if (currentPage === "обяд") setCurrentPage("вечеря");
  };

  // Function to handle previous page
  const prevPage = () => {
    if (currentPage === "обяд") setCurrentPage("закуска");
    else if (currentPage === "вечеря") setCurrentPage("обяд");
  };
  console.log("unfiltered Array: ", mealPlan);

  const filteredArr = Object.fromEntries(
    Object.entries(mealPlan).filter(([key]) => key !== "totals")
  );

  console.log("filteredArr: ", filteredArr);

  const calculatedTotals = calculateMealTotals(mealPlan);

  console.log("calculatedTotals: ", calculatedTotals);
  return (
    <FadeInWrapper>
      <Card>
        <Flex justify="center">
          <IconButton
            aria-label="left"
            icon={<MdOutlineKeyboardArrowLeft />}
            onClick={prevPage}
            disabled={currentPage === "breakfast"}
            fontSize="4xl"
            size="lg"
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
            bg="none"
          />
          <Text fontSize="4xl" fontWeight="bold" ml="10px" mr="10px">
            {currentPage.toUpperCase()}
          </Text>
          <IconButton
            aria-label="right"
            icon={<MdOutlineKeyboardArrowRight />}
            onClick={nextPage}
            disabled={currentPage === "dinner"}
            fontSize="4xl"
            size="lg"
            _hover={{ bg: "none" }}
            _active={{ bg: "none" }}
            bg="none"
          />
        </Flex>
        {currentPage === "закуска" && (
          <>
            {Object.keys(filteredArr).map((mealType, index) => {
              if (mealType === "breakfast") {
                const meal = (mealPlan as any)[mealType];
                const appetizer = meal.appetizer ? meal.appetizer : "none";
                const main = meal.main;
                const dessert = meal.dessert ? meal.dessert : "none";

                console.log("meal:", mealType, meal);
                return (
                  <Box key={mealType}>
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      gap="20px"
                      mt="40px"
                      mb="40px"
                    >
                      {appetizer !== "none" && (
                        <Box key="appetizer">
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
                            image={
                              (mealPlanImages as any)[mealType].appetizer
                                ? (mealPlanImages as any)[mealType].appetizer
                                : ""
                            }
                            currentbid={
                              <Box>
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mb="30px"
                                >
                                  <Icon
                                    as={MdFlatware}
                                    boxSize={6}
                                    color="purple.500"
                                    mr={2}
                                  />
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Грамаж: {`${appetizer?.totals.grams} g`}
                                  </Text>
                                </Flex>
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
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Калории: {appetizer?.totals.calories}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Въглехидрати:{" "}
                                      {appetizer?.totals.carbohydrates}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Протеин: {appetizer?.totals.protein}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Мазнини: {appetizer?.totals.fat}
                                    </Text>
                                  </SimpleGrid>
                                </Flex>
                                <Flex
                                  mt="20px"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Button
                                    size="lg"
                                    bg="#7c6bff"
                                    color="white"
                                    onClick={toggleAppetizerInstructions}
                                  >
                                    Рецепта
                                  </Button>
                                </Flex>

                                <Modal
                                  isOpen={showAppetizerInstructions}
                                  onClose={toggleAppetizerInstructions}
                                >
                                  <ModalOverlay />
                                  <ModalContent borderRadius="20px">
                                    <ModalHeader fontSize="2xl">
                                      Рецепта
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <b>Съставки:</b>
                                      {appetizer?.ingredients.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Инструкции:</b>
                                      {appetizer?.instructions.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Крайно количество: </b>
                                      {appetizer?.recipeQuantity}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        bg="#7c6bff"
                                        color="white"
                                        mr={3}
                                        onClick={toggleAppetizerInstructions}
                                      >
                                        Излез
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Box>
                            }
                          />
                        </Box>
                      )}
                      <Box key="main">
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
                          image={
                            (mealPlanImages as any)[mealType].main
                              ? (mealPlanImages as any)[mealType].main
                              : ""
                          }
                          currentbid={
                            <Box>
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                mb="30px"
                              >
                                <Icon
                                  as={MdFlatware}
                                  boxSize={6}
                                  color="purple.500"
                                  mr={2}
                                />
                                <Text
                                  textStyle="italic"
                                  fontSize={{
                                    base: "sm",
                                    md: "md",
                                    lg: "lg"
                                  }}
                                  fontStyle="italic"
                                >
                                  Грамаж: {`${main?.totals.grams} g`}
                                </Text>
                              </Flex>
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
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Калории: {main?.totals.calories}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    mb={{ base: "2%", md: 0, lg: "3%" }}
                                    fontStyle="italic"
                                  >
                                    Въглехидрати: {main?.totals.carbohydrates}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Протеин: {main?.totals.protein}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    mb={{ base: "2%", md: 0, lg: "3%" }}
                                    fontStyle="italic"
                                  >
                                    Мазнини: {main?.totals.fat}
                                  </Text>
                                </SimpleGrid>
                              </Flex>
                              <Flex
                                mt="20px"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Button
                                  size="lg"
                                  bg="#7c6bff"
                                  color="white"
                                  onClick={toggleMainInstructions}
                                >
                                  Рецепта
                                </Button>
                              </Flex>

                              <Modal
                                isOpen={showMainInstructions}
                                onClose={toggleMainInstructions}
                              >
                                <ModalOverlay />
                                <ModalContent borderRadius="20px">
                                  <ModalHeader fontSize="2xl">
                                    Рецепта
                                  </ModalHeader>
                                  <ModalCloseButton />
                                  <ModalBody>
                                    <b>Съставки:</b>
                                    {main?.ingredients.map(
                                      (step: string, index: number) => (
                                        <Text key={index}>{step}</Text>
                                      )
                                    )}
                                    <br />
                                    <b>Инструкции:</b>
                                    {main?.instructions.map(
                                      (step: string, index: number) => (
                                        <Text key={index}>{step}</Text>
                                      )
                                    )}
                                    <br />
                                    <b>Крайно количество: </b>
                                    {main?.recipeQuantity}
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      bg="#7c6bff"
                                      color="white"
                                      mr={3}
                                      onClick={toggleMainInstructions}
                                    >
                                      Излез
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </Box>
                          }
                        />
                      </Box>
                      {dessert !== "none" && (
                        <Box key="dessert">
                          <RecipeWidget
                            name={
                              <Flex justify="center" w="100%" overflow="hidden">
                                <Tooltip
                                  label={dessert?.name}
                                  borderRadius="10px"
                                >
                                  <Text
                                    fontSize="2xl"
                                    whiteSpace="nowrap"
                                    maxW="360px"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                  >
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
                            image={
                              (mealPlanImages as any)[mealType].dessert
                                ? (mealPlanImages as any)[mealType].dessert
                                : ""
                            }
                            currentbid={
                              <Box>
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mb="30px"
                                >
                                  <Icon
                                    as={MdFlatware}
                                    boxSize={6}
                                    color="purple.500"
                                    mr={2}
                                  />
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Грамаж: {`${dessert?.totals.grams} g`}
                                  </Text>
                                </Flex>
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
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Калории: {dessert?.totals.calories}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Въглехидрати:{" "}
                                      {dessert?.totals.carbohydrates}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Протеин: {dessert?.totals.protein}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Мазнини: {dessert?.totals.fat}
                                    </Text>
                                  </SimpleGrid>
                                </Flex>
                                <Flex
                                  mt="20px"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Button
                                    size="lg"
                                    bg="#7c6bff"
                                    color="white"
                                    onClick={toggleDessertInstructions}
                                  >
                                    Рецепта
                                  </Button>
                                </Flex>

                                <Modal
                                  isOpen={showDessertInstructions}
                                  onClose={toggleDessertInstructions}
                                >
                                  <ModalOverlay />
                                  <ModalContent borderRadius="20px">
                                    <ModalHeader fontSize="2xl">
                                      Рецепта
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <b>Съставки:</b>
                                      {dessert?.ingredients.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Инструкции:</b>
                                      {dessert?.instructions.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Крайно количество: </b>
                                      {dessert?.recipeQuantity}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        bg="#7c6bff"
                                        color="white"
                                        mr={3}
                                        onClick={toggleDessertInstructions}
                                      >
                                        Излез
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Box>
                            }
                          />
                        </Box>
                      )}
                    </SimpleGrid>
                  </Box>
                );
              }
            })}
          </>
        )}
        {currentPage === "обяд" && (
          <>
            {Object.keys(filteredArr).map((mealType, index) => {
              if (mealType === "lunch") {
                const meal = (mealPlan as any)[mealType];
                const appetizer = meal.appetizer ? meal.appetizer : "none";
                const main = meal.main;
                const dessert = meal.dessert ? meal.dessert : "none";

                console.log("meal:", mealType, meal);
                return (
                  <Box key={mealType}>
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      gap="20px"
                      mt="40px"
                      mb="40px"
                    >
                      {appetizer !== "none" && (
                        <Box key="appetizer">
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
                            image={
                              (mealPlanImages as any)[mealType].appetizer
                                ? (mealPlanImages as any)[mealType].appetizer
                                : ""
                            }
                            currentbid={
                              <Box>
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mb="30px"
                                >
                                  <Icon
                                    as={MdFlatware}
                                    boxSize={6}
                                    color="purple.500"
                                    mr={2}
                                  />
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Грамаж: {`${appetizer?.totals.grams} g`}
                                  </Text>
                                </Flex>
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
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Калории: {appetizer?.totals.calories}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Въглехидрати:{" "}
                                      {appetizer?.totals.carbohydrates}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Протеин: {appetizer?.totals.protein}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Мазнини: {appetizer?.totals.fat}
                                    </Text>
                                  </SimpleGrid>
                                </Flex>
                                <Flex
                                  mt="20px"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Button
                                    size="lg"
                                    bg="#7c6bff"
                                    color="white"
                                    onClick={toggleAppetizerInstructions}
                                  >
                                    Рецепта
                                  </Button>
                                </Flex>

                                <Modal
                                  isOpen={showAppetizerInstructions}
                                  onClose={toggleAppetizerInstructions}
                                >
                                  <ModalOverlay />
                                  <ModalContent borderRadius="20px">
                                    <ModalHeader fontSize="2xl">
                                      Рецепта
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <b>Съставки:</b>
                                      {appetizer?.ingredients.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Инструкции:</b>
                                      {appetizer?.instructions.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Крайно количество: </b>
                                      {appetizer?.recipeQuantity}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        bg="#7c6bff"
                                        color="white"
                                        mr={3}
                                        onClick={toggleAppetizerInstructions}
                                      >
                                        Излез
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Box>
                            }
                          />
                        </Box>
                      )}
                      <Box key="main">
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
                          image={
                            (mealPlanImages as any)[mealType].main
                              ? (mealPlanImages as any)[mealType].main
                              : ""
                          }
                          currentbid={
                            <Box>
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                mb="30px"
                              >
                                <Icon
                                  as={MdFlatware}
                                  boxSize={6}
                                  color="purple.500"
                                  mr={2}
                                />
                                <Text
                                  textStyle="italic"
                                  fontSize={{
                                    base: "sm",
                                    md: "md",
                                    lg: "lg"
                                  }}
                                  fontStyle="italic"
                                >
                                  Грамаж: {`${main?.totals.grams} g`}
                                </Text>
                              </Flex>
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
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Калории: {main?.totals.calories}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    mb={{ base: "2%", md: 0, lg: "3%" }}
                                    fontStyle="italic"
                                  >
                                    Въглехидрати: {main?.totals.carbohydrates}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Протеин: {main?.totals.protein}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    mb={{ base: "2%", md: 0, lg: "3%" }}
                                    fontStyle="italic"
                                  >
                                    Мазнини: {main?.totals.fat}
                                  </Text>
                                </SimpleGrid>
                              </Flex>
                              <Flex
                                mt="20px"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Button
                                  size="lg"
                                  bg="#7c6bff"
                                  color="white"
                                  onClick={toggleMainInstructions}
                                >
                                  Рецепта
                                </Button>
                              </Flex>

                              <Modal
                                isOpen={showMainInstructions}
                                onClose={toggleMainInstructions}
                              >
                                <ModalOverlay />
                                <ModalContent borderRadius="20px">
                                  <ModalHeader fontSize="2xl">
                                    Рецепта
                                  </ModalHeader>
                                  <ModalCloseButton />
                                  <ModalBody>
                                    <b>Съставки:</b>
                                    {main?.ingredients.map(
                                      (step: string, index: number) => (
                                        <Text key={index}>{step}</Text>
                                      )
                                    )}
                                    <br />
                                    <b>Инструкции:</b>
                                    {main?.instructions.map(
                                      (step: string, index: number) => (
                                        <Text key={index}>{step}</Text>
                                      )
                                    )}
                                    <br />
                                    <b>Крайно количество: </b>
                                    {main?.recipeQuantity}
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      bg="#7c6bff"
                                      color="white"
                                      mr={3}
                                      onClick={toggleMainInstructions}
                                    >
                                      Излез
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </Box>
                          }
                        />
                      </Box>
                      {dessert !== "none" && (
                        <Box key="dessert">
                          <RecipeWidget
                            name={
                              <Flex justify="center" w="100%" overflow="hidden">
                                <Tooltip
                                  label={dessert?.name}
                                  borderRadius="10px"
                                >
                                  <Text
                                    fontSize="2xl"
                                    whiteSpace="nowrap"
                                    maxW="360px"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                  >
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
                            image={
                              (mealPlanImages as any)[mealType].dessert
                                ? (mealPlanImages as any)[mealType].dessert
                                : ""
                            }
                            currentbid={
                              <Box>
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mb="30px"
                                >
                                  <Icon
                                    as={MdFlatware}
                                    boxSize={6}
                                    color="purple.500"
                                    mr={2}
                                  />
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Грамаж: {`${dessert?.totals.grams} g`}
                                  </Text>
                                </Flex>
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
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Калории: {dessert?.totals.calories}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Въглехидрати:{" "}
                                      {dessert?.totals.carbohydrates}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Протеин: {dessert?.totals.protein}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Мазнини: {dessert?.totals.fat}
                                    </Text>
                                  </SimpleGrid>
                                </Flex>
                                <Flex
                                  mt="20px"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Button
                                    size="lg"
                                    bg="#7c6bff"
                                    color="white"
                                    onClick={toggleDessertInstructions}
                                  >
                                    Рецепта
                                  </Button>
                                </Flex>

                                <Modal
                                  isOpen={showDessertInstructions}
                                  onClose={toggleDessertInstructions}
                                >
                                  <ModalOverlay />
                                  <ModalContent borderRadius="20px">
                                    <ModalHeader fontSize="2xl">
                                      Рецепта
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <b>Съставки:</b>
                                      {dessert?.ingredients.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Инструкции:</b>
                                      {dessert?.instructions.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Крайно количество: </b>
                                      {dessert?.recipeQuantity}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        bg="#7c6bff"
                                        color="white"
                                        mr={3}
                                        onClick={toggleDessertInstructions}
                                      >
                                        Излез
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Box>
                            }
                          />
                        </Box>
                      )}
                    </SimpleGrid>
                  </Box>
                );
              }
            })}
          </>
        )}
        {currentPage === "вечеря" && (
          <>
            {Object.keys(filteredArr).map((mealType, index) => {
              if (mealType === "dinner") {
                const meal = (mealPlan as any)[mealType];
                const appetizer = meal.appetizer ? meal.appetizer : "none";
                const main = meal.main;
                const dessert = meal.dessert ? meal.dessert : "none";

                console.log("meal:", mealType, meal);
                return (
                  <Box key={mealType}>
                    <SimpleGrid
                      columns={{ base: 1, md: 3 }}
                      gap="20px"
                      mt="40px"
                      mb="40px"
                    >
                      {appetizer !== "none" && (
                        <Box key="appetizer">
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
                            image={
                              (mealPlanImages as any)[mealType].appetizer
                                ? (mealPlanImages as any)[mealType].appetizer
                                : ""
                            }
                            currentbid={
                              <Box>
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mb="30px"
                                >
                                  <Icon
                                    as={MdFlatware}
                                    boxSize={6}
                                    color="purple.500"
                                    mr={2}
                                  />
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Грамаж: {`${appetizer?.totals.grams} g`}
                                  </Text>
                                </Flex>
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
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Калории: {appetizer?.totals.calories}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Въглехидрати:{" "}
                                      {appetizer?.totals.carbohydrates}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Протеин: {appetizer?.totals.protein}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Мазнини: {appetizer?.totals.fat}
                                    </Text>
                                  </SimpleGrid>
                                </Flex>

                                <Flex
                                  mt="20px"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Button
                                    size="lg"
                                    bg="#7c6bff"
                                    color="white"
                                    onClick={toggleAppetizerInstructions}
                                  >
                                    Рецепта
                                  </Button>
                                </Flex>

                                <Modal
                                  isOpen={showAppetizerInstructions}
                                  onClose={toggleAppetizerInstructions}
                                >
                                  <ModalOverlay />
                                  <ModalContent borderRadius="20px">
                                    <ModalHeader fontSize="2xl">
                                      Рецепта
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <b>Съставки:</b>
                                      {appetizer?.ingredients.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Инструкции:</b>
                                      {appetizer?.instructions.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Крайно количество: </b>
                                      {appetizer?.recipeQuantity}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        bg="#7c6bff"
                                        color="white"
                                        mr={3}
                                        onClick={toggleAppetizerInstructions}
                                      >
                                        Излез
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Box>
                            }
                          />
                        </Box>
                      )}
                      <Box key="main">
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
                          image={
                            (mealPlanImages as any)[mealType].main
                              ? (mealPlanImages as any)[mealType].main
                              : ""
                          }
                          currentbid={
                            <Box>
                              <Flex
                                alignItems="center"
                                justifyContent="center"
                                mb="30px"
                              >
                                <Icon
                                  as={MdFlatware}
                                  boxSize={6}
                                  color="purple.500"
                                  mr={2}
                                />
                                <Text
                                  textStyle="italic"
                                  fontSize={{
                                    base: "sm",
                                    md: "md",
                                    lg: "lg"
                                  }}
                                  fontStyle="italic"
                                >
                                  Грамаж: {`${main?.totals.grams} g`}
                                </Text>
                              </Flex>
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
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Калории: {main?.totals.calories}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    mb={{ base: "2%", md: 0, lg: "3%" }}
                                    fontStyle="italic"
                                  >
                                    Въглехидрати: {main?.totals.carbohydrates}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Протеин: {main?.totals.protein}
                                  </Text>
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    mb={{ base: "2%", md: 0, lg: "3%" }}
                                    fontStyle="italic"
                                  >
                                    Мазнини: {main?.totals.fat}
                                  </Text>
                                </SimpleGrid>
                              </Flex>
                              <Flex
                                mt="20px"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <Button
                                  size="lg"
                                  bg="#7c6bff"
                                  color="white"
                                  onClick={toggleMainInstructions}
                                >
                                  Рецепта
                                </Button>
                              </Flex>

                              <Modal
                                isOpen={showMainInstructions}
                                onClose={toggleMainInstructions}
                              >
                                <ModalOverlay />
                                <ModalContent borderRadius="20px">
                                  <ModalHeader fontSize="2xl">
                                    Рецепта
                                  </ModalHeader>
                                  <ModalCloseButton />
                                  <ModalBody>
                                    <b>Съставки:</b>
                                    {main?.ingredients.map(
                                      (step: string, index: number) => (
                                        <Text key={index}>{step}</Text>
                                      )
                                    )}
                                    <br />
                                    <b>Инструкции:</b>
                                    {main?.instructions.map(
                                      (step: string, index: number) => (
                                        <Text key={index}>{step}</Text>
                                      )
                                    )}
                                    <br />
                                    <b>Крайно количество: </b>
                                    {main?.recipeQuantity}
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button
                                      bg="#7c6bff"
                                      color="white"
                                      mr={3}
                                      onClick={toggleMainInstructions}
                                    >
                                      Излез
                                    </Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>
                            </Box>
                          }
                        />
                      </Box>
                      {dessert !== "none" && (
                        <Box key="dessert">
                          <RecipeWidget
                            name={
                              <Flex justify="center" w="100%" overflow="hidden">
                                <Tooltip
                                  label={dessert?.name}
                                  borderRadius="10px"
                                >
                                  <Text
                                    fontSize="2xl"
                                    whiteSpace="nowrap"
                                    maxW="360px"
                                    overflow="hidden"
                                    textOverflow="ellipsis"
                                  >
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
                            image={
                              (mealPlanImages as any)[mealType].dessert
                                ? (mealPlanImages as any)[mealType].dessert
                                : ""
                            }
                            currentbid={
                              <Box>
                                <Flex
                                  alignItems="center"
                                  justifyContent="center"
                                  mb="30px"
                                >
                                  <Icon
                                    as={MdFlatware}
                                    boxSize={6}
                                    color="purple.500"
                                    mr={2}
                                  />
                                  <Text
                                    textStyle="italic"
                                    fontSize={{
                                      base: "sm",
                                      md: "md",
                                      lg: "lg"
                                    }}
                                    fontStyle="italic"
                                  >
                                    Грамаж: {`${dessert?.totals.grams} g`}
                                  </Text>
                                </Flex>
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
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Калории: {dessert?.totals.calories}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Въглехидрати:{" "}
                                      {dessert?.totals.carbohydrates}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      fontStyle="italic"
                                    >
                                      Протеин: {dessert?.totals.protein}
                                    </Text>
                                    <Text
                                      textStyle="italic"
                                      fontSize={{
                                        base: "sm",
                                        md: "md",
                                        lg: "lg"
                                      }}
                                      mb={{ base: "2%", md: 0, lg: "3%" }}
                                      fontStyle="italic"
                                    >
                                      Мазнини: {dessert?.totals.fat}
                                    </Text>
                                  </SimpleGrid>
                                </Flex>
                                <Flex
                                  mt="20px"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Button
                                    size="lg"
                                    bg="#7c6bff"
                                    color="white"
                                    onClick={toggleDessertInstructions}
                                  >
                                    Рецепта
                                  </Button>
                                </Flex>
                                <Modal
                                  isOpen={showDessertInstructions}
                                  onClose={toggleDessertInstructions}
                                >
                                  <ModalOverlay />
                                  <ModalContent borderRadius="20px">
                                    <ModalHeader fontSize="2xl">
                                      Рецепта
                                    </ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                      <b>Съставки:</b>
                                      {dessert?.ingredients.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Инструкции:</b>
                                      {dessert?.instructions.map(
                                        (step: string, index: number) => (
                                          <Text key={index}>{step}</Text>
                                        )
                                      )}
                                      <br />
                                      <b>Крайно количество: </b>
                                      {dessert?.recipeQuantity}
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button
                                        bg="#7c6bff"
                                        color="white"
                                        mr={3}
                                        onClick={toggleDessertInstructions}
                                      >
                                        Излез
                                      </Button>
                                    </ModalFooter>
                                  </ModalContent>
                                </Modal>
                              </Box>
                            }
                          />
                        </Box>
                      )}
                    </SimpleGrid>
                  </Box>
                );
              }
            })}
          </>
        )}
        <HSeparator />
        <Flex justify="center" pt="5px" w="100%" mt="20px">
          <SimpleGrid
            columns={{ base: 2, lg: 4 }}
            spacing="3%"
            alignItems="center"
          >
            <Flex>
              <Tooltip
                label={`Сумирани калории и тяхната разлика от подадените лимити.`}
                aria-label="calories-tooltip"
                borderRadius="10px"
              >
                <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
                  <b>
                    Сумирани калории: {calculatedTotals.calories.toFixed(2)}
                  </b>
                  {calculatedTotals.calories - userPreferences.Calories !==
                  0 ? (
                    <Box>
                      <Text fontSize="lg" color="white">
                        Отклонение на chatGPT в цифри:
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        (
                        {calculatedTotals.calories - userPreferences.Calories >
                          0 && "+"}
                        {(
                          calculatedTotals.calories - userPreferences.Calories
                        ).toFixed(2)}
                        )
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        <Text fontSize="lg" color="white">
                          Процент на отклонение на chatGPT:
                        </Text>
                        (+
                        {(
                          ((calculatedTotals.calories -
                            userPreferences.Calories) /
                            userPreferences.Calories) *
                          100
                        ).toFixed(2)}
                        %)
                      </Text>
                    </Box>
                  ) : (
                    <Text fontSize="lg" color="#03AC13">
                      Няма отклонение от страна на chatGPT!
                    </Text>
                  )}
                </Text>
              </Tooltip>
            </Flex>
            <Flex>
              <Tooltip
                label={`Сумиран протеин и неговата разлика от подадените лимити.`}
                aria-label="protein-tooltip"
                borderRadius="10px"
              >
                <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
                  <b>Сумиран протеин: {calculatedTotals.protein.toFixed(2)}</b>
                  {calculatedTotals.protein - userPreferences.Protein !== 0 && (
                    <Box>
                      <Text fontSize="lg" color="white">
                        Отклонение на chatGPT в цифри:
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        (
                        {calculatedTotals.protein - userPreferences.Protein >
                          0 && "+"}
                        {(
                          calculatedTotals.protein - userPreferences.Protein
                        ).toFixed(2)}
                        )
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        <Text fontSize="lg" color="white">
                          Отклонение на chatGPT в цифри:
                        </Text>
                        (+
                        {(
                          ((calculatedTotals.protein -
                            userPreferences.Protein) /
                            userPreferences.Protein) *
                          100
                        ).toFixed(2)}
                        %)
                      </Text>
                    </Box>
                  )}
                </Text>
              </Tooltip>
            </Flex>
            <Flex>
              <Tooltip
                label={`Сумирани въглехидрати и тяхната разлика от подадените лимити.`}
                aria-label="carbs-tooltip"
                borderRadius="10px"
              >
                <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
                  <b>
                    Сумирани въглехидрати:{" "}
                    {calculatedTotals.carbohydrates.toFixed(2)}
                  </b>
                  {calculatedTotals.carbohydrates -
                    userPreferences.Carbohydrates !==
                    0 && (
                    <Box>
                      <Text fontSize="lg" color="white">
                        Отклонение на chatGPT в цифри:
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        (
                        {calculatedTotals.carbohydrates -
                          userPreferences.Carbohydrates >
                          0 && "+"}
                        {(
                          calculatedTotals.carbohydrates -
                          userPreferences.Carbohydrates
                        ).toFixed(2)}
                        )
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        <Text fontSize="lg" color="white">
                          Процент на отклонение на chatGPT:
                        </Text>
                        (+
                        {(
                          ((calculatedTotals.carbohydrates -
                            userPreferences.Carbohydrates) /
                            userPreferences.Carbohydrates) *
                          100
                        ).toFixed(2)}
                        %)
                      </Text>
                    </Box>
                  )}
                </Text>
              </Tooltip>
            </Flex>
            <Flex>
              <Tooltip
                label={`Сумирани мазнини и тяхната разлика от подадените лимити.`}
                aria-label="fat-tooltip"
                borderRadius="10px"
              >
                <Text mr="20%" fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}>
                  <b>Сумирани мазнини: {calculatedTotals.fat.toFixed(2)}</b>
                  {calculatedTotals.fat - userPreferences.Fat !== 0 && (
                    <Box>
                      <Text fontSize="lg" color="white">
                        Отклонение на chatGPT в цифри:
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        ({calculatedTotals.fat - userPreferences.Fat > 0 && "+"}
                        {(calculatedTotals.fat - userPreferences.Fat).toFixed(
                          2
                        )}
                        )
                      </Text>
                      <Text fontSize="lg" color="rgba(67,24,255,1)">
                        <Text fontSize="lg" color="white">
                          Процент на отклонение на chatGPT:
                        </Text>
                        (+
                        {(
                          ((calculatedTotals.fat - userPreferences.Fat) /
                            userPreferences.Fat) *
                          100
                        ).toFixed(2)}
                        %)
                      </Text>
                    </Box>
                  )}
                </Text>
              </Tooltip>
            </Flex>
          </SimpleGrid>
        </Flex>
      </Card>
    </FadeInWrapper>
  );
};

export default MealPlanDetails;
