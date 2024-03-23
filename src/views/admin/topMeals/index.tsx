import React from "react";
// Chakra imports
import {
  Avatar,
  Button,
  Box,
  Center,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  Tooltip,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Text,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useMediaQuery,
  IconButton
} from "@chakra-ui/react";
// Assets
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { orderMealsByFrequency } from "database/getAdditionalUserData";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// Custom components
import Loading from "views/admin/weightStats/components/Loading";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import RecipeWidget from "components/card/NFT";

import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { ColumnAvaragesChart } from "components/charts/BarCharts";
import { ColumnChart } from "components/charts/BarCharts";

import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdFlatware
} from "react-icons/md";
import RecipeModal from "./components/RecipeModal";
import { SuggestedMeal } from "../../../types/weightStats";
import { db } from "database/connection";
interface DropdownState {
  currentPage: number;
}

export default function TopMeals() {
  // Chakra Color Mode
  const [isMd] = useMediaQuery("(min-width: 48em) and (max-width: 61.99em)");
  const [isLg] = useMediaQuery("(min-width: 62em)");
  const chartsColor = useColorModeValue("brand.500", "white");
  const [loading, setLoading] = React.useState(true);
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const ITEMS_PER_PAGE = 5;
  const [dropdownState, setDropdownState] = React.useState<DropdownState>({
    currentPage: 0
  });
  const [allMeals, setAllMeals] = React.useState<SuggestedMeal[] | []>([
    {
      name: "Tova",
      count: 2,
      mealData: {
        totals: {
          calories: 424,
          carbohydrates: 2135432,
          grams: 1233412,
          fat: 124,
          protein: 124
        },
        recipeQuantity: 235,
        image:
          "https://recepti.gotvach.bg/files/lib/250x250/vitaminozna-salata-pecheni-orehi.webp",
        ingredients: ["wfwfwf", "fgwfwfwf"],
        name: "string",
        instructions: ["wfwfwf", "fgwfwfwf"]
      }
    },
    {
      name: "Tova",
      count: 1,
      mealData: {
        totals: {
          calories: 424,
          carbohydrates: 2135432,
          grams: 1233412,
          fat: 124,
          protein: 124
        },
        recipeQuantity: 235,
        image:
          "https://recepti.gotvach.bg/files/lib/250x250/vitaminozna-salata-pecheni-orehi.webp",
        ingredients: ["wfwfwf", "fgwfwfwf"],
        name: "string",
        instructions: ["wfwfwf", "fgwfwfwf"]
      }
    },
    {
      name: "Tova",
      count: 1,
      mealData: {
        totals: {
          calories: 424,
          carbohydrates: 2135432,
          grams: 1233412,
          fat: 124,
          protein: 124
        },
        recipeQuantity: 235,
        image:
          "https://recepti.gotvach.bg/files/lib/250x250/vitaminozna-salata-pecheni-orehi.webp",
        ingredients: ["wfwfwf", "fgwfwfwf"],
        name: "string",
        instructions: ["wfwfwf", "fgwfwfwf"]
      }
    },
    {
      name: "Tova",
      count: 1,
      mealData: {
        totals: {
          calories: 424,
          carbohydrates: 2135432,
          grams: 1233412,
          fat: 124,
          protein: 124
        },
        recipeQuantity: 235,
        image:
          "https://recepti.gotvach.bg/files/lib/250x250/vitaminozna-salata-pecheni-orehi.webp",
        ingredients: ["wfwfwf", "fgwfwfwf"],
        name: "string",
        instructions: ["wfwfwf", "fgwfwfwf"]
      }
    },
    {
      name: "Tova",
      count: 1,
      mealData: {
        totals: {
          calories: 424,
          carbohydrates: 2135432,
          grams: 1233412,
          fat: 124,
          protein: 124
        },
        recipeQuantity: 235,
        image:
          "https://recepti.gotvach.bg/files/lib/250x250/vitaminozna-salata-pecheni-orehi.webp",
        ingredients: ["wfwfwf", "fgwfwfwf"],
        name: "string",
        instructions: ["wfwfwf", "fgwfwfwf"]
      }
    }
  ]);
  const totalPages = Math.ceil(allMeals.length / ITEMS_PER_PAGE);
  // Sorting by calories
  const sortedByCaloriesDescending = [...allMeals].sort(
    (a, b) => b.mealData.totals.calories - a.mealData.totals.calories
  );

  const sortedByCaloriesAscending = [...allMeals].sort(
    (a, b) => a.mealData.totals.calories - b.mealData.totals.calories
  );

  // Sorting by carbohydrates
  const sortedByCarbohydratesDescending = [...allMeals].sort(
    (a, b) => b.mealData.totals.carbohydrates - a.mealData.totals.carbohydrates
  );

  const sortedByCarbohydratesAscending = [...allMeals].sort(
    (a, b) => a.mealData.totals.carbohydrates - b.mealData.totals.carbohydrates
  );

  // Sorting by fat
  const sortedByFatDescending = [...allMeals].sort(
    (a, b) => b.mealData.totals.fat - a.mealData.totals.fat
  );

  const sortedByFatAscending = [...allMeals].sort(
    (a, b) => a.mealData.totals.fat - b.mealData.totals.fat
  );

  // Sorting by protein
  const sortedByProteinDescending = [...allMeals].sort(
    (a, b) => b.mealData.totals.protein - a.mealData.totals.protein
  );

  const sortedByProteinAscending = [...allMeals].sort(
    (a, b) => a.mealData.totals.protein - b.mealData.totals.protein
  );
  const barChartNames = allMeals.slice(0, 10).map((entry) => entry.name);
  const barChartLabels = allMeals
    .slice(0, 10)
    .map((_, index) => `#${index + 1}`);
  const barChartForTopSuggestions = allMeals
    .slice(0, 10)
    .map((entry) => entry.count);
  const barChartForCalories = allMeals
    .slice(0, 10)
    .map((entry) => entry.mealData.totals.calories);
  const barChartForProtein = allMeals
    .slice(0, 10)
    .map((entry) => entry.mealData.totals.protein);
  const barChartForFat = allMeals
    .slice(0, 10)
    .map((entry) => entry.mealData.totals.fat);
  const barChartForCarbohydrates = allMeals
    .slice(0, 10)
    .map((entry) => entry.mealData.totals.carbohydrates);

  console.log(
    "Sorted by calories (descending order):",
    sortedByCaloriesDescending
  );
  console.log(
    "Sorted by carbohydrates (descending order):",
    sortedByCarbohydratesDescending
  );
  console.log("Sorted by fat (descending order):", sortedByFatDescending);
  console.log(
    "Sorted by protein (descending order):",
    sortedByProteinDescending
  );
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  React.useEffect(() => {
    const fetchData = async () => {
      console.log("NOT FETCHED YET!");
      const sortedMeals = await orderMealsByFrequency();
      console.log("Sorted meals by frequency:", sortedMeals);
      const mealsSortedByCount = sortedMeals.sort((a, b) => b.count - a.count);
      setAllMeals((mealsSortedByCount as SuggestedMeal[]).slice(0, 10));
      setLoading(false);
      console.log("FETCHED!");
    };

    const unsubscribe = onSnapshot(
      collection(db, "additionalUserData"),
      async (querySnapshot) => {
        await fetchData(); // Call fetchData when a snapshot occurs
      }
    );

    // Cleanup function to unsubscribe from snapshot listener
    return () => unsubscribe();
  }, []);

  // React.useEffect(() => {
  //   const headers = {
  //     "Content-Type": "application/json"
  //   };
  //   const fetchData = () => {
  //     fetch("https://nutri-api.noit.eu/orderMealsByFrequency", {
  //       method: "GET",
  //       headers: headers,
  //       keepalive: true
  //     })
  //       .then((response) => {
  //         console.log(response);
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch data");
  //         }
  //         return response.text();
  //       })
  //       .then((data) => {
  //         console.log(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   };

  //   fetchData();
  // }, []);

  const [dropdownVisible, setDropdownVisible] = React.useState(true);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(true);
  const [renderDropdown, setRenderDropdown] = React.useState(true);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const slideAnimationDrop = useSpring({
    opacity: miniStatisticsVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -90}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  const slideAnimation = useSpring({
    transform: `translateY(${dropdownVisible ? 0 : 0}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  React.useEffect(() => {
    const handleRestSlidePositionChange = async () => {
      if (dropdownVisible) {
        setMiniStatisticsVisible(true);
        setRenderDropdown(true);
      } else {
        setMiniStatisticsVisible(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdown(false);
          }, 150)
        );
      }
    };

    handleRestSlidePositionChange();
  }, [dropdownVisible]);

  const mealsToShow = allMeals.slice(
    dropdownState.currentPage * ITEMS_PER_PAGE,
    (dropdownState.currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {loading ? (
          <Box mt="37vh" minH="600px" opacity={loading ? 1 : 0}>
            <Loading />
          </Box>
        ) : (
          <Flex
            flexDirection="column"
            gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
          >
            <Card p="0px">
              <Card
                onClick={handleDropdownToggle}
                cursor="pointer"
                zIndex="1"
                position="relative"
                bg={dropdownVisible ? dropdownBoxBg : dropdownBoxBg}
                borderColor={borderColor}
                borderWidth="5px"
              >
                <Flex
                  align={{ sm: "flex-start", lg: "center" }}
                  justify="space-between"
                  w="100%"
                >
                  <Text
                    color={textColor}
                    fontSize="2xl"
                    style={
                      dropdownVisible
                        ? {
                            backgroundImage: gradient,
                            WebkitBackgroundClip: "text",
                            color: "transparent"
                          }
                        : {}
                    }
                    userSelect="none"
                  >
                    {dropdownVisible ? (
                      <b>Най-препоръчани храни от ChatGPT!</b>
                    ) : (
                      "Най-често препоръчани храни от ChatGPT!"
                    )}
                  </Text>
                  <Icon
                    as={dropdownVisible ? FaAngleUp : FaAngleDown}
                    boxSize={6}
                    color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  />
                </Flex>
              </Card>
              {renderDropdown && (
                <animated.div
                  style={{ ...slideAnimationDrop, position: "relative" }}
                >
                  <Box mt="50px">
                    {mealsToShow.map((meal: SuggestedMeal, index: number) => {
                      return (
                        <HistoryItem
                          key={index}
                          name={meal.name}
                          count={"Брой препоръчвания: " + meal.count.toString()}
                          instructions={meal?.mealData.instructions}
                          image={meal?.mealData.image}
                          ingredients={meal?.mealData.ingredients}
                          totals={meal?.mealData.totals}
                          topMeals={allMeals}
                        />
                      );
                    })}
                    <Flex justify="center" mt="40px">
                      <IconButton
                        aria-label="Previous page"
                        icon={<MdKeyboardArrowLeft />}
                        onClick={() =>
                          setDropdownState((prevState) => ({
                            ...prevState,
                            currentPage: Math.max(0, prevState.currentPage - 1)
                          }))
                        }
                        disabled={dropdownState.currentPage === 0}
                        variant="unstyled"
                        _hover={{ bg: "none" }}
                        boxSize={8}
                      />
                      <Text mt="1px" mr="15px" fontSize="xl">
                        <b>{`Страница ${
                          dropdownState.currentPage + 1
                        } от ${totalPages}`}</b>
                      </Text>
                      <IconButton
                        aria-label="Next page"
                        icon={<MdKeyboardArrowRight />}
                        onClick={() =>
                          setDropdownState((prevState) => ({
                            ...prevState,
                            currentPage: Math.min(
                              prevState.currentPage + 1,
                              totalPages - 1
                            )
                          }))
                        }
                        ml="10px"
                        disabled={dropdownState.currentPage === totalPages - 1}
                        variant="unstyled"
                        _hover={{ bg: "none" }}
                        boxSize={8} // Adjust the box size to match the text size
                      />
                    </Flex>
                  </Box>
                </animated.div>
              )}
            </Card>
            <animated.div style={{ ...slideAnimation, position: "relative" }}>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 2 }}
                gap="20px"
                mt="20px"
              >
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-препоръчани храни от ChatGPT!
                </Card>
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Сравнение на калории(kCal) на първите 10
                </Card>
              </SimpleGrid>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 2 }}
                gap="20px"
                mt="20px"
                mb="20px"
              >
                <Card
                  alignItems="center"
                  flexDirection="column"
                  h="100%"
                  w="100%"
                  minH={{ sm: "150px", md: "300px", lg: "auto" }}
                  minW={{ sm: "150px", md: "200px", lg: "auto" }}
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForTopSuggestions}
                    chartLabelName="Сравнение на препоръчани храни"
                    textColor={chartsColor}
                    color="#472ffb"
                  />
                </Card>
                <Card
                  alignItems="center"
                  flexDirection="column"
                  h="100%"
                  w="100%"
                  minH={{ sm: "150px", md: "300px", lg: "400px" }}
                  maxH={{ lg: "600px" }}
                  minW={{ sm: "150px", md: "200px", lg: "auto" }}
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForCalories}
                    chartLabelName="Сравнение на калории(g)"
                    textColor={chartsColor}
                    color="#523bff"
                  />
                </Card>
              </SimpleGrid>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 2 }}
                gap="20px"
                mt="20px"
              >
                {/* Third Card */}
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Сравнение на протеин(g) на първите 10
                </Card>

                {/* Fourth Card */}
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Сравнение на въглехидрати(g) на първите 10
                </Card>

                {/* Third Chart */}
                <Card
                  alignItems="center"
                  flexDirection="column"
                  h="100%"
                  w="100%"
                  minH={{ sm: "150px", md: "300px", lg: "400px" }}
                  maxH={{ lg: "600px" }}
                  minW={{ sm: "150px", md: "200px", lg: "auto" }}
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForProtein}
                    chartLabelName="Сравнение на протеин(g)"
                    textColor={chartsColor}
                    color="#5d47ff"
                  />
                </Card>

                {/* Fourth Chart */}
                <Card
                  alignItems="center"
                  flexDirection="column"
                  h="100%"
                  w="100%"
                  minH={{ sm: "150px", md: "300px", lg: "400px" }}
                  maxH={{ lg: "600px" }}
                  minW={{ sm: "150px", md: "200px", lg: "auto" }}
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForCarbohydrates}
                    chartLabelName="Сравнение на въглехидрати(g)"
                    textColor={chartsColor}
                    color="#7a69ff"
                  />
                </Card>
              </SimpleGrid>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 2 }}
                gap="20px"
                mt="20px"
              >
                <Box>
                  <Card
                    fontSize="3xl"
                    maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                    p="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    borderColor={borderColor}
                    borderWidth="3px"
                    mb="20px"
                  >
                    Сравнение на мазнини(g) на първите 10
                  </Card>

                  <Card
                    alignItems="center"
                    flexDirection="column"
                    h="100%"
                    w="100%"
                    minH={{ sm: "150px", md: "300px", lg: "400px" }}
                    maxH={{ lg: "600px" }}
                    minW={{ sm: "150px", md: "200px", lg: "auto" }}
                    borderColor={borderColor}
                    borderWidth="3px"
                  >
                    <ColumnChart
                      chartLabels={barChartLabels}
                      chartData={barChartForFat}
                      chartLabelName="Сравнение на мазнини(g)"
                      textColor={chartsColor}
                      color="#8878ff"
                    />
                  </Card>
                </Box>
              </SimpleGrid>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 4 }}
                gap="20px"
                mt="20px"
              >
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-богата на протеин храна от ChatGPT!
                </Card>
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-калорична храна от ChatGPT!
                </Card>
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-богата на въглехидрати храна от ChatGPT!
                </Card>
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-богата на мазнини храна от ChatGPT!
                </Card>
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByProteinDescending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByProteinDescending[0]?.name || "Няма рецепта"}
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
                  image={sortedByProteinDescending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByProteinDescending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByProteinDescending[0]?.mealData?.ingredients
                          }
                          instructions={
                            sortedByProteinDescending[0]?.mealData?.instructions
                          }
                          recipeQuantity={
                            sortedByProteinDescending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByCaloriesDescending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByCaloriesDescending[0]?.name ||
                            "Няма рецепта"}
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
                  image={sortedByCaloriesDescending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByCaloriesDescending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByCaloriesDescending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByCaloriesDescending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByCaloriesDescending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByCaloriesDescending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByCaloriesDescending[0]?.mealData?.ingredients
                          }
                          instructions={
                            sortedByCaloriesDescending[0]?.mealData
                              ?.instructions
                          }
                          recipeQuantity={
                            sortedByCaloriesDescending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByCarbohydratesDescending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByCarbohydratesDescending[0]?.name ||
                            "Няма рецепта"}
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
                  image={sortedByCarbohydratesDescending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByCarbohydratesDescending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByCarbohydratesDescending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByCarbohydratesDescending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByCarbohydratesDescending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByCarbohydratesDescending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByCarbohydratesDescending[0]?.mealData
                              ?.ingredients
                          }
                          instructions={
                            sortedByCarbohydratesDescending[0]?.mealData
                              ?.instructions
                          }
                          recipeQuantity={
                            sortedByCarbohydratesDescending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByProteinDescending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByProteinDescending[0]?.name || "Няма рецепта"}
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
                  image={sortedByProteinDescending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByProteinDescending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByProteinDescending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByProteinDescending[0]?.mealData?.ingredients
                          }
                          instructions={
                            sortedByProteinDescending[0]?.mealData?.instructions
                          }
                          recipeQuantity={
                            sortedByProteinDescending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
              </SimpleGrid>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 4 }}
                gap="20px"
                mt="20px"
                mb="20px"
              >
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-бедна на протеин храна от ChatGPT!
                </Card>
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Най-бедна на мазнини храна от ChatGPT!
                </Card>
                {isLg && (
                  <Card
                    fontSize="3xl"
                    maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                    p="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    borderColor={borderColor}
                    borderWidth="3px"
                  >
                    Най-ниско калорична храна от ChatGPT!
                  </Card>
                )}
                {isLg && (
                  <Card
                    fontSize="3xl"
                    maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                    p="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    borderColor={borderColor}
                    borderWidth="3px"
                    textOverflow="ellipsis"
                  >
                    Най-бедна на въглехидрати храна от ChatGPT!
                  </Card>
                )}
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByProteinAscending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByProteinAscending[0]?.name || "Няма рецепта"}
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
                  image={sortedByProteinAscending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByProteinAscending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByProteinAscending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByProteinAscending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByProteinAscending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByProteinAscending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByProteinAscending[0]?.mealData?.ingredients
                          }
                          instructions={
                            sortedByProteinAscending[0]?.mealData?.instructions
                          }
                          recipeQuantity={
                            sortedByProteinAscending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByFatAscending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByFatAscending[0]?.name || "Няма рецепта"}
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
                  image={sortedByFatAscending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByFatAscending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByFatAscending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByFatAscending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByFatAscending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByFatAscending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByFatAscending[0]?.mealData?.ingredients
                          }
                          instructions={
                            sortedByFatAscending[0]?.mealData?.instructions
                          }
                          recipeQuantity={
                            sortedByFatAscending[0]?.mealData?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
                {isMd && (
                  <Card
                    fontSize="3xl"
                    maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                    p="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    borderColor={borderColor}
                    borderWidth="3px"
                  >
                    Най-ниско калорична храна от ChatGPT!
                  </Card>
                )}
                {isMd && (
                  <Card
                    fontSize="3xl"
                    maxH={{ sm: "100px", md: "150px", lg: "150px" }}
                    p="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    borderColor={borderColor}
                    borderWidth="3px"
                  >
                    Най-бедна на въглехидрати храна от ChatGPT!
                  </Card>
                )}
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByCaloriesAscending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByCaloriesAscending[0]?.name || "Няма рецепта"}
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
                  image={sortedByCaloriesAscending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByCaloriesAscending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByCaloriesAscending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByCaloriesAscending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByCaloriesAscending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByCaloriesAscending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByCaloriesAscending[0]?.mealData?.ingredients
                          }
                          instructions={
                            sortedByCaloriesAscending[0]?.mealData?.instructions
                          }
                          recipeQuantity={
                            sortedByCaloriesAscending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
                <RecipeWidget
                  name={
                    <Flex justify="center" w="100%" overflow="hidden">
                      <Tooltip
                        label={sortedByCaloriesAscending[0]?.name}
                        borderRadius="10px"
                      >
                        <Text
                          fontSize="2xl"
                          whiteSpace="nowrap"
                          maxW="360px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {sortedByCarbohydratesAscending[0]?.name ||
                            "Няма рецепта"}
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
                  image={sortedByCarbohydratesAscending[0]?.mealData?.image}
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
                          Грамаж:{" "}
                          {`${sortedByCarbohydratesAscending[0]?.mealData?.totals?.grams} g`}
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
                            Калории:{" "}
                            {`${sortedByCarbohydratesAscending[0]?.mealData?.totals?.calories} g`}
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
                            {`${sortedByCarbohydratesAscending[0]?.mealData?.totals?.carbohydrates} g`}
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
                            Протеин:{" "}
                            {`${sortedByCarbohydratesAscending[0]?.mealData?.totals?.protein} g`}
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
                            Мазнини:{" "}
                            {`${sortedByCarbohydratesAscending[0]?.mealData?.totals?.fat} g`}
                          </Text>
                        </SimpleGrid>
                      </Flex>
                      <Flex
                        mt="20px"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <RecipeModal
                          title="Рецепта"
                          ingredients={
                            sortedByCarbohydratesAscending[0]?.mealData
                              ?.ingredients
                          }
                          instructions={
                            sortedByCarbohydratesAscending[0]?.mealData
                              ?.instructions
                          }
                          recipeQuantity={
                            sortedByCarbohydratesAscending[0]?.mealData
                              ?.recipeQuantity
                          }
                        />
                      </Flex>
                    </Box>
                  }
                />
              </SimpleGrid>
            </animated.div>
          </Flex>
        )}
      </Box>
    </FadeInWrapper>
  );
}
