/* eslint-disable */
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

import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { saveAdditionalUserData } from "database/setAdditionalUserData";
import { fetchAdditionalUserData } from "database/getAdditionalUserData";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

import MeasurementsAlertDialog from "./components/MeasurementsAlertDialog";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/measurements/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import Loading from "views/admin/weightStats/components/Loading";
import {
  saveBMI,
  savePerfectWeight,
  saveBodyMass
} from "../../database/setWeightStatsData";
import {
  BMIInfo,
  BodyMass,
  UserData,
  Goal,
  WeightDifference
} from "../../types/weightStats";
import {
  fetchBMIData,
  fetchPerfectWeightData,
  fetchBodyFatAndLeanMassData
} from "./utils/fetchFunctions";
interface UserMeasurements {
  userData: UserData;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRadioChange: (key: string, value: string) => void;
  generateStats: () => void;
}

const userDataPropertiesTranslated = [
  "ръст (см)",
  "възраст",
  "тегло (кг)",
  "обиколка на врат (см)",
  "обиколка на талия (см)",
  "oбиколка на таз (см)",
  "цел"
];

const UserMeasurements = () => {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const history = useHistory();
  const [error, setError] = useState("");
  const [isFilledOut, setIsFilledOut] = useState(false);
  const [userDataForToday, setUserDataForToday] = useState(null);
  const [userDataLastSavedDate, setUserDataLastSavedDate] = useState(null);
  const [isTodaysDataFetched, setIsTodaysDataFetched] =
    useState<boolean>(false);
  const isMounted = useRef(true);
  const [user, setUser] = useState(null);
  // State за въведени потребителски данни
  const [userData, setUserData] = useState<UserData>({
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    goal: "maintain"
  });

  const [userDataForReq, setUserDataForReq] = useState<UserData>({
    gender: "male" || "female",
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    goal: "maintain"
  });

  // State за зареждане на страницата
  const [isLoading, setIsLoading] = useState(false);

  // Event handler-и за реакция при промяна
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const parsedValue = value.trim() === "" ? 0 : parseFloat(value);

    setUserData((prevData) => ({
      ...prevData,
      [name]: parsedValue
    }));
  };

  console.log(userData);

  const [validationErrors, setValidationErrors] = React.useState<{
    [key: string]: string;
  }>({});
  // States за запазване на извличените данни
  const [BMIIndex, setBMIIndex] = useState<BMIInfo>({
    bmi: null,
    health: "",
    healthy_bmi_range: "18.5 - 25"
  });
  const [bodyFatMassAndLeanMass, setBodyFatMassAndLeanMass] =
    useState<BodyMass>({
      "Body Fat (U.S. Navy Method)": 0,
      "Body Fat Mass": 0,
      "Lean Body Mass": 0
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
          setUserDataForReq({
            gender: additionalData.gender,
            goal: additionalData.goal,
            age: additionalData[timestampKey].age,
            height: additionalData[timestampKey].height,
            waist: additionalData[timestampKey].waist,
            neck: additionalData[timestampKey].neck,
            hip: additionalData[timestampKey].hip,
            weight: additionalData[timestampKey].weight
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
      userDataForReq["gender"],
      setPerfectWeight
    );
    fetchBodyFatAndLeanMassData(
      userData["age"],
      userDataForReq["gender"],
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

  React.useEffect(() => {
    // Зарежда последно запазените данни от Local Storage
    const storedValues = JSON.parse(
      localStorage.getItem("lastTypedValues") || "{}"
    );
    Object.keys(storedValues).forEach((key) => {
      handleInputChange({
        target: { name: key, value: storedValues[key] }
      } as React.ChangeEvent<HTMLInputElement>);
    });
  }, []);

  const validateField = (
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): string | undefined => {
    if (value === 0) {
      return `Моля, въведете ${fieldName}.`;
    }

    if (value < min || value > max) {
      return `Полето ${fieldName} трябва да бъде между ${min} и ${max} см.`;
    }

    return undefined;
  };

  const isUserDataValid = () => {
    const errors: { [key: string]: string } = {};

    errors.height = validateField(userData.height, 130, 230, "височина");
    errors.age = validateField(userData.age, 1, 80, "възраст");
    errors.weight = validateField(userData.weight, 40, 160, "тегло");
    errors.neck = validateField(userData.neck, 20, 60, "обиколка на врата");
    errors.waist = validateField(userData.waist, 40, 130, "обиколка на талия");
    errors.hip = validateField(userData.hip, 40, 130, "обиколка на таз");

    setValidationErrors(errors);

    return Object.values(errors).every((error) => error === undefined);
  };

  const handleInputChangeWithMemory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    handleInputChange(e);

    setValidationErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Запазва последно написаните данни в Local Storage
    const storedValues = JSON.parse(
      localStorage.getItem("lastTypedValues") || "{}"
    );
    localStorage.setItem(
      "lastTypedValues",
      JSON.stringify({ ...storedValues, [name]: value })
    );
  };
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
  const saveAllData = async () => {
    saveBMIData();
    saveBodyMassData();
    savePerfectWeightData();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ако датата е валидна я записва в базата и изпраща потребителят на главната страница
    if (isUserDataValid()) {
      try {
        const uid = getAuth().currentUser.uid;

        // Save additional user data
        await saveAdditionalUserData(
          uid,
          userData.height,
          userData.age,
          userData.weight,
          userData.neck,
          userData.waist,
          userData.hip
        );

        setIsFilledOut(true);

        // Generate stats and wait for it to complete
        await generateStats();
        setIsGenerateStatsCalled(true);

        // Use the latest state values directly in saveAllData
        await saveAllData();

        // Redirect to the default page
        history.push("/admin/default");
      } catch (error) {
        console.error("Error saving additional user data:", error);
      }
    }
  };

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted.current) {
        setUser(user);
      }

      if (user) {
        try {
          setIsLoading(true);

          const additionalData = await fetchAdditionalUserData(user.uid);

          // Extract date keys from additionalData
          const dateKeys = Object.keys(additionalData).filter((key) =>
            /^\d{4}-\d{2}-\d{2}$/.test(key)
          );

          // Sort date keys in descending order
          dateKeys.sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
          );

          // Find the first date before today
          const today = new Date().toISOString().slice(0, 10);
          const lastSavedDate = dateKeys.find((date) => date < today);
          const rawUserDataForToday = additionalData[today];
          const rawUserDataForLastSavedDate = additionalData[lastSavedDate];

          if (isMounted.current) {
            setUserDataLastSavedDate(rawUserDataForLastSavedDate);
            setUserDataForToday(rawUserDataForToday);
            setIsTodaysDataFetched(true);
          }

          setTimeout(() => {
            setIsLoading(false);
          }, 1000);
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);
  const [updateWithNewData, setUpdateWithNewData] = useState<boolean>(false);
  useEffect(() => {
    if (userDataLastSavedDate) {
      const commonKeys = Object.keys(userData).filter((key) =>
        Object.keys(userDataLastSavedDate).includes(key)
      );

      const areDataEqual = commonKeys.every(
        (key) => userData[key] === userDataLastSavedDate[key]
      );

      setUpdateWithNewData(!areDataEqual);

      const differentFields = commonKeys.filter(
        (key) => userData[key] !== userDataLastSavedDate[key]
      );

      setHighlightedFields(differentFields);
    } else {
      setUpdateWithNewData(false);
    }
  }, [userData, userDataLastSavedDate]);

  React.useEffect(() => {
    const diff = perfectWeight - userData.weight;
    setDifferenceFromPerfectWeight({
      difference: Math.abs(diff),
      isUnderOrAbove: userData.weight > perfectWeight ? "above" : "under"
    });
  }, [perfectWeight, userData]);

  React.useEffect(() => {
    // Check if numeric values in userData are different from 0 and not null
    const areValuesValid = Object.values(userDataForReq).every(
      (value) => value !== 0
    );

    if (areValuesValid) {
      generateStats();
      setIsGenerateStatsCalled(true);
    }
  }, [userDataForReq]);
  return (
    <Box>
      {isLoading || !isTodaysDataFetched ? (
        <Box mt="45vh">
          <Loading />
        </Box>
      ) : (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
          <Flex
            maxW={{ base: "100%", md: "max-content" }}
            w="100%"
            mx={{ base: "auto", lg: "0px" }}
            me="auto"
            h="100%"
            alignItems="start"
            justifyContent="center"
            mb={{ base: "30px", md: "60px" }}
            px={{ base: "25px", md: "0px" }}
            mt={{ base: "40px", md: "5%" }}
            flexDirection="column"
          >
            <Box me="auto">
              <Heading color={textColor} fontSize="36px" mb="10px">
                Напишете вашите данни:
              </Heading>
              <Text
                mb="10px"
                ms="4px"
                color={textColorSecondary}
                fontWeight="400"
                fontSize="md"
                style={{ whiteSpace: "pre-line" }}
              >
                Напишете вашите данни и ние ще направим калкулации, за{"\u00a0"}
                <br /> да определим
              </Text>
            </Box>
            <Flex
              zIndex="2"
              direction="column"
              w={{ base: "100%", md: "420px" }}
              maxW="100%"
              background="transparent"
              borderRadius="15px"
              mx={{ base: "auto", lg: "unset" }}
              me="auto"
              mb={{ base: "20px", md: "auto" }}
            >
              <Flex align="center" mb="25px">
                <HSeparator />
              </Flex>
              <FormControl>
                {Object.entries(userData).map(([key, value], index) => (
                  <Box key={key} mb="10px">
                    {key !== "gender" && key !== "goal" && (
                      <FormLabel
                        display="flex"
                        ms="4px"
                        fontSize="sm"
                        fontWeight="500"
                        color={textColor}
                        mb="4px"
                      >
                        {userDataPropertiesTranslated[index]
                          .charAt(0)
                          .toUpperCase() +
                          userDataPropertiesTranslated[index].slice(1)}
                        {key === "age" && (
                          <Text color={brandStars} ml="1">
                            *
                          </Text>
                        )}
                      </FormLabel>
                    )}
                    {key !== "gender" &&
                      key !== "goal" &&
                      (typeof value === "number" ? (
                        value !== 0 ? (
                          <Input
                            isRequired={key === "age"}
                            color={textColor}
                            focusBorderColor="#7551ff"
                            type="number"
                            name={key}
                            value={value || ""}
                            variant="auth"
                            placeholder={`Въведете ${userDataPropertiesTranslated[index]}`}
                            _placeholder={{ opacity: 1, color: "gray.500" }}
                            onChange={(e) => handleInputChangeWithMemory(e)}
                            fontSize="sm"
                            fontWeight="500"
                            size="lg"
                            borderColor={
                              highlightedFields.includes(key)
                                ? "green.500"
                                : undefined
                            }
                          />
                        ) : (
                          <Input
                            isRequired={key === "age"}
                            color={textColor}
                            focusBorderColor="#7551ff"
                            type="number"
                            name={key}
                            value={""}
                            variant="auth"
                            placeholder={`Въведете ${userDataPropertiesTranslated[index]}`}
                            _placeholder={{ opacity: 1, color: "gray.500" }}
                            onChange={(e) => handleInputChangeWithMemory(e)}
                            fontSize="sm"
                            fontWeight="500"
                            size="lg"
                          />
                        )
                      ) : (
                        <></>
                      ))}
                    {validationErrors[key] && (
                      <Text color="red" fontSize="sm">
                        {validationErrors[key]}
                      </Text>
                    )}
                  </Box>
                ))}
                <MeasurementsAlertDialog
                  handleSubmit={handleSubmit}
                  userData={userData}
                  checkUpdate={updateWithNewData}
                />
                {error && (
                  <Text color="red" fontSize="sm" mb="8px">
                    {error}
                  </Text>
                )}
              </FormControl>
            </Flex>
          </Flex>
        </DefaultAuth>
      )}
    </Box>
  );
};

export default UserMeasurements;
