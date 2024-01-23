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
import { UserData } from "../../types/weightStats";

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Ако датата е валидна я записва в базата и изпраща потребителят на главната страница
    if (isUserDataValid()) {
      try {
        const uid = getAuth().currentUser.uid;
        await saveAdditionalUserData(
          uid,
          userData.height,
          userData.age,
          userData.weight,
          userData.neck,
          userData.waist,
          userData.hip
        ).then(() => {
          setIsFilledOut(true);
          history.push("/admin/default");
        });
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

          const rawUserDataForLastSavedDate = additionalData[lastSavedDate];

          if (isMounted.current) {
            setUserDataForToday(rawUserDataForLastSavedDate);
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

  useEffect(() => {
    if (userDataForToday) {
      const differentFields = Object.keys(userData).filter(
        (key) => userData[key] !== userDataForToday[key]
      );
      setHighlightedFields(differentFields);
    }
  }, [userData, userDataForToday]);

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
