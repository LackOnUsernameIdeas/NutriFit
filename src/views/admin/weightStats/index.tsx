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
  Image
} from "@chakra-ui/react";

// React Icons
import { MdOutlineInfo } from "react-icons/md";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";

// Custom components
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import DietTable from "views/admin/dataTables/components/ColumnsTable";
import CalorieRequirements from "./components/CalorieRequirements";
import UserPersonalData from "./components/UserPersonalData";
import Loading from "./components/Loading";
import MealPlanner from "./components/MealPlanner";
import { HSeparator } from "components/separator/Separator";

// Types
import {
  BMIInfo,
  BodyMass,
  UserData,
  DailyCaloryRequirements,
  MacroNutrientsData
} from "../../../types/weightStats";

// Помощни функции за извличане на данни
import {
  fetchBMIData,
  fetchPerfectWeightData,
  fetchBodyFatAndLeanMassData,
  fetchCaloriesForActivityLevels,
  fetchMacroNutrients
} from "./utils/fetchFunctions";

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

  const [perfectWeight, setPerfectWeight] = useState<number>(0);

  const [bodyFatMassAndLeanMass, setBodyFatMassAndLeanMass] =
    useState<BodyMass>({
      "Body Fat (U.S. Navy Method)": 0,
      "Body Fat Mass": 0,
      "Lean Body Mass": 0
    });

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
  const [activityLevel, setActivityLevel] = useState<number>(1);

  // State за зареждане на страницата
  const [isLoading, setIsLoading] = useState(false);

  // State за въведени потребителски данни
  const [userData, setUserData] = useState<UserData>({
    gender: "male",
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    goal: "maintain"
  });

  // Submission state
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Функция за генериране на статистики
  function generateStats() {
    fetchBMIData(
      userData["age"],
      userData["height"],
      userData["weight"],
      setBMIIndex
    );
    fetchPerfectWeightData(
      userData["gender"],
      userData["height"],
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
    fetchCaloriesForActivityLevels(
      userData["age"],
      userData["gender"],
      userData["height"],
      userData["weight"],
      setDailyCaloryRequirements
    );
    fetchMacroNutrients(
      userData["age"],
      userData["gender"],
      userData["height"],
      userData["weight"],
      userData["goal"],
      setTableData
    );

    setIsSubmitted(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

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

  const handleRadioChange = (key: string, radioValue: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: radioValue
    }));
  };

  return (
    <Box
      pt={{ base: "130px", md: "80px", xl: "80px" }}
      style={{ overflow: "hidden" }}
    >
      <Box>
        {isSubmitted ? (
          <Box>
            {isLoading ? (
              <Box mb="2.5%">
                <UserPersonalData
                  userData={userData}
                  handleInputChange={handleInputChange}
                  handleRadioChange={handleRadioChange}
                  generateStats={generateStats}
                />
                <Loading />
              </Box>
            ) : (
              <Box>
                <UserPersonalData
                  userData={userData}
                  handleInputChange={handleInputChange}
                  handleRadioChange={handleRadioChange}
                  generateStats={generateStats}
                />
                <Card
                  p="20px"
                  alignItems="center"
                  flexDirection="column"
                  w="100%"
                  mb="20px"
                >
                  <Flex justifyContent="space-between" align="center">
                    <Text
                      color={textColor}
                      fontSize="2xl"
                      ms="24px"
                      fontWeight="700"
                    >
                      Колко е вашият Индекс на Телесна Маса :
                    </Text>
                    <Menu
                      isOpen={isOpenPerfectWeight}
                      onClose={onClosePerfectWeight}
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
                        maxW={{ base: "80%", lg: "100%" }}
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
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Индексът на телесната маса(ИТМ) e
                              медико-биологичен показател, който служи за
                              определяне на нормалното, здравословно тегло при
                              хора с различен ръст и за диагностициране на
                              затлъстяване и недохранване.
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Индексът на телесната маса се измерва в килограми
                              на квадратен метър и се определя по следната
                              формула:
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
                          <HSeparator />
                          <br></br>
                          <Flex align="center">
                            <Text fontSize="1xl" fontWeight="400">
                              Видовете състояние според ИТМ могат да бъдат:
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              • Сериозно недохранване - Този статус показва
                              тежък недостиг на хранителни вещества, което може
                              да доведе до сериозни проблеми със здравето и
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
                              което може да води до отслабване и различни
                              проблеми със здравето.
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
                              леко под нормата, което може да създаде проблеми
                              със здравето и да наложи корекции в хранителния
                              режим.
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
                              • Наднормено тегло - В тази категория теглото е
                              над нормалната граница, което може да повиши риска
                              от заболявания, свързани със здравето, като диабет
                              и сърдечно-съдови заболявания.
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
                              повишено, като този статус може да увеличи риска
                              от сериозни здравословни проблеми.
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
                              сериозни здравословни проблеми и изисква внимание
                              от специалист в здравеопазването.
                            </Text>
                          </Flex>
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
                  <Flex align="center" justify="center">
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
                        maxW={{ base: "80%", lg: "100%" }}
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
                              Перфектното тегло е калкулация, която се определя
                              по формулата "Дивайн" както следва:
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
                              Мъже: 50.0 кг + 2.3 кг за всеки инч (2.54 см) над
                              5 фута (30.48см)
                            </Text>
                          </Flex>
                          <Flex align="center">
                            <Text
                              fontSize="sm"
                              fontWeight="400"
                              mt="10px"
                              mb="5px"
                            >
                              Жени: 45.5 кг + 2.3 кг за всеки инч (2.54 см) над
                              5 фута (30.48см)
                            </Text>
                          </Flex>
                        </Box>
                      </MenuList>
                    </Menu>
                  </Flex>
                </Card>
                <Card
                  p="20px"
                  alignItems="center"
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
                          value={
                            value + " " + bodyFatAndLeanMassWidgetsUnits[index]
                          }
                        />
                      )
                    )}
                  </SimpleGrid>
                </Card>
                <Card
                  p="20px"
                  alignItems="center"
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
                            colorScheme={
                              activityLevel === level ? "blue" : "gray"
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
                            maxW={{ base: "80%", lg: "100%" }}
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
                                  Ниво 2 - Спортувате умерено 1-3 пъти в
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
                                  Ниво 3 - Спортувате умерено 4-5 пъти в
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
                                  Ниво 4 - Спортувате умерено дневно или
                                  интензивно 3-4 пъти в седмицата.
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
                  <Text
                    color={textColor}
                    fontSize="2xl"
                    ms="24px"
                    fontWeight="700"
                  >
                    Изберете колко калории искате да приемате на ден според
                    целите:
                  </Text>
                  {activityLevel && (
                    <CalorieRequirements
                      calorieRequirements={dailyCaloryRequirements}
                      selectedActivityLevel={activityLevel}
                      clickedValueCalories={clickedValueCalories}
                      setClickedValueCalories={setClickedValueCalories}
                    />
                  )}
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
                </Card>
                <MealPlanner
                  chosenCalories={clickedValueCalories}
                  chosenNutrients={clickedValueNutrients}
                />
              </Box>
            )}
          </Box>
        ) : (
          <UserPersonalData
            userData={userData}
            handleInputChange={handleInputChange}
            handleRadioChange={handleRadioChange}
            generateStats={generateStats}
          />
        )}
      </Box>
    </Box>
  );
}
