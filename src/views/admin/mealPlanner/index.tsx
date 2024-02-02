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
  Menu,
  Heading,
  Stack,
  StackDivider,
  Alert,
  AlertIcon,
  Link
} from "@chakra-ui/react";

// React Icons
import { MdOutlineInfo } from "react-icons/md";
// Custom components
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import Card from "components/card/Card";
import CardHeader from "components/card/Card";
import CardBody from "components/card/Card";
import backgroundImageWhite from "../../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import DietTable from "views/admin/dataTables/components/ColumnsTable";
import CalorieRequirements from "./components/CalorieRequirements";
import Loading from "views/admin/weightStats/components/Loading";
import MealPlanner from "./components/MealPlanner";
import { HSeparator } from "components/separator/Separator";
// Types
import {
  UserData,
  AllUsersPreferences,
  DailyCaloryRequirements,
  MacroNutrientsData
} from "../../../types/weightStats";
import { onSnapshot, doc, getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchAdditionalUserData } from "../../../database/getAdditionalUserData";
import { savePreferences } from "../../../database/setWeightStatsData";
import { table } from "console";

import { lineChartOptions } from "variables/chartjs";
import LineChart from "components/charts/LineChart";

// Главен компонент
export default function WeightStats() {
  // Color values
  const { colorMode } = useColorMode();
  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const brandColor = useColorModeValue("brand.500", "white");
  const fontWeight = useColorModeValue("550", "100");
  const tipFontWeight = useColorModeValue("500", "100");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("black", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("secondaryGray.150", "whiteAlpha.100");
  const borderColor = useColorModeValue("secondaryGray.200", "whiteAlpha.200");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const gradientHover = useColorModeValue(
    { bg: "linear-gradient(90deg, #4f3efb 0%, #8477fa 50%)" },
    { bg: "linear-gradient(90deg, #7e6afc 0%, #4f3efb 100%)" }
  );
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
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

  const saveUserPreferences = () => {
    const uid = getAuth().currentUser.uid;
    savePreferences(uid, clickedValueCalories, clickedValueNutrients);
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

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const userId = user.uid;
          const additionalDataRef = doc(
            getFirestore(),
            "additionalUserData",
            userId
          );

          // Subscribe to real-time updates using onSnapshot
          const unsubscribeData = onSnapshot(additionalDataRef, (doc) => {
            if (doc.exists()) {
              const additionalData = doc.data();
              const timestampKey = new Date().toISOString().slice(0, 10);
              const userDataTimestamp = additionalData[timestampKey];

              const timestampedObjects = Object.entries(additionalData)
                .filter(
                  ([key, value]) =>
                    typeof value === "object" &&
                    value.hasOwnProperty("Preferences")
                )
                .map(([key, value]) => ({ date: key, ...value.Preferences }));

              const orderedTimestampObjects = [...timestampedObjects].sort(
                (a, b) => {
                  const keyA = a.key;
                  const keyB = b.key;
                  return new Date(keyB).getTime() - new Date(keyA).getTime();
                }
              );

              setAllUsersPreferences(orderedTimestampObjects);

              setUserData({
                gender: additionalData.gender,
                goal: additionalData.goal,
                age: userDataTimestamp.age,
                height: userDataTimestamp.height,
                waist: userDataTimestamp.waist,
                neck: userDataTimestamp.neck,
                hip: userDataTimestamp.hip,
                weight: userDataTimestamp.weight
              } as UserData);

              setDailyCaloryRequirements(
                userDataTimestamp.dailyCaloryRequirements
              );

              const macroNutrientsData = Array.isArray(
                userDataTimestamp.macroNutrientsData
              )
                ? userDataTimestamp.macroNutrientsData
                : [];

              setMacroNutrients(macroNutrientsData);
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

  React.useEffect(() => {
    // Check if both clickedValueCalories and clickedValueNutrients are set
    if (
      clickedValueCalories !== null &&
      clickedValueNutrients.protein !== null
    ) {
      // Call the saveUserPreferences function
      saveUserPreferences();
    }
  }, [clickedValueCalories, clickedValueNutrients]);
  return (
    <FadeInWrapper>
      <Box
        pt={{ base: "130px", md: "80px", xl: "80px" }}
        style={{ overflow: "hidden" }}
      >
        <Box>
          {!isGenerateStatsForCaloriesCalled ? (
            <Box mt="37vh" minH="600px" transition="0.25s ease-in-out">
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
                          <b>Цел:</b> {mapGoalToDisplayValue(userData.goal)}
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
                alignItems="center"
                p="20px"
                flexDirection="column"
                w="100%"
                mb="20px"
              >
                <Text
                  color={textColor}
                  fontSize="2xl"
                  ms="24px"
                  fontWeight="700"
                >
                  Изберете ниво на натовареност:
                </Text>
                <Box gap="10px" mb="20px" mt="20px">
                  <Flex justifyContent="space-between" align="center">
                    <SimpleGrid
                      columns={{ base: 3, md: 2, lg: 7 }}
                      spacing="10px"
                      alignItems="center"
                      mb="10px"
                    >
                      {[1, 2, 3, 4, 5, 6].map((level) => (
                        <Button
                          key={level}
                          fontSize={{ base: "sm", md: "md" }}
                          margin="0"
                          color={activityLevel === level ? "white" : textColor}
                          bg={activityLevel === level ? gradient : bgButton}
                          _hover={
                            activityLevel === level ? gradientHover : bgHover
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
                      <Menu isOpen={isOpenLevels} onClose={onCloseLevels}>
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
                          onClick={onOpenStats}
                          borderRadius="10px"
                          ml="10%"
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
                                    Видовете състояние според ИТМ могат да
                                    бъдат:
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
                                        спортувате.
                                      </Text>
                                    </Flex>
                                    <Flex align="center">
                                      <Text
                                        fontSize="sm"
                                        fontWeight="400"
                                        mt="10px"
                                        mb="5px"
                                      >
                                        <b>Ниво 2</b> - Спортувате умерено 1-3
                                        пъти в седмицата.
                                      </Text>
                                    </Flex>
                                    <Flex align="center">
                                      <Text
                                        fontSize="sm"
                                        fontWeight="400"
                                        mt="10px"
                                        mb="5px"
                                      >
                                        <b>Ниво 3</b> - Спортувате умерено 4-5
                                        пъти в седмицата.
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
                                        седмицата.
                                      </Text>
                                    </Flex>
                                    <Flex align="center">
                                      <Text
                                        fontSize="sm"
                                        fontWeight="400"
                                        mt="10px"
                                        mb="5px"
                                      >
                                        <b>Ниво 5</b> - Спортувате интензивно
                                        6-7 пъти в седмицата.
                                      </Text>
                                    </Flex>
                                    <Flex align="center">
                                      <Text
                                        fontSize="sm"
                                        fontWeight="400"
                                        mt="10px"
                                      >
                                        <b>Ниво 6</b> - Спортувате много
                                        интензивно цялата седмица.
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
                    </SimpleGrid>
                  </Flex>
                </Box>
              </Card>
              <Alert
                status="info"
                borderRadius="20px"
                fontWeight={tipFontWeight}
                p="20px"
                w="100%"
                mb="20px"
              >
                <AlertIcon />
                <Link href="/#/admin/weight">
                  <b>Съвет:</b> Натиснете тук, за да видите състоянието на
                  вашето тегло, дали трябва да сваляте или да качвате тегло и
                  тогава се върнете в тази страница, за да прецените правилно
                  каква цел да си поставите.
                </Link>
              </Alert>
              {activityLevel && (
                <FadeInWrapper>
                  <FadeInWrapper>
                    <Card p="20px" flexDirection="column" w="100%" mb="20px">
                      <Card alignItems="center">
                        <Text
                          color={textColor}
                          fontSize="2xl"
                          ms="24px"
                          fontWeight="700"
                        >
                          Изберете желаната от вас цел и съответните калории,
                          които трябва да приемате на ден според желания
                          резултат:
                        </Text>
                        <CalorieRequirements
                          calorieRequirements={dailyCaloryRequirements}
                          selectedActivityLevel={activityLevel}
                          clickedValueCalories={clickedValueCalories}
                          setClickedValueCalories={setClickedValueCalories}
                          setSelectedGoal={setSelectedGoal}
                          setUserData={setUserData}
                        />
                      </Card>
                      <FadeInWrapper>
                        {isDietTableDataReady &&
                          clickedValueCalories !== null && (
                            <>
                              <Card>
                                <Flex align="center">
                                  <Menu
                                    isOpen={isOpenDiet}
                                    onClose={onCloseDiet}
                                  >
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
                                      onClick={onOpen}
                                      borderRadius="10px"
                                      order={1} // Set a higher order value
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
                                        maxW={{ base: "2xl", lg: "100%" }}
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
                                            >
                                              <AlertDialogHeader
                                                fontSize="lg"
                                                fontWeight="bold"
                                              >
                                                Изберете тип диета по вашите{" "}
                                                <br />
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
                                                    Балансирано разпределение на
                                                    макронутриенти с умерени
                                                    нива на протеини,
                                                    въглехидрати и мазнини.
                                                    Идеална за поддържане на
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
                                                    Набляга на намаляване на
                                                    приема на мазнини и
                                                    поддържане на адекватни нива
                                                    на протеини и въглехидрати.
                                                    Подходящ за тези, които се
                                                    стремят да намалят общия
                                                    прием на калории и да
                                                    контролират теглото си.
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
                                                    минимизиране на приема на
                                                    въглехидрати, като
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
                                                    Дава приоритет на по-висок
                                                    прием на протеин с умерени
                                                    нива на въглехидрати и
                                                    мазнини. Идеална за тези,
                                                    които искат да подпомогнат
                                                    развитието на мускулите,
                                                    особено при силови
                                                    тренировки или фитнес
                                                    програми.
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
                              </Card>
                              <DietTable
                                tableName="Изберете тип диета:"
                                tableData={tableData}
                                columnsData={[
                                  { name: "name", label: "Тип диета" },
                                  { name: "protein", label: "Протеин (гр.)" },
                                  { name: "fat", label: "Мазнини (гр.)" },
                                  { name: "carbs", label: "Въглехидрати (гр.)" }
                                ]}
                                setState={setClickedValueNutrients}
                                clickedValueProtein={
                                  clickedValueNutrients.protein
                                }
                              />
                            </>
                          )}
                      </FadeInWrapper>
                    </Card>
                  </FadeInWrapper>
                  {clickedValueNutrients.protein !== null && (
                    <MealPlanner
                      chosenCalories={clickedValueCalories}
                      chosenNutrients={clickedValueNutrients}
                    />
                  )}
                </FadeInWrapper>
              )}
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: 2 }}
                gap="20px"
                mb="20px"
              >
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
                    lineChartData={lineChartForCalories}
                    lineChartOptions={lineChartOptions}
                    lineChartLabelName="Изменение на калории(kcal)"
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
                    lineChartData={lineChartForProtein}
                    lineChartOptions={lineChartOptions}
                    lineChartLabelName="Изменение на протеин(g)"
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
                    lineChartData={lineChartForFat}
                    lineChartOptions={lineChartOptions}
                    lineChartLabelName="Изменение на мазнини(g)"
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
                    lineChartData={lineChartForCarbs}
                    lineChartOptions={lineChartOptions}
                    lineChartLabelName="Изменение на въглехидрати(g)"
                  />
                </Card>
              </SimpleGrid>
            </Box>
          )}
        </Box>
      </Box>
    </FadeInWrapper>
  );
}
