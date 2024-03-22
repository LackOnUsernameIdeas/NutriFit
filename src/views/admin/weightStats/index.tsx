import React, { useState } from "react";

// Chakra UI components
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Alert,
  AlertIcon,
  Box,
  Flex,
  Icon,
  Text,
  SimpleGrid,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  Menu,
  Image,
  Heading,
  Stack,
  StackDivider,
  Button
} from "@chakra-ui/react";

// React Icons
import { MdOutlineInfo } from "react-icons/md";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// Custom components
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { useSpring, animated } from "react-spring";
import Card from "components/card/Card";
import CardBody from "components/card/Card";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Loading from "views/admin/weightStats/components/Loading";
// Types
import {
  BMIInfo,
  BodyMass,
  UserData,
  WeightDifference
} from "../../../types/weightStats";

import { LineChart } from "components/charts/LineCharts";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { fetchAdditionalUserData } from "../../../database/getAdditionalUserData";
import { parseISO } from "date-fns";
import { firebaseStore } from "database/connection";

// Главен компонент
export default function WeightStats() {
  // Color values
  const { colorMode } = useColorMode();
  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;
  const chartsColor = useColorModeValue("brand.500", "white");
  const fontWeight = useColorModeValue("550", "100");
  const tipFontWeight = useColorModeValue("500", "100");
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
  const textColor = useColorModeValue("black", "white");
  const infoBoxIconColor = useColorModeValue("black", "white");
  const bgList = useColorModeValue("secondaryGray.150", "whiteAlpha.100");
  const borderColor = useColorModeValue("secondaryGray.200", "whiteAlpha.200");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgHoverInfoBox = useColorModeValue(
    { bg: "#C6C7D4" },
    { bg: "whiteAlpha.100" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const cancelRefPerfectWeightAlert = React.useRef();
  const cancelRefStatus = React.useRef();
  const cancelRefBMIAlert = React.useRef();
  const {
    isOpen: isOpenPerfectWeightAlert,
    onOpen: onOpenPerfectWeightAlert,
    onClose: onClosePerfectWeightAlert
  } = useDisclosure();
  const {
    isOpen: isOpenStatus,
    onOpen: onOpenStatus,
    onClose: onCloseStatus
  } = useDisclosure();

  const {
    isOpen: isOpenBMIAlert,
    onOpen: onOpenBMIAlert,
    onClose: onCloseBMIAlert
  } = useDisclosure();

  // State за разкриване на информация за менюто с информация
  const { isOpen: isOpenPerfectWeight, onClose: onClosePerfectWeight } =
    useDisclosure();

  const {
    isOpen: isOpenBMI,
    onOpen: onOpenBMI,
    onClose: onCloseBMI
  } = useDisclosure();

  // States за запазване на извличените данни
  const [BMIIndex, setBMIIndex] = useState<BMIInfo>({
    bmi: null,
    health: "",
    healthy_bmi_range: "18.5 - 25"
  });

  const [bmiChange, setBMIChange] = useState<number | null>(null);
  const [bodyFatChange, setBodyFatChange] = useState<number>(null);
  const [bodyFatMassChange, setBodyFatMassChange] = useState<number | null>(
    null
  );
  const [leanBodyMassChange, setLeanBodyMassChange] = useState<number | null>(
    null
  );
  const [
    differenceFromPerfectWeightChange,
    setDifferenceFromPerfectWeightChange
  ] = useState<number | null>(null);

  const [bodyFatMassAndLeanMass, setBodyFatMassAndLeanMass] =
    useState<BodyMass>({
      "Body Fat (U.S. Navy Method)": 0,
      "Body Fat Mass": 0,
      "Lean Body Mass": 0
    });

  // State за зареждане на страницата
  const [isLoading, setIsLoading] = useState(true);

  // State-ове за потребителски данни
  const [user, setUser] = useState(null);

  const [userData, setUserData] = useState<UserData>({
    gender: "male" || "female",
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    goal: "maintain",
    bmi: 0,
    bodyFat: 0,
    bodyFatMass: 0,
    leanBodyMass: 0,
    differenceFromPerfectWeight: 0
  });

  const [userDataForCharts, setUserDataForCharts] = useState([
    {
      date: "",
      height: 0,
      weight: 0,
      bmi: 0,
      bodyFat: 0,
      bodyFatMass: 0,
      leanBodyMass: 0,
      differenceFromPerfectWeight: 0,
      isUnderOrAbove: ""
    }
  ]);

  userDataForCharts.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0
  );
  const lineChartLabels = userDataForCharts.map((entry) => entry.date);

  const lineChartForKilogramsData = userDataForCharts.map(
    (entry) => entry.weight
  );
  const lineChartForBMI = userDataForCharts.map((entry) => entry.bmi);
  const lineChartForBodyFatData = userDataForCharts.map(
    (entry) => entry.bodyFat
  );
  const lineChartForBodyFatMassData = userDataForCharts.map(
    (entry) => entry.bodyFatMass
  );
  const lineChartForLeanBodyMassData = userDataForCharts.map(
    (entry) => entry.leanBodyMass
  );
  const differenceFromPerfectWeightData = userDataForCharts.map(
    (entry) => entry.differenceFromPerfectWeight
  );
  const isUnderOrAboveData = userDataForCharts.map(
    (entry) => entry.isUnderOrAbove
  );

  const [perfectWeight, setPerfectWeight] = useState<number>(0);
  const [differenceFromPerfectWeight, setDifferenceFromPerfectWeight] =
    useState<WeightDifference>({
      difference: 0,
      isUnderOrAbove: ""
    });

  const lineChartForDifferenceFromPerfectWeightData =
    differenceFromPerfectWeightData.map((difference, index) => {
      // If the user is above perfect weight, keep the difference as is
      if (isUnderOrAboveData[index] === "above") {
        return difference;
      } else {
        // If the user is below perfect weight, make the difference negative
        return -difference;
      }
    });

  const [isGenerateStatsCalled, setIsGenerateStatsCalled] =
    useState<boolean>(false);

  const [userDataLastSavedDate, setUserDataLastSavedDate] = useState("");

  const [dropdownVisible, setDropdownVisible] = React.useState(false);
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const slideAnimationDrop = useSpring({
    opacity: miniStatisticsVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -80}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  const slideAnimation = useSpring({
    transform: `translateY(${dropdownVisible ? -30 : 0}px)`,
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

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const userId = user.uid;
          const additionalDataRef = doc(
            firebaseStore,
            "additionalUserData",
            userId
          );

          // Subscribe to real-time updates using onSnapshot
          const unsubscribeData = onSnapshot(additionalDataRef, (doc) => {
            if (doc.exists()) {
              const additionalData = doc.data();
              const timestampKey = new Date().toISOString().slice(0, 10);

              if (
                additionalData[timestampKey]?.age &&
                additionalData[timestampKey]?.BMI?.bmi &&
                additionalData[timestampKey]?.BodyMassData?.bodyFat
              ) {
                const userDataSaveable: UserData = {
                  gender: additionalData.gender,
                  goal: additionalData.goal,
                  age: additionalData[timestampKey].age,
                  height: additionalData[timestampKey].height,
                  waist: additionalData[timestampKey].waist,
                  neck: additionalData[timestampKey].neck,
                  hip: additionalData[timestampKey].hip,
                  weight: additionalData[timestampKey].weight,
                  bmi: additionalData[timestampKey]?.BMI
                    ? additionalData[timestampKey]?.BMI?.bmi
                    : 0,
                  bodyFat: additionalData[timestampKey]?.BodyMassData
                    ? additionalData[timestampKey]?.BodyMassData?.bodyFat
                    : 0,
                  bodyFatMass: additionalData[timestampKey]?.BodyMassData
                    ? additionalData[timestampKey]?.BodyMassData?.bodyFatMass
                    : 0,
                  leanBodyMass: additionalData[timestampKey]?.BodyMassData
                    ? additionalData[timestampKey]?.BodyMassData?.leanBodyMass
                    : 0,
                  differenceFromPerfectWeight: additionalData[timestampKey]
                    ?.PerfectWeightData
                    ? additionalData[timestampKey]?.PerfectWeightData
                        ?.differenceFromPerfectWeight?.difference
                    : 0
                };
                const bmiData: BMIInfo = {
                  bmi: additionalData[timestampKey]?.BMI
                    ? additionalData[timestampKey]?.BMI?.bmi
                    : 0,
                  health: additionalData[timestampKey]?.BMI
                    ? additionalData[timestampKey]?.BMI?.health
                    : "",
                  healthy_bmi_range: additionalData[timestampKey]?.BMI
                    ? additionalData[timestampKey]?.BMI?.healthy_bmi_range
                    : ""
                };
                const bodyMass: BodyMass = {
                  "Body Fat (U.S. Navy Method)": additionalData[timestampKey]
                    ?.BodyMassData
                    ? additionalData[timestampKey]?.BodyMassData?.bodyFat
                    : 0,
                  "Body Fat Mass": additionalData[timestampKey]?.BodyMassData
                    ? additionalData[timestampKey]?.BodyMassData?.bodyFatMass
                    : 0,
                  "Lean Body Mass": additionalData[timestampKey]?.BodyMassData
                    ? additionalData[timestampKey]?.BodyMassData?.leanBodyMass
                    : 0
                };
                setPerfectWeight(
                  additionalData[timestampKey]?.PerfectWeightData
                    ? additionalData[timestampKey]?.PerfectWeightData
                        ?.perfectWeight
                    : 0
                );
                setDifferenceFromPerfectWeight(
                  additionalData[timestampKey]?.PerfectWeightData
                    ? additionalData[timestampKey]?.PerfectWeightData
                        ?.differenceFromPerfectWeight
                    : {
                        difference: 0,
                        isUnderOrAbove: ""
                      }
                );
                setBMIIndex(bmiData);
                setBodyFatMassAndLeanMass(bodyMass);
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  ...userDataSaveable
                }));

                // Log the updated state in the callback
                setUserData((updatedUserData) => {
                  console.log("Updated userData:", updatedUserData);
                  return updatedUserData;
                });
                console.log("i hate myserlf ----->", userDataSaveable);
                console.log("USERDATA ----> ", userData);

                const userChartData = [];

                for (const key in additionalData) {
                  if (
                    key !== "gender" &&
                    key !== "goal" &&
                    key !== "dailyCaloryRequirements" &&
                    key !== "macroNutrientsData" &&
                    typeof additionalData[key] === "object"
                  ) {
                    const dateData = additionalData[key];
                    userChartData.push({
                      date: key,
                      height: dateData.height,
                      weight: dateData.weight,
                      bmi: dateData.BMI ? dateData.BMI.bmi : undefined,
                      bodyFat: dateData.BodyMassData
                        ? dateData.BodyMassData.bodyFat
                        : undefined,
                      bodyFatMass: dateData.BodyMassData
                        ? dateData.BodyMassData.bodyFatMass
                        : undefined,
                      leanBodyMass: dateData.BodyMassData
                        ? dateData.BodyMassData.leanBodyMass
                        : undefined,
                      differenceFromPerfectWeight: dateData.PerfectWeightData
                        ? dateData.PerfectWeightData.differenceFromPerfectWeight
                            .difference
                        : undefined,
                      isUnderOrAbove: dateData.PerfectWeightData
                        ? dateData.PerfectWeightData.differenceFromPerfectWeight
                            .isUnderOrAbove
                        : undefined
                    });
                  }
                }

                setUserDataForCharts(userChartData);
                setIsLoading(false);
                console.log(
                  "ID: ",
                  user.uid,
                  "Additional user data:",
                  additionalData
                );
                console.log("userChartData:", userChartData);
              }
            }
          });

          // Cleanup the subscription when the component unmounts
          return () => {
            unsubscribeData();
          };
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    });
  }, []);

  const calculateChange = (sortedData: any[], property: string) => {
    const latestValue = sortedData[0][property];
    const previousValue = sortedData[1][property];
    const change = latestValue - previousValue;
    setUserDataLastSavedDate(sortedData[1].date);
    return change;
  };

  const calculateBMIChange = () => {
    // Create an object to store unique entries based on date
    const uniqueEntries: { [date: string]: any } = {};

    // Iterate over userDataForCharts to find the unique entries
    userDataForCharts.forEach((entry) => {
      if (entry.bmi !== 0 && !uniqueEntries[entry.date]) {
        uniqueEntries[entry.date] = {
          bmi: entry.bmi,
          bodyFat: entry.bodyFat,
          bodyFatMass: entry.bodyFatMass,
          leanBodyMass: entry.leanBodyMass,
          differenceFromPerfectWeight: entry.differenceFromPerfectWeight
        };
      }
    });

    // Create an array of entries sorted by date
    const sortedData = Object.entries(uniqueEntries)
      .sort((a, b) => parseISO(b[0]).getTime() - parseISO(a[0]).getTime())
      .map(([date, values]) => ({ date, ...values }));

    if (sortedData.length >= 2) {
      const bmiChange = calculateChange(sortedData, "bmi");
      setBMIChange(bmiChange);

      const bodyFatChange = calculateChange(sortedData, "bodyFat");
      setBodyFatChange(bodyFatChange);

      const bodyFatMassChange = calculateChange(sortedData, "bodyFatMass");
      setBodyFatMassChange(bodyFatMassChange);

      const leanBodyMassChange = calculateChange(sortedData, "leanBodyMass");
      setLeanBodyMassChange(leanBodyMassChange);

      const differenceFromPerfectWeightChange = calculateChange(
        sortedData,
        "differenceFromPerfectWeight"
      );
      setDifferenceFromPerfectWeightChange(differenceFromPerfectWeightChange);

      console.log("the last two entries for BMI222222: ", sortedData);
      console.log(
        "all changes: ",
        bmiChange,
        bodyFatChange,
        bodyFatMassChange,
        leanBodyMassChange,
        differenceFromPerfectWeightChange
      );
    } else {
      setBMIChange(null);
    }
  };

  React.useEffect(() => {
    calculateBMIChange();
  }, [userDataForCharts]);

  // Функция за генериране на статистики
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
      case "weightlose":
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

  React.useEffect(() => {
    // Check if numeric values in userData are different from 0 and not null
    const areValuesValid =
      Object.values(userData).every((value) => value !== 0) &&
      perfectWeight !== 0;

    if (areValuesValid) {
      setIsGenerateStatsCalled(true);
    }
  }, [userData]);

  // TODO: Make this work

  // const [userDataForToday, setUserDataForToday] = useState(null);
  // const [userDataLastSavedDate, setUserDataLastSavedDate] = useState(null);
  // const [isTodaysDataFetched, setIsTodaysDataFetched] =
  //   useState<boolean>(false);
  // const isMounted = useRef(true);
  // React.useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (isMounted.current) {
  //       setUser(user);
  //     }

  //     if (user) {
  //       try {
  //         setIsLoading(true);

  //         const additionalData = await fetchAdditionalUserData(user.uid);

  //         // Extract date keys from additionalData
  //         const dateKeys = Object.keys(additionalData).filter((key) =>
  //           /^\d{4}-\d{2}-\d{2}$/.test(key)
  //         );

  //         // Sort date keys in descending order
  //         dateKeys.sort(
  //           (a, b) => new Date(b).getTime() - new Date(a).getTime()
  //         );

  //         // Find the first date before today
  //         const today = new Date().toISOString().slice(0, 10);
  //         const lastSavedDate = dateKeys.find((date) => date < today);
  //         const rawUserDataForToday = additionalData[today];
  //         const rawUserDataForLastSavedDate = additionalData[lastSavedDate];

  //         if (isMounted.current) {
  //           setUserDataLastSavedDate(rawUserDataForLastSavedDate);
  //           setUserDataForToday(rawUserDataForToday);
  //           setIsTodaysDataFetched(true);
  //         }

  //         setTimeout(() => {
  //           setIsLoading(false);
  //         }, 1000);
  //       } catch (error) {
  //         console.error("Error fetching additional user data:", error);
  //       }
  //     }
  //   });

  //   return () => {
  //     isMounted.current = false;
  //     unsubscribe();
  //   };
  // }, []);

  // const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  // React.useEffect(() => {
  //   if (userDataForToday && userDataLastSavedDate) {
  //     const commonKeys = Object.keys(userDataForToday).filter((key) =>
  //       Object.keys(userDataLastSavedDate).includes(key)
  //     );

  //     const differentFields = commonKeys.filter(
  //       (key) => userDataForToday[key] !== userDataLastSavedDate[key]
  //     );

  //     setHighlightedFields(
  //       differentFields.map((field) => `${field}Highlighted`)
  //     );
  //   }
  // }, [userDataForToday, userDataLastSavedDate]);

  // Масиви с преведени имена

  const bmiData: string[] = [
    "ИТМ(Индекс на телесната маса)",
    "Състояние",
    "Диапазон на здравословен ИТМ"
  ];
  const bodyFatAndLeanMassWidgetsData: string[] = [
    "% телесни мазнини",
    "Мастна телесна маса",
    "Чиста телесна маса"
  ];
  const bodyFatAndLeanMassWidgetsUnits: string[] = ["%", "kg", "kg"];

  const [isSmallScreen] = useMediaQuery("(max-width: 767px)");

  return (
    <FadeInWrapper>
      <Box
        pt={{ base: "130px", md: "80px", xl: "80px" }}
        style={{ overflow: "hidden" }}
      >
        {isLoading || !isGenerateStatsCalled ? (
          <Box
            mt="37vh"
            minH="600px"
            opacity={isLoading || !isGenerateStatsCalled ? 1 : 0}
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
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
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
                      Колко е вашият Индекс на Телесна Маса:
                    </Text>
                    <Menu isLazy isOpen={isOpenBMI} onClose={onCloseBMI}>
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
                        onClick={onOpenBMI}
                        borderRadius="20px"
                        ml="10px"
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
                        maxW={{ base: "60%", lg: "80%" }}
                        border="1px"
                        borderColor={borderColor}
                        backdropFilter="blur(100px)"
                        bg={bgList}
                        borderRadius="20px"
                        p="15px"
                      >
                        <Box
                          transition="0.2s linear"
                          color={textColor}
                          p="0px"
                          maxW={{ base: "100%", lg: "100%" }}
                          borderRadius="8px"
                        >
                          <MenuItem
                            onClick={onOpenBMIAlert}
                            borderRadius="20px"
                            _hover={bgHover}
                            _focus={bgFocus}
                            _active={bgFocus}
                          >
                            <Text fontSize="1xl" fontWeight="400">
                              Какво е Индекс на Телесната Маса?
                            </Text>
                          </MenuItem>
                          <MenuItem
                            onClick={onOpenStatus}
                            borderRadius="20px"
                            _hover={bgHover}
                            _focus={bgFocus}
                            _active={bgFocus}
                          >
                            <Text fontSize="1xl" fontWeight="400">
                              Видовете състояние според ИТМ
                            </Text>
                          </MenuItem>
                        </Box>
                      </MenuList>
                    </Menu>
                    <AlertDialog
                      isOpen={isOpenBMIAlert}
                      leastDestructiveRef={cancelRefBMIAlert}
                      onClose={onCloseBMIAlert}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent
                          border="2px"
                          borderRadius="25px"
                          borderColor={borderColor}
                          mx="20px"
                        >
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Какво е Индекс на Телесната Маса?
                          </AlertDialogHeader>

                          <AlertDialogCloseButton borderRadius="20px" />

                          <AlertDialogBody>
                            <b>Индексът на телесната маса(ИТМ)</b> e
                            медико-биологичен показател, който служи за
                            определяне на нормалното, здравословно тегло при
                            хора с различен ръст и за диагностициране на
                            затлъстяване и недохранване. Индексът на телесната
                            маса се измерва в килограми на квадратен метър и се
                            определя по следната формула:
                            <br />
                            <Image
                              src="https://wikimedia.org/api/rest_v1/media/math/render/svg/75508e7ad0fc780453684deec6aab53ea630ece7"
                              alt="Dan Abramov"
                            />
                            <b>BMI</b> - индекс на телесната маса
                            <br /> <b>W</b> - тегло в килограми
                            <br /> <b>h</b> - височина в метри
                          </AlertDialogBody>
                          <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                    <AlertDialog
                      isOpen={isOpenStatus}
                      leastDestructiveRef={cancelRefStatus}
                      onClose={onCloseStatus}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent
                          border="2px"
                          borderRadius="25px"
                          borderColor={borderColor}
                          mx="20px"
                        >
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Видовете състояние според ИТМ:
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
                                <b>• Сериозно недохранване</b> - Този статус
                                показва тежък недостиг на хранителни вещества,
                                което може да доведе до сериозни проблеми със
                                здравето и отслабване на организма.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Средно недохранване</b> - Този статус
                                показва недостиган на хранителни вещества на
                                умерено ниво, което може да води до отслабване и
                                различни проблеми със здравето.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Леко недохранване</b> - В тази категория
                                теглото е леко под нормата, което може да
                                създаде проблеми със здравето и да наложи
                                корекции в хранителния режим.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Нормално</b> - Тази категория отразява
                                здравословно тегло в съответствие с височината.
                                Хора в тази категория имат по-нисък риск от
                                различни здравословни проблеми, свързани с
                                теглото.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Наднормено тегло</b> - В тази категория
                                теглото е над нормалната граница, което може да
                                повиши риска от заболявания, свързани със
                                здравето, като диабет и сърдечно-съдови
                                заболявания.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Затлъстяване I Клас</b> - Теглото е
                                значително повишено, като този статус може да
                                увеличи риска от сериозни здравословни проблеми.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Затлъстяване II Клас</b> - Тук има по-висок
                                риск от здравословни проблеми в сравнение с
                                предишната категория. Затлъстяването става
                                по-значително.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Затлъстяване III Клас</b> - Този клас
                                показва екстремно затлъстяване, което може да
                                предизвика сериозни здравословни проблеми и
                                изисква внимание от специалист в
                                здравеопазването.
                              </Text>
                            </Flex>
                          </AlertDialogBody>
                          <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
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
                      Колко е вашият Индекс на Телесна Маса:
                    </Text>
                    <Menu isOpen={isOpenBMI} onClose={onCloseBMI}>
                      <MenuButton
                        alignItems="center"
                        justifyContent="center"
                        bg={bgButton}
                        _hover={bgHoverInfoBox}
                        _focus={bgFocus}
                        _active={bgFocus}
                        width="30px" // Use "width" instead of "w"
                        maxWidth="30px" // Use "maxWidth" instead of "maxW"
                        height="30px" // Set the height property as well
                        lineHeight="50%"
                        borderRadius="20px"
                        ml="10px"
                        onClick={isOpenBMI ? onCloseBMI : onOpenBMI}
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
                        maxW={{ base: "60%", lg: "80%" }}
                        border="1px"
                        borderColor={borderColor}
                        backdropFilter="blur(100px)"
                        bg={bgList}
                        borderRadius="20px"
                        p="15px"
                      >
                        <Box
                          transition="0.2s linear"
                          color={textColor}
                          p="0px"
                          maxW={{ base: "100%", lg: "100%" }}
                          borderRadius="8px"
                        >
                          <MenuItem
                            onClick={onOpenBMIAlert}
                            borderRadius="20px"
                            _hover={bgHover}
                            _focus={bgFocus}
                            _active={bgFocus}
                          >
                            <Text fontSize="1xl" fontWeight="400">
                              Какво е Индекс на Телесната Маса?
                            </Text>
                          </MenuItem>
                          <MenuItem
                            onClick={onOpenStatus}
                            borderRadius="20px"
                            _hover={bgHover}
                            _focus={bgFocus}
                            _active={bgFocus}
                          >
                            <Text fontSize="1xl" fontWeight="400">
                              Видовете състояние според ИТМ
                            </Text>
                          </MenuItem>
                        </Box>
                      </MenuList>
                    </Menu>

                    <AlertDialog
                      isOpen={isOpenBMIAlert}
                      leastDestructiveRef={cancelRefBMIAlert}
                      onClose={onCloseBMIAlert}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent
                          border="2px"
                          borderRadius="25px"
                          borderColor={borderColor}
                        >
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Какво е Индекс на Телесната Маса?
                          </AlertDialogHeader>

                          <AlertDialogCloseButton borderRadius="20px" />

                          <AlertDialogBody>
                            <b>Индексът на телесната маса(ИТМ)</b> e
                            медико-биологичен показател, който служи за
                            определяне на нормалното, здравословно тегло при
                            хора с различен ръст и за диагностициране на
                            затлъстяване и недохранване. Индексът на телесната
                            маса се измерва в килограми на квадратен метър и се
                            определя по следната формула:
                            <br />
                            <Image
                              src="https://wikimedia.org/api/rest_v1/media/math/render/svg/75508e7ad0fc780453684deec6aab53ea630ece7"
                              alt="Dan Abramov"
                            />
                            <b>BMI</b> - индекс на телесната маса
                            <br /> <b>W</b> - тегло в килограми
                            <br /> <b>h</b> - височина в метри
                          </AlertDialogBody>
                          <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>

                    <AlertDialog
                      isOpen={isOpenStatus}
                      leastDestructiveRef={cancelRefStatus}
                      onClose={onCloseStatus}
                    >
                      <AlertDialogOverlay>
                        <AlertDialogContent
                          border="2px"
                          borderRadius="25px"
                          borderColor={borderColor}
                          mx="20px"
                        >
                          <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Видовете състояние според ИТМ:
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
                                <b>• Сериозно недохранване</b> - Този статус
                                показва тежък недостиг на хранителни вещества,
                                което може да доведе до сериозни проблеми със
                                здравето и отслабване на организма.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Средно недохранване</b> - Този статус
                                показва недостиган на хранителни вещества на
                                умерено ниво, което може да води до отслабване и
                                различни проблеми със здравето.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Леко недохранване</b> - В тази категория
                                теглото е леко под нормата, което може да
                                създаде проблеми със здравето и да наложи
                                корекции в хранителния режим.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Нормално</b> - Тази категория отразява
                                здравословно тегло в съответствие с височината.
                                Хора в тази категория имат по-нисък риск от
                                различни здравословни проблеми, свързани с
                                теглото.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Наднормено тегло</b> - В тази категория
                                теглото е над нормалната граница, което може да
                                повиши риска от заболявания, свързани със
                                здравето, като диабет и сърдечно-съдови
                                заболявания.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Затлъстяване I Клас</b> - Теглото е
                                значително повишено, като този статус може да
                                увеличи риска от сериозни здравословни проблеми.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Затлъстяване II Клас</b> - Тук има по-висок
                                риск от здравословни проблеми в сравнение с
                                предишната категория. Затлъстяването става
                                по-значително.
                              </Text>
                            </Flex>
                            <Flex align="center">
                              <Text
                                fontSize="sm"
                                fontWeight="400"
                                mt="10px"
                                mb="5px"
                              >
                                <b>• Затлъстяване III Клас</b> - Този клас
                                показва екстремно затлъстяване, което може да
                                предизвика сериозни здравословни проблеми и
                                изисква внимание от специалист в
                                здравеопазването.
                              </Text>
                            </Flex>
                          </AlertDialogBody>
                          <AlertDialogFooter></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialogOverlay>
                    </AlertDialog>
                  </Flex>
                </>
              )}
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                gap="20px"
                mb="10px"
              >
                {Object.entries(BMIIndex).map(([key, value], index) => (
                  <MiniStatistics
                    key={key}
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
                    name={bmiData[index]}
                    growth={
                      key == "bmi" && bmiChange
                        ? bmiChange > 0
                          ? `+${bmiChange.toFixed(2)}`
                          : null
                        : null
                    }
                    decrease={
                      key == "bmi" && bmiChange
                        ? bmiChange < 0
                          ? `${bmiChange.toFixed(2)}`
                          : null
                        : null
                    }
                    neutral={
                      key == "bmi" && bmiChange == 0
                        ? bmiChange == 0
                          ? `${"0.00"}`
                          : null
                        : null
                    }
                    subtext={`в сравнение с ${userDataLastSavedDate}`}
                    value={value}
                  />
                ))}
              </SimpleGrid>
            </Card>
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
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
                      Колко е вашето перфектно тегло:
                    </Text>
                    <Menu
                      isOpen={isOpenPerfectWeight}
                      onClose={onClosePerfectWeight}
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
                        onClick={onOpenPerfectWeightAlert}
                        borderRadius="20px"
                        ml="10px"
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
                        maxW={{ base: "50%", lg: "80%" }}
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
                            isOpen={isOpenPerfectWeightAlert}
                            leastDestructiveRef={cancelRefPerfectWeightAlert}
                            onClose={onClosePerfectWeightAlert}
                          >
                            <AlertDialogOverlay>
                              <AlertDialogContent
                                border="2px"
                                borderRadius="25px"
                                borderColor={borderColor}
                                mx={isSmallScreen ? "20px" : "0px"}
                              >
                                <AlertDialogHeader
                                  fontSize="lg"
                                  fontWeight="bold"
                                >
                                  Перфектното тегло е калкулация, която се
                                  определя по формулата "Дивайн" както следва:
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
                                      Мъже: 50.0 кг + 2.3 кг за всеки инч (2.54
                                      см) над 5 фута (30.48см)
                                    </Text>
                                  </Flex>
                                  <Flex align="center">
                                    <Text
                                      fontSize="sm"
                                      fontWeight="400"
                                      mt="10px"
                                      mb="5px"
                                    >
                                      Жени: 45.5 кг + 2.3 кг за всеки инч (2.54
                                      см) над 5 фута (30.48см)
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
                      Колко е вашето перфектно тегло:
                    </Text>
                    <Menu
                      isOpen={isOpenPerfectWeight}
                      onClose={onClosePerfectWeight}
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
                        onClick={onOpenPerfectWeightAlert}
                        borderRadius="20px"
                        ml="10px"
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
                        maxW={{ base: "50%", lg: "80%" }}
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
                            isOpen={isOpenPerfectWeightAlert}
                            leastDestructiveRef={cancelRefPerfectWeightAlert}
                            onClose={onClosePerfectWeightAlert}
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
                                  Перфектното тегло е калкулация, която се
                                  определя по формулата "Дивайн" както следва:
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
                                      Мъже: 50.0 кг + 2.3 кг за всеки инч (2.54
                                      см) над 5 фута (30.48см)
                                    </Text>
                                  </Flex>
                                  <Flex align="center">
                                    <Text
                                      fontSize="sm"
                                      fontWeight="400"
                                      mt="10px"
                                      mb="5px"
                                    >
                                      Жени: 45.5 кг + 2.3 кг за всеки инч (2.54
                                      см) над 5 фута (30.48см)
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
              <SimpleGrid
                ml={{ sm: "0", lg: "14%" }}
                columns={{ base: 1, md: 2, lg: 3 }}
                gap="20px"
                mb="10px"
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
                    Math.abs(differenceFromPerfectWeight.difference).toFixed(
                      2
                    ) + " kg"
                  }
                  growth={
                    differenceFromPerfectWeightChange
                      ? differenceFromPerfectWeightChange > 0
                        ? `+${differenceFromPerfectWeightChange.toFixed(2)}`
                        : null
                      : null
                  }
                  decrease={
                    differenceFromPerfectWeightChange
                      ? differenceFromPerfectWeightChange < 0
                        ? `${differenceFromPerfectWeightChange.toFixed(2)}`
                        : null
                      : null
                  }
                  neutral={
                    differenceFromPerfectWeightChange == 0
                      ? differenceFromPerfectWeightChange == 0
                        ? `${"0.00"}`
                        : null
                      : null
                  }
                  subtext={`в сравнение с ${userDataLastSavedDate}`}
                />
              </SimpleGrid>
            </Card>
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
              mb="20px"
            >
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Колко от вашето тегло е :
              </Text>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                gap="20px"
                mb="10px"
              >
                {Object.entries(bodyFatMassAndLeanMass).map(
                  ([key, value], index) => (
                    <MiniStatistics
                      key={key}
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
                      name={bodyFatAndLeanMassWidgetsData[index]}
                      value={
                        value + " " + bodyFatAndLeanMassWidgetsUnits[index]
                      }
                      growth={
                        key === "Body Fat (U.S. Navy Method)" && bodyFatChange
                          ? bodyFatChange > 0
                            ? `+${bodyFatChange.toFixed(2)}`
                            : null
                          : key === "Body Fat Mass" && bodyFatMassChange
                          ? bodyFatMassChange > 0
                            ? `+${bodyFatMassChange.toFixed(2)}`
                            : null
                          : key === "Lean Body Mass" && leanBodyMassChange
                          ? leanBodyMassChange > 0
                            ? `+${leanBodyMassChange.toFixed(2)}`
                            : null
                          : null
                      }
                      decrease={
                        key === "Body Fat (U.S. Navy Method)" && bodyFatChange
                          ? bodyFatChange < 0
                            ? `${bodyFatChange.toFixed(2)}`
                            : null
                          : key === "Body Fat Mass" && bodyFatMassChange
                          ? bodyFatMassChange < 0
                            ? `${bodyFatMassChange.toFixed(2)}`
                            : null
                          : key === "Lean Body Mass" && leanBodyMassChange
                          ? leanBodyMassChange < 0
                            ? `${leanBodyMassChange.toFixed(2)}`
                            : null
                          : null
                      }
                      neutral={
                        key === "Body Fat (U.S. Navy Method)" &&
                        bodyFatChange == 0
                          ? bodyFatChange == 0
                            ? `${"0.00"}`
                            : null
                          : key === "Body Fat Mass" && bodyFatMassChange == 0
                          ? bodyFatMassChange == 0
                            ? `${"0.00"}`
                            : null
                          : key === "Lean Body Mass" && leanBodyMassChange == 0
                          ? leanBodyMassChange == 0
                            ? `${"0.00"}`
                            : null
                          : null
                      }
                      subtext={`в сравнение с ${userDataLastSavedDate}`}
                    />
                  )
                )}
              </SimpleGrid>
            </Card>
            <Card
              onClick={handleDropdownToggle}
              cursor="pointer"
              zIndex="1"
              position="relative"
              bg={dropdownVisible ? dropdownActiveBoxBg : dropdownBoxBg}
              transition="background-image 0.5s ease-in-out"
              mb={renderDropdown ? "0px" : "20px"}
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
                    <b>Статистики за вашето телесно изменение:</b>
                  ) : (
                    "Статистики за вашето телесно изменение:"
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
                    columns={{ base: 1, md: 2, xl: 2 }}
                    gap="20px"
                    mt="50px"
                  >
                    <Card
                      fontSize="3xl"
                      maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                      p="20px" // Add padding to the card
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      Вашето тегло (кг.)
                    </Card>
                    {!isSmallScreen && (
                      <Card
                        fontSize="3xl"
                        maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                        p="20px" // Add padding to the card
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                      >
                        Вашият Индекс на Телесна Маса
                      </Card>
                    )}
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      h="100%"
                      w="100%"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      maxH={{ sm: "100px", md: "300px", lg: "auto" }}
                    >
                      <LineChart
                        lineChartLabels={lineChartLabels}
                        lineChartData={lineChartForKilogramsData}
                        lineChartLabelName="Изменение на тегло(кг)"
                        textColor={chartsColor}
                        color="rgba(67,24,255,1)"
                      />
                    </Card>
                    {isSmallScreen && (
                      <Card
                        fontSize="3xl"
                        maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                        p="20px" // Add padding to the card
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                      >
                        Вашият Индекс на Телесна Маса
                      </Card>
                    )}
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      h="100%"
                      w="100%"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      maxH={{ sm: "150px", md: "300px", lg: "auto" }}
                    >
                      <LineChart
                        lineChartLabels={lineChartLabels}
                        lineChartData={lineChartForBMI}
                        lineChartLabelName="Изменение на ИТМ(Индекс на Телесна Маса)"
                        textColor={chartsColor}
                        color="rgba(67,24,255,1)"
                      />
                    </Card>
                    <Card
                      fontSize="3xl"
                      maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                      p="20px" // Add padding to the card
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      Вашият % телесни мазнини
                    </Card>
                    {!isSmallScreen && (
                      <Card
                        fontSize="3xl"
                        maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                        p="20px" // Add padding to the card
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                      >
                        Вашата мастна телесна маса (кг.)
                      </Card>
                    )}
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      h="100%"
                      w="100%"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      maxH={{ sm: "150px", md: "300px", lg: "auto" }}
                    >
                      <LineChart
                        lineChartLabels={lineChartLabels}
                        lineChartData={lineChartForBodyFatData}
                        lineChartLabelName="Изменение на % телесни мазнини"
                        textColor={chartsColor}
                        color="#7c6bff"
                      />
                    </Card>
                    {isSmallScreen && (
                      <Card
                        fontSize="3xl"
                        maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                        p="20px" // Add padding to the card
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                      >
                        Вашата мастна телесна маса (кг.)
                      </Card>
                    )}
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      h="100%"
                      w="100%"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      maxH={{ sm: "150px", md: "300px", lg: "auto" }}
                    >
                      <LineChart
                        lineChartLabels={lineChartLabels}
                        lineChartData={lineChartForBodyFatMassData}
                        lineChartLabelName="Изменение на мастна телесна маса"
                        textColor={chartsColor}
                        color="#7c6bff"
                      />
                    </Card>
                    <Card
                      fontSize="3xl"
                      maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                      p="20px" // Add padding to the card
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      Вашата чиста телесна маса (кг.)
                    </Card>
                    {!isSmallScreen && (
                      <Card
                        fontSize="3xl"
                        maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                        p="20px" // Add padding to the card
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        fontWeight="500"
                      >
                        Теглото ви под/над нормата (кг.)
                      </Card>
                    )}
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      h="100%"
                      w="100%"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      maxH={{ sm: "150px", md: "300px", lg: "auto" }}
                    >
                      <LineChart
                        lineChartLabels={lineChartLabels}
                        lineChartData={lineChartForLeanBodyMassData}
                        lineChartLabelName="Изменение на чиста телесна маса"
                        textColor={chartsColor}
                        color="#a194ff"
                      />
                    </Card>
                    {isSmallScreen && (
                      <Card
                        fontSize="3xl"
                        maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                        p="20px" // Add padding to the card
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexDirection="column"
                        fontWeight="500"
                      >
                        Теглото ви под/над нормата (кг.)
                      </Card>
                    )}
                    <Card
                      alignItems="center"
                      flexDirection="column"
                      h="100%"
                      w="100%"
                      minH={{ sm: "400px", md: "300px", lg: "300px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      maxH={{ sm: "150px", md: "300px", lg: "auto" }}
                    >
                      <LineChart
                        lineChartLabels={lineChartLabels}
                        lineChartData={
                          lineChartForDifferenceFromPerfectWeightData
                        }
                        lineChartLabelName={`Изменение в килограмите ви под/над нормата`}
                        textColor={chartsColor}
                        color="#a194ff"
                      />
                    </Card>
                  </SimpleGrid>
                </Card>
              </animated.div>
            )}
            <animated.div style={{ ...slideAnimation, position: "relative" }}>
              <Alert
                status="warning"
                borderRadius="20px"
                fontWeight={tipFontWeight}
                p="20px"
                w="100%"
                mb="20px"
              >
                <AlertIcon />
                Тези стойности са приблизителни и може да е необходимо преценка
                от диетолог или здравен специалист, за да се адаптират към
                индивидуалните ви нужди.
              </Alert>
            </animated.div>
          </Box>
        )}
      </Box>
    </FadeInWrapper>
  );
}
