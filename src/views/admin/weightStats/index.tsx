import React, { useState, useRef } from "react";

// Chakra UI components
import {
  Box,
  Flex,
  Icon,
  Text,
  SimpleGrid,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Menu,
  Image,
  Heading,
  Stack,
  StackDivider
} from "@chakra-ui/react";

// React Icons
import { MdOutlineInfo } from "react-icons/md";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";
// Custom components
import Card from "components/card/Card";
import CardHeader from "components/card/Card";
import CardBody from "components/card/Card";

import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Loading from "./components/Loading";
import { HSeparator } from "components/separator/Separator";
// Types
import {
  BMIInfo,
  BodyMass,
  UserData,
  Goal,
  WeightDifference
} from "../../../types/weightStats";

import { lineChartOptions } from "variables/chartjs";
import LineChart from "components/charts/LineChart";

// Помощни функции за извличане на данни
import {
  fetchBMIData,
  fetchPerfectWeightData,
  fetchBodyFatAndLeanMassData
} from "./utils/fetchFunctions";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchAdditionalUserData } from "../../../database/getAdditionalUserData";
import {
  saveBMI,
  savePerfectWeight,
  saveBodyMass
} from "../../../database/setWeightStatsData";

import { parseISO, differenceInDays } from "date-fns";

// Главен компонент
export default function WeightStats() {
  // Color values
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("black", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("white", "whiteAlpha.100");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const [showITM, setShowITM] = useState(false);

  // Function to toggle the display of raw data
  const toggleITM = () => {
    setShowITM(!showITM);
  };

  const [showStatus, setShowStatus] = useState(false);

  // Function to toggle the display of raw data
  const toggleStatus = () => {
    setShowStatus(!showStatus);
  };
  // State за разкриване на информация за менюто с информация
  const {
    isOpen: isOpenPerfectWeight,
    onOpen: onOpenPerfectWeight,
    onClose: onClosePerfectWeight
  } = useDisclosure();

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
  const [bodyFatChange, setBodyFatChange] = useState<number | null>(null);
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
  const [isLoading, setIsLoading] = useState(false);

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
      differenceFromPerfectWeight: 0
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
  const lineChartForDifferenceFromPerfectWeightData = userDataForCharts.map(
    (entry) => entry.differenceFromPerfectWeight
  );

  const [perfectWeight, setPerfectWeight] = useState<number>(0);
  const [differenceFromPerfectWeight, setDifferenceFromPerfectWeight] =
    useState<WeightDifference>({
      difference: 0,
      isUnderOrAbove: ""
    });

  const [isGenerateStatsCalled, setIsGenerateStatsCalled] =
    useState<boolean>(false);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const timestampKey = new Date().toISOString().slice(0, 10);

          const additionalData = await fetchAdditionalUserData(user.uid);
          setUserData({
            gender: additionalData.gender,
            goal: additionalData.goal,
            age: additionalData[timestampKey].age,
            height: additionalData[timestampKey].height,
            waist: additionalData[timestampKey].waist,
            neck: additionalData[timestampKey].neck,
            hip: additionalData[timestampKey].hip,
            weight: additionalData[timestampKey].weight,
            bmi: additionalData[timestampKey].BMIData
              ? additionalData[timestampKey].BMIData.bmi
              : undefined,
            bodyFat: additionalData[timestampKey].BodyMassData
              ? additionalData[timestampKey].BodyMassData.bodyFat
              : undefined,
            bodyFatMass: additionalData[timestampKey].BodyMassData
              ? additionalData[timestampKey].BodyMassData.bodyFatMass
              : undefined,
            leanBodyMass: additionalData[timestampKey].BodyMassData
              ? additionalData[timestampKey].BodyMassData.leanBodyMass
              : undefined,
            differenceFromPerfectWeight: additionalData[timestampKey]
              .PerfectWeightData
              ? additionalData[timestampKey].PerfectWeightData
                  .differenceFromPerfectWeight.difference
              : undefined
          } as any);

          console.log(additionalData, "additionalData");
          const userChartData = [];

          for (const key in additionalData) {
            if (
              key !== "gender" &&
              key !== "goal" &&
              typeof additionalData[key] === "object"
            ) {
              const dateData = additionalData[key];
              userChartData.push({
                date: key,
                height: dateData.height,
                weight: dateData.weight,
                bmi: dateData.BMIData ? dateData.BMIData.bmi : undefined,
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
                  : undefined
              });
            }
          }

          setUserDataForCharts(userChartData);
          console.log(
            "ID: ",
            user.uid,
            "Additional user data:",
            additionalData
          );
          console.log("userChartData:", userChartData);
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const calculateChange = (sortedData: any[], property: string) => {
    const latestValue = sortedData[0][property];
    const previousValue = sortedData[1][property];
    const change = latestValue - previousValue;
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
      setDifferenceFromPerfectWeightChange(
        Math.abs(differenceFromPerfectWeightChange)
      );

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
  function generateStats() {
    fetchBMIData(
      userData["age"],
      userData["height"],
      userData["weight"],
      setBMIIndex
    );
    fetchPerfectWeightData(
      userData["height"],
      userData["gender"],
      setPerfectWeight
    );
    fetchBodyFatAndLeanMassData(
      userData["age"],
      userData["gender"],
      userData["height"],
      userData["weight"],
      userData["neck"],
      userData["waist"],
      userData["hip"],
      setBodyFatMassAndLeanMass
    );
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

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
    const diff = perfectWeight - userData.weight;
    setDifferenceFromPerfectWeight({
      difference: Math.abs(diff),
      isUnderOrAbove: userData.weight > perfectWeight ? "above" : "under"
    });
  }, [perfectWeight, userData]);

  React.useEffect(() => {
    // Check if numeric values in userData are different from 0 and not null
    const areValuesValid = Object.values(userData).every(
      (value) => value !== 0
    );

    if (areValuesValid) {
      generateStats();
      setIsGenerateStatsCalled(true);
    }
  }, [userData]);

  React.useEffect(() => {
    const saveBMIData = async () => {
      try {
        const { bmi, health, healthy_bmi_range } = BMIIndex;
        const uid = getAuth().currentUser.uid;
        await saveBMI(uid, bmi, health, healthy_bmi_range);

        console.log("BMI data saved successfully!");
      } catch (error) {
        console.error("Error saving BMI data:", error);
      }
    };

    if (BMIIndex.bmi !== null) {
      saveBMIData();
    }
  }, [BMIIndex]);

  // useEffect to handle Perfect Weight data saving
  React.useEffect(() => {
    const savePerfectWeightData = async () => {
      try {
        const perfect = perfectWeight;
        const difference = differenceFromPerfectWeight;
        const uid = getAuth().currentUser.uid;
        await savePerfectWeight(uid, perfect, difference);

        console.log("Perfect Weight data saved successfully!");
      } catch (error) {
        console.error("Error saving Perfect Weight data:", error);
      }
    };

    if (perfectWeight !== 0) {
      savePerfectWeightData();
    }
  }, [perfectWeight, differenceFromPerfectWeight]);

  // useEffect to handle Body Mass data saving
  React.useEffect(() => {
    const saveBodyMassData = async () => {
      try {
        const {
          "Body Fat (U.S. Navy Method)": bodyFat,
          "Body Fat Mass": bodyFatMass,
          "Lean Body Mass": leanBodyMass
        } = bodyFatMassAndLeanMass;
        const uid = getAuth().currentUser.uid;

        await saveBodyMass(uid, bodyFat, bodyFatMass, leanBodyMass);

        console.log("Body Mass data saved successfully!");
      } catch (error) {
        console.error("Error saving Body Mass data:", error);
      }
    };

    if (bodyFatMassAndLeanMass["Body Fat (U.S. Navy Method)"] !== 0) {
      saveBodyMassData();
    }
  }, [bodyFatMassAndLeanMass]);
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

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      style={{ overflow: "hidden" }}
    >
      {isLoading || !isGenerateStatsCalled ? (
        <Loading />
      ) : (
        <Box>
          <Card
            p="20px"
            alignItems="center"
            flexDirection="column"
            w="100%"
            mb="20px"
          >
            <CardHeader>
              <Heading size="md">Вашите данни:</Heading>
            </CardHeader>
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Години:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {userData.age}
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Пол:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {mapGenderToDisplayValue(userData.gender)}
                  </Text>
                </Box>
                {userData.goal && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Цел:
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {mapGoalToDisplayValue(userData.goal)}
                    </Text>
                  </Box>
                )}
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Височина:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {userData.height} (см)
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Тегло:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {userData.weight} (кг)
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Обиколка на врата:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {userData.neck} (см)
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Обиколка на талията:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {userData.waist} (см)
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Обиколка на таза:
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {userData.hip} (см)
                  </Text>
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
            <Flex justifyContent="space-between" align="center">
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Колко е вашият Индекс на Телесна Маса :
              </Text>
              <Menu isOpen={isOpenPerfectWeight} onClose={onClosePerfectWeight}>
                <MenuButton
                  alignItems="center"
                  justifyContent="center"
                  bg={bgButton}
                  _hover={bgHover}
                  _focus={bgFocus}
                  _active={bgFocus}
                  w="30px"
                  h="30px"
                  lineHeight="50%"
                  onClick={onOpenPerfectWeight}
                  borderRadius="10px"
                  ml="20px"
                >
                  <Icon
                    as={MdOutlineInfo}
                    color={iconColor}
                    w="24px"
                    h="24px"
                  />
                </MenuButton>
                <MenuList
                  w="100%"
                  minW="unset"
                  ml={{ base: "2%", lg: 0 }}
                  mr={{ base: "2%", lg: 0 }}
                  maxW={{ base: "23%", lg: "80%" }}
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
                    <Flex align="center">
                      <Text fontSize="1xl" fontWeight="400">
                        Какво е Индекс на Телесната Маса?
                      </Text>
                    </Flex>
                    <HSeparator />
                    <br></br>
                    <Flex align="center">
                      <Text fontSize="1xl" fontWeight="400">
                        Видовете състояние според ИТМ могат да бъдат:
                      </Text>
                    </Flex>
                    <MenuItem onClick={toggleITM}>
                      <Text fontSize="1xl" fontWeight="400">
                        {showITM ? "Hide Raw Data" : "Show Raw Data"}
                      </Text>
                    </MenuItem>
                    {showITM && (
                      <>
                        <HSeparator />
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            Индексът на телесната маса(ИТМ) e медико-биологичен
                            показател, който служи за определяне на нормалното,
                            здравословно тегло при хора с различен ръст и за
                            диагностициране на затлъстяване и недохранване.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            Индексът на телесната маса се измерва в килограми на
                            квадратен метър и се определя по следната формула:
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Image
                            src="https://wikimedia.org/api/rest_v1/media/math/render/svg/75508e7ad0fc780453684deec6aab53ea630ece7"
                            alt="Dan Abramov"
                          />
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                            ml="5px"
                          >
                            където:
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            <b>BMI</b> - индекс на телесната маса, <b>W</b> -
                            тегло в килограми, <b>h</b> - височина в метри
                          </Text>
                        </Flex>
                      </>
                    )}
                    <MenuItem onClick={toggleStatus}>
                      <Text fontSize="1xl" fontWeight="400">
                        {showStatus ? "Hide Raw Data" : "Show Raw Data"}
                      </Text>
                    </MenuItem>
                    {showStatus && (
                      <>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Сериозно недохранване - Този статус показва тежък
                            недостиг на хранителни вещества, което може да
                            доведе до сериозни проблеми със здравето и
                            отслабване на организма.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Средно недохранване - Този статус показва
                            недостиган на хранителни вещества на умерено ниво,
                            което може да води до отслабване и различни проблеми
                            със здравето.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Леко недохранване - В тази категория теглото е
                            леко под нормата, което може да създаде проблеми със
                            здравето и да наложи корекции в хранителния режим.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Нормално - Тази категория отразява здравословно
                            тегло в съответствие с височината. Хора в тази
                            категория имат по-нисък риск от различни
                            здравословни проблеми, свързани с теглото.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Наднормено тегло - В тази категория теглото е над
                            нормалната граница, което може да повиши риска от
                            заболявания, свързани със здравето, като диабет и
                            сърдечно-съдови заболявания.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Затлъстяване I Клас - Теглото е значително
                            повишено, като този статус може да увеличи риска от
                            сериозни здравословни проблеми.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Затлъстяване II Клас - Тук има по-висок риск от
                            здравословни проблеми в сравнение с предишната
                            категория. Затлъстяването става по-значително.
                          </Text>
                        </Flex>
                        <Flex align="center">
                          <Text
                            fontSize="sm"
                            fontWeight="400"
                            mt="10px"
                            mb="5px"
                          >
                            • Затлъстяване III Клас - Този клас показва
                            екстремно затлъстяване, което може да предизвика
                            сериозни здравословни проблеми и изисква внимание от
                            специалист в здравеопазването.
                          </Text>
                        </Flex>
                      </>
                    )}
                  </Box>
                </MenuList>
              </Menu>
            </Flex>
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
                      bg={boxBg}
                      icon={
                        <Icon
                          w="32px"
                          h="32px"
                          as={GiWeightScale}
                          color={brandColor}
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
            <Flex justifyContent="space-between" align="center">
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                Колко е вашето перфектно тегло :
              </Text>
              <Menu isOpen={isOpenBMI} onClose={onCloseBMI}>
                <MenuButton
                  alignItems="center"
                  justifyContent="center"
                  bg={bgButton}
                  _hover={bgHover}
                  _focus={bgFocus}
                  _active={bgFocus}
                  w="37px"
                  h="30px"
                  lineHeight="50%"
                  onClick={onOpenBMI}
                  borderRadius="10px"
                  ml="20px"
                >
                  <Icon
                    as={MdOutlineInfo}
                    color={iconColor}
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
                    <Flex align="center">
                      <Text fontSize="1xl" fontWeight="400">
                        Перфектното тегло е калкулация, която се определя по
                        формулата "Дивайн" както следва:
                      </Text>
                    </Flex>
                    <HSeparator />
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        Мъже: 50.0 кг + 2.3 кг за всеки инч (2.54 см) над 5 фута
                        (30.48см)
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        Жени: 45.5 кг + 2.3 кг за всеки инч (2.54 см) над 5 фута
                        (30.48см)
                      </Text>
                    </Flex>
                  </Box>
                </MenuList>
              </Menu>
            </Flex>
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
                    bg={boxBg}
                    icon={
                      <Icon
                        w="32px"
                        h="32px"
                        as={GiWeightLiftingUp}
                        color={brandColor}
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
                    bg={boxBg}
                    icon={
                      <Icon
                        w="32px"
                        h="32px"
                        as={GiWeightLiftingUp}
                        color={brandColor}
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
                  Math.abs(differenceFromPerfectWeight.difference).toFixed(2) +
                  " kg"
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
                        bg={boxBg}
                        icon={
                          <Icon
                            w="32px"
                            h="32px"
                            as={GiWeightScale}
                            color={brandColor}
                          />
                        }
                      />
                    }
                    name={bodyFatAndLeanMassWidgetsData[index]}
                    value={value + " " + bodyFatAndLeanMassWidgetsUnits[index]}
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
                  />
                )
              )}
            </SimpleGrid>
          </Card>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "150px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "100px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForKilogramsData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Изменение на тегло(кг)"
              />
            </Card>
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "150px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForBMI}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Изменение на ИТМ(Индекс на Телесна Маса)"
              />
            </Card>
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "150px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForBodyFatData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Изменение на % телесни мазнини"
              />
            </Card>
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "150px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForBodyFatMassData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Изменение на мастна телесна маса"
              />
            </Card>
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "150px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForLeanBodyMassData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Изменение на чиста телесна маса"
              />
            </Card>
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "150px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForDifferenceFromPerfectWeightData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName={`Изменение в килограми ${
                  differenceFromPerfectWeight.isUnderOrAbove == "above"
                    ? "над"
                    : "под"
                } нормата`}
              />
            </Card>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
