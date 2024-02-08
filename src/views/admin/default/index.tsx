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
import Bulgaria from "assets/img/dashboards/bulgaria.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import { useSpring, animated } from "react-spring";
import { FaFireAlt, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GiWeightScale } from "react-icons/gi";
import { BsPersonFillUp } from "react-icons/bs";
import { RiWaterPercentFill } from "react-icons/ri";
import { MdOutlineMale, MdOutlineFemale } from "react-icons/md";
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
import {
  getTotalUsers,
  getAverageWeightOfAllUsers,
  getAverageCaloriesOfAllUsers,
  getAverageProteinOfAllUsers,
  getAverageCarbsOfAllUsers,
  getAverageFatOfAllUsers,
  getAverageBodyFatPercentageOfAllUsers
} from "database/getMeanUsersData";

// Types
import {
  GenderStatistics,
  GenderAverageStats
} from "../../../types/weightStats";

import { ColumnAvaragesChart } from "components/charts/BarCharts";
import { LineAvaragesChart } from "components/charts/LineCharts";

interface LinearGradientTextProps {
  text: any;
  gradient: string;
  fontSize?: string;
  fontFamily?: string;
  mr?: string;
}

interface TimestampedObject {
  date: string;
  weight?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  bodyFatPercentage?: number;
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
  const gradientNutri = useColorModeValue(gradientLight, gradientDark);
  const gradientFit = useColorModeValue(gradientDark, gradientLight);
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const fontWeight = useColorModeValue("500", "100");
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
  const redirectWidgetsSlidePosition = useBreakpointValue({
    base: -805,
    sm: -805,
    md: -480,
    lg: 0,
    xl: 0
  });
  const dropdownWidgetsSlidePosition = useBreakpointValue({
    sm: -200,
    md: -80,
    lg: -80,
    xl: -80
  });
  const dropdownWidgetsSlidePositionStats = useBreakpointValue({
    sm: -200,
    md: -80,
    lg: -80,
    xl: -80
  });
  const [loading, setLoading] = React.useState(true);
  const [totalUsers, setTotalUsers] = React.useState<number | null>(null);
  const [averageWeight, setAverageWeight] = React.useState<number | null>(null);
  const [averageCalories, setAverageCalories] = React.useState<number | null>(
    null
  );
  const [averageProtein, setAverageProtein] = React.useState<number | null>(
    null
  );
  const [averageCarbs, setAverageCarbs] = React.useState<number | null>(null);
  const [averageFat, setAverageFat] = React.useState<number | null>(null);
  const [averageBodyFatPercentage, setAverageBodyFatPercentage] =
    React.useState<number | null>(null);
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
    const fetchData = async () => {
      try {
        const firestore = getFirestore();
        const usersDataCollectionRef = collection(
          firestore,
          "additionalUserData"
        );

        const querySnapshot = await getDocs(usersDataCollectionRef);

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

          const gender = userData.gender; // Retrieve gender directly from userData

          if (gender === "male") {
            malesCount++;
          } else if (gender === "female") {
            femalesCount++;
          }

          const timestampedObjects = Object.entries(userData)
            .filter(([key, value]) => typeof value === "object")
            .map(([key, value]) => {
              return { key, ...value };
            });

          const orderedTimestampObjects = [...timestampedObjects].sort(
            (a, b) => {
              const keyA = a.key;
              const keyB = b.key;
              return new Date(keyB).getTime() - new Date(keyA).getTime();
            }
          );

          let latestTimestampData = undefined;
          for (const obj of orderedTimestampObjects) {
            if (obj.weight && obj.BodyMassData) {
              latestTimestampData = obj;
              break; // Stop loop once found
            }
          }

          if (gender === "male" && latestTimestampData !== undefined) {
            malesWithData++;
          } else if (gender === "female" && latestTimestampData !== undefined) {
            femalesWithData++;
          }

          let latestTimestampDataWithNutrients = undefined;
          for (const obj of orderedTimestampObjects) {
            if (obj.Preferences) {
              latestTimestampDataWithNutrients = obj;
              break; // Stop loop once found
            }
          }

          if (
            gender === "male" &&
            latestTimestampDataWithNutrients !== undefined
          ) {
            malesWithNutrients++;
          } else if (
            gender === "female" &&
            latestTimestampDataWithNutrients !== undefined
          ) {
            femalesWithNutrients++;
          }

          console.log("males: ", malesCount, "females: ", femalesCount);

          console.log("orderedTimestampObjects: ", orderedTimestampObjects);
          // Find the latest timestamped object

          let latestTimestampDataForNutrients;
          for (const obj of orderedTimestampObjects) {
            if (obj.Preferences) {
              latestTimestampDataForNutrients = obj;
              break; // Stop loop once found
            }
          }

          // Check if the timestamped object has a weight field
          if (latestTimestampData || latestTimestampDataForNutrients) {
            if (gender === "male") {
              if (latestTimestampDataForNutrients?.Preferences?.calories) {
                totalCaloriesMale +=
                  latestTimestampDataForNutrients.Preferences.calories;
                totalProteinMale +=
                  latestTimestampDataForNutrients.Preferences.nutrients.protein;
                totalCarbsMale +=
                  latestTimestampDataForNutrients.Preferences.nutrients.carbs;
                totalFatMale +=
                  latestTimestampDataForNutrients.Preferences.nutrients.fat;
              }
              totalWeightMale += latestTimestampData.weight;
              totalBodyFatPercentageMale +=
                latestTimestampData.BodyMassData.bodyFat;
            } else if (gender === "female") {
              if (latestTimestampDataForNutrients?.Preferences?.calories) {
                totalCaloriesFemale +=
                  latestTimestampDataForNutrients.Preferences.calories;
                totalProteinFemale +=
                  latestTimestampDataForNutrients.Preferences.nutrients.protein;
                totalCarbsFemale +=
                  latestTimestampDataForNutrients.Preferences.nutrients.carbs;
                totalFatFemale +=
                  latestTimestampDataForNutrients.Preferences.nutrients.fat;
              }
              totalWeightFemale += latestTimestampData.weight;
              totalBodyFatPercentageFemale +=
                latestTimestampData.BodyMassData.bodyFat;
            }
          }
        });

        // Calculate the average statistics for male users
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

        // Calculate the average statistics for female users
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

        console.log(
          "totalCaloriesFemale: ",
          totalCaloriesFemale,
          "totalProteinFemale: ",
          totalProteinFemale,
          "totalCarbsFemale: ",
          totalCarbsFemale,
          "totalFatFemale: ",
          totalFatFemale
        );
        // Update state with calculated averages for both genders
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
      } catch (error) {
        console.error("Error fetching additional user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <FadeInWrapper>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="100px" mb="20px">
          <Card>
            <Flex justify="left" alignItems="center">
              <Text fontSize="5xl" mr="2">
                Добре дошли в{" "}
              </Text>
              <LinearGradientText
                text={<b>Nutri</b>}
                gradient={gradientNutri}
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
        </SimpleGrid>
        <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
          <Card>
            <Flex justify="left">
              <Text fontSize="2xl">
                Нашата цел е да помогнем на нашите потребители да поддържат
                перфектното тегло с помощта на статистики и диаграми.
              </Text>
            </Flex>
          </Card>
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
                      color={dropdownVisibleMale && "#715ffa"}
                    >
                      Средни статистики за МЪЖЕ
                    </Text>
                    <Icon
                      w="30px"
                      h="30px"
                      as={MdOutlineMale}
                      color={dropdownVisibleMale ? "#715ffa" : "blue"}
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
                      color={dropdownVisibleFemale && "#715ffa"}
                    >
                      Средни статистики за ЖЕНИ
                    </Text>
                    <Icon
                      w="30px"
                      h="30px"
                      as={MdOutlineFemale}
                      color={dropdownVisibleFemale ? "#715ffa" : "pink"}
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
        <Card
          mt="20px"
          onClick={handleDropdownToggle}
          cursor="pointer"
          zIndex="1"
          position="relative"
          bg={dropdownVisible ? dropdownActiveBoxBg : dropdownBoxBg}
        >
          <Flex justify="space-between" alignItems="center">
            <Text fontSize="2xl" color={dropdownVisible && "#715ffa"}>
              Средни статистики за ВСИЧКИ потребители:
            </Text>
            <Icon
              as={dropdownVisible ? FaAngleUp : FaAngleDown}
              boxSize={6}
              color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
            />
          </Flex>
        </Card>
        {renderDropdown && (
          <animated.div style={{ ...slideAnimationDrop, position: "relative" }}>
            <Card bg={boxBg} minH={{ base: "800px", md: "300px", xl: "180px" }}>
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
                          averageStats.male.totalUsers
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
                  mt="30px"
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
                      gradient={gradientNutri}
                      fontSize="xl"
                      mr="2"
                    />
                  </Flex>
                  <Flex justify="center" mt="1%" pt="10px">
                    <Text fontWeight={fontWeight} fontSize="l">
                      Посетете нашата страница с калкулатор за тегло! Предлагаме
                      интерактивни диаграми и статистики, създадени за вас!
                    </Text>
                  </Flex>
                </Card>
              </Link>
              <Link href="#/admin/mealplan">
                <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                  <Flex pt="5px" w="100%">
                    <LinearGradientText
                      text={<b>Хранителен план ↪</b>}
                      gradient={gradientNutri}
                      fontSize="xl"
                      mr="2"
                    />
                  </Flex>
                  <Flex justify="center" mt="1%" pt="10px">
                    <Text fontWeight={fontWeight} fontSize="l">
                      Посетете нашата страница за създаване на хранителен план!
                      Имаме обширна база данни със рецепти, която използваме да
                      създадем хранителен режим с вашите предпочитания!
                    </Text>
                  </Flex>
                </Card>
              </Link>
              <Link href="#/admin/mealplan">
                <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                  <Flex pt="5px" w="100%">
                    <LinearGradientText
                      text={<b>Пример ↪</b>}
                      gradient={gradientNutri}
                      fontSize="xl"
                      mr="2"
                    />
                  </Flex>
                  <Flex justify="center" mt="1%" pt="10px">
                    <Text fontWeight={fontWeight} fontSize="l">
                      Посетете нашата страница за създаване на хранителен план!
                      Имаме обширна база данни със рецепти, която използваме да
                      създадем хранителен режим с вашите предпочитания!
                    </Text>
                  </Flex>
                </Card>
              </Link>
              <Link href="#/admin/mealplan">
                <Card _hover={{ bg: bgHover }} _focus={bgFocus} minH="100%">
                  <Flex pt="5px" w="100%">
                    <LinearGradientText
                      text={<b>Пример ↪</b>}
                      gradient={gradientNutri}
                      fontSize="xl"
                      mr="2"
                    />
                  </Flex>
                  <Flex justify="center" mt="1%" pt="10px">
                    <Text fontWeight={fontWeight} fontSize="l">
                      Посетете нашата страница за създаване на хранителен план!
                      Имаме обширна база данни със рецепти, която използваме да
                      създадем хранителен режим с вашите предпочитания!
                    </Text>
                  </Flex>
                </Card>
              </Link>
            </SimpleGrid>
          </Card>
        </animated.div>
      </Box>
    </FadeInWrapper>
  );
}
