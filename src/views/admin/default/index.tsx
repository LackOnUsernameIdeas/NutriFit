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
  Tooltip,
  SimpleGrid,
  useColorMode,
  useColorModeValue,
  Text,
  Link
} from "@chakra-ui/react";
// Assets
// Custom components
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
import { Meal } from "../../../types/weightStats";
import { orderMealsByFrequency } from "database/getAdditionalUserData";
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
import { getTotalUsers } from "database/getMeanUsersData";

// Types
import { GenderAverageStats } from "../../../types/weightStats";

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
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.200" },
    { bg: "whiteAlpha.100" }
  );
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
  const [loading, setLoading] = React.useState(true);
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

  const chartLabels = [
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
    const fetchSortedMeals = async () => {
      try {
        const mealsCollectionRef = collection(getFirestore(), "orderedMeals");
        const querySnapshot = await getDocs(mealsCollectionRef);
        console.log("snap :", querySnapshot);
        const sortedMeals: Meal[] = [];
        querySnapshot.forEach((doc) => {
          const orderedMealsData = doc.data().orderedMeals;
          Object.keys(orderedMealsData).forEach((key) => {
            sortedMeals.push(orderedMealsData[key]);
          });
        });
        console.log("ordered meals collection data :", sortedMeals);
        if (sortedMeals.length !== 0) {
          const mealsSortedByCount = sortedMeals.sort(
            (a, b) => b.count - a.count
          );
          setAllMeals((mealsSortedByCount as Meal[]).slice(0, 10));
        } else {
          orderMealsByFrequency().then((sortedMeals) => {
            console.log("Sorted meals by frequency:", sortedMeals);
            const mealsSortedByCount = sortedMeals.sort(
              (a, b) => b.count - a.count
            );
            setAllMeals((mealsSortedByCount as Meal[]).slice(0, 10));
            setLoading(false);
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sorted meals:", error);
      }
    };

    fetchSortedMeals();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      console.log("NOT FETCHED YET!");
      const sortedMeals = await orderMealsByFrequency();
      console.log("Sorted meals by frequency:", sortedMeals);
      const mealsSortedByCount = sortedMeals.sort((a, b) => b.count - a.count);
      setAllMeals((mealsSortedByCount as Meal[]).slice(0, 10));
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
        setLoading(false);
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

  const barChartLabels = allMeals.slice(0, 5).map((entry) => entry.name);
  const barChartForTopSuggestions = allMeals
    .slice(0, 5)
    .map((entry) => entry.count);
  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
          <Card>
            <Flex justify="left" alignItems="center">
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
                Нашата цел е да помогнем на потребители ни да спазват хранителен
                режим и здравословно телесно състояние с изкуствен интелект.
              </Text>
            </Flex>
          </Card>
        </SimpleGrid>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
          gap="20px"
          mb="20px"
        >
          <Box maxH={{ sm: "600px", md: "400px", lg: "640px" }}>
            <Card mb="20px" borderColor={borderColor} borderWidth="3px">
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
                <b>Най-често препоръчвана храна от ChatGPT!</b>
              </Text>
            </Card>
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
              image={allMeals[0]?.mealData?.image}
              currentbid={
                <Box>
                  <Flex alignItems="center" justifyContent="center" mb="30px">
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
                    <SimpleGrid columns={{ base: 2, md: 2, lg: 2 }} gap="10px">
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
                        Протеин: {`${allMeals[0]?.mealData?.totals?.protein} g`}
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
          </Box>
          <Box maxH={{ sm: "600px", md: "400px", lg: "530px" }}>
            <Card mb="20px" borderColor={borderColor} borderWidth="3px">
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
                <b>Топ 5 най-често препоръчани храни от ChatGPT!</b>
              </Text>
            </Card>
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
                color="#523bff"
              />
            </Card>
          </Box>
        </SimpleGrid>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
          gap="20px"
          margin="0"
          padding="0"
        >
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
                  minH={{ base: "800px", md: "300px", xl: "180px" }}
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
                style={{ ...slideAnimationDropFemale, position: "relative" }}
              >
                <Card
                  bg={boxBg}
                  minH={{ base: "800px", md: "300px", xl: "180px" }}
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
                          ? `${averageStats.female.averageWeight.toFixed(2)}kg`
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
                          ? `${averageStats.female.averageCalories.toFixed(2)}`
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
        <animated.div style={{ ...slideAnimationStats, position: "relative" }}>
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
                <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
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
                      lineChartData={maleChartData}
                      lineChartData2={femaleChartData}
                      lineChartLabels={chartLabels}
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
                      chartData={maleChartData}
                      chartData2={femaleChartData}
                      chartLabels={chartLabels}
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
              minH="225px"
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
                        text={<b>Калкулации за теглото ви ↪</b>}
                        gradient={gradient}
                        fontSize="xl"
                        mr="2"
                      />
                    </Flex>
                    <Flex justify="center" mt="1%" pt="10px">
                      <Text fontWeight={fontWeight} fontSize="l">
                        Посетете нашата страница с калкулатор за тегло!
                        Предлагаме интерактивни диаграми и статистики, с които
                        вие можете да следите вашето телесно изменение.
                      </Text>
                    </Flex>
                  </Card>
                </Link>
                <Link href="#/admin/mealplan">
                  <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                    <Flex pt="5px" w="100%">
                      <LinearGradientText
                        text={<b>Хранителен план ↪</b>}
                        gradient={gradient}
                        fontSize="xl"
                        mr="2"
                      />
                    </Flex>
                    <Flex justify="center" mt="1%" pt="10px">
                      <Text fontWeight={fontWeight} fontSize="l">
                        Посетете нашата страница за създаване на хранителен
                        план! Ние използваме изкуствен интелект, с който
                        създаваме хранителен режим според вашите предпочитания.
                      </Text>
                    </Flex>
                  </Card>
                </Link>
                <Link href="#/admin/top-meals">
                  <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                    <Flex pt="5px" w="100%">
                      <LinearGradientText
                        text={<b>Класации ↪</b>}
                        gradient={gradient}
                        fontSize="xl"
                        mr="2"
                      />
                    </Flex>
                    <Flex justify="center" mt="1%" pt="10px">
                      <Text fontWeight={fontWeight} fontSize="l">
                        Посетете нашата страница с класации за храните,
                        генерирани от ChatGPT! Ние запазваме всички хранителни
                        планове, които генерираме и ги използваме за да ви
                        предоставим статистики.
                      </Text>
                    </Flex>
                  </Card>
                </Link>
                <Link href="#/admin/contact">
                  <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                    <Flex pt="5px" w="100%">
                      <LinearGradientText
                        text={<b>Контакт ↪</b>}
                        gradient={gradient}
                        fontSize="xl"
                        mr="2"
                      />
                    </Flex>
                    <Flex justify="center" mt="1%" pt="10px">
                      <Text fontWeight={fontWeight} fontSize="l">
                        Свържете се с нас! Ако изпитате проблем или имате
                        препоръка, попълнете бланката и ни изпратете съобщение.
                      </Text>
                    </Flex>
                  </Card>
                </Link>
              </SimpleGrid>
            </Card>
          </animated.div>
        </animated.div>
      </Box>
    </FadeInWrapper>
  );
}
