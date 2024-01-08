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
import { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Text,
  Button,
  Input,
  SimpleGrid,
  Stack,
  Radio,
  RadioGroup,
  MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
  useColorModeValue,
  Menu,
} from "@chakra-ui/react";
// Assets
import {
	MdOutlineInfo,
	MdOutlinePerson,
} from 'react-icons/md';

import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import CalorieRequirements from "./components/CalorieRequirements";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";
import { HealthInfo, BodyMass, DailyCaloryRequirements, MacroNutrientsData, Goal } from '../../../types/weightStats';
import Loading from "./components/Loading";

import MealPlanner from './components/MealPlanner';
import { HSeparator } from "components/separator/Separator";

export default function WeightStats() {
  
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue('secondaryGray.500', 'white');
	const textHover = useColorModeValue(
		{ color: 'secondaryGray.900', bg: 'unset' },
		{ color: 'secondaryGray.500', bg: 'unset' }
	);
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgList = useColorModeValue('white', 'whiteAlpha.100');
	const bgShadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

  const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

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
      'Mild weight loss': {
        'loss weight': '0',
        'calory': 0,
      },
      'Weight loss': {
        'loss weight': '0',
        'calory': 0,
      },
      'Extreme weight loss': {
        'loss weight': '0',
        'calory': 0,
      },
      'Mild weight gain': {
        'gain weight': '0',
        'calory': 0,
      },
      'Weight gain': {
        'gain weight': '0',
        'calory': 0,
      },
      'Extreme weight gain': {
        'gain weight': '0',
        'calory': 0,
      },
    },
    }))
  ); 

  const [tableData, setTableData] = useState<MacroNutrientsData[]>(Array.from({ length: 6 }, (_) => ([
    {
      name: 'Балансирана',
      protein: 0,
      fat: 0,
      carbs: 0
    },
    {
      name:'Ниско съдържание на мазнини',
      protein: 0,
      fat: 0,
      carbs: 0
    },
    {
      name: 'Ниско съдържание на въглехидрати',
      protein: 0,
      fat: 0,
      carbs: 0
    },
    {
      name: 'Високо съдържание на Протеин',
      protein: 0,
      fat: 0,
      carbs: 0
    }, 
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

  const headers = {
    "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
    "X-RapidAPI-Key": "9f28f7d48amsh2d3e88bff5dc3e3p128d8ajsn8d2c53ac54e5",
    "Content-Type": "application/json",
  }

  const fetchPerfectWeightData = async (gender: string, height: number) => {
    try {
      fetch(
        `https://fitness-calculator.p.rapidapi.com/idealweight?gender=${gender}&height=${height}`,
        {
          method: "GET",
          headers: headers,
        }
      )

      .then((res) => res.json())
      .then((data) => {
        const bodyMassInfo: HealthInfo = {
          Hamwi: data.data.Hamwi,
          Devine: data.data.Devine,
          Miller: data.data.Miller,
          Robinson: data.data.Robinson,
        };
        setPerfectWeight(bodyMassInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });      
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes('failed to fetch')) {
        console.error('Error fetching data. Please check your internet connection.')
      } else {
        console.error('An error occurred while fetching data:', err.message);
      };
    }
  };

  const fetchBodyFatAndLeanMassData = async (age: number, gender: string, height: number, weight: number, neck: number, waist: number, hip: number) => {
    try {
      fetch(
        `https://fitness-calculator.p.rapidapi.com/bodyfat?age=${age}&gender=${gender}&weight=${weight}&height=${height}&neck=${neck}&waist=${waist}&hip=${hip}`,
        {
          method: "GET",
          headers: headers,
        }
      )
      .then((res) => res.json())
      .then((data) => {
        const bodyMassInfo: BodyMass = {
          "Body Fat (U.S. Navy Method)":
            data.data["Body Fat (U.S. Navy Method)"],
          "Body Fat Mass": data.data["Body Fat Mass"],
          "Lean Body Mass": data.data["Lean Body Mass"],
        };
        setBodyFatMassAndLeanMass(bodyMassInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });     
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes('failed to fetch')) {
        console.error('Error fetching data. Please check your internet connection.')
      } else {
        console.error('An error occurred while fetching data:', err.message);
      };
    }
  };

  const fetchCaloriesForActivityLevels = async (age: number, gender: string, height: number, weight: number) => {
    try {
      const requests = [];

      for (let i = 1; i <= 6; i++) {
        const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=${age}&gender=${gender}&weight=${weight}&height=${height}&activitylevel=level_${i}`;

        requests.push(
          fetch(url, {
            method: 'GET',
            headers: headers,
          })
        );
      }

      const responses = await Promise.all(requests);

      const data = await Promise.all(responses.map((res) => res.json()));

      const dailyCaloryRequirementsData = data.map((levelData, index): DailyCaloryRequirements => {
        return {
          level: index + 1,
          BMR: levelData.data.BMR,
          goals: {
            "maintain weight": levelData.data.goals["maintain weight"],
            "Mild weight loss": {
                "loss weight": levelData.data.goals["Mild weight loss"]["loss weight"],
                "calory": levelData.data.goals["Mild weight loss"].calory
            },
            "Weight loss": {
                "loss weight": levelData.data.goals["Weight loss"]["loss weight"],
                "calory": levelData.data.goals["Weight loss"].calory
            },
            "Extreme weight loss": {
                "loss weight": levelData.data.goals["Extreme weight loss"]["loss weight"],
                "calory": levelData.data.goals["Extreme weight loss"].calory
            },
            "Mild weight gain": {
                "gain weight": levelData.data.goals["Mild weight gain"]["gain weight"],
                "calory": levelData.data.goals["Mild weight gain"].calory
            },
            "Weight gain": {
                "gain weight": levelData.data.goals["Weight gain"]["gain weight"],
                "calory": levelData.data.goals["Weight gain"].calory
            },
            "Extreme weight gain": {
                "gain weight": levelData.data.goals["Extreme weight gain"]["gain weight"],
                "calory": levelData.data.goals["Extreme weight gain"].calory
            }
          },
        };
      });

      setDailyCaloryRequirements(dailyCaloryRequirementsData);
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes('failed to fetch')) {
        console.error('Error fetching data. Please check your internet connection.')
      } else {
        console.error('An error occurred while fetching data:', err.message);
      };
    }
  };
    

  const fetchMacroNutrients = async (age: number, gender: string, height: number, weight: number, goal: Goal) => {
    try {
      const requests = [];

      for (let i = 1; i <= 6; i++) {
        const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=${age}&gender=${gender}&activitylevel=${i}&goal=${goal}&weight=${weight}&height=${height}`;

        requests.push(
          fetch(url, {
            method: 'GET',
            headers: headers,
          })
        );
      }

      const responses = await Promise.all(requests);

      const data = await Promise.all(responses.map((res) => res.json()));

      const tableData: MacroNutrientsData[] = data.map((item) => ([
        {
          name: 'Балансирана',
          protein: item.data.balanced.protein.toFixed(2),
          fat: item.data.balanced.fat.toFixed(2),
          carbs: item.data.balanced.carbs.toFixed(2)
        },
        {
          name: 'Ниско съдържание на мазнини',
          protein: item.data.lowfat.protein.toFixed(2),
          fat: item.data.lowfat.fat.toFixed(2),
          carbs: item.data.lowfat.carbs.toFixed(2)
        },
        {
          name: 'Ниско съдържание на въглехидрати',
          protein: item.data.lowcarbs.protein.toFixed(2),
          fat: item.data.lowcarbs.fat.toFixed(2),
          carbs: item.data.lowcarbs.carbs.toFixed(2)
        },
        {
          name: 'Високо съдържание на Протеин',
          protein: item.data.highprotein.protein.toFixed(2),
          fat: item.data.highprotein.fat.toFixed(2),
          carbs: item.data.highprotein.carbs.toFixed(2)
        },
      ]));

      setTableData(tableData);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const [userData, setUserData] = useState<{
    gender: 'male' | 'female',
    height: number,
    age: number,
    weight: number,
    neck: number,
    waist: number,
    hip: number,
    goal: Goal
  }>({
    gender: 'male',
    height: 185,
    age: 16,
    weight: 105,
    neck: 39,
    waist: 108,
    hip: 117,
    goal: 'weightlose'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  
  function generateStats(){
    fetchPerfectWeightData(userData["gender"], userData["height"]);
    fetchBodyFatAndLeanMassData(userData["age"], userData["gender"], userData["height"], userData["weight"], userData["neck"], userData["waist"], userData["hip"]);
    fetchCaloriesForActivityLevels(userData["age"], userData["gender"], userData["height"], userData["weight"]);
    fetchMacroNutrients(userData["age"], userData["gender"], userData["height"], userData["weight"], userData["goal"]);

    setIsSubmitted(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

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
                <Card
                  p="20px"
                  alignItems="center"
                  flexDirection="column"
                  w="100%"
                  mb="20px"
                >
                  <Box gap="10px" mb="20px">
                    {Object.entries(userData).map(([key, value]) => (
                      <label key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        {typeof value === "number" ? (
                          <Input
                            type="number"
                            name={key}
                            value={value}
                            onChange={(e) => handleInputChange(e)}
                          />
                        ) : key === "gender" ? (
                          <Stack direction="row">
                            <Radio
                              value="male"
                              onChange={() => handleRadioChange(key, "male")}
                              isChecked={value === "male"}
                            >
                              Male
                            </Radio>
                            <Radio
                              value="female"
                              onChange={() => handleRadioChange(key, "female")}
                              isChecked={value === "female"}
                            >
                              Female
                            </Radio>
                          </Stack>
                        ) : key === "goal" ? (
                          <Stack direction="row">
                            <Radio
                              value="maintain"
                              onChange={() => handleRadioChange(key, "maintain")}
                              isChecked={value === "maintain"}
                            >
                              Maintain Weight
                            </Radio>
                            <Radio
                              value="mildlose"
                              onChange={() => handleRadioChange(key, "mildlose")}
                              isChecked={value === "mildlose"}
                            >
                              Mild Weight Loss
                            </Radio>
                            <Radio
                              value="weightlose"
                              onChange={() => handleRadioChange(key, "weightlose")}
                              isChecked={value === "weightlose"}
                            >
                              Weight Loss
                            </Radio>
                            <Radio
                              value="extremelose"
                              onChange={() => handleRadioChange(key, "extremelose")}
                              isChecked={value === "extremelose"}
                            >
                              Extreme Weight Loss
                            </Radio>
                            <Radio
                              value="mildgain"
                              onChange={() => handleRadioChange(key, "mildgain")}
                              isChecked={value === "mildgain"}
                            >
                              Mild Weight Gain
                            </Radio>
                            <Radio
                              value="weightgain"
                              onChange={() => handleRadioChange(key, "weightgain")}
                              isChecked={value === "weightgain"}
                            >
                              Weight Gain
                            </Radio>
                            <Radio
                              value="extremegain"
                              onChange={() => handleRadioChange(key, "extremegain")}
                              isChecked={value === "extremegain"}
                            >
                            Extreme Weight Gain
                          </Radio>
                        </Stack>
                        ) : (
                          <Input
                            type="radio"
                            id={value}
                            name="goal"
                            value={value}
                            onChange={(e) => handleInputChange(e)}
                          />
                        )}
                      </label>
                    ))}
                    <Button onClick={generateStats}>Submit</Button>
                  </Box>
                </Card>
                <Loading />
              </Box>
            ) : (
              <Box>
                <Card
                  p="20px"
                  alignItems="center"
                  flexDirection="column"
                  w="100%"
                  mb="20px"
                >
                  <Box gap="10px" mb="20px">
                    {Object.entries(userData).map(([key, value]) => (
                      <label key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                        {typeof value === "number" ? (
                          <Input
                            type="number"
                            name={key}
                            value={value}
                            defaultValue={1}
                            onChange={(e) => handleInputChange(e)}
                          />
                        ) : key === "gender" ? (
                          <Stack direction="row">
                            <Radio
                              value="male"
                              onChange={() => handleRadioChange(key, "male")}
                              isChecked={value === "male"}
                            >
                              Male
                            </Radio>
                            <Radio
                              value="female"
                              onChange={() => handleRadioChange(key, "female")}
                              isChecked={value === "female"}
                            >
                              Female
                            </Radio>
                          </Stack>
                        ) : key === "goal" ? (
                          <Stack direction="row">
                            <Radio
                              value="maintain"
                              onChange={() => handleRadioChange(key, "maintain")}
                              isChecked={value === "maintain"}
                            >
                              Maintain Weight
                            </Radio>
                            <Radio
                              value="mildlose"
                              onChange={() => handleRadioChange(key, "mildlose")}
                              isChecked={value === "mildlose"}
                            >
                              Mild Weight Loss
                            </Radio>
                            <Radio
                              value="weightlose"
                              onChange={() => handleRadioChange(key, "weightlose")}
                              isChecked={value === "weightlose"}
                            >
                              Weight Loss
                            </Radio>
                            <Radio
                              value="extremelose"
                              onChange={() => handleRadioChange(key, "extremelose")}
                              isChecked={value === "extremelose"}
                            >
                              Extreme Weight Loss
                            </Radio>
                            <Radio
                              value="mildgain"
                              onChange={() => handleRadioChange(key, "mildgain")}
                              isChecked={value === "mildgain"}
                            >
                              Mild Weight Gain
                            </Radio>
                            <Radio
                              value="weightgain"
                              onChange={() => handleRadioChange(key, "weightgain")}
                              isChecked={value === "weightgain"}
                            >
                              Weight Gain
                            </Radio>
                            <Radio
                              value="extremegain"
                              onChange={() => handleRadioChange(key, "extremegain")}
                              isChecked={value === "extremegain"}
                            >
                            Extreme Weight Gain
                          </Radio>
                        </Stack>
                        ) : (
                          <Input
                            type="radio"
                            id={value}
                            name="goal"
                            value={value}
                            onChange={(e) => handleInputChange(e)}
                          />
                        )}
                      </label>
                    ))}
                    <Button onClick={generateStats}>Submit</Button>
                  </Box>
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
                  <Box gap="10px" mb="20px">
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
                              maxW='100%'
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
                    Колко калории трябва да приемате на ден според целите:
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
                    tableName='Макронутриенти' 
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
                <Card
                  p="20px"
                  alignItems="center"
                  flexDirection="column"
                  w="100%"
                  mb="20px"
                >
                  <MealPlanner chosenCalories={clickedValueCalories} chosenNutrients={clickedValueNutrients} />
                </Card>
              </Box>
            )}
          </Box>
        ) : (
          <Card
            p="20px"
            alignItems="center"
            flexDirection="column"
            w="100%"
            mb="20px"
          >
            <Box gap="10px" mb="20px">
              {Object.entries(userData).map(([key, value]) => (
              <label key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                {typeof value === "number" ? (
                  <Input
                    type="number"
                    name={key}
                    value={value}
                    onChange={(e) => handleInputChange(e)}
                  />
                ) : key === "gender" ? (
                  <Stack direction="row">
                    <Radio
                      value="male"
                      onChange={() => handleRadioChange(key, "male")}
                      isChecked={value === "male"}
                    >
                      Мъж
                    </Radio>
                    <Radio
                      value="female"
                      onChange={() => handleRadioChange(key, "female")}
                      isChecked={value === "female"}
                    >
                      Жена
                    </Radio>
                  </Stack>
                ) : key === "goal" ? (
                  <Stack direction="row">
                    <Radio
                      value="maintain"
                      onChange={() => handleRadioChange(key, "maintain")}
                      isChecked={value === "maintain"}
                    >
                      Запази тегло
                    </Radio>
                    <Radio
                      value="mildlose"
                      onChange={() => handleRadioChange(key, "mildlose")}
                      isChecked={value === "mildlose"}
                    >
                      Леко сваляне на тегло
                    </Radio>
                    <Radio
                      value="weightlose"
                      onChange={() => handleRadioChange(key, "weightlose")}
                      isChecked={value === "weightlose"}
                    >
                      Сваляне на тегло
                    </Radio>
                    <Radio
                      value="extremelose"
                      onChange={() => handleRadioChange(key, "extremelose")}
                      isChecked={value === "extremelose"}
                    >
                      Екстремно сваляне на тегло
                    </Radio>
                    <Radio
                      value="mildgain"
                      onChange={() => handleRadioChange(key, "mildgain")}
                      isChecked={value === "mildgain"}
                    >
                      Леко качване на тегло
                    </Radio>
                    <Radio
                      value="weightgain"
                      onChange={() => handleRadioChange(key, "weightgain")}
                      isChecked={value === "weightgain"}
                    >
                      Качване на тегло
                    </Radio>
                    <Radio
                      value="extremegain"
                      onChange={() => handleRadioChange(key, "extremegain")}
                      isChecked={value === "extremegain"}
                    >
                      Екстремно качване на тегло
                  </Radio>
                </Stack>
                ) : (
                  <Input
                    type="radio"
                    id={value}
                    name="goal"
                    value={value}
                    onChange={(e) => handleInputChange(e)}
                  />
                )}
              </label>
              ))}
              <Button onClick={generateStats}>Готово</Button>
            </Box>
          </Card>
        )}
      </Box>   
    </Box> 
  );
}