import React from "react";
// Chakra imports
import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Text,
  useMediaQuery,
  IconButton
} from "@chakra-ui/react";
// Assets
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import {
  getFirstAndLastTopMealsByCollection,
  getFirst50TopMealsByCollection
} from "database/getFunctions";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// Custom components
import Loading from "views/admin/weightStats/components/Loading";
import LeaderBoardItemSmall from "../topCalorieMeals/components/leaderboardItemSmall";

import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { ColumnChart } from "components/charts/BarCharts";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { NutrientMeal } from "../../../variables/weightStats";
interface DropdownState {
  currentPage: number;
}

export default function TopMeals() {
  // Chakra Color Mode
  const [isSm] = useMediaQuery("(max-width: 768px)");
  const [isMd] = useMediaQuery("(min-width: 769px) and (max-width: 1400px)");
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
  const [allMeals, setAllMeals] = React.useState<NutrientMeal[] | []>([]);
  const [leastCarbsFoods, setLeastCarbsFoods] = React.useState<
    NutrientMeal[] | []
  >([]);
  const totalPages = Math.ceil(allMeals.length / ITEMS_PER_PAGE);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const barChartLabels = allMeals
    .slice(0, 10)
    .map((_, index) => `#${index + 1}`);

  const barChartForTopCarbohydratesFoods = allMeals
    .slice(0, 10)
    .map((meal, index) => allMeals[index].totals.carbohydrates);

  const barChartForLowCarbohydratesFoods = allMeals
    .slice()
    .sort((a, b) => a.totals.carbohydrates - b.totals.carbohydrates)
    .slice(0, 10)
    .map((meal) => meal.totals.carbohydrates);

  const [dropdownStateLowCarbs, setDropdownStateLowCarbs] =
    React.useState<DropdownState>({
      currentPage: 0
    });

  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        console.log("Fetching first 50 carbohydrate meals...");
        const first50CarbsMealsPromise = getFirst50TopMealsByCollection(
          "topCarbohydratesMeals"
        );
        const first50CarbsMeals = await first50CarbsMealsPromise;

        console.log("First 50 Carbohydrate Meals: ", first50CarbsMeals);

        // Display the first 50 carbohydrate meals
        setAllMeals(first50CarbsMeals as NutrientMeal[]);

        const initialLowCarbsMeals = first50CarbsMeals
          .slice()
          .sort(
            (a: NutrientMeal, b: NutrientMeal) =>
              (a.totals.carbohydrates || 0) - (b.totals.carbohydrates || 0)
          );

        setLeastCarbsFoods(initialLowCarbsMeals);

        setLoading(false);

        // Fetch all carbohydrate meals in the background
        console.log("Fetching remaining carbohydrate meals...");
        getFirstAndLastTopMealsByCollection("topCarbohydratesMeals").then(
          (allCarbsMeals) => {
            console.log("All Carbohydrate Meals: ", allCarbsMeals);
            // Update state to include the remaining carbohydrate meals
            setAllMeals(allCarbsMeals as NutrientMeal[]);
            const lowCarbsMeals = allCarbsMeals
              .slice()
              .sort(
                (a: NutrientMeal, b: NutrientMeal) =>
                  (a.totals.carbohydrates || 0) - (b.totals.carbohydrates || 0)
              );

            setLeastCarbsFoods(lowCarbsMeals);
            console.log("FETCHED!");
          }
        );
      } catch (error) {
        console.error("Error fetching carbohydrate data:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup function to be called when component unmounts
      isMounted = false;
    };
  }, []);

  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(true);
  const [miniStatisticsVisibleLowCarbs, setMiniStatisticsVisibleLowCarbs] =
    React.useState(true);
  const [renderDropdown, setRenderDropdown] = React.useState(true);
  const [renderDropdownLowCarbs, setRenderDropdownLowCarbs] =
    React.useState(true);
  const [dropdownVisible, setDropdownVisible] = React.useState(true);
  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  // State and function for the second dropdown
  const [dropdownVisibleLowCarbs, setDropdownVisibleLowCarbs] =
    React.useState(true);
  const handleDropdownToggleLowCarbs = () => {
    setDropdownVisibleLowCarbs(!dropdownVisibleLowCarbs);
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
    transform: `translateY(${
      dropdownVisible || dropdownVisibleLowCarbs ? -50 : -20
    }px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  const slideAnimationDropLowCarbs = useSpring({
    opacity: miniStatisticsVisibleLowCarbs ? 1 : 0,
    transform: `translateY(${dropdownVisibleLowCarbs ? -50 : -90}px)`,
    config: {
      tension: dropdownVisibleLowCarbs ? 170 : 200,
      friction: dropdownVisibleLowCarbs ? 12 : 20
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

  React.useEffect(() => {
    const handleRestSlidePositionChangeLowCarbs = async () => {
      if (dropdownVisibleLowCarbs) {
        setMiniStatisticsVisibleLowCarbs(true);
        setRenderDropdownLowCarbs(true);
      } else {
        setMiniStatisticsVisibleLowCarbs(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdownLowCarbs(false);
          }, 150)
        );
      }
    };

    handleRestSlidePositionChangeLowCarbs();
  }, [dropdownVisibleLowCarbs]);

  const mealsToShow = allMeals.slice(
    dropdownState.currentPage * ITEMS_PER_PAGE,
    (dropdownState.currentPage + 1) * ITEMS_PER_PAGE
  );

  const mealsToShowLowCarbs = leastCarbsFoods.slice(
    dropdownStateLowCarbs.currentPage * ITEMS_PER_PAGE,
    (dropdownStateLowCarbs.currentPage + 1) * ITEMS_PER_PAGE
  );

  const [isPhoneScreen] = useMediaQuery("(max-width: 767px)");

  return (
    <FadeInWrapper>
      <Box pt={{ base: "160px", md: "80px", xl: "80px" }}>
        <Flex
          flexDirection="column"
          gridArea={{ xl: "1 / 3 / 2 / 4", "2xl": "1 / 2 / 2 / 3" }}
        >
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mt="20px">
            <Box p="0px">
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
                      <b>Най-богатите на въглехидрати храни от NutriFit!</b>
                    ) : (
                      "Най-богатите на въглехидрати храни от NutriFit!"
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
                  <Card mt="10px">
                    {loading ? (
                      <Flex justify="center" align="center" minH="400px">
                        <Loading />
                      </Flex>
                    ) : (
                      <Box mt="40px" mb="10px">
                        {mealsToShow.map(
                          (meal: NutrientMeal, index: number) => {
                            return (
                              <LeaderBoardItemSmall
                                key={index}
                                name={meal.name}
                                instructions={meal?.instructions}
                                image={meal?.image}
                                ingredients={meal?.ingredients}
                                totals={meal?.totals}
                                topMeals={allMeals}
                                keepOpen={meal === allMeals[0] ? true : false}
                                type="Въглехидрати"
                              />
                            );
                          }
                        )}
                        <Flex justify="center" mt="40px">
                          <IconButton
                            aria-label="Previous page"
                            icon={<MdKeyboardArrowLeft />}
                            onClick={() =>
                              setDropdownState((prevState) => ({
                                ...prevState,
                                currentPage: Math.max(
                                  0,
                                  prevState.currentPage - 1
                                )
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
                            disabled={
                              dropdownState.currentPage === totalPages - 1
                            }
                            variant="unstyled"
                            _hover={{ bg: "none" }}
                            boxSize={8} // Adjust the box size to match the text size
                          />
                        </Flex>
                      </Box>
                    )}
                  </Card>
                </animated.div>
              )}
            </Box>
            <Box p="0px" mb={dropdownVisibleLowCarbs ? "0px" : "20px"}>
              <Card
                onClick={handleDropdownToggleLowCarbs}
                cursor="pointer"
                zIndex="1"
                position="relative"
                bg={dropdownVisibleLowCarbs ? dropdownBoxBg : dropdownBoxBg}
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
                      dropdownVisibleLowCarbs
                        ? {
                            backgroundImage: gradient,
                            WebkitBackgroundClip: "text",
                            color: "transparent"
                          }
                        : {}
                    }
                    userSelect="none"
                  >
                    {dropdownVisibleLowCarbs ? (
                      <b>Най-бедните на въглехидрати храни от NutriFit!</b>
                    ) : (
                      "Най-беднитена въглехидрати храни от NutriFit!"
                    )}
                  </Text>
                  <Icon
                    as={dropdownVisibleLowCarbs ? FaAngleUp : FaAngleDown}
                    boxSize={6}
                    color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  />
                </Flex>
              </Card>
              {renderDropdownLowCarbs && (
                <animated.div
                  style={{
                    ...slideAnimationDropLowCarbs,
                    position: "relative"
                  }}
                >
                  <Card mt="10px">
                    {loading ? (
                      <Flex justify="center" align="center" minH="400px">
                        <Loading />
                      </Flex>
                    ) : (
                      <Box mt="40px" mb="10px">
                        {mealsToShowLowCarbs.map(
                          (meal: NutrientMeal, index: number) => {
                            return (
                              <LeaderBoardItemSmall
                                key={index}
                                name={meal.name}
                                instructions={meal?.instructions}
                                image={meal?.image}
                                ingredients={meal?.ingredients}
                                totals={meal?.totals}
                                topMeals={leastCarbsFoods}
                                keepOpen={
                                  meal === leastCarbsFoods[0] ? true : false
                                }
                                type="Въглехидрати"
                              />
                            );
                          }
                        )}
                        <Flex justify="center" mt="40px">
                          <IconButton
                            aria-label="Previous page"
                            icon={<MdKeyboardArrowLeft />}
                            onClick={() =>
                              setDropdownStateLowCarbs((prevState) => ({
                                ...prevState,
                                currentPage: Math.max(
                                  0,
                                  prevState.currentPage - 1
                                )
                              }))
                            }
                            disabled={dropdownStateLowCarbs.currentPage === 0}
                            variant="unstyled"
                            _hover={{ bg: "none" }}
                            boxSize={8}
                          />
                          <Text mt="1px" mr="15px" fontSize="xl">
                            <b>{`Страница ${
                              dropdownStateLowCarbs.currentPage + 1
                            } от ${totalPages}`}</b>
                          </Text>
                          <IconButton
                            aria-label="Next page"
                            icon={<MdKeyboardArrowRight />}
                            onClick={() =>
                              setDropdownStateLowCarbs((prevState) => ({
                                ...prevState,
                                currentPage: Math.min(
                                  prevState.currentPage + 1,
                                  totalPages - 1
                                )
                              }))
                            }
                            ml="10px"
                            disabled={
                              dropdownStateLowCarbs.currentPage ===
                              totalPages - 1
                            }
                            variant="unstyled"
                            _hover={{ bg: "none" }}
                            boxSize={8} // Adjust the box size to match the text size
                          />
                        </Flex>
                      </Box>
                    )}
                  </Card>
                </animated.div>
              )}
            </Box>
          </SimpleGrid>
          <animated.div style={{ ...slideAnimation, position: "relative" }}>
            <SimpleGrid
              columns={{ base: 1, md: 2, xl: 2 }}
              gap="20px"
              mt="20px"
            >
              <Card
                fontSize="3xl"
                maxH={{ sm: "250px", md: "250px", lg: "150px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                borderColor={borderColor}
                borderWidth="3px"
              >
                Сравнение на първите 10 най-богати на въглехидрати храни от
                NutriFit!
              </Card>
              {!isPhoneScreen && (
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "250px", md: "250px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Сравнение на първите 10 най-бедни на въглехидрати храни от
                  NutriFit!
                </Card>
              )}
              <Card
                alignItems="center"
                flexDirection="column"
                h="100%"
                w="100%"
                minH={{ sm: "400px", md: "300px", lg: "auto" }}
                minW={{ sm: "150px", md: "200px", lg: "auto" }}
                borderColor={borderColor}
                borderWidth="3px"
              >
                {loading ? (
                  <Flex justify="center" align="center" minH="200px">
                    <Loading />
                  </Flex>
                ) : (
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForTopCarbohydratesFoods}
                    chartLabelName="Сравнение на най-богатите на въглехидрати храни (g.)"
                    textColor={chartsColor}
                    color="#472ffb"
                  />
                )}
              </Card>
              {isPhoneScreen && (
                <Card
                  fontSize="3xl"
                  maxH={{ sm: "250px", md: "250px", lg: "150px" }}
                  p="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  Сравнение на първите 10 най-бедни на въглехидрати храни от
                  NutriFit!
                </Card>
              )}
              <Card
                alignItems="center"
                flexDirection="column"
                h="100%"
                w="100%"
                minH={{ sm: "400px", md: "300px", lg: "auto" }}
                minW={{ sm: "150px", md: "200px", lg: "auto" }}
                borderColor={borderColor}
                borderWidth="3px"
              >
                {loading ? (
                  <Flex justify="center" align="center" minH="200px">
                    <Loading />
                  </Flex>
                ) : (
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForLowCarbohydratesFoods}
                    chartLabelName="Сравнение на най-бедните на въглехидрати храни (g.)"
                    textColor={chartsColor}
                    color="#472ffb"
                  />
                )}
              </Card>
            </SimpleGrid>
          </animated.div>
        </Flex>
      </Box>
    </FadeInWrapper>
  );
}
