import React, { useState } from "react";

// Chakra UI components
import {
  Box,
  Flex,
  Icon,
  Text,
  SimpleGrid,
  MenuButton,
  MenuList,
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
    goal: "maintain"
  });

  const [userDataForCharts, setUserDataForCharts] = useState([
    {
      date: "",
      height: 0,
      weight: 0
    }
  ]);

  const lineChartLabels = userDataForCharts.map((entry) => entry.date);

  const lineChartForKilogramsData = userDataForCharts.map(
    (entry) => entry.weight
  );
  const lineChartForHeightData = userDataForCharts.map((entry) => entry.height);

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
            weight: additionalData[timestampKey].weight
          } as UserData);

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
                weight: dateData.weight
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
      difference: diff,
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
                    Години: {userData.age}
                  </Heading>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Пол: {mapGenderToDisplayValue(userData.gender)}
                  </Heading>
                </Box>
                {userData.goal && (
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Цел: {mapGoalToDisplayValue(userData.goal)}
                    </Heading>
                  </Box>
                )}
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
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        Индексът на телесната маса(ИТМ) e медико-биологичен
                        показател, който служи за определяне на нормалното,
                        здравословно тегло при хора с различен ръст и за
                        диагностициране на затлъстяване и недохранване.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
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
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        <b>BMI</b> - индекс на телесната маса, <b>W</b> - тегло
                        в килограми, <b>h</b> - височина в метри
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
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Сериозно недохранване - Този статус показва тежък
                        недостиг на хранителни вещества, което може да доведе до
                        сериозни проблеми със здравето и отслабване на
                        организма.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Средно недохранване - Този статус показва недостиган
                        на хранителни вещества на умерено ниво, което може да
                        води до отслабване и различни проблеми със здравето.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Леко недохранване - В тази категория теглото е леко
                        под нормата, което може да създаде проблеми със здравето
                        и да наложи корекции в хранителния режим.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Нормално - Тази категория отразява здравословно тегло
                        в съответствие с височината. Хора в тази категория имат
                        по-нисък риск от различни здравословни проблеми,
                        свързани с теглото.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Наднормено тегло - В тази категория теглото е над
                        нормалната граница, което може да повиши риска от
                        заболявания, свързани със здравето, като диабет и
                        сърдечно-съдови заболявания.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Затлъстяване I Клас - Теглото е значително повишено,
                        като този статус може да увеличи риска от сериозни
                        здравословни проблеми.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Затлъстяване II Клас - Тук има по-висок риск от
                        здравословни проблеми в сравнение с предишната
                        категория. Затлъстяването става по-значително.
                      </Text>
                    </Flex>
                    <Flex align="center">
                      <Text fontSize="sm" fontWeight="400" mt="10px" mb="5px">
                        • Затлъстяване III Клас - Този клас показва екстремно
                        затлъстяване, което може да предизвика сериозни
                        здравословни проблеми и изисква внимание от специалист в
                        здравеопазването.
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
              />
            </Flex>
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
              minH={{ sm: "100px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForKilogramsData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Килограми"
              />
            </Card>
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "100px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForHeightData}
                lineChartOptions={lineChartOptions}
                lineChartLabelName="Височина"
              />
            </Card>
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
}
