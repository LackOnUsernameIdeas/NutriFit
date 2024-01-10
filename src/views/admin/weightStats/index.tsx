import React, { useState } from "react";
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
} from "@chakra-ui/react";
import {
  MdOutlineInfo,
} from 'react-icons/md';
import {
  GiWeightLiftingUp,
  GiWeightScale
} from "react-icons/gi";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import CalorieRequirements from "./components/CalorieRequirements";
import UserPersonalData from "./components/UserPersonalData";
import Loading from "./components/Loading";
import MealPlanner from './components/MealPlanner';
import { HSeparator } from "components/separator/Separator";
import { BMIInfo, HealthInfo, BodyMass, UserData, DailyCaloryRequirements, MacroNutrientsData } from '../../../types/weightStats';

import { fetchBMIData, fetchPerfectWeightData, fetchBodyFatAndLeanMassData, fetchCaloriesForActivityLevels, fetchMacroNutrients } from "./utils/fetchFunctions";

export default function WeightStats() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue('secondaryGray.500', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const bgList = useColorModeValue('white', 'whiteAlpha.100');
  const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
  const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

  const [BMIIndex, setBMIIndex] = useState<BMIInfo>({
    "bmi": null,
    "health": "",
    "healthy_bmi_range": ""
  });

  const [perfectWeight, setPerfectWeight] = useState<HealthInfo>({
    Hamwi: 0,
    Devine: 0,
    Miller: 0,
    Robinson: 0,
  });

  const [bodyFatMassAndLeanMass, setBodyFatMassAndLeanMass] = useState<BodyMass>({
    "Body Fat (U.S. Navy Method)": 0,
    "Body Fat Mass": 0,
    "Lean Body Mass": 0,
  });

  const [dailyCaloryRequirements, setDailyCaloryRequirements] = useState<DailyCaloryRequirements[]>(Array.from({ length: 6 }, (_, index) => ({
    level: index + 1,
    BMR: 0,
    goals: {
      'maintain weight': 0,
      'Mild weight loss': { 'loss weight': '0', 'calory': 0 },
      'Weight loss': { 'loss weight': '0', 'calory': 0 },
      'Extreme weight loss': { 'loss weight': '0', 'calory': 0 },
      'Mild weight gain': { 'gain weight': '0', 'calory': 0 },
      'Weight gain': { 'gain weight': '0', 'calory': 0 },
      'Extreme weight gain': { 'gain weight': '0', 'calory': 0 },
    },
  })));

  const [tableData, setTableData] = useState<MacroNutrientsData[]>(Array.from({ length: 6 }, (_) => ([
    { name: 'Балансирана', protein: 0, fat: 0, carbs: 0 },
    { name: 'Ниско съдържание на мазнини', protein: 0, fat: 0, carbs: 0 },
    { name: 'Ниско съдържание на въглехидрати', protein: 0, fat: 0, carbs: 0 },
    { name: 'Високо съдържание на Протеин', protein: 0, fat: 0, carbs: 0 },
  ])));

  const [clickedValueNutrients, setClickedValueNutrients] = useState({
    name: "",
    protein: null,
    fat: null,
    carbs: null
  });

  const [clickedValueCalories, setClickedValueCalories] = useState<number | null>(null);

  const [activityLevel, setActivityLevel] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    gender: 'male',
    height: 0,
    age: 0,
    weight: 0,
    neck: 0,
    waist: 0,
    hip: 0,
    goal: 'maintain'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  
  function generateStats(){
    fetchBMIData(userData["age"], userData["height"], userData["weight"], setBMIIndex);
    fetchPerfectWeightData(userData["gender"], userData["height"], setPerfectWeight);
    fetchBodyFatAndLeanMassData(userData["age"], userData["gender"], userData["height"], userData["weight"], userData["neck"], userData["waist"], userData["hip"], setBodyFatMassAndLeanMass);
    fetchCaloriesForActivityLevels(userData["age"], userData["gender"], userData["height"], userData["weight"], setDailyCaloryRequirements);
    fetchMacroNutrients(userData["age"], userData["gender"], userData["height"], userData["weight"], userData["goal"], setTableData);

    setIsSubmitted(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  const bmiData: string[] = ['ИТМ(Индексът на телесната маса)', 'Статус', 'диапазон на здравословен ИТМ']
  const perfectWeightWidgetsData: string[] = ['Хамви', 'Дивайн', 'Милър', 'Робинсън'];
  const bodyFatAndLeanMassWidgetsData: string[] = ['% телесни мазнини', 'Мастна телесна маса', 'Чиста телесна маса'];
  const bodyFatAndLeanMassWidgetsUnits: string[] = ['%','kg','kg'];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value)
    }));
  };  

  const handleRadioChange = (key: string, radioValue: string) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: radioValue,
    }));
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Box>
        {isSubmitted ? (
          <Box>
            {isLoading ? (
              <Box>
                <UserPersonalData userData={userData} handleInputChange={handleInputChange} handleRadioChange={handleRadioChange} generateStats={generateStats} />
                <Loading />
              </Box>
            ) : (
              <Box>
                <UserPersonalData userData={userData} handleInputChange={handleInputChange} handleRadioChange={handleRadioChange} generateStats={generateStats} />
                <Card
                  p="20px"
                  alignItems="center"
                  flexDirection="column"
                  w="100%"
                  mb="20px"
                >
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mb="10px">
                    {Object.entries(BMIIndex).map(([key, value], index) => (
                      <MiniStatistics
                        key={key} 
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                              <Icon w="32px" h="32px" as={GiWeightScale} color={brandColor} />
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
                  <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                    Какво е вашето перфектно тегло според формулите:
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 1, lg: 4 }} gap="20px" mb="10px">
                    {Object.entries(perfectWeight).map(([key, value], index) => (
                      <MiniStatistics
                        key={key}
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                              <Icon w="32px" h="32px" as={GiWeightLiftingUp} color={brandColor} />
                            }
                          />
                        }
                        name={perfectWeightWidgetsData[index]}
                        value={value + ' kg'}
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
                  <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                    Колко от вашето тегло е :
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mb="10px">
                    {Object.entries(bodyFatMassAndLeanMass).map(([key, value], index) => (
                      <MiniStatistics
                        key={key} 
                        startContent={
                          <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                              <Icon w="32px" h="32px" as={GiWeightScale} color={brandColor} />
                            }
                          />
                        }
                        name={bodyFatAndLeanMassWidgetsData[index]}
                        value={value + ' ' + bodyFatAndLeanMassWidgetsUnits[index]}
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
                  <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                    Изберете ниво на натовареност:
                  </Text>
                  <Box gap="10px" mb="20px" mt="20px">
                    <Flex justifyContent='space-between' align='center'>
                      <SimpleGrid columns={{ base: 3, md: 2, lg: 7 }} spacing="10px" alignItems="center" mb="10px">
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <Button
                              key={level}
                              fontSize={{ base: "sm", md: "md" }}
                              margin="0"
                              colorScheme={activityLevel === level ? 'blue' : 'gray'}
                              onClick={() => setActivityLevel(level)}
                            >
                              Ниво {level}
                            </Button>
                          ))}
                          <Menu isOpen={isOpen1} onClose={onClose1}>
                            <MenuButton
                              alignItems='center'
                              justifyContent='center'
                              bg={bgButton}
                              _hover={bgHover}
                              _focus={bgFocus}
                              _active={bgFocus}
                              w='30px'
                              h='30px'
                              lineHeight='50%'
                              onClick={onOpen1}
                              borderRadius='10px'
                              ml="10%"
                              >
                              <Icon as={MdOutlineInfo} color={iconColor} w='24px' h='24px' />
                            </MenuButton>
                            <MenuList
                              w='100%'
                              minW='unset'
                              ml={{ base: "2%", lg: 0 }}
                              mr={{ base: "2%", lg: 0 }}
                              maxW={{ base: "80%", lg: "100%" }}
                              border='transparent'
                              backdropFilter='blur(100px)'
                              bg={bgList}
                              borderRadius='20px'
                              p='15px'>
                              <Box
                                transition='0.2s linear'
                                color={textColor}
                                p='0px'
                                borderRadius='8px'
                                >
                                <Flex align='center'>
                                  <Text fontSize='1xl' fontWeight='400'>
                                    Бутони за определяне на ниво на натовареност. 
                                  </Text>
                                </Flex>
                                <HSeparator />
                                <Flex align='center'>
                                  <Text fontSize='sm' fontWeight='400' mt="10px" mb="5px">
                                    Ниво 1 - Малко или въобще не спортувате.
                                  </Text>
                                </Flex>
                                <Flex align='center'>
                                  <Text fontSize='sm' fontWeight='400' mt="10px" mb="5px">
                                    Ниво 2 - Спортувате умерено 1-3 пъти в седмицата.
                                  </Text>
                                </Flex>
                                <Flex align='center'>
                                  <Text fontSize='sm' fontWeight='400' mt="10px" mb="5px">
                                    Ниво 3 - Спортувате умерено 4-5 пъти в седмицата.
                                  </Text>
                                </Flex>
                                <Flex align='center'>
                                  <Text fontSize='sm' fontWeight='400' mt="10px" mb="5px">
                                    Ниво 4 - Спортувате умерено дневно или интензивно 3-4 пъти в седмицата.
                                  </Text>
                                </Flex>
                                <Flex align='center'>
                                  <Text fontSize='sm' fontWeight='400' mt="10px" mb="5px">
                                    Ниво 5 - Спортувате интензивно 6-7 пъти в седмицата.
                                  </Text>
                                </Flex>
                                <Flex align='center'>
                                  <Text fontSize='sm' fontWeight='400' mt="10px">
                                    Ниво 6 - Спортувате много интензивно цялата седмица.
                                  </Text>
                                </Flex>
                              </Box>
                            </MenuList>
                          </Menu>
                      </SimpleGrid>
                    </Flex>
                  </Box>
                  <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
                    Изберете колко калории искате да приемате на ден според целите:
                  </Text>
                  {activityLevel && (
                    <CalorieRequirements
                      calorieRequirements={dailyCaloryRequirements}
                      selectedActivityLevel={activityLevel}
                      clickedValueCalories={clickedValueCalories}
                      setClickedValueCalories={setClickedValueCalories}
                    />
                  )}
                  <ColumnsTable 
                    tableName='Изберете тип диета:' 
                    tableData={tableData[activityLevel - 1]} 
                    columnsData={[
                      { name: 'name', label: 'Тип диета' },
                      { name: 'protein', label: 'Протеин (гр.)' },
                      { name: 'fat', label: 'Мазнини (гр.)' },
                      { name: 'carbs', label: 'Въглехидрати (гр.)' }	
                    ]} 
                    setState={setClickedValueNutrients}
                    clickedValueProtein={clickedValueNutrients.protein}
                  />
                </Card>
                <MealPlanner chosenCalories={clickedValueCalories} chosenNutrients={clickedValueNutrients} />
              </Box>
            )}
          </Box>
        ) : (
          <UserPersonalData userData={userData} handleInputChange={handleInputChange} handleRadioChange={handleRadioChange} generateStats={generateStats} />
        )}
      </Box>   
    </Box> 
  );
}