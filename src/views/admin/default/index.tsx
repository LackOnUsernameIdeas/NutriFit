/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Tooltip,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  Text,
  Link
} from "@chakra-ui/react";
// Assets
// Custom components
import Loading from "../weightStats/components/Loading";
import { ColumnChart } from "components/charts/BarCharts";
import RecipeWidget from "components/card/NFT";
import RecipeModal from "../topMeals/components/RecipeModal";
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import { useSpring, animated } from "react-spring";
import { FaFireAlt, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GiWeightScale } from "react-icons/gi";
import { BsPersonFillUp } from "react-icons/bs";
import { RiWaterPercentFill } from "react-icons/ri";
import { MdOutlineMale, MdOutlineFemale, MdFlatware } from "react-icons/md";
import { HiMiniArrowUturnRight } from "react-icons/hi2";
import { SuggestedMeal } from "../../../types/weightStats";
import {
  orderMealsByFrequency,
  getAllHealthStatus
} from "database/getAdditionalUserData";
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  DocumentData
} from "firebase/firestore";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import ChatGPT from "../../../assets/img/layout/openai.png";
import Gemini from "../../../assets/img/layout/bggpt.png";
import { getTotalUsers } from "database/getMeanUsersData";

// Types
import { GenderAverageStats, Deviations } from "../../../types/weightStats";

import { ColumnAvaragesChart } from "components/charts/BarCharts";
import { LineAvaragesChart } from "components/charts/LineCharts";

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

export default function UserReports() {
  // Chakra Color Mode
  const { colorMode } = useColorMode();
  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;
  const chartsColor = useColorModeValue("brand.500", "white");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const fontWeight = useColorModeValue("500", "100");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
  const color = useColorModeValue("#715ffa", "#422afb");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.200" },
    { bg: "whiteAlpha.100" }
  );
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
    }
  ]);
  const [loading, setLoading] = React.useState(true);
  const [mealLoading, setMealLoading] = React.useState(true);
  const [totalUsers, setTotalUsers] = React.useState<number | null>(null);
  const [averageStats, setAverageStats] = React.useState<GenderAverageStats>({
    male: {
      totalUsers: 0,
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      averageWeight: 0,
      averageBodyFatPercentage: 0
    },
    female: {
      totalUsers: 0,
      averageCalories: 0,
      averageProtein: 0,
      averageCarbs: 0,
      averageFat: 0,
      averageWeight: 0,
      averageBodyFatPercentage: 0
    }
  });
  const [deviations, setDeviations] = React.useState<Deviations>();

  const [allUsersHealthStatesLabels, setAllUsersHealthStatesLabels] =
    React.useState<string[]>([]);
  const [allUsersHealthStatesData, setAllUsersHealthStatesData] =
    React.useState<number[]>([]);

  const maleChartData = [
    averageStats.male.averageCalories,
    averageStats.male.averageProtein,
    averageStats.male.averageCarbs,
    averageStats.male.averageFat,
    averageStats.male.averageWeight,
    averageStats.male.averageBodyFatPercentage
  ];

  const femaleChartData = [
    averageStats.female.averageCalories,
    averageStats.female.averageProtein,
    averageStats.female.averageCarbs,
    averageStats.female.averageFat,
    averageStats.female.averageWeight,
    averageStats.female.averageBodyFatPercentage
  ];

  const allUsersStatsLabels = [
    "Калории",
    "Протеин",
    "Въглехидрати",
    "Мазнини",
    "Тегло",
    "% телесни мазнини"
  ];

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);
  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const [dropdownVisibleMale, setDropdownVisibleMale] = React.useState(true);
  const [miniStatisticsVisibleMale, setMiniStatisticsVisibleMale] =
    React.useState(true);
  const [renderDropdownMale, setRenderDropdownMale] = React.useState(true);
  const handleDropdownToggleMale = () => {
    setDropdownVisibleMale(!dropdownVisibleMale);
  };
  const [dropdownVisibleFemale, setDropdownVisibleFemale] =
    React.useState(true);
  const [miniStatisticsVisibleFemale, setMiniStatisticsVisibleFemale] =
    React.useState(true);
  const [renderDropdownFemale, setRenderDropdownFemale] = React.useState(true);
  const handleDropdownToggleFemale = () => {
    setDropdownVisibleFemale(!dropdownVisibleFemale);
  };

  const slideAnimationDropFemale = useSpring({
    opacity: miniStatisticsVisibleFemale ? 1 : 0,
    transform: `translateY(${dropdownVisibleFemale ? -50 : -80}px)`,
    config: {
      tension: dropdownVisibleFemale ? 170 : 200,
      friction: dropdownVisibleFemale ? 12 : 20
    }
  });

  const slideAnimationDropMale = useSpring({
    opacity: miniStatisticsVisibleMale ? 1 : 0,
    transform: `translateY(${dropdownVisibleMale ? -50 : -80}px)`,
    config: {
      tension: dropdownVisibleMale ? 170 : 200,
      friction: dropdownVisibleMale ? 12 : 20
    }
  });

  const slideAnimationDrop = useSpring({
    opacity: miniStatisticsVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -80}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });
  const slideAnimationStats = useSpring({
    transform: `translateY(${
      dropdownVisibleMale || dropdownVisibleFemale ? -50 : 0
    }px)`,
    config: {
      tension: dropdownVisibleMale || dropdownVisibleFemale ? 170 : 200,
      friction: dropdownVisibleMale || dropdownVisibleFemale ? 12 : 20
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
    const handleDropdownVisibilityChange = async () => {
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

    handleDropdownVisibilityChange();
  }, [dropdownVisible]);

  React.useEffect(() => {
    const handleDropdownVisibilityChangeMale = async () => {
      if (dropdownVisibleMale) {
        setMiniStatisticsVisibleMale(true);
        setRenderDropdownMale(true);
      } else {
        setMiniStatisticsVisibleMale(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdownMale(false);
          }, 150)
        );
      }
    };

    handleDropdownVisibilityChangeMale();
  }, [dropdownVisibleMale]);

  React.useEffect(() => {
    const handleDropdownVisibilityChangeFemale = async () => {
      if (dropdownVisibleFemale) {
        setMiniStatisticsVisibleFemale(true);
        setRenderDropdownFemale(true);
      } else {
        setMiniStatisticsVisibleFemale(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdownFemale(false);
          }, 150)
        );
      }
    };

    handleDropdownVisibilityChangeFemale();
  }, [dropdownVisibleFemale]);

  React.useEffect(() => {
    // Fetch the total number of users when the component mounts
    getTotalUsers()
      .then((users) => {
        setTotalUsers(users);
      })
      .catch((error) => {
        console.error("Error fetching total users:", error);
      });
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://nutri-api.noit.eu/getTop10Meals");
        if (!response.ok) {
          throw new Error("Failed to fetch data for top 10 meals");
        }
        const top10meals = await response.json();

        console.log("top10meals: ", top10meals.top10meals);
        // Set your state variables accordingly
        setAllMeals(top10meals.top10meals);
        setMealLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMealLoading(false);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://nutri-api.noit.eu/getAllDeviations"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const { openAI, gemini } = await response.json();

        console.log("openAI: ", openAI, "gemini: ", gemini);
        // Set your state variables accordingly
        setDeviations({
          openAI: {
            averageDeviation: openAI.averageDeviation,
            maxDeviation: openAI.maxDeviation,
            averageDeviationPercentage: openAI.averageDeviationPercentage
          },
          gemini: {
            averageDeviation: gemini.averageDeviation,
            maxDeviation: gemini.maxDeviation,
            averageDeviationPercentage: gemini.averageDeviationPercentage
          }
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("deviations: ", deviations);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to your API endpoint
        const response = await fetch(
          "https://nutri-api.noit.eu/getAllHealthStatuses"
        );

        // Check if the request was successful (status code 200)
        if (response.ok) {
          const { labels: healthStatuses, counts: healthStatusesCount } =
            await response.json();

          console.log(
            "healthStatuses: ",
            healthStatuses,
            "healthStatusesCount: ",
            healthStatusesCount
          );
          setAllUsersHealthStatesLabels(healthStatuses);
          setAllUsersHealthStatesData(healthStatusesCount);
        } else {
          // Handle the error if the request fails
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Regardless of success or failure, stop loading
      }
    };

    // Call fetchData once when the component mounts
    fetchData();

    // No cleanup is needed for this effect
  }, []);

  React.useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(getFirestore(), "additionalUserData"),
      (querySnapshot) => {
        let totalCaloriesMale = 0;
        let totalProteinMale = 0;
        let totalCarbsMale = 0;
        let totalFatMale = 0;
        let totalWeightMale = 0;
        let totalBodyFatPercentageMale = 0;

        let totalCaloriesFemale = 0;
        let totalProteinFemale = 0;
        let totalCarbsFemale = 0;
        let totalFatFemale = 0;
        let totalWeightFemale = 0;
        let totalBodyFatPercentageFemale = 0;

        let malesCount = 0;
        let femalesCount = 0;

        let malesWithData = 0;
        let femalesWithData = 0;

        let malesWithNutrients = 0;
        let femalesWithNutrients = 0;

        querySnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          const gender = userData.gender;

          if (gender === "male") {
            malesCount++;
          } else if (gender === "female") {
            femalesCount++;
          }

          const latestTimestampData = getLatestTimestampData(userData);
          if (latestTimestampData !== undefined) {
            if (gender === "male") {
              malesWithData++;
              if (latestTimestampData.Preferences) {
                malesWithNutrients++;
                totalCaloriesMale +=
                  latestTimestampData.Preferences.calories || 0;
                totalProteinMale +=
                  latestTimestampData.Preferences.nutrients.protein || 0;
                totalCarbsMale +=
                  latestTimestampData.Preferences.nutrients.carbs || 0;
                totalFatMale +=
                  latestTimestampData.Preferences.nutrients.fat || 0;
              }
              totalWeightMale += latestTimestampData.weight || 0;
              totalBodyFatPercentageMale +=
                latestTimestampData.BodyMassData.bodyFat || 0;
            } else if (gender === "female") {
              femalesWithData++;
              if (latestTimestampData.Preferences) {
                femalesWithNutrients++;
                totalCaloriesFemale +=
                  latestTimestampData.Preferences.calories || 0;
                totalProteinFemale +=
                  latestTimestampData.Preferences.nutrients.protein || 0;
                totalCarbsFemale +=
                  latestTimestampData.Preferences.nutrients.carbs || 0;
                totalFatFemale +=
                  latestTimestampData.Preferences.nutrients.fat || 0;
              }
              totalWeightFemale += latestTimestampData.weight || 0;
              totalBodyFatPercentageFemale +=
                latestTimestampData.BodyMassData.bodyFat || 0;
            }
          }
        });

        const meanCaloriesMale =
          malesWithNutrients > 0 ? totalCaloriesMale / malesWithNutrients : 0;
        const meanProteinMale =
          malesWithNutrients > 0 ? totalProteinMale / malesWithNutrients : 0;
        const meanCarbsMale =
          malesWithNutrients > 0 ? totalCarbsMale / malesWithNutrients : 0;
        const meanFatMale =
          malesWithNutrients > 0 ? totalFatMale / malesWithNutrients : 0;
        const meanWeightMale =
          malesWithData > 0 ? totalWeightMale / malesWithData : 0;
        const meanBodyFatPercentageMale =
          malesWithData > 0 ? totalBodyFatPercentageMale / malesWithData : 0;

        const meanCaloriesFemale =
          femalesWithNutrients > 0
            ? totalCaloriesFemale / femalesWithNutrients
            : 0;
        const meanProteinFemale =
          femalesWithNutrients > 0
            ? totalProteinFemale / femalesWithNutrients
            : 0;
        const meanCarbsFemale =
          femalesWithNutrients > 0
            ? totalCarbsFemale / femalesWithNutrients
            : 0;
        const meanFatFemale =
          femalesWithNutrients > 0 ? totalFatFemale / femalesWithNutrients : 0;
        const meanWeightFemale =
          femalesWithData > 0 ? totalWeightFemale / femalesWithData : 0;
        const meanBodyFatPercentageFemale =
          femalesWithData > 0
            ? totalBodyFatPercentageFemale / femalesWithData
            : 0;

        setAverageStats({
          male: {
            totalUsers: malesCount,
            averageCalories: meanCaloriesMale,
            averageProtein: meanProteinMale,
            averageCarbs: meanCarbsMale,
            averageFat: meanFatMale,
            averageWeight: meanWeightMale,
            averageBodyFatPercentage: meanBodyFatPercentageMale
          },
          female: {
            totalUsers: femalesCount,
            averageCalories: meanCaloriesFemale,
            averageProtein: meanProteinFemale,
            averageCarbs: meanCarbsFemale,
            averageFat: meanFatFemale,
            averageWeight: meanWeightFemale,
            averageBodyFatPercentage: meanBodyFatPercentageFemale
          }
        });
      }
    );

    return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
  }, []);

  // Function to get the latest timestamp data
  const getLatestTimestampData = (userData: {
    [key: string]: any;
  }): { [key: string]: any } | undefined => {
    const timestampedObjects = Object.entries(userData)
      .filter(([key, value]) => typeof value === "object")
      .map(([key, value]) => ({ key, ...value }));
    const orderedTimestampObjects = [...timestampedObjects].sort(
      (a, b) => new Date(b.key).getTime() - new Date(a.key).getTime()
    );
    for (const obj of orderedTimestampObjects) {
      if (obj.weight && obj.BodyMassData) {
        return obj;
      }
    }
    return undefined;
  };

  console.log("allMeals: ", allMeals);
  const barChartLabels = allMeals.slice(0, 5).map((entry) => {
    const words = entry.name.split(" ");
    const wordGroups = [];
    for (let i = 0; i < words.length; i += 2) {
      const group = [words[i]];
      if (words[i + 1]) {
        group.push(words[i + 1]);
      }
      wordGroups.push(group.join(" "));
    }
    return wordGroups;
  });
  console.log(barChartLabels);
  const barChartForTopSuggestions = allMeals
    .slice(0, 5)
    .map((entry) => entry.count);

  const [isSmallScreen] = useMediaQuery("(max-width: 767px)");

  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Box>
          <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
            <Card>
              <Flex
                justify={isSmallScreen && "center"}
                w="100%"
                mb="5px"
                flexWrap="wrap"
                textAlign={isSmallScreen ? "center" : "start"}
              >
                <Text fontSize="5xl" mr="2">
                  Добре дошли в{" "}
                </Text>
                <LinearGradientText
                  text={<b>Nutri</b>}
                  gradient={gradient}
                  fontSize="5xl"
                  fontFamily="DM Sans"
                />
                <LinearGradientText
                  text={<b>Fit⠀</b>}
                  gradient={gradientFit}
                  fontFamily="Leckerli One"
                  fontSize="5xl"
                  mr="2px"
                />
              </Flex>
            </Card>
            <Card>
              <Flex justify="left">
                <Text fontSize="2xl">
                  Бъдете винаги във форма и в оптимално здравословно състояние с
                  помощта на изкуствен интелект!
                </Text>
              </Flex>
            </Card>
          </SimpleGrid>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
            gap="20px"
            mb="20px"
          >
            <Card borderColor={borderColor} borderWidth="3px">
              <Text
                fontSize="3xl"
                alignContent="center"
                textAlign="center"
                style={{
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent"
                }}
              >
                <b>Най-често препоръчвано ястие от NutriFit</b>
              </Text>
            </Card>
            {!isSmallScreen && (
              <Card
                borderColor={borderColor}
                borderWidth="3px"
                maxH={{ sm: "400px", md: "600px", lg: "530px" }}
              >
                <Text
                  fontSize="3xl"
                  alignContent="center"
                  textAlign="center"
                  style={{
                    backgroundImage: gradient,
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  <b>Топ 5 най-препоръчвани ястия от NutriFit</b>
                </Text>
              </Card>
            )}
            {mealLoading ? (
              <Card borderColor={borderColor} borderWidth="3px">
                <Flex justify="center" align="center" minH="400px">
                  <Loading />
                </Flex>
              </Card>
            ) : (
              <RecipeWidget
                name={
                  <Flex justify="center" w="100%" overflow="hidden">
                    <Tooltip label={allMeals[0]?.name} borderRadius="10px">
                      <Text
                        fontSize="2xl"
                        whiteSpace="nowrap"
                        maxW="360px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {allMeals[0]?.name || "Няма рецепта"}
                      </Text>
                    </Tooltip>
                  </Flex>
                }
                author={<Box></Box>}
                image={allMeals[0]?.mealData?.image}
                currentbid={
                  <Box>
                    <Flex
                      alignItems="center"
                      justifyContent="center"
                      mb="30px"
                      mt={{ sm: "50px", md: "30px", lg: "10px", xl: "0px" }}
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
                        Грамаж: {`${allMeals[0]?.mealData?.totals?.grams} g`}
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
                          {`${allMeals[0]?.mealData?.totals?.calories} g`}
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
                          {`${allMeals[0]?.mealData?.totals?.carbohydrates} g`}
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
                          {`${allMeals[0]?.mealData?.totals?.protein} g`}
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
                          Мазнини: {`${allMeals[0]?.mealData?.totals?.fat} g`}
                        </Text>
                      </SimpleGrid>
                    </Flex>
                    <Flex mt="20px" alignItems="center" justifyContent="center">
                      <RecipeModal
                        title="Рецепта"
                        ingredients={allMeals[0]?.mealData?.ingredients}
                        instructions={allMeals[0]?.mealData?.instructions}
                        recipeQuantity={allMeals[0]?.mealData?.recipeQuantity}
                      />
                    </Flex>
                  </Box>
                }
              />
            )}
            {isSmallScreen && (
              <Card
                borderColor={borderColor}
                borderWidth="3px"
                maxH={{ sm: "400px", md: "600px", lg: "530px" }}
              >
                <Text
                  fontSize="3xl"
                  alignContent="center"
                  textAlign="center"
                  style={{
                    backgroundImage: gradient,
                    WebkitBackgroundClip: "text",
                    color: "transparent"
                  }}
                >
                  <b>Топ 5 най-препоръчвани ястия от NutriFit</b>
                </Text>
              </Card>
            )}
            <Box maxH={{ sm: "400px", md: "595px", lg: "530px" }}>
              <Card
                alignItems="center"
                flexDirection="column"
                h="100%"
                w="100%"
                minH={{ sm: "400px", md: "300px", lg: "auto" }}
                minW={{ sm: "200px", md: "200px", lg: "auto" }}
                borderColor={borderColor}
                borderWidth="3px"
              >
                {mealLoading ? (
                  <Flex justify="center" align="center" minH="400px">
                    <Loading />
                  </Flex>
                ) : (
                  <ColumnChart
                    chartLabels={barChartLabels}
                    chartData={barChartForTopSuggestions}
                    chartLabelName="Сравнение на препоръчани храни"
                    textColor={chartsColor}
                    color="#523bff"
                  />
                )}
              </Card>
            </Box>
          </SimpleGrid>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1, "2xl": 1 }}
            gap="20px"
            mb="20px"
          >
            <Card borderColor={borderColor} borderWidth="3px">
              <Text
                fontSize="3xl"
                alignContent="center"
                textAlign="center"
                style={{
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent"
                }}
              >
                <b>Сравнение между OpenAI и Gemini</b>
              </Text>
            </Card>
            {loading ? (
              <Card borderColor={borderColor} borderWidth="3px">
                <Flex justify="center" align="center" minH="400px">
                  <Loading />
                </Flex>
              </Card>
            ) : (
              <Box>
                <Card
                  alignItems="center"
                  flexDirection="column"
                  h="100%"
                  w="100%"
                  minH={{ sm: "400px", md: "300px", lg: "auto" }}
                  minW={{ sm: "200px", md: "200px", lg: "auto" }}
                  borderColor={borderColor}
                  borderWidth="3px"
                >
                  <SimpleGrid
                    columns={{ base: 1, md: 3, lg: 3 }}
                    gap="80px"
                    mb="10px"
                  >
                    {/* ChatGPT */}
                    <Box textAlign="center">
                      <Text
                        mb="4"
                        fontSize="2xl"
                        textColor="#00A67E"
                        fontWeight="500"
                      >
                        ChatGPT
                      </Text>
                      <Image
                        src={ChatGPT}
                        alt="ChatGPT"
                        boxSize="100px"
                        ml="24.5%"
                      />
                      <Text
                        mt="4"
                        fontSize="2xl"
                        textColor="#00A67E"
                        fontWeight="500"
                      >
                        {deviations &&
                          deviations.openAI.averageDeviationPercentage
                            ?.overallAverage}
                      </Text>
                    </Box>

                    {/* vs */}
                    <Text textAlign="center" fontSize="5xl" mt="50px">
                      vs
                    </Text>

                    {/* gemini */}
                    <Box textAlign="center">
                      <Text
                        mb="4"
                        fontSize="2xl"
                        textColor="#00A67E"
                        fontWeight="500"
                      >
                        gemini
                      </Text>
                      <Image
                        src={Gemini}
                        alt="gemini"
                        boxSize="100px"
                        w="200px"
                      />
                      <Text
                        mt="4"
                        fontSize="2xl"
                        textColor="#00A67E"
                        fontWeight="500"
                      >
                        {deviations &&
                          deviations.gemini.averageDeviationPercentage
                            ?.overallAverage}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Deviation stats */}
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 2 }}
                    gap="80px"
                    mb="10px"
                  >
                    {/* ChatGPT Deviation Stats */}
                    <Box>
                      <Text
                        fontSize="4xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <b>Средно отклонение на:</b>
                      </Text>
                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 2 }}
                        gap="20px"
                        mb="10px"
                      >
                        {/* MiniStatistics components for gemini average deviation */}
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Калории"
                          value={`${
                            deviations &&
                            deviations.openAI.averageDeviation?.calories.toFixed(
                              2
                            )
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.openAI.averageDeviationPercentage
                              ?.categoryAverages?.calories
                          }%)`}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Протеин"
                          value={`${
                            deviations &&
                            deviations.openAI.averageDeviation?.protein.toFixed(
                              2
                            )
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.openAI.averageDeviationPercentage
                              ?.categoryAverages?.protein
                          }%)`}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Въглехидрати"
                          value={`${
                            deviations &&
                            deviations.openAI.averageDeviation?.carbohydrates.toFixed(
                              2
                            )
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.openAI.averageDeviationPercentage
                              ?.categoryAverages?.carbohydrates
                          }%)`}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Мазнини"
                          value={`${
                            deviations &&
                            deviations.openAI.averageDeviation?.fat.toFixed(2)
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.openAI.averageDeviationPercentage
                              ?.categoryAverages?.fat
                          }%)`}
                        />
                      </SimpleGrid>
                      <Text
                        fontSize="4xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <b>Максимално отклонение на:</b>
                      </Text>
                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 2 }}
                        gap="20px"
                        mb="10px"
                      >
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Калории"
                          value={`${
                            deviations &&
                            deviations.openAI.maxDeviation?.calories.toFixed(2)
                          } kCal`}
                          loading={loading}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Протеин"
                          value={`${
                            deviations &&
                            deviations.openAI.maxDeviation?.protein.toFixed(2)
                          } g`}
                          loading={loading}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Въглехидрати"
                          value={`${
                            deviations &&
                            deviations.openAI.maxDeviation?.carbohydrates.toFixed(
                              2
                            )
                          } g`}
                          loading={loading}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Мазнини"
                          value={`${
                            deviations &&
                            deviations.openAI.maxDeviation?.fat.toFixed(2)
                          } g`}
                          loading={loading}
                        />
                      </SimpleGrid>
                    </Box>
                    {/* gemini Deviation Stats */}
                    <Box>
                      <Text
                        fontSize="4xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <b>Средно отклонение на:</b>
                      </Text>
                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 2 }}
                        gap="20px"
                        mb="10px"
                      >
                        {/* MiniStatistics components for gemini average deviation */}
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Калории"
                          value={`${
                            deviations &&
                            deviations.gemini.averageDeviation?.calories.toFixed(
                              2
                            )
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.gemini.averageDeviationPercentage
                              ?.categoryAverages?.calories
                          }%)`}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Протеин"
                          value={`${
                            deviations &&
                            deviations.gemini.averageDeviation?.protein.toFixed(
                              2
                            )
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.gemini.averageDeviationPercentage
                              ?.categoryAverages?.protein
                          }%)`}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Въглехидрати"
                          value={`${
                            deviations &&
                            deviations.gemini.averageDeviation?.carbohydrates.toFixed(
                              2
                            )
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.gemini.averageDeviationPercentage
                              ?.categoryAverages?.carbohydrates
                          }%)`}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Мазнини"
                          value={`${
                            deviations &&
                            deviations.gemini.averageDeviation?.fat.toFixed(2)
                          } g `}
                          loading={loading}
                          growth={`(${
                            deviations &&
                            deviations.gemini.averageDeviationPercentage
                              ?.categoryAverages?.fat
                          }%)`}
                        />
                      </SimpleGrid>
                      <Text
                        fontSize="4xl"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <b>Максимално отклонение на:</b>
                      </Text>
                      <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 2 }}
                        gap="20px"
                        mb="10px"
                      >
                        {/* MiniStatistics components for gemini max deviation */}
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Калории"
                          value={`${
                            deviations &&
                            deviations.gemini.maxDeviation?.calories.toFixed(2)
                          } kCal`}
                          loading={loading}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Протеин"
                          value={`${
                            deviations &&
                            deviations.gemini.maxDeviation?.protein.toFixed(2)
                          } g`}
                          loading={loading}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Въглехидрати"
                          value={`${
                            deviations &&
                            deviations.gemini.maxDeviation?.carbohydrates.toFixed(
                              2
                            )
                          } g`}
                          loading={loading}
                        />
                        <MiniStatistics
                          startContent={
                            <IconBox
                              w="56px"
                              h="56px"
                              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                              icon={
                                <Icon
                                  w="32px"
                                  h="32px"
                                  as={GiWeightScale}
                                  color="white"
                                />
                              }
                            />
                          }
                          name="Мазнини"
                          value={`${
                            deviations &&
                            deviations.gemini.maxDeviation?.fat.toFixed(2)
                          } g`}
                          loading={loading}
                        />
                      </SimpleGrid>
                    </Box>
                  </SimpleGrid>
                </Card>
              </Box>
            )}
            <Card
              borderColor={borderColor}
              borderWidth="3px"
              maxH={{ sm: "400px", md: "600px", lg: "530px" }}
            >
              <Text
                fontSize="3xl"
                alignContent="center"
                textAlign="center"
                style={{
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent"
                }}
              >
                <b>Състояния на всички потребители</b>
              </Text>
            </Card>
            <Box maxH={{ sm: "400px", md: "595px", lg: "530px" }}>
              <Card
                alignItems="center"
                flexDirection="column"
                h="100%"
                w="100%"
                minH={{ sm: "400px", md: "300px", lg: "auto" }}
                minW={{ sm: "200px", md: "200px", lg: "auto" }}
                borderColor={borderColor}
                borderWidth="3px"
              >
                {loading ? (
                  <Flex justify="center" align="center" minH="400px">
                    <Loading />
                  </Flex>
                ) : (
                  <ColumnChart
                    chartLabels={allUsersHealthStatesLabels}
                    chartData={allUsersHealthStatesData}
                    chartLabelName="Състояния на всички потребители"
                    textColor={chartsColor}
                    color="#523bff"
                  />
                )}
              </Card>
            </Box>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }} gap="20px">
            <Box>
              <Card
                onClick={handleDropdownToggleMale}
                cursor="pointer"
                zIndex="1"
                position="relative"
                bg={dropdownVisibleMale ? dropdownActiveBoxBg : dropdownBoxBg}
              >
                <Flex justify="space-between" alignItems="center">
                  <Box>
                    <Flex alignItems="center" justifyContent="center">
                      <Text
                        fontSize="2xl"
                        fontWeight="medium"
                        textAlign="center"
                        color={dropdownVisibleMale && "#513bff"}
                        userSelect="none"
                      >
                        {dropdownVisibleMale ? (
                          <b>Средни статистики за МЪЖЕ</b>
                        ) : (
                          "Средни статистики за МЪЖЕ"
                        )}
                      </Text>
                      <Icon
                        w="30px"
                        h="30px"
                        as={MdOutlineMale}
                        color="#513bff"
                      />
                    </Flex>
                  </Box>
                  <Icon
                    as={dropdownVisibleMale ? FaAngleUp : FaAngleDown}
                    boxSize={6}
                    color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  />
                </Flex>
              </Card>
              {renderDropdownMale && (
                <animated.div
                  style={{ ...slideAnimationDropMale, position: "relative" }}
                >
                  <Card
                    bg={boxBg}
                    minH={{ base: "700px", md: "300px", xl: "180px" }}
                  >
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
                      gap="20px"
                      mt="50px"
                    >
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={GiWeightScale}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Тегло"
                        value={
                          averageStats.male.averageWeight !== null
                            ? `${averageStats.male.averageWeight.toFixed(2)}kg`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="28px"
                                h="28px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Калории"
                        value={
                          averageStats.male.averageCalories !== null
                            ? `${averageStats.male.averageCalories.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Протеин"
                        value={
                          averageStats.male.averageProtein !== null
                            ? `${averageStats.male.averageProtein.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Въглехидрати"
                        value={
                          averageStats.male.averageCarbs !== null
                            ? `${averageStats.male.averageCarbs.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Мазнини"
                        value={
                          averageStats.male.averageFat !== null
                            ? `${averageStats.male.averageFat.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={RiWaterPercentFill}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Тел. Мазнини"
                        value={
                          averageStats.male.averageBodyFatPercentage !== null
                            ? `${averageStats.male.averageBodyFatPercentage.toFixed(
                                2
                              )}%`
                            : "0"
                        }
                        loading={loading}
                      />
                    </SimpleGrid>
                  </Card>
                </animated.div>
              )}
            </Box>
            <Box>
              <Card
                onClick={handleDropdownToggleFemale}
                cursor="pointer"
                zIndex="1"
                position="relative"
                bg={dropdownVisibleFemale ? dropdownActiveBoxBg : dropdownBoxBg}
              >
                <Flex justify="space-between" alignItems="center">
                  <Box>
                    <Flex alignItems="center" justifyContent="center">
                      <Text
                        fontSize="2xl"
                        fontWeight="medium"
                        textAlign="center"
                        color={dropdownVisibleFemale && "#8170ff"}
                        userSelect="none"
                      >
                        {dropdownVisibleFemale ? (
                          <b>Средни статистики за ЖЕНИ</b>
                        ) : (
                          "Средни статистики за ЖЕНИ"
                        )}
                      </Text>
                      <Icon
                        w="30px"
                        h="30px"
                        as={MdOutlineFemale}
                        color="#8170ff"
                      />
                    </Flex>
                  </Box>
                  <Icon
                    as={dropdownVisibleFemale ? FaAngleUp : FaAngleDown}
                    boxSize={6}
                    color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  />
                </Flex>
              </Card>
              {renderDropdownFemale && (
                <animated.div
                  style={{
                    ...slideAnimationDropFemale,
                    position: "relative"
                  }}
                >
                  <Card
                    bg={boxBg}
                    minH={{ base: "700px", md: "300px", xl: "180px" }}
                  >
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
                      mt="50px"
                      gap="20px"
                    >
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={GiWeightScale}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Тегло"
                        value={
                          averageStats.female.averageWeight !== null
                            ? `${averageStats.female.averageWeight.toFixed(
                                2
                              )}kg`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="28px"
                                h="28px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Калории"
                        value={
                          averageStats.female.averageCalories !== null
                            ? `${averageStats.female.averageCalories.toFixed(
                                2
                              )}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Протеин"
                        value={
                          averageStats.female.averageProtein !== null
                            ? `${averageStats.female.averageProtein.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Въглехидрати"
                        value={
                          averageStats.female.averageCarbs !== null
                            ? `${averageStats.female.averageCarbs.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={FaFireAlt}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Мазнини"
                        value={
                          averageStats.female.averageFat !== null
                            ? `${averageStats.female.averageFat.toFixed(2)}`
                            : "0"
                        }
                        loading={loading}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={RiWaterPercentFill}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Тел. Мазнини"
                        value={
                          averageStats.female.averageBodyFatPercentage !== null
                            ? `${averageStats.female.averageBodyFatPercentage.toFixed(
                                2
                              )}%`
                            : "0"
                        }
                        loading={loading}
                      />
                    </SimpleGrid>
                  </Card>
                </animated.div>
              )}
            </Box>
          </SimpleGrid>
          <animated.div
            style={{ ...slideAnimationStats, position: "relative" }}
          >
            <Card
              mt="20px"
              onClick={handleDropdownToggle}
              cursor="pointer"
              zIndex="1"
              position="relative"
              bg={dropdownVisible ? dropdownActiveBoxBg : dropdownBoxBg}
            >
              <Flex justify="space-between" alignItems="center">
                <Text
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
                    <b>Средни статистики за ВСИЧКИ потребители:</b>
                  ) : (
                    "Средни статистики за ВСИЧКИ потребители:"
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
                <Card
                  bg={boxBg}
                  minH={{ base: "800px", md: "300px", xl: "180px" }}
                >
                  <SimpleGrid
                    columns={{ base: 1, md: 3, lg: 3, "2xl": 3 }}
                    gap="20px"
                    mt="50px"
                    mb="20px"
                  >
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={MdOutlineMale}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Мъже"
                      value={
                        averageStats.male.totalUsers !== null
                          ? averageStats.male.totalUsers.toString()
                          : "0"
                      }
                      loading={loading}
                    />
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={BsPersonFillUp}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Потребители"
                      value={
                        averageStats.male.totalUsers !== null
                          ? (
                              averageStats.male.totalUsers +
                              averageStats.female.totalUsers
                            ).toString()
                          : "0"
                      }
                      loading={loading}
                    />
                    <MiniStatistics
                      startContent={
                        <IconBox
                          w="56px"
                          h="56px"
                          bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                          icon={
                            <Icon
                              w="32px"
                              h="32px"
                              as={MdOutlineFemale}
                              color="white"
                            />
                          }
                        />
                      }
                      name="Жени"
                      value={
                        averageStats.female.totalUsers !== null
                          ? averageStats.female.totalUsers.toString()
                          : "0"
                      }
                      loading={loading}
                    />
                  </SimpleGrid>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, xl: 2 }}
                    gap="20px"
                    mt={isSmallScreen ? "0px" : "40px"}
                  >
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "200px", md: "200px", lg: "auto" }}
                      maxH="400px"
                    >
                      <LineAvaragesChart
                        lineChartData={maleChartData}
                        lineChartData2={femaleChartData}
                        lineChartLabels={allUsersStatsLabels}
                        lineChartLabelName={"Мъже"}
                        lineChartLabelName2={"Жени"}
                        textColor={chartsColor}
                      />
                    </Card>
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "200px", md: "200px", lg: "auto" }}
                      maxH="400px"
                    >
                      <ColumnAvaragesChart
                        chartData={maleChartData}
                        chartData2={femaleChartData}
                        chartLabels={allUsersStatsLabels}
                        chartLabelName={"Мъже"}
                        chartLabelName2={"Жени"}
                        textColor={chartsColor}
                      />
                    </Card>
                  </SimpleGrid>
                </Card>
              </animated.div>
            )}
            <animated.div style={{ ...slideAnimation, position: "relative" }}>
              <Card
                minH="200px"
                backgroundImage={`url(${backgroundImage})`}
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition="center"
                transition="background-image 0.5s ease-in-out"
                mt="20px"
                mb="20px"
              >
                <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap="20px">
                  <Link href="#/admin/weight">
                    <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                      <Flex pt="5px" w="100%">
                        <LinearGradientText
                          text={<b>Калкулации за теглото Ви </b>}
                          gradient={gradient}
                          fontSize="xl"
                          mr="2"
                        />
                        <Icon
                          w="20px"
                          h="20px"
                          as={HiMiniArrowUturnRight}
                          color={color}
                          mt="3px"
                        />
                      </Flex>
                      <Flex justify="center" mt="1%" pt="10px">
                        <Text fontWeight={fontWeight} fontSize="l">
                          Проследете вашето телесно изменение, посредством
                          интерактивни диаграми и статистики!
                        </Text>
                      </Flex>
                    </Card>
                  </Link>
                  <Link href="#/admin/mealplan">
                    <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                      <Flex pt="5px" w="100%">
                        <LinearGradientText
                          text={<b>Хранителен план </b>}
                          gradient={gradient}
                          fontSize="xl"
                          mr="2"
                        />
                        <Icon
                          w="20px"
                          h="20px"
                          as={HiMiniArrowUturnRight}
                          color={color}
                          mt="3px"
                        />
                      </Flex>
                      <Flex justify="center" mt="1%" pt="10px">
                        <Text fontWeight={fontWeight} fontSize="l">
                          Създайте подходящия за вас хранителен план с изкуствен
                          интелект в зависимост от интензивността на физическо
                          натоварване!
                        </Text>
                      </Flex>
                    </Card>
                  </Link>
                  <Link href="#/admin/top-meals">
                    <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                      <Flex pt="5px" w="100%">
                        <LinearGradientText
                          text={<b>Класации </b>}
                          gradient={gradient}
                          fontSize="xl"
                          mr="2"
                        />
                        <Icon
                          w="20px"
                          h="20px"
                          as={HiMiniArrowUturnRight}
                          color={color}
                          mt="3px"
                        />
                      </Flex>
                      <Flex justify="center" mt="1%" pt="10px">
                        <Text fontWeight={fontWeight} fontSize="l">
                          Запознайте се с нашите многобройни статистики и
                          класации за най-препоръчвани ястия от NutriFit!
                        </Text>
                      </Flex>
                    </Card>
                  </Link>
                  <Link href="#/admin/contact">
                    <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                      <Flex pt="5px" w="100%">
                        <LinearGradientText
                          text={<b>Контакт </b>}
                          gradient={gradient}
                          fontSize="xl"
                          mr="2"
                        />
                        <Icon
                          w="20px"
                          h="20px"
                          as={HiMiniArrowUturnRight}
                          color={color}
                          mt="3px"
                        />
                      </Flex>
                      <Flex justify="center" mt="1%" pt="10px">
                        <Text fontWeight={fontWeight} fontSize="l">
                          Ако имате проблем или препоръка, попълнете бланката и
                          ни изпратете съобщение!
                        </Text>
                      </Flex>
                    </Card>
                  </Link>
                </SimpleGrid>
              </Card>
            </animated.div>
          </animated.div>
        </Box>
      </Box>
    </FadeInWrapper>
  );
}
