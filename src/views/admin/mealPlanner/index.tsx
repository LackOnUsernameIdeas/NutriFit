import React, { useState } from "react";

// Chakra UI components
import {
  Box,
  Flex,
  Icon,
  Text,
  Button,
  SimpleGrid,
  MenuButton,
  MenuList,
  useDisclosure,
  useColorModeValue,
  Menu,
  Heading,
  Stack,
  StackDivider
} from "@chakra-ui/react";

// React Icons
import { MdOutlineInfo } from "react-icons/md";
// Custom components
import Card from "components/card/Card";
import CardHeader from "components/card/Card";
import CardBody from "components/card/Card";

import DietTable from "views/admin/dataTables/components/ColumnsTable";
import CalorieRequirements from "./components/CalorieRequirements";
import Loading from "./components/Loading";
import MealPlanner from "./components/MealPlanner";
import { HSeparator } from "components/separator/Separator";
// Types
import {
  UserData,
  DailyCaloryRequirements,
  MacroNutrientsData
} from "../../../types/weightStats";

// Помощни функции за извличане на данни
import {
  fetchCaloriesForActivityLevels,
  fetchMacroNutrients
} from "./utils/fetchFunctions";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchAdditionalUserData } from "../../../database/getAdditionalUserData";

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

  const [tableData, setTableData] = useState<MacroNutrientsData[]>(
    Array.from({ length: 6 }, (_) => [
      { name: "Балансирана", protein: 0, fat: 0, carbs: 0 },
      { name: "Ниско съдържание на мазнини", protein: 0, fat: 0, carbs: 0 },
      {
        name: "Ниско съдържание на въглехидрати",
        protein: 0,
        fat: 0,
        carbs: 0
      },
      { name: "Високо съдържание на протеин", protein: 0, fat: 0, carbs: 0 }
    ])
  );

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

  // State за избрано ниво на натовареност
  const [activityLevel, setActivityLevel] = useState<number>(null);

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
    fetchCaloriesForActivityLevels(
      userData["age"],
      userData["gender"],
      userData["height"],
      userData["weight"],
      setDailyCaloryRequirements
    );

    setIsLoadingForCalories(true);
    setTimeout(() => {
      setIsLoadingForCalories(false);
    }, 1000);
  }

  function generateStatsForMacroNutrients() {
    fetchMacroNutrients(
      userData["age"],
      userData["gender"],
      userData["height"],
      userData["weight"],
      userData["goal"],
      setTableData
    );

    setIsLoadingForMacroNutrients(true);
    setTimeout(() => {
      setIsLoadingForMacroNutrients(false);
    }, 1000);
  }

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const additionalData = await fetchAdditionalUserData(user.uid);
          setUserData(additionalData as any);
          console.log(
            "ID: ",
            user.uid,
            "Additional user data:",
            additionalData
          );
        } catch (error) {
          console.error("Error fetching additional user data:", error);
        }
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
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
    generateStatsForMacroNutrients();
    setIsGenerateStatsForMacroNutrientsCalled(true);
  }, [userData.goal]);

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      style={{ overflow: "hidden" }}
    >
      <Box>
        {!isGenerateStatsForCaloriesCalled ? (
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
                      Години: {userData.age}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Пол: {userData.gender}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Цел: {userData.goal}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Височина: {userData.height}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Тегло: {userData.weight}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Обиколка на врата: {userData.neck}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Обиколка на талията: {userData.waist}
                    </Heading>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Обиколка на таза: {userData.hip}
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
              <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
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
                        colorScheme={activityLevel === level ? "blue" : "gray"}
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
                        onClick={onOpenLevels}
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
                          <Flex align="center">
                            <Text fontSize="1xl" fontWeight="400">
                              Бутони за определяне на ниво на натовареност.
                            </Text>
                          </Flex>
                          <HSeparator />
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Ниво 1 - Малко или въобще не спортувате.
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Ниво 2 - Спортувате умерено 1-3 пъти в седмицата.
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Ниво 3 - Спортувате умерено 4-5 пъти в седмицата.
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Ниво 4 - Спортувате умерено дневно или интензивно
                              3-4 пъти в седмицата.
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Ниво 5 - Спортувате интензивно 6-7 пъти в
                              седмицата.
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text fontSize="sm" fontWeight="400" mt="10px">
                              Ниво 6 - Спортувате много интензивно цялата
                              седмица.
                            </Text>
                          </Flex>
                        </Box>
                      </MenuList>
                    </Menu>
                  </SimpleGrid>
                </Flex>
              </Box>
            </Card>
            {activityLevel && (
              <>
                <Card p="20px" flexDirection="column" w="100%" mb="20px">
                  <Card alignItems="center">
                    <Text
                      color={textColor}
                      fontSize="2xl"
                      ms="24px"
                      fontWeight="700"
                    >
                      Изберете желаната от вас цел и съответните калории, които
                      трябва да приемате на ден според желания резултат:
                    </Text>
                    <CalorieRequirements
                      calorieRequirements={dailyCaloryRequirements}
                      selectedActivityLevel={activityLevel}
                      clickedValueCalories={clickedValueCalories}
                      setClickedValueCalories={setClickedValueCalories}
                      setUserData={setUserData}
                    />
                  </Card>
                  {clickedValueCalories !== null &&
                  !isLoadingForMacroNutrients ? (
                    <>
                      <Card>
                        <Flex align="center">
                          <Menu isOpen={isOpenDiet} onClose={onCloseDiet}>
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
                              onClick={onOpenDiet}
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
                                <Flex align="center">
                                  <Text fontSize="2xl" fontWeight="400">
                                    Изберете тип диета по вашите предпочитания.
                                  </Text>
                                </Flex>
                                <HSeparator />
                                <Flex align="center">
                                  <Text
                                    fontSize="1xl"
                                    fontWeight="400"
                                    mt="4px"
                                  >
                                    Балансирана:
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="200"
                                    mb="10px"
                                  >
                                    Балансирано разпределение на макронутриенти
                                    с умерени нива на протеини, въглехидрати и
                                    мазнини. Идеална за поддържане на здравето.
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text
                                    fontSize="1xl"
                                    fontWeight="400"
                                    mt="4px"
                                  >
                                    Ниско съдържание на мазнини:
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="200"
                                    mb="10px"
                                  >
                                    Набляга на намаляване на приема на мазнини и
                                    поддържане на адекватни нива на протеини и
                                    въглехидрати. Подходящ за тези, които се
                                    стремят да намалят общия прием на калории и
                                    да контролират теглото си.
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text
                                    fontSize="1xl"
                                    fontWeight="400"
                                    mt="4px"
                                  >
                                    Ниско съдържание на въглехидрати:
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="400"
                                    mb="10px"
                                  >
                                    Фокусира се върху минимизиране на приема на
                                    въглехидрати, като същевременно осигурява
                                    достатъчно протеини и здравословни мазнини.
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text
                                    fontSize="1xl"
                                    fontWeight="400"
                                    mt="4px"
                                  >
                                    Високо съдържание на протеин:
                                  </Text>
                                </Flex>
                                <Flex align="center">
                                  <Text fontSize="sm" fontWeight="400">
                                    Дава приоритет на по-висок прием на протеин
                                    с умерени нива на въглехидрати и мазнини.
                                    Идеална за тези, които искат да подпомогнат
                                    развитието на мускулите, особено при силови
                                    тренировки или фитнес програми.
                                  </Text>
                                </Flex>
                              </Box>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </Card>
                      <DietTable
                        tableName="Изберете тип диета:"
                        tableData={tableData[activityLevel - 1]}
                        columnsData={[
                          { name: "name", label: "Тип диета" },
                          { name: "protein", label: "Протеин (гр.)" },
                          { name: "fat", label: "Мазнини (гр.)" },
                          { name: "carbs", label: "Въглехидрати (гр.)" }
                        ]}
                        setState={setClickedValueNutrients}
                        clickedValueProtein={clickedValueNutrients.protein}
                      />
                    </>
                  ) : isLoadingForMacroNutrients ? (
                    <Loading />
                  ) : (
                    <></>
                  )}
                </Card>
                {clickedValueNutrients.protein !== null && (
                  <MealPlanner
                    chosenCalories={clickedValueCalories}
                    chosenNutrients={clickedValueNutrients}
                  />
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
