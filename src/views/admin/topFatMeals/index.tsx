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
import { getTopFatMeals } from "database/getAdditionalUserData";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// Custom components
import Loading from "views/admin/weightStats/components/Loading";
import LeaderBoardItemSmall from "../topCalorieMeals/components/leaderboardItemSmall";

import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { ColumnChart } from "components/charts/BarCharts";

import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdFlatware
} from "react-icons/md";
import { NutrientMeal } from "../../../types/weightStats";
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
  const [dropdownStateLowFat, setDropdownStateLowFat] =
    React.useState<DropdownState>({
      currentPage: 0
    });
  const [allMeals, setAllMeals] = React.useState<NutrientMeal[] | []>([]);
  const [leastFatFoods, setLeastFatFoods] = React.useState<NutrientMeal[] | []>(
    []
  );
  const totalPages = Math.ceil(allMeals.length / ITEMS_PER_PAGE);

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const barChartLabels = allMeals
    .slice(0, 10)
    .map((_, index) => `#${index + 1}`);

  const barChartForTopFatFoods = allMeals
    .slice(0, 10)
    .map((meal, index) => allMeals[index].totals.fat);

  React.useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchData = async () => {
      try {
        console.log("fetching...");
        const meals = await getTopFatMeals();

        console.log("Top Fat: ", meals);

        if (isMounted) {
          setAllMeals(meals as NutrientMeal[]);

          const lowFatMeals = meals
            .slice()
            .sort(
              (a: NutrientMeal, b: NutrientMeal) =>
                (a.totals.fat || 0) - (b.totals.fat || 0)
            );

          setLeastFatFoods(lowFatMeals);
          setLoading(false);
          console.log("FETCHED!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function to be called when component unmounts
      isMounted = false;
    };
  }, []);

  const [dropdownVisible, setDropdownVisible] = React.useState(true);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(true);
  const [renderDropdown, setRenderDropdown] = React.useState(true);
  const [dropdownVisibleLowFat, setDropdownVisibleLowFat] =
    React.useState(true);
  const [miniStatisticsVisibleLowFat, setMiniStatisticsVisibleLowFat] =
    React.useState(true);
  const [renderDropdownLowFat, setRenderDropdownLowFat] = React.useState(true);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownToggleLowFat = () => {
    setDropdownVisibleLowFat(!dropdownVisibleLowFat);
  };

  const slideAnimationDropLowFat = useSpring({
    opacity: miniStatisticsVisibleLowFat ? 1 : 0,
    transform: `translateY(${dropdownVisibleLowFat ? -50 : -90}px)`,
    config: {
      tension: dropdownVisibleLowFat ? 170 : 200,
      friction: dropdownVisibleLowFat ? 12 : 20
    }
  });

  const slideAnimationDropTopFat = useSpring({
    opacity: dropdownVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -90}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  const slideAnimation = useSpring({
    transform: `translateY(${
      dropdownVisible || dropdownVisibleLowFat ? -50 : 0
    }px)`,
    config: {
      tension: dropdownVisible || dropdownVisibleLowFat ? 170 : 200,
      friction: dropdownVisible || dropdownVisibleLowFat ? 12 : 20
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
    const handleRestSlidePositionChangeLowFat = async () => {
      if (dropdownVisibleLowFat) {
        setMiniStatisticsVisibleLowFat(true);
        setRenderDropdownLowFat(true);
      } else {
        setMiniStatisticsVisibleLowFat(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdownLowFat(false);
          }, 150)
        );
      }
    };

    handleRestSlidePositionChangeLowFat();
  }, [dropdownVisibleLowFat]);

  const mealsToShow = allMeals.slice(
    dropdownState.currentPage * ITEMS_PER_PAGE,
    (dropdownState.currentPage + 1) * ITEMS_PER_PAGE
  );

  const leastFatMealsToShow = leastFatFoods.slice(
    dropdownStateLowFat.currentPage * ITEMS_PER_PAGE,
    (dropdownStateLowFat.currentPage + 1) * ITEMS_PER_PAGE
  );

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
                      <b>Най-богатите на мазнини храни от NutriFit!</b>
                    ) : (
                      "Най-богатите на мазнини храни от NutriFit!"
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
                  style={{ ...slideAnimationDropTopFat, position: "relative" }}
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
            <Box p="0px">
              <Card
                onClick={handleDropdownToggleLowFat}
                cursor="pointer"
                zIndex="1"
                position="relative"
                bg={dropdownVisibleLowFat ? dropdownBoxBg : dropdownBoxBg}
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
                      dropdownVisibleLowFat
                        ? {
                            backgroundImage: gradient,
                            WebkitBackgroundClip: "text",
                            color: "transparent"
                          }
                        : {}
                    }
                    userSelect="none"
                  >
                    {dropdownVisibleLowFat ? (
                      <b>Най-бедните на мазнини храни от NutriFit!</b>
                    ) : (
                      "Най-бедните на мазнини храни от NutriFit!"
                    )}
                  </Text>
                  <Icon
                    as={dropdownVisibleLowFat ? FaAngleUp : FaAngleDown}
                    boxSize={6}
                    color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  />
                </Flex>
              </Card>
              {renderDropdownLowFat && (
                <animated.div
                  style={{
                    ...slideAnimationDropLowFat,
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
                        {leastFatMealsToShow.map(
                          (meal: NutrientMeal, index: number) => {
                            return (
                              <LeaderBoardItemSmall
                                key={index}
                                name={meal.name}
                                instructions={meal?.instructions}
                                image={meal?.image}
                                ingredients={meal?.ingredients}
                                totals={meal?.totals}
                                topMeals={leastFatFoods}
                                keepOpen={
                                  meal === leastFatFoods[0] ? true : false
                                }
                              />
                            );
                          }
                        )}
                        <Flex justify="center" mt="40px">
                          <IconButton
                            aria-label="Previous page"
                            icon={<MdKeyboardArrowLeft />}
                            onClick={() =>
                              setDropdownStateLowFat((prevState) => ({
                                ...prevState,
                                currentPage: Math.max(
                                  0,
                                  prevState.currentPage - 1
                                )
                              }))
                            }
                            disabled={dropdownStateLowFat.currentPage === 0}
                            variant="unstyled"
                            _hover={{ bg: "none" }}
                            boxSize={8}
                          />
                          <Text mt="1px" mr="15px" fontSize="xl">
                            <b>{`Страница ${
                              dropdownStateLowFat.currentPage + 1
                            } от ${totalPages}`}</b>
                          </Text>
                          <IconButton
                            aria-label="Next page"
                            icon={<MdKeyboardArrowRight />}
                            onClick={() =>
                              setDropdownStateLowFat((prevState) => ({
                                ...prevState,
                                currentPage: Math.min(
                                  prevState.currentPage + 1,
                                  totalPages - 1
                                )
                              }))
                            }
                            ml="10px"
                            disabled={
                              dropdownStateLowFat.currentPage === totalPages - 1
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
            <SimpleGrid columns={1} gap="20px" mt="20px">
              <Card
                fontSize="3xl"
                maxH={{ sm: "200px", md: "150px", lg: "150px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                borderColor={borderColor}
                borderWidth="3px"
              >
                Сравнение на първите 10 най-богати на мазнини храни от NutriFit!
                (g.)
              </Card>
            </SimpleGrid>
            <SimpleGrid columns={1} gap="20px" mt="20px" mb="20px">
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
                    chartData={barChartForTopFatFoods}
                    chartLabelName="Сравнение на най-богатите на мазнини храни (g.)"
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
