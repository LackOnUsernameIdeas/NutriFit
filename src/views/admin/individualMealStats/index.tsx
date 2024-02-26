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
import { Meal } from "../../../types/weightStats";
interface DropdownState {
  currentPage: number;
}

export default function TopCaloryMeals() {
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
  const [dropdownStateAscending, setDropdownStateAscending] =
    React.useState<DropdownState>({
      currentPage: 0
    });
  const [dropdownStateDescending, setDropdownStateDescending] =
    React.useState<DropdownState>({
      currentPage: 0
    });
  const [allMeals, setAllMeals] = React.useState<Meal[] | []>([
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
      setAllMeals(mealsSortedByCount as Meal[]);
      setLoading(false);
      console.log("FETCHED!");
    };

    const unsubscribe = onSnapshot(
      collection(getFirestore(), "additionalUserData"),
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
    transform: `translateY(${dropdownVisible ? -40 : -90}px)`,
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

  const [dropdownVisibleLow, setDropdownVisibleLow] = React.useState(true);
  const [miniStatisticsVisibleLow, setMiniStatisticsVisibleLow] =
    React.useState(true);
  const [renderDropdownLow, setRenderDropdownLow] = React.useState(true);

  const handleDropdownToggleLow = () => {
    setDropdownVisibleLow(!dropdownVisibleLow);
  };

  const slideAnimationDropLow = useSpring({
    opacity: miniStatisticsVisibleLow ? 1 : 0,
    transform: `translateY(${dropdownVisibleLow ? -50 : -90}px)`,
    config: {
      tension: dropdownVisibleLow ? 170 : 200,
      friction: dropdownVisibleLow ? 12 : 20
    }
  });

  const slideAnimationLow = useSpring({
    transform: `translateY(${dropdownVisibleLow ? 0 : 0}px)`,
    config: {
      tension: dropdownVisibleLow ? 170 : 200,
      friction: dropdownVisibleLow ? 12 : 20
    }
  });

  React.useEffect(() => {
    const handleRestSlidePositionChangeLow = async () => {
      if (dropdownVisibleLow) {
        setMiniStatisticsVisibleLow(true);
        setRenderDropdownLow(true);
      } else {
        setMiniStatisticsVisibleLow(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdownLow(false);
          }, 150)
        );
      }
    };

    handleRestSlidePositionChangeLow();
  }, [dropdownVisibleLow]);

  const mealsToShowLowCalory = sortedByCaloriesDescending.slice(
    dropdownStateDescending.currentPage * ITEMS_PER_PAGE,
    (dropdownStateDescending.currentPage + 1) * ITEMS_PER_PAGE
  );

  const mealsToShowHighCalory = sortedByCaloriesAscending.slice(
    dropdownStateAscending.currentPage * ITEMS_PER_PAGE,
    (dropdownStateAscending.currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        {loading ? (
          <Box mt="37vh" minH="600px" opacity={loading ? 1 : 0}>
            <Loading />
          </Box>
        ) : (
          <Box>
            <Flex
              flexDirection="column"
              gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
            >
              <Card p="0px">
                <Card
                  onClick={handleDropdownToggleLow}
                  cursor="pointer"
                  zIndex="1"
                  position="relative"
                  bg={dropdownVisibleLow ? dropdownBoxBg : dropdownBoxBg}
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
                        dropdownVisibleLow
                          ? {
                              backgroundImage: gradient,
                              WebkitBackgroundClip: "text",
                              color: "transparent"
                            }
                          : {}
                      }
                      userSelect="none"
                    >
                      {dropdownVisibleLow ? (
                        <b>Най-калорични храни от ChatGPT!</b>
                      ) : (
                        "Най-калорични храни от ChatGPT!"
                      )}
                    </Text>
                    <Icon
                      as={dropdownVisibleLow ? FaAngleUp : FaAngleDown}
                      boxSize={6}
                      color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                    />
                  </Flex>
                </Card>
                {renderDropdownLow && (
                  <animated.div
                    style={{ ...slideAnimationDropLow, position: "relative" }}
                  >
                    <Box mt="50px">
                      {mealsToShowLowCalory.map((meal: Meal, index: number) => {
                        return (
                          <HistoryItem
                            key={index}
                            name={meal.name}
                            count={
                              "Брой препоръчвания: " + meal.count.toString()
                            }
                            instructions={meal?.mealData.instructions}
                            image={meal?.mealData.image}
                            ingredients={meal?.mealData.ingredients}
                            totals={meal?.mealData.totals}
                            topMeals={sortedByCaloriesDescending}
                          />
                        );
                      })}
                      <Flex justify="center" mt="40px">
                        <IconButton
                          aria-label="Previous page"
                          icon={<MdKeyboardArrowLeft />}
                          onClick={() =>
                            setDropdownStateDescending((prevState) => ({
                              ...prevState,
                              currentPage: Math.max(
                                0,
                                prevState.currentPage - 1
                              )
                            }))
                          }
                          disabled={dropdownStateDescending.currentPage === 0}
                          variant="unstyled"
                          _hover={{ bg: "none" }}
                          boxSize={8}
                        />
                        <Text mt="1px" mr="15px" fontSize="xl">
                          <b>{`Страница ${
                            dropdownStateDescending.currentPage + 1
                          } от ${totalPages}`}</b>
                        </Text>
                        <IconButton
                          aria-label="Next page"
                          icon={<MdKeyboardArrowRight />}
                          onClick={() =>
                            setDropdownStateDescending((prevState) => ({
                              ...prevState,
                              currentPage: Math.min(
                                prevState.currentPage + 1,
                                totalPages - 1
                              )
                            }))
                          }
                          ml="10px"
                          disabled={
                            dropdownStateDescending.currentPage ===
                            totalPages - 1
                          }
                          variant="unstyled"
                          _hover={{ bg: "none" }}
                          boxSize={8} // Adjust the box size to match the text size
                        />
                      </Flex>
                    </Box>
                  </animated.div>
                )}
              </Card>
            </Flex>
            <Flex
              flexDirection="column"
              gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
            >
              <animated.div style={{ ...slideAnimation, position: "relative" }}>
                <Card p="0px" mb="20px">
                  <Card
                    onClick={handleDropdownToggle}
                    cursor="pointer"
                    zIndex="1"
                    position="relative"
                    bg={dropdownVisible ? dropdownBoxBg : dropdownBoxBg}
                    borderColor={borderColor}
                    borderWidth="5px"
                    mt="20px"
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
                          <b>Най-ниско калорични храни от ChatGPT!</b>
                        ) : (
                          "Най-ниско калорични храни от ChatGPT!"
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
                        {mealsToShowHighCalory.map(
                          (meal: Meal, index: number) => {
                            return (
                              <HistoryItem
                                key={index}
                                name={meal.name}
                                count={
                                  "Брой препоръчвания: " + meal.count.toString()
                                }
                                instructions={meal?.mealData.instructions}
                                image={meal?.mealData.image}
                                ingredients={meal?.mealData.ingredients}
                                totals={meal?.mealData.totals}
                                topMeals={sortedByCaloriesAscending}
                              />
                            );
                          }
                        )}
                        <Flex justify="center" mt="40px">
                          <IconButton
                            aria-label="Previous page"
                            icon={<MdKeyboardArrowLeft />}
                            onClick={() =>
                              setDropdownStateAscending((prevState) => ({
                                ...prevState,
                                currentPage: Math.max(
                                  0,
                                  prevState.currentPage - 1
                                )
                              }))
                            }
                            disabled={dropdownStateAscending.currentPage === 0}
                            variant="unstyled"
                            _hover={{ bg: "none" }}
                            boxSize={8}
                          />
                          <Text mt="1px" mr="15px" fontSize="xl">
                            <b>{`Страница ${
                              dropdownStateAscending.currentPage + 1
                            } от ${totalPages}`}</b>
                          </Text>
                          <IconButton
                            aria-label="Next page"
                            icon={<MdKeyboardArrowRight />}
                            onClick={() =>
                              setDropdownStateAscending((prevState) => ({
                                ...prevState,
                                currentPage: Math.min(
                                  prevState.currentPage + 1,
                                  totalPages - 1
                                )
                              }))
                            }
                            ml="10px"
                            disabled={
                              dropdownStateAscending.currentPage ===
                              totalPages - 1
                            }
                            variant="unstyled"
                            _hover={{ bg: "none" }}
                            boxSize={8} // Adjust the box size to match the text size
                          />
                        </Flex>
                      </Box>
                    </animated.div>
                  )}
                </Card>
              </animated.div>
            </Flex>
          </Box>
        )}
      </Box>
    </FadeInWrapper>
  );
}
