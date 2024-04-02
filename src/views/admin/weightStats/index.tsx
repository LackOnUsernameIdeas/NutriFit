import React, { useState } from "react";
import {
  Box,
  Flex,
  Icon,
  Text,
  SimpleGrid,
  useColorModeValue,
  useMediaQuery
} from "@chakra-ui/react";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";
import FadeInWrapper from "components/wrapper/FadeInWrapper";
import { useSpring, animated } from "react-spring";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Loading from "views/admin/weightStats/components/Loading";
import {
  BMIInfo,
  BodyMass,
  UserData,
  UserChartData,
  WeightDifference
} from "../../../variables/weightStats";
import { parseISO } from "date-fns";
import UserInfoCard from "components/infoCard/userInfoCard";
import AlertBox from "components/alert/alert";
import InfoBox from "components/infoBox/infoBox";
import BMIDetailsSmallScreen from "./components/BMIDetailsSmallScreen";
import BMIDetails from "./components/BMIDetails";
import BodyChangeDropdown from "./components/BodyChangeDropdown";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot
} from "firebase/firestore";
import { fetchAdditionalUserData } from "../../../database/getFunctions";
import { db } from "database/connection";

// Главен компонент
export default function WeightStats() {
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 50%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const textColor = useColorModeValue("black", "white");
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
  const [isUserDataForTodaySaved, setIsUserDataForTodaySaved] = useState(false);
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

  const [perfectWeight, setPerfectWeight] = useState<number>(0);
  const [differenceFromPerfectWeight, setDifferenceFromPerfectWeight] =
    useState<WeightDifference>({
      difference: 0,
      isUnderOrAbove: ""
    });

  // Данни за диаграмите
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
  const lineChartForDifferenceFromPerfectWeightData =
    differenceFromPerfectWeightData.map((difference, index) => {
      if (isUnderOrAboveData[index] === "above") {
        return difference;
      } else {
        return -difference;
      }
    });

  const [
    userDataLastSavedDateBeforeCurrentDate,
    setUserDataLastSavedDateBeforeCurrentDate
  ] = useState("");
  // State-ове за дропдауна
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };
  // Анимация за компонентите под дропдауна при негово движение
  const slideAnimation = useSpring({
    transform: `translateY(${dropdownVisible ? -30 : 20}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  // useEffect за дърпане на данните на потребителя от нашето API.
  React.useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const auth = getAuth();
      const user = await new Promise<User | null>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user);
          unsubscribe();
        });
      });

      console.log("User:", user); // Log user data

      if (user) {
        try {
          const userId = user.uid;

          // Fetch user document to get gender and goal
          const userDocRef = doc(db, "additionalData2", userId);
          const userDocSnapshot = await getDoc(userDocRef);
          console.log("User Doc Snapshot:", userDocSnapshot); // Log user document snapshot

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const { gender, goal } = userData;

            console.log("Gender:", gender); // Log gender
            console.log("Goal:", goal); // Log goal

            // Fetch all dated documents
            const dataEntriesRef = collection(
              db,
              "additionalData2",
              userId,
              "dataEntries"
            );
            const querySnapshot = await getDocs(dataEntriesRef);
            console.log("Query Snapshot:", querySnapshot);

            const userChartData: UserChartData[] = [];

            querySnapshot.forEach((doc) => {
              const date = doc.id;
              const additionalData = doc.data();

              console.log("Date:", date);

              if (
                !date.startsWith("dailyCaloryRequirements_") &&
                !date.startsWith("macroNutrients_")
              ) {
                userChartData.push({
                  date: date,
                  height: additionalData.height || 0,
                  weight: additionalData.weight || 0,
                  bmi: additionalData?.BMI?.bmi || 0,
                  bodyFat: additionalData?.BodyMassData?.bodyFat || 0,
                  bodyFatMass: additionalData?.BodyMassData?.bodyFatMass || 0,
                  leanBodyMass: additionalData?.BodyMassData?.leanBodyMass || 0,
                  differenceFromPerfectWeight:
                    additionalData?.PerfectWeightData
                      ?.differenceFromPerfectWeight?.difference || 0,
                  isUnderOrAbove:
                    additionalData?.PerfectWeightData
                      ?.differenceFromPerfectWeight?.isUnderOrAbove || ""
                });
              }
            });

            // Sort userChartData by date in descending order
            userChartData.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            // Get the most recent document
            const mostRecentData = userChartData[0];
            console.log("Most Recent Data:", mostRecentData); // Log most recent data for debugging

            // Fetch additional data from the most recent document
            const mostRecentDate = mostRecentData.date;
            const mostRecentDocRef = doc(
              db,
              "additionalData2",
              userId,
              "dataEntries",
              mostRecentDate
            );
            const mostRecentDocSnapshot = await getDoc(mostRecentDocRef);
            if (mostRecentDocSnapshot.exists()) {
              const additionalData = mostRecentDocSnapshot.data();
              console.log("Additional Data (Most Recent):", additionalData); // Log additional data for debugging

              // Set all user data properties
              if (isMounted) {
                // Check if the component is still mounted
                setUserData({
                  gender: gender || "",
                  goal: goal || "",
                  age: additionalData?.age || 0,
                  height: additionalData?.height || 0,
                  waist: additionalData?.waist || 0,
                  neck: additionalData?.neck || 0,
                  hip: additionalData?.hip || 0,
                  weight: additionalData?.weight || 0,
                  bmi: additionalData?.BMI?.bmi || 0,
                  bodyFat: additionalData?.BodyMassData?.bodyFat || 0,
                  bodyFatMass: additionalData?.BodyMassData?.bodyFatMass || 0,
                  leanBodyMass: additionalData?.BodyMassData?.leanBodyMass || 0,
                  differenceFromPerfectWeight:
                    additionalData?.PerfectWeightData
                      ?.differenceFromPerfectWeight?.difference || 0
                });

                setBMIIndex({
                  bmi: mostRecentData.bmi || 0,
                  health: additionalData?.BMI?.health || "",
                  healthy_bmi_range:
                    additionalData?.BMI?.healthy_bmi_range || ""
                });

                setBodyFatMassAndLeanMass({
                  "Body Fat (U.S. Navy Method)": mostRecentData.bodyFat || 0,
                  "Body Fat Mass": mostRecentData.bodyFatMass || 0,
                  "Lean Body Mass": mostRecentData.leanBodyMass || 0
                });

                setPerfectWeight(
                  additionalData?.PerfectWeightData?.perfectWeight || 0
                );

                setDifferenceFromPerfectWeight(
                  additionalData?.PerfectWeightData?.differenceFromPerfectWeight
                );

                // Set user chart data
                console.log("User Chart Data:", userChartData); // Log user chart data for debugging
                setUserDataForCharts(userChartData);
                setIsLoading(false);
              }
            } else {
              console.log("Most recent document does not exist.");
            }
          } else {
            console.log("User document does not exist.");
          }
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    };

    fetchData();

    // Cleanup function to be called when the component unmounts
    return () => {
      isMounted = false; // Set isMounted to false when unmounting
    };
  }, [isUserDataForTodaySaved]);

  React.useEffect(() => {
    const currentDay = new Date().toISOString().slice(0, 10);

    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      onSnapshot(
        doc(db, "additionalData2", user.uid, "dataEntries", currentDay),
        (doc) => {
          if (doc.exists()) {
            setIsUserDataForTodaySaved(true);
            setIsLoading(false);
          } else {
            // Document doesn't exist, handle the case if needed
            console.log("Today's document doesn't exist.");
          }
        }
      );
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    console.log("userData:", userData);
    console.log("bmiIndex:", BMIIndex);
    console.log("bodyFatMassAndLeanMass:", bodyFatMassAndLeanMass);
    console.log("perfectWeight:", perfectWeight);
    console.log("differenceFromPerfectWeight:", differenceFromPerfectWeight);
    console.log("userDataForCharts:", userDataForCharts);
  }, [
    userData,
    BMIIndex,
    bodyFatMassAndLeanMass,
    perfectWeight,
    differenceFromPerfectWeight,
    userDataForCharts
  ]);
  // Функции, които калкулират изменението на стойностите на потребителя
  const calculateChange = (sortedData: any[], property: string) => {
    const latestValue = sortedData[0][property];
    const previousValue = sortedData[1][property];
    const change = latestValue - previousValue;
    setUserDataLastSavedDateBeforeCurrentDate(sortedData[1].date);
    return change;
  };

  const calculateBMIChange = () => {
    const uniqueEntries: { [date: string]: any } = {};
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

      console.log("Сортирано: ", sortedData);
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
        {isLoading ? (
          <Box mt="37vh" minH="600px" opacity={isLoading ? 1 : 0}>
            <Loading />
          </Box>
        ) : (
          <Box transition="0.2s ease-in-out" mb="20px">
            <UserInfoCard userData={userData} />
            <Card
              p="20px"
              alignItems="center"
              flexDirection="column"
              w="100%"
              mb="20px"
            >
              {isSmallScreen ? (
                <>
                  <BMIDetailsSmallScreen />
                </>
              ) : (
                <>
                  <BMIDetails />
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
                    subtext={`в сравнение с ${userDataLastSavedDateBeforeCurrentDate}`}
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
                    <InfoBox
                      buttonText="Перфектното тегло"
                      infoText={[
                        "Перфектното тегло е калкулация, която се определя по формулата 'Дивайн' както следва:",
                        "Мъже: 50.0 кг + 2.3 кг за всеки инч (2.54 см) над 5 фута (30.48см)",
                        "Жени: 45.5 кг + 2.3 кг за всеки инч (2.54 см) над 5 фута (30.48см)"
                      ]}
                    />
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
                    <InfoBox
                      buttonText="Перфектното тегло"
                      infoText={[
                        "Перфектното тегло е калкулация, която се определя по формулата 'Дивайн' както следва:",
                        "Мъже: 50.0 кг + 2.3 кг за всеки инч (2.54 см) над 5 фута (30.48см)",
                        "Жени: 45.5 кг + 2.3 кг за всеки инч (2.54 см) над 5 фута (30.48см)"
                      ]}
                    />
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
                  subtext={`в сравнение с ${userDataLastSavedDateBeforeCurrentDate}`}
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
                      subtext={`в сравнение с ${userDataLastSavedDateBeforeCurrentDate}`}
                    />
                  )
                )}
              </SimpleGrid>
            </Card>
            {lineChartForBMI.length > 1 && (
              //Статистики за вашето телесно изменение:
              <BodyChangeDropdown
                lineChartForBMI={lineChartForBMI}
                lineChartForBodyFatData={lineChartForBodyFatData}
                lineChartForBodyFatMassData={lineChartForBodyFatMassData}
                lineChartForDifferenceFromPerfectWeightData={
                  lineChartForDifferenceFromPerfectWeightData
                }
                lineChartForKilogramsData={lineChartForKilogramsData}
                lineChartForLeanBodyMassData={lineChartForLeanBodyMassData}
                lineChartLabels={lineChartLabels}
                handleDropdownToggle={handleDropdownToggle}
                dropdownVisible={dropdownVisible}
              />
            )}
            <animated.div style={{ ...slideAnimation, position: "relative" }}>
              <AlertBox
                status="warning"
                text="Тези стойности са приблизителни и може да е необходимо
                    преценка от диетолог или здравен специалист, за да се
                    адаптират към индивидуалните ви нужди."
              />
              {lineChartForBMI.length == 1 && <Box mb="40px"></Box>}
            </animated.div>
          </Box>
        )}
      </Box>
    </FadeInWrapper>
  );
}
