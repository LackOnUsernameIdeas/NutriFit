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
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Text,
  Link
} from "@chakra-ui/react";
// Assets
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { orderMealsByFrequency } from "database/getAdditionalUserData";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// Custom components
import Loading from "views/admin/weightStats/components/Loading";
import HistoryItem from "views/admin/marketplace/components/HistoryItem";
import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { ColumnAvaragesChart } from "components/charts/BarCharts";
import { LineAvaragesChart } from "components/charts/LineCharts";

interface Meal {
  name: string;
  count: number;
  mealData: {
    totals: {
      calories: number;
      carbohydrates: number;
      grams: number;
      fat: number;
      protein: number;
    };
    recipeQuantity: number;
    image: string;
    ingredients: string[];
    name: string;
    instructions: string[];
  };
}

export default function TopMeals() {
  // Chakra Color Mode
  const { colorMode } = useColorMode();
  const chartsColor = useColorModeValue("brand.500", "white");
  const [loading, setLoading] = React.useState(false);
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
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
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");

  // React.useEffect(() => {
  //   setLoading(true);
  //   orderMealsByFrequency().then((sortedMeals) => {
  //     console.log("Sorted meals by frequency:", sortedMeals);
  //     setAllMeals(sortedMeals);
  //     setLoading(false);
  //   });
  // }, []);

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);

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
    transform: `translateY(${dropdownVisible ? -50 : 0}px)`,
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
                      <b>Най-често препоръчани храни от ChatGPT!</b>
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
                    {allMeals.map((meal, index) => (
                      <HistoryItem
                        key={index}
                        name={meal.name}
                        // Set author, date, image, and price according to your data structure
                        author={"Брой: " + meal.count.toString()}
                        date="Date"
                        image={meal?.mealData.image} // You may want to update this based on the meal data
                        price="Price"
                      />
                    ))}
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
                  alignItems="center"
                  flexDirection="column"
                  minH={{ sm: "150px", md: "300px", lg: "300px" }}
                  minW={{ sm: "150px", md: "200px", lg: "100%" }} // Adjusted minW for responsiveness
                  maxH="400px"
                  mt="40px"
                >
                  {/* BarChart component with adjusted width */}
                  <LineAvaragesChart
                    lineChartData={[4, 2]}
                    lineChartData2={[2, 4]}
                    lineChartLabels={["yes", "no"]}
                    lineChartLabelName={"Мъже"}
                    lineChartLabelName2={"Жени"}
                    textColor={chartsColor}
                  />
                </Card>
                <Card
                  alignItems="center"
                  flexDirection="column"
                  minH={{ sm: "150px", md: "300px", lg: "300px" }}
                  minW={{ sm: "150px", md: "200px", lg: "100%" }} // Adjusted minW for responsiveness
                  maxH="400px"
                  mt="40px"
                >
                  <ColumnAvaragesChart
                    chartData={[4, 2]}
                    chartData2={[2, 4]}
                    chartLabels={["yes", "no"]}
                    chartLabelName={"Мъже"}
                    chartLabelName2={"Жени"}
                    textColor={chartsColor}
                  />
                </Card>
              </SimpleGrid>
            </animated.div>
          </Flex>
        )}
      </Box>
    </FadeInWrapper>
  );
}
