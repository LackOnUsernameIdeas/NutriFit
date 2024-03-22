import React, { useState } from "react";

// Chakra UI components
import {
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Flex,
  Icon,
  Text,
  Button,
  SimpleGrid,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  Menu,
  Heading,
  Stack,
  StackDivider,
  Alert,
  AlertIcon,
  useMediaQuery
} from "@chakra-ui/react";

// React Icons
import { MdOutlineInfo } from "react-icons/md";
// Custom components
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";
import CardHeader from "components/card/Card";
import CardBody from "components/card/Card";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import DietTable from "views/admin/dataTables/components/ColumnsTable";
import CalorieRequirements from "./components/CalorieRequirements";
import Loading from "views/admin/weightStats/components/Loading";
import MiniStatistics from "components/card/MiniStatistics";
import { FaFireAlt } from "react-icons/fa";
import IconBox from "components/icons/IconBox";
import MealPlannerForm from "./components/MealPlannerForm";
import { HSeparator } from "components/separator/Separator";
// Types
import {
  UserData,
  UserIntakes,
  AllUsersPreferences,
  DailyCaloryRequirements,
  WeightDifference
} from "../../../types/weightStats";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchAdditionalUserData } from "../../../database/getAdditionalUserData";
import {
  savePreferences,
  saveIntakes
} from "../../../database/setWeightStatsData";
import { table } from "console";

import { LineChart } from "components/charts/LineCharts";
import { parseISO } from "date-fns";
// Главен компонент
export default function MealPlanner() {
  // Color values
  const { colorMode } = useColorMode();
  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const chartsColor = useColorModeValue("brand.500", "white");
  const fontWeight = useColorModeValue("550", "100");
  const tipFontWeight = useColorModeValue("500", "100");
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
  const TipBoxBg = useColorModeValue("#a7ddfc", "#395182");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const textColor = useColorModeValue("black", "white");
  const infoBoxIconColor = useColorModeValue("black", "white");
  const bgList = useColorModeValue("secondaryGray.150", "whiteAlpha.100");
  const borderColor = useColorModeValue("secondaryGray.200", "whiteAlpha.200");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const gradientHover = useColorModeValue(
    { bg: "linear-gradient(90deg, #4f3efb 0%, #8477fa 50%)" },
    { bg: "linear-gradient(90deg, #7e6afc 0%, #4f3efb 100%)" }
  );
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.100" }
  );
  const bgHoverInfoBox = useColorModeValue(
    { bg: "#C6C7D4" },
    { bg: "whiteAlpha.100" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  // State за разкриване на информация за менюто с информация
  const {
    isOpen: isOpenLevels,
    onOpen: onOpenLevels,
    onClose: onCloseLevels
  } = useDisclosure();

  const {
    isOpen: isOpenDiet,
    onOpen: onOpenDiet,
    onClose: onCloseDiet
  } = useDisclosure();

  const [dailyCaloryRequirements, setDailyCaloryRequirements] = useState<
    DailyCaloryRequirements[]
  >(
    Array.from({ length: 6 }, (_, index) => ({
      level: index + 1,
      BMR: 0,
      goals: {
        "maintain weight": 0,
        "Mild weight loss": { "loss weight": "0", calory: 0 },
        "Weight loss": { "loss weight": "0", calory: 0 },
        "Extreme weight loss": { "loss weight": "0", calory: 0 },
        "Mild weight gain": { "gain weight": "0", calory: 0 },
        "Weight gain": { "gain weight": "0", calory: 0 },
        "Extreme weight gain": { "gain weight": "0", calory: 0 }
      }
    }))
  );

  const [macroNutrients, setMacroNutrients] = useState<any>([]);

  // State за избрани стойности
  const [clickedValueNutrients, setClickedValueNutrients] = useState({
    name: "",
    protein: null,
    fat: null,
    carbs: null
  });

  const [clickedValueCalories, setClickedValueCalories] = useState<
    number | null
  >(null);

  const [userIntakes, setUserIntakes] = useState<UserIntakes>({
    Calories: 0,
    Protein: 0,
    Fat: 0,
    Carbohydrates: 0
  });

  const [selectedGoal, setSelectedGoal] = useState("");

  // State за избрано ниво на натовареност
  const [activityLevel, setActivityLevel] = useState<number>(null);
  const [isDietTableDataReady, setIsDietTableDataReady] = useState(false);
  // State за зареждане на страницата
  const [isLoadingForCalories, setIsLoadingForCalories] = useState(false);
  const [isLoadingForMacroNutrients, setIsLoadingForMacroNutrients] =
    useState(false);

  // State-ове за въведени потребителски данни
  const [user, setUser] = useState(null);

  const [userData, setUserData] = useState<UserData>({
    gender: "male" || "female",
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    goal: "maintain"
  });

  const [allUsersPreferences, setAllUsersPreferences] = useState<
    AllUsersPreferences[]
  >([
    {
      date: "",
      calories: 0,
      nutrients: {
        protein: 0,
        fat: 0,
        carbs: 0,
        name: ""
      }
    }
  ]);
  allUsersPreferences.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  );
  const [allOrderedObjects, setAllOrderedObjects] = useState([
    {
      date: "",
      height: 0,
      weight: 0,
      bmi: 0,
      bodyFat: 0,
      bodyFatMass: 0,
      leanBodyMass: 0,
      differenceFromPerfectWeight: 0
    }
  ]);
  allOrderedObjects.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  );
  const [
    differenceFromPerfectWeightChange,
    setDifferenceFromPerfectWeightChange
  ] = useState<number | null>(null);

  const [perfectWeight, setPerfectWeight] = useState<number>(0);
  const [differenceFromPerfectWeight, setDifferenceFromPerfectWeight] =
    useState<WeightDifference>({
      difference: 0,
      isUnderOrAbove: ""
    });

  function calculateRecommendedGoal() {
    const difference = differenceFromPerfectWeight.difference;
    const underOrAbove = differenceFromPerfectWeight.isUnderOrAbove;

    let recommendedGoal;

    if (Math.abs(difference) < 2) {
      recommendedGoal = "Запазите";
    } else if (underOrAbove === "under" && Math.abs(difference) >= 2) {
      recommendedGoal = "Качвате";
    } else if (underOrAbove === "above" && Math.abs(difference) >= 2) {
      recommendedGoal = "Сваляте";
    }

    return recommendedGoal;
  }
  const [health, setHealth] = useState("");
  const [userDataLastSavedDate, setUserDataLastSavedDate] = useState("");

  const [showITM, setShowITM] = useState(false);

  // Function to toggle the display of raw data
  const toggleITM = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default behavior of the click event
    setShowITM(!showITM);
  };
  const [showStatus, setShowStatus] = useState(false);

  const cancelRef = React.useRef();
  const cancelRefStats = React.useRef();

  // Function to toggle the display of raw data
  const toggleStatus = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent the default behavior of the click event
    setShowStatus(!showStatus);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenStats,
    onOpen: onOpenStats,
    onClose: onCloseStats
  } = useDisclosure();

  const [
    isGenerateStatsForCaloriesCalled,
    setIsGenerateStatsForCaloriesCalled
  ] = useState<boolean>(false);

  const [
    isGenerateStatsForMacroNutrientsCalled,
    setIsGenerateStatsForMacroNutrientsCalled
  ] = useState<boolean>(false);
  // Функция за генериране на статистики
  function generateStatsForCalories() {
    setIsLoadingForCalories(true);
    setTimeout(() => {
      setIsLoadingForCalories(false);
    }, 1000);
  }

  function generateStatsForMacroNutrients() {
    setIsLoadingForMacroNutrients(true);
    setTimeout(() => {
      setIsLoadingForMacroNutrients(false);
      setIsDietTableDataReady(true); // Set the state when data is ready
    }, 1000);
  }

  const calculateChange = (sortedData: any[], property: string) => {
    const latestValue = sortedData[0][property];
    const previousValue = sortedData[1][property];
    const change = latestValue - previousValue;
    setUserDataLastSavedDate(sortedData[1].date);
    return change;
  };

  const calculatePerfectWeightChange = () => {
    // Create an object to store unique entries based on date
    const uniqueEntries: { [date: string]: any } = {};
    console.log("called");
    allOrderedObjects.forEach((entry) => {
      if (
        entry.differenceFromPerfectWeight !== 0 &&
        !uniqueEntries[entry.date]
      ) {
        uniqueEntries[entry.date] = {
          differenceFromPerfectWeight: entry.differenceFromPerfectWeight
        };
      }
    });

    // Create an array of entries sorted by date
    const sortedData = Object.entries(uniqueEntries)
      .sort((a, b) => parseISO(b[0]).getTime() - parseISO(a[0]).getTime())
      .map(([date, values]) => ({ date, ...values }));

    if (sortedData.length >= 2) {
      const differenceFromPerfectWeightChange = calculateChange(
        sortedData,
        "differenceFromPerfectWeight"
      );
      setDifferenceFromPerfectWeightChange(differenceFromPerfectWeightChange);

      console.log("the last two entries for BMI222222: ", sortedData);
      console.log("Perfect Weight Change: ", differenceFromPerfectWeightChange);
    }
  };

  const saveUserPreferencesAndIntakes = () => {
    const uid = getAuth().currentUser.uid;
    savePreferences(uid, clickedValueCalories, clickedValueNutrients);
    if (
      (userIntakes.Calories !== 0,
      userIntakes.Protein !== 0,
      userIntakes.Fat !== 0,
      userIntakes.Carbohydrates !== 0)
    ) {
      saveIntakes(
        uid,
        userIntakes.Calories,
        userIntakes.Protein,
        userIntakes.Fat,
        userIntakes.Carbohydrates
      );
    }
  };
  const mapGoalToDisplayValue = (goal: string) => {
    switch (goal) {
      case "maintain":
        return "Запазване на Тегло";
        break;
      case "mildlose":
        return "Леко Сваляне на Тегло";
        break;
      case "weightlose":
        return "Сваляне на Тегло";
        break;
      case "extremelose":
        return "Екстремно Сваляне на Тегло";
        break;
      case "mildgain":
        return "Леко Качване на Тегло";
        break;
      case "weightgain":
        return "Качване на Тегло";
        break;
      case "extremegain":
        return "Екстремно Качване на Тегло";
        break;
      default:
        return goal; // Return the original value if not found in the mapping
    }
  };

  const mapGenderToDisplayValue = (gender: string) => {
    switch (gender) {
      case "male":
        return "Мъж";
        break;
      case "female":
        return "Жена";
        break;
      default:
        return gender; // Return the original value if not found in the mapping
    }
  };

  const lineChartLabels = allUsersPreferences.map((entry) => entry.date);
  const lineChartForCalories = allUsersPreferences.map(
    (entry) => entry.calories
  );
  const lineChartForProtein = allUsersPreferences.map(
    (entry) => entry.nutrients.protein
  );
  const lineChartForFat = allUsersPreferences.map(
    (entry) => entry.nutrients.fat
  );
  const lineChartForCarbs = allUsersPreferences.map(
    (entry) => entry.nutrients.carbs
  );

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);
  const [dropdownVisibleTip, setDropdownVisibleTip] = React.useState(false);
  const [miniStatisticsVisibleTip, setMiniStatisticsVisibleTip] =
    React.useState(false);
  const [renderDropdownTip, setRenderDropdownTip] = React.useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownTipToggle = () => {
    setDropdownVisibleTip(!dropdownVisibleTip);
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

  const slideAnimationDropTip = useSpring({
    opacity: miniStatisticsVisibleTip ? 1 : 0,
    transform: `translateY(${dropdownVisibleTip ? -50 : -90}px)`,
    config: {
      tension: dropdownVisibleTip ? 170 : 200,
      friction: dropdownVisibleTip ? 12 : 20
    }
  });

  const slideAnimationTip = useSpring({
    transform: `translateY(${dropdownVisibleTip ? -30 : 0}px)`,
    config: {
      tension: dropdownVisibleTip ? 170 : 200,
      friction: dropdownVisibleTip ? 12 : 20
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
    const handleRestSlideTipPositionChange = async () => {
      if (dropdownVisibleTip) {
        setMiniStatisticsVisibleTip(true);
        setRenderDropdownTip(true);
      } else {
        setMiniStatisticsVisibleTip(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdownTip(false);
          }, 150)
        );
      }
    };

    handleRestSlideTipPositionChange();
  }, [dropdownVisibleTip]);

  React.useEffect(() => {
    calculatePerfectWeightChange();
  }, [perfectWeight]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://nutri-api.noit.eu/weightStatsAndMealPlannerData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uid: "zaZs3xBP19f1mKk32j9aNCxkeqM2", // Assuming user is defined somewhere in your component
              date: "2024-03-22" // Get today's date in YYYY-MM-DD format
            })
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weight stats");
        }

        const weightStatsData = await response.json();

        // Set the states accordingly
        setPerfectWeight(weightStatsData.perfectWeight || 0);
        setDifferenceFromPerfectWeight(
          {
            difference: weightStatsData.differenceFromPerfectWeight.difference,
            isUnderOrAbove:
              weightStatsData.differenceFromPerfectWeight.isUnderOrAbove
          } || {
            difference: 0,
            isUnderOrAbove: ""
          }
        );

        setAllOrderedObjects(weightStatsData.userDataForCharts || []);
        setAllUsersPreferences(
          weightStatsData.orderedTimestampObjectsWithPreferences || []
        );

        setUserData((prevUserData) => ({
          ...prevUserData,
          ...weightStatsData.userDataSaveable
        }));

        setHealth(weightStatsData.bmiIndex.health);

        setDailyCaloryRequirements(weightStatsData.dailyCaloryRequirements);

        setMacroNutrients(weightStatsData.macroNutrientsData);
      } catch (error) {
        console.error("Error fetching weight stats:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    // Check if numeric values in userData are different from 0 and not null
    const areValuesValid = Object.values(userData).every(
      (value) => value !== 0
    );

    if (areValuesValid) {
      generateStatsForCalories();
      setIsGenerateStatsForCaloriesCalled(true);
    }
  }, [userData]);

  React.useEffect(() => {
    if (isGenerateStatsForCaloriesCalled && userData.goal) {
      generateStatsForMacroNutrients();
      setIsGenerateStatsForMacroNutrientsCalled(true);
    }
  }, [isGenerateStatsForCaloriesCalled, userData.goal]);

  let tableData: any = [];
  if (macroNutrients[activityLevel - 1]) {
    macroNutrients[activityLevel - 1].goals.forEach((item: any) => {
      const { goal, calorie, balanced, highprotein, lowcarbs, lowfat } = item;

      if (goal === selectedGoal) {
        const savedData = [
          {
            name: "Балансирана",
            protein: balanced.protein.toFixed(2),
            fat: balanced.fat.toFixed(2),
            carbs: balanced.carbs.toFixed(2)
          },
          {
            name: "Ниско съдържание на мазнини",
            protein: lowfat.protein.toFixed(2),
            fat: lowfat.fat.toFixed(2),
            carbs: lowfat.carbs.toFixed(2)
          },
          {
            name: "Ниско съдържание на въглехидрати",
            protein: lowcarbs.protein.toFixed(2),
            fat: lowcarbs.fat.toFixed(2),
            carbs: lowcarbs.carbs.toFixed(2)
          },
          {
            name: "Високо съдържание на Протеин",
            protein: highprotein.protein.toFixed(2),
            fat: highprotein.fat.toFixed(2),
            carbs: highprotein.carbs.toFixed(2)
          }
        ];

        tableData = savedData;
        // You can use or save the 'savedData' object as needed.
      }
    });
  }

  console.log("tableData: ", tableData);
  React.useEffect(() => {
    // Check if both clickedValueCalories and clickedValueNutrients are set
    if (
      clickedValueCalories !== null &&
      clickedValueNutrients.protein !== null
    ) {
      saveUserPreferencesAndIntakes();
    }
  }, [clickedValueCalories, clickedValueNutrients]);

  console.log("userIntakes: ", userIntakes);

  const [isSmallScreen] = useMediaQuery("(max-width: 767px)");

  return (
    <FadeInWrapper>
      <Box
        pt={{ base: "130px", md: "80px", xl: "80px" }}
        style={{ overflow: "hidden" }}
      >
        <Box>
          {!isGenerateStatsForCaloriesCalled ? (
            <Box
              mt="37vh"
              minH="600px"
              opacity={!isGenerateStatsForCaloriesCalled ? 1 : 0}
            >
              <Loading />
            </Box>
          ) : (
            <Box transition="0.2s ease-in-out">
              <Card
                p="20px"
                alignItems="center"
                flexDirection="column"
                w="100%"
                mb="20px"
                backgroundImage={`url(${backgroundImage})`}
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
                backgroundPosition="center"
                transition="background-image 0.25s ease-in-out"
              >
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Години:</b> {userData.age}
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Пол:</b> {mapGenderToDisplayValue(userData.gender)}
                      </Heading>
                    </Box>
                    {userData.goal && (
                      <Box>
                        <Heading
                          size="xs"
                          textTransform="uppercase"
                          fontWeight={fontWeight}
                        >
                          <b>Последно избрана цел:</b>{" "}
                          {mapGoalToDisplayValue(userData.goal)}
                        </Heading>
                      </Box>
                    )}
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Височина:</b> {userData.height} (см)
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Тегло:</b> {userData.weight} (кг)
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Обиколка на врата:</b> {userData.neck} (см)
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Обиколка на талията:</b> {userData.waist} (см)
                      </Heading>
                    </Box>
                    <Box>
                      <Heading
                        size="xs"
                        textTransform="uppercase"
                        fontWeight={fontWeight}
                      >
                        <b>Обиколка на таза:</b> {userData.hip} (см)
                      </Heading>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
              <Alert
                status="info"
                borderRadius="20px"
                fontWeight={tipFontWeight}
                p="20px"
                w="100%"
                mb="20px"
                bg={TipBoxBg}
                onClick={handleDropdownTipToggle}
                cursor="pointer"
                zIndex="1"
                position="relative"
              >
                <Flex
                  justify="space-between"
                  alignItems="center"
                  direction="row"
                  w="100%" // Ensure Flex container takes up the full width
                >
                  <Flex>
                    <AlertIcon />
                    <Text userSelect="none">
                      <b>Съвет:</b> Натиснете тук, за да видите състоянието на
                      вашето тегло, дали трябва да сваляте или да качвате тегло
                      и тогава си съставете хранително меню за деня, за да
                      прецените правилно каква цел да си поставите.
                    </Text>
                  </Flex>
                  <Flex alignItems="center">
                    <Icon
                      as={dropdownVisibleTip ? FaAngleUp : FaAngleDown}
                      boxSize={6}
                      color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                    />
                  </Flex>
                </Flex>
              </Alert>
              {renderDropdownTip && (
                <animated.div
                  style={{ ...slideAnimationDropTip, position: "relative" }}
                >
                  <Card
                    bg={boxBg}
                    minH={{ base: "800px", md: "300px", xl: "180px" }}
                  >
                    <SimpleGrid
                      columns={{ base: 1, md: 2, lg: 4 }}
                      gap="20px"
                      mt="40px"
                    >
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={gradient}
                            transition="background-image 0.5s ease-in-out"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={GiWeightLiftingUp}
                                color="white"
                              />
                            }
                          />
                        }
                        name="Перфектно тегло"
                        value={perfectWeight + " kg"}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={gradient}
                            transition="background-image 0.5s ease-in-out"
                            icon={
                              <Icon
                                w="32px"
                                h="32px"
                                as={GiWeightLiftingUp}
                                color="white"
                              />
                            }
                          />
                        }
                        name={`Вие сте ${
                          differenceFromPerfectWeight.isUnderOrAbove == "above"
                            ? "над"
                            : "под"
                        } нормата:`}
                        value={
                          Math.abs(
                            differenceFromPerfectWeight.difference
                          ).toFixed(2) + " kg"
                        }
                        growth={
                          differenceFromPerfectWeightChange
                            ? differenceFromPerfectWeightChange > 0
                              ? `+${differenceFromPerfectWeightChange.toFixed(
                                  2
                                )}`
                              : null
                            : null
                        }
                        decrease={
                          differenceFromPerfectWeightChange
                            ? differenceFromPerfectWeightChange < 0
                              ? `${differenceFromPerfectWeightChange.toFixed(
                                  2
                                )}`
                              : null
                            : null
                        }
                        subtext={`в сравнение с ${userDataLastSavedDate}`}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={gradient}
                            transition="background-image 0.5s ease-in-out"
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
                        name="Състояние"
                        value={health}
                      />
                      <MiniStatistics
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={gradient}
                            transition="background-image 0.5s ease-in-out"
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
                        name="Препоръчително е да:"
                        value={calculateRecommendedGoal() + " (кг.)"}
                      />
                    </SimpleGrid>
                  </Card>
                </animated.div>
              )}
              <animated.div
                style={{ ...slideAnimationTip, position: "relative" }}
              >
                {lineChartForCalories.length > 1 && (
                  <Box>
                    <Card
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
                            <b>
                              Статистики за ВАШИТЕ средно приети нутриенти и
                              тяхното изменение:
                            </b>
                          ) : (
                            "Статистики за ВАШИТЕ средно приети нутриенти и тяхното изменение:"
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
                            columns={{ base: 1, md: 2, lg: 4 }}
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
                                      as={FaFireAlt}
                                      color="white"
                                    />
                                  }
                                />
                              }
                              name="Калории"
                              value={
                                lineChartLabels.length > 0
                                  ? (
                                      lineChartForCalories.reduce(
                                        (accumulator, currentValue) =>
                                          accumulator + currentValue,
                                        0
                                      ) / lineChartLabels.length
                                    ).toFixed(2)
                                  : 0
                              }
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
                                lineChartLabels.length > 0
                                  ? (
                                      lineChartForProtein.reduce(
                                        (accumulator, currentValue) =>
                                          accumulator + currentValue,
                                        0
                                      ) / lineChartLabels.length
                                    ).toFixed(2)
                                  : 0
                              }
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
                                lineChartLabels.length > 0
                                  ? (
                                      lineChartForCarbs.reduce(
                                        (accumulator, currentValue) =>
                                          accumulator + currentValue,
                                        0
                                      ) / lineChartLabels.length
                                    ).toFixed(2)
                                  : 0
                              }
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
                                lineChartLabels.length > 0
                                  ? (
                                      lineChartForFat.reduce(
                                        (accumulator, currentValue) =>
                                          accumulator + currentValue,
                                        0
                                      ) / lineChartLabels.length
                                    ).toFixed(2)
                                  : 0
                              }
                            />
                          </SimpleGrid>
                          <SimpleGrid
                            columns={{ base: 1, md: 2, xl: 2 }}
                            gap="20px"
                            mt="20px"
                          >
                            <Card
                              fontSize="3xl"
                              maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                              p="20px" // Add padding to the card
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexDirection="column"
                            >
                              Вашите приети калории (kcal)
                            </Card>
                            {!isSmallScreen && (
                              <Card
                                fontSize="3xl"
                                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                                p="20px" // Add padding to the card
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                              >
                                Вашият приет протеин (g.)
                              </Card>
                            )}
                            <Card
                              alignItems="center"
                              flexDirection="column"
                              h="100%"
                              w="100%"
                              minH={{ sm: "400px", md: "300px", lg: "auto" }}
                              minW={{ sm: "150px", md: "200px", lg: "auto" }}
                              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
                            >
                              <LineChart
                                lineChartLabels={lineChartLabels}
                                lineChartData={lineChartForCalories}
                                lineChartLabelName="Изменение на калории(kcal)"
                                textColor={chartsColor}
                                color="rgba(67,24,255,1)"
                              />
                            </Card>
                            {isSmallScreen && (
                              <Card
                                fontSize="3xl"
                                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                                p="20px" // Add padding to the card
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                              >
                                Вашият приет протеин (g.)
                              </Card>
                            )}
                            <Card
                              alignItems="center"
                              flexDirection="column"
                              h="100%"
                              w="100%"
                              minH={{ sm: "400px", md: "300px", lg: "auto" }}
                              minW={{ sm: "150px", md: "200px", lg: "auto" }}
                              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
                            >
                              <LineChart
                                lineChartLabels={lineChartLabels}
                                lineChartData={lineChartForProtein}
                                lineChartLabelName="Изменение на протеин(g)"
                                textColor={chartsColor}
                                color="rgba(67,24,255,1)"
                              />
                            </Card>
                            <Card
                              fontSize="3xl"
                              maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                              p="20px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexDirection="column"
                            >
                              Вашите приети мазнини (g.)
                            </Card>
                            {!isSmallScreen && (
                              <Card
                                fontSize="3xl"
                                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                                p="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                              >
                                Вашите приети въглехидрати (g.)
                              </Card>
                            )}
                            <Card
                              alignItems="center"
                              flexDirection="column"
                              h="100%"
                              w="100%"
                              minH={{ sm: "400px", md: "300px", lg: "auto" }}
                              minW={{ sm: "150px", md: "200px", lg: "auto" }}
                              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
                            >
                              <LineChart
                                lineChartLabels={lineChartLabels}
                                lineChartData={lineChartForFat}
                                lineChartLabelName="Изменение на мазнини(g)"
                                textColor={chartsColor}
                                color="#a194ff"
                              />
                            </Card>
                            {isSmallScreen && (
                              <Card
                                fontSize="3xl"
                                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                                p="20px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                              >
                                Вашите приети въглехидрати (g.)
                              </Card>
                            )}
                            <Card
                              alignItems="center"
                              flexDirection="column"
                              h="100%"
                              w="100%"
                              minH={{ sm: "400px", md: "300px", lg: "auto" }}
                              minW={{ sm: "150px", md: "200px", lg: "auto" }}
                              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
                            >
                              <LineChart
                                lineChartLabels={lineChartLabels}
                                lineChartData={lineChartForCarbs}
                                lineChartLabelName="Изменение на въглехидрати(g)"
                                textColor={chartsColor}
                                color="#a194ff"
                              />
                            </Card>
                          </SimpleGrid>
                        </Card>
                      </animated.div>
                    )}
                  </Box>
                )}
                <animated.div
                  style={{ ...slideAnimation, position: "relative" }}
                >
                  <Card
                    alignItems="center"
                    p="20px"
                    flexDirection="column"
                    w="100%"
                    mt="20px"
                    mb="20px"
                  >
                    {isSmallScreen ? (
                      <>
                        <Flex direction="column" alignItems="center">
                          <Text
                            color={textColor}
                            fontSize="2xl"
                            ms="24px"
                            fontWeight="700"
                            whiteSpace="normal"
                            textAlign="center"
                          >
                            Изберете ниво на натовареност:
                          </Text>
                          <Menu isOpen={isOpenLevels} onClose={onCloseLevels}>
                            <MenuButton
                              alignItems="center"
                              justifyContent="center"
                              bg={bgButton}
                              _hover={bgHoverInfoBox}
                              _focus={bgFocus}
                              _active={bgFocus}
                              w="30px"
                              h="30px"
                              lineHeight="50%"
                              onClick={onOpenStats}
                              borderRadius="20px"
                              mt="2px"
                            >
                              <Icon
                                as={MdOutlineInfo}
                                color={infoBoxIconColor}
                                w="24px"
                                h="24px"
                              />
                            </MenuButton>
                            <MenuList
                              w="100%"
                              minW="unset"
                              ml={{ base: "2%", lg: 0 }}
                              mr={{ base: "2%", lg: 0 }}
                              maxW={{ base: "70%", lg: "80%" }}
                              border="transparent"
                              backdropFilter="blur(100px)"
                              bg={bgList}
                              borderRadius="20px"
                              p="15px"
                            >
                              <Box
                                transition="0.2s linear"
                                color={textColor}
                                p="0px"
                                maxW={{ base: "80%", lg: "100%" }}
                                borderRadius="8px"
                              >
                                <AlertDialog
                                  isOpen={isOpenStats}
                                  leastDestructiveRef={cancelRefStats}
                                  onClose={onCloseStats}
                                >
                                  <AlertDialogOverlay>
                                    <AlertDialogContent
                                      border="2px"
                                      borderRadius="25px"
                                      borderColor={borderColor}
                                      mx="20px"
                                    >
                                      <AlertDialogHeader
                                        fontSize="lg"
                                        fontWeight="bold"
                                      >
                                        Различните нива на натовареност са:
                                      </AlertDialogHeader>

                                      <AlertDialogCloseButton borderRadius="20px" />

                                      <AlertDialogBody>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 1</b> - Малко или въобще не
                                            спортувате. Примерни упражнения:
                                            Кратка разходка, Лека Йога, Кратка
                                            Тай Чи сесия (20 мин.)
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 2</b> - Спортувате умерено
                                            1-3 пъти в седмицата. Примерни
                                            упражнения: Умерена разходка за 30
                                            мин, Работа в двора/градинарство за
                                            45 мин, Каране на колело за 1 час,
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 3</b> - Спортувате умерено
                                            4-5 пъти в седмицата. Примерни
                                            упражнения: Тичане 30 мин, Плуване
                                            за 30 мин, Играене на тенис/волейбол
                                            за 45 мин.
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 4</b> - Спортувате умерено
                                            дневно или интензивно 3-4 пъти в
                                            седмицата. Примерни упражнения:
                                            Интервална тренировка с висока
                                            интензивност 30 мин, Тренировка за
                                            цялото тяло 45 мин. Бързо плуване за
                                            45 минути.
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 5</b> - Спортувате
                                            интензивно 6-7 пъти в седмицата.
                                            Примерни упражнения: По-тежка и
                                            по-дълга интервална тренировка с
                                            висока интензивност, Трениране на
                                            Кик-бокс за 1 час, Трениране на
                                            бойни изкуства.
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                          >
                                            <b>Ниво 6</b> - Спортувате много
                                            интензивно цялата седмица. Примерни
                                            упражнения: Тренировка за маратон,
                                            Каране на колело из дълги растояния
                                            за 2 часа, Вдигане на тежести за 1
                                            час, Участвие в спортен турнир (90
                                            мин.)
                                          </Text>
                                        </Flex>
                                      </AlertDialogBody>
                                      <AlertDialogFooter></AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialogOverlay>
                                </AlertDialog>
                              </Box>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </>
                    ) : (
                      <>
                        <Flex wrap="nowrap" alignItems="center">
                          <Text
                            color={textColor}
                            fontSize="2xl"
                            fontWeight="700"
                            whiteSpace="nowrap"
                            mr="10px"
                          >
                            Изберете ниво на натовареност:
                          </Text>
                          <Menu isOpen={isOpenLevels} onClose={onCloseLevels}>
                            <MenuButton
                              alignItems="center"
                              justifyContent="center"
                              bg={bgButton}
                              _hover={bgHoverInfoBox}
                              _focus={bgFocus}
                              _active={bgFocus}
                              w="30px"
                              h="30px"
                              lineHeight="50%"
                              onClick={onOpenStats}
                              borderRadius="20px"
                            >
                              <Icon
                                as={MdOutlineInfo}
                                color={infoBoxIconColor}
                                w="24px"
                                h="24px"
                              />
                            </MenuButton>
                            <MenuList
                              w="100%"
                              minW="unset"
                              ml={{ base: "2%", lg: 0 }}
                              mr={{ base: "2%", lg: 0 }}
                              maxW={{ base: "70%", lg: "80%" }}
                              border="transparent"
                              backdropFilter="blur(100px)"
                              bg={bgList}
                              borderRadius="20px"
                              p="15px"
                            >
                              <Box
                                transition="0.2s linear"
                                color={textColor}
                                p="0px"
                                maxW={{ base: "80%", lg: "100%" }}
                                borderRadius="8px"
                              >
                                <AlertDialog
                                  isOpen={isOpenStats}
                                  leastDestructiveRef={cancelRefStats}
                                  onClose={onCloseStats}
                                >
                                  <AlertDialogOverlay>
                                    <AlertDialogContent
                                      border="2px"
                                      borderRadius="25px"
                                      borderColor={borderColor}
                                    >
                                      <AlertDialogHeader
                                        fontSize="lg"
                                        fontWeight="bold"
                                      >
                                        Различните нива на натовареност са:
                                      </AlertDialogHeader>

                                      <AlertDialogCloseButton borderRadius="20px" />

                                      <AlertDialogBody>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 1</b> - Малко или въобще не
                                            спортувате. Примерни упражнения:
                                            Кратка разходка, Лека Йога, Кратка
                                            Тай Чи сесия (20 мин.)
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 2</b> - Спортувате умерено
                                            1-3 пъти в седмицата. Примерни
                                            упражнения: Умерена разходка за 30
                                            мин, Работа в двора/градинарство за
                                            45 мин, Каране на колело за 1 час,
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 3</b> - Спортувате умерено
                                            4-5 пъти в седмицата. Примерни
                                            упражнения: Тичане 30 мин, Плуване
                                            за 30 мин, Играене на тенис/волейбол
                                            за 45 мин.
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 4</b> - Спортувате умерено
                                            дневно или интензивно 3-4 пъти в
                                            седмицата. Примерни упражнения:
                                            Интервална тренировка с висока
                                            интензивност 30 мин, Тренировка за
                                            цялото тяло 45 мин. Бързо плуване за
                                            45 минути.
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                            mb="5px"
                                          >
                                            <b>Ниво 5</b> - Спортувате
                                            интензивно 6-7 пъти в седмицата.
                                            Примерни упражнения: По-тежка и
                                            по-дълга интервална тренировка с
                                            висока интензивност, Трениране на
                                            Кик-бокс за 1 час, Трениране на
                                            бойни изкуства.
                                          </Text>
                                        </Flex>
                                        <Flex align="center">
                                          <Text
                                            fontSize="sm"
                                            fontWeight="400"
                                            mt="10px"
                                          >
                                            <b>Ниво 6</b> - Спортувате много
                                            интензивно цялата седмица. Примерни
                                            упражнения: Тренировка за маратон,
                                            Каране на колело из дълги растояния
                                            за 2 часа, Вдигане на тежести за 1
                                            час, Участвие в спортен турнир (90
                                            мин.)
                                          </Text>
                                        </Flex>
                                      </AlertDialogBody>
                                      <AlertDialogFooter></AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialogOverlay>
                                </AlertDialog>
                              </Box>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </>
                    )}
                    <Box gap="10px" mb="20px" mt="20px">
                      <Flex justifyContent="space-between" align="center">
                        <SimpleGrid
                          columns={{ base: 3, md: 2, lg: 6 }}
                          spacing="10px"
                          alignItems="center"
                          mb="10px"
                        >
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <Button
                              key={level}
                              fontSize={{ base: "sm", md: "md" }}
                              margin="0"
                              color={
                                activityLevel === level ? "white" : textColor
                              }
                              bg={activityLevel === level ? gradient : bgButton}
                              _hover={
                                activityLevel === level
                                  ? gradientHover
                                  : bgHover
                              }
                              transition={
                                activityLevel === level
                                  ? "background 0.3s ease-in-out"
                                  : "background 0.3s ease-in-out, color 0.3s ease-in-out"
                              }
                              onClick={() => setActivityLevel(level)}
                            >
                              Ниво {level}
                            </Button>
                          ))}
                        </SimpleGrid>
                      </Flex>
                    </Box>
                  </Card>
                  {activityLevel && (
                    <Box>
                      {macroNutrients.length > 0 ? (
                        <FadeInWrapper>
                          <FadeInWrapper>
                            <Card
                              p="20px"
                              flexDirection="column"
                              w="100%"
                              mb="20px"
                            >
                              <Card alignItems="center">
                                <Text
                                  color={textColor}
                                  fontSize="2xl"
                                  ms="24px"
                                  fontWeight="700"
                                >
                                  Изберете желаната от вас цел и съответните
                                  калории, които трябва да приемате на ден
                                  според желания резултат:
                                </Text>
                                <CalorieRequirements
                                  calorieRequirements={dailyCaloryRequirements}
                                  selectedActivityLevel={activityLevel}
                                  clickedValueCalories={clickedValueCalories}
                                  setClickedValueCalories={
                                    setClickedValueCalories
                                  }
                                  setSelectedGoal={setSelectedGoal}
                                  setUserData={setUserData}
                                />
                              </Card>
                              {isDietTableDataReady &&
                                clickedValueCalories !== null && (
                                  <FadeInWrapper>
                                    <>
                                      <Flex align="center" gap="1%">
                                        <Text
                                          color={textColor}
                                          fontSize="2xl"
                                          ms="24px"
                                          fontWeight="700"
                                        >
                                          Изберете тип диета:
                                        </Text>
                                        <Menu
                                          isOpen={isOpenDiet}
                                          onClose={onCloseDiet}
                                        >
                                          <MenuButton
                                            alignItems="center"
                                            justifyContent="center"
                                            bg={bgButton}
                                            _hover={bgHoverInfoBox}
                                            _focus={bgFocus}
                                            _active={bgFocus}
                                            w="30px"
                                            h="30px"
                                            lineHeight="50%"
                                            onClick={onOpen}
                                            borderRadius="20px"
                                            order={1} // Set a higher order value
                                          >
                                            <Icon
                                              as={MdOutlineInfo}
                                              color={infoBoxIconColor}
                                              w="24px"
                                              h="24px"
                                            />
                                          </MenuButton>
                                          <MenuList
                                            w="100%"
                                            minW="unset"
                                            ml={{ base: "2%", lg: 0 }}
                                            mr={{ base: "2%", lg: 0 }}
                                            maxW={{ base: "47%", lg: "80%" }}
                                            border="transparent"
                                            backdropFilter="blur(100px)"
                                            bg={bgList}
                                            borderRadius="20px"
                                          >
                                            <Box
                                              transition="0.2s linear"
                                              color={textColor}
                                              borderRadius="8px"
                                              maxW={{
                                                base: "2xl",
                                                lg: "100%"
                                              }}
                                            >
                                              <AlertDialog
                                                isOpen={isOpen}
                                                leastDestructiveRef={cancelRef}
                                                onClose={onClose}
                                              >
                                                <AlertDialogOverlay>
                                                  <AlertDialogContent
                                                    border="2px"
                                                    borderRadius="25px"
                                                    borderColor={borderColor}
                                                    mx={
                                                      isSmallScreen
                                                        ? "20px"
                                                        : "0px"
                                                    }
                                                  >
                                                    <AlertDialogHeader
                                                      fontSize="lg"
                                                      fontWeight="bold"
                                                    >
                                                      Изберете тип диета по
                                                      вашите <br />
                                                      предпочитания.
                                                    </AlertDialogHeader>

                                                    <AlertDialogCloseButton borderRadius="20px" />

                                                    <AlertDialogBody>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="1xl"
                                                          fontWeight="400"
                                                          mt="4px"
                                                        >
                                                          <b>Балансирана:</b>
                                                          <br />
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="sm"
                                                          fontWeight="200"
                                                          mb="10px"
                                                        >
                                                          Балансирано
                                                          разпределение на
                                                          макронутриенти с
                                                          умерени нива на
                                                          протеини, въглехидрати
                                                          и мазнини. Идеална за
                                                          поддържане на
                                                          здравето.
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="1xl"
                                                          fontWeight="400"
                                                          mt="4px"
                                                        >
                                                          <b>
                                                            Ниско съдържание на
                                                            мазнини:
                                                          </b>
                                                          <br />
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="sm"
                                                          fontWeight="200"
                                                          mb="10px"
                                                        >
                                                          Набляга на намаляване
                                                          на приема на мазнини и
                                                          поддържане на
                                                          адекватни нива на
                                                          протеини и
                                                          въглехидрати. Подходящ
                                                          за тези, които се
                                                          стремят да намалят
                                                          общия прием на калории
                                                          и да контролират
                                                          теглото си.
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="1xl"
                                                          fontWeight="400"
                                                          mt="4px"
                                                        >
                                                          <b>
                                                            Ниско съдържание на
                                                            въглехидрати:
                                                          </b>
                                                          <br />
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="sm"
                                                          fontWeight="400"
                                                          mb="10px"
                                                        >
                                                          Фокусира се върху
                                                          минимизиране на приема
                                                          на въглехидрати, като
                                                          същевременно осигурява
                                                          достатъчно протеини и
                                                          здравословни мазнини.
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="1xl"
                                                          fontWeight="400"
                                                          mt="4px"
                                                        >
                                                          <b>
                                                            Високо съдържание на
                                                            протеин:
                                                          </b>
                                                          <br />
                                                        </Text>
                                                      </Flex>
                                                      <Flex align="center">
                                                        <Text
                                                          fontSize="sm"
                                                          fontWeight="400"
                                                        >
                                                          Дава приоритет на
                                                          по-висок прием на
                                                          протеин с умерени нива
                                                          на въглехидрати и
                                                          мазнини. Идеална за
                                                          тези, които искат да
                                                          подпомогнат развитието
                                                          на мускулите, особено
                                                          при силови тренировки
                                                          или фитнес програми.
                                                        </Text>
                                                      </Flex>
                                                    </AlertDialogBody>
                                                    <AlertDialogFooter></AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialogOverlay>
                                              </AlertDialog>
                                            </Box>
                                          </MenuList>
                                        </Menu>
                                      </Flex>
                                      <DietTable
                                        tableData={tableData}
                                        columnsData={[
                                          { name: "name", label: "Тип диета" },
                                          {
                                            name: "protein",
                                            label: "Протеин (гр.)"
                                          },
                                          {
                                            name: "fat",
                                            label: "Мазнини (гр.)"
                                          },
                                          {
                                            name: "carbs",
                                            label: "Въглехидрати (гр.)"
                                          }
                                        ]}
                                        setState={setClickedValueNutrients}
                                        clickedValueProtein={
                                          clickedValueNutrients.protein
                                        }
                                      />
                                    </>
                                  </FadeInWrapper>
                                )}
                            </Card>
                          </FadeInWrapper>
                          {clickedValueNutrients.protein !== null && (
                            <MealPlannerForm
                              chosenCalories={clickedValueCalories}
                              chosenNutrients={clickedValueNutrients}
                              // selectedGoal={selectedGoal}
                              userIntakes={userIntakes}
                              setUserIntakes={setUserIntakes}
                            />
                          )}
                        </FadeInWrapper>
                      ) : (
                        <Box>
                          <Loading />
                          <br />
                        </Box>
                      )}
                    </Box>
                  )}
                  <Alert
                    status="warning"
                    borderRadius="20px"
                    fontWeight={tipFontWeight}
                    p="20px"
                    w="100%"
                    mb="20px"
                  >
                    <AlertIcon />
                    Тези стойности са приблизителни и може да е необходимо
                    преценка от диетолог или здравен специалист, за да се
                    адаптират към индивидуалните ви нужди.
                  </Alert>
                </animated.div>
              </animated.div>
            </Box>
          )}
        </Box>
      </Box>
    </FadeInWrapper>
  );
}
