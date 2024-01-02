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
  ButtonGroup,
  Link,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import CalorieRequirements from "./components/CalorieRequirements";
import { GiWeightLiftingUp, GiWeightScale } from "react-icons/gi";
import { HealthInfo, BodyMass, DailyCaloryRequirements, MacroNutrientsData } from '../../../types/weightStats';
import Loading from "./components/Loading";

export default function WeightStats() {
  
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");

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
  
  const [activityLevel, setActivityLevel] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const headers = {
    "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
    "X-RapidAPI-Key": "9f28f7d48amsh2d3e88bff5dc3e3p128d8ajsn8d2c53ac54e5",
    "Content-Type": "application/json",
  }

  const fetchPerfectWeightData = async () => {
    try {
      fetch(
        "https://fitness-calculator.p.rapidapi.com/idealweight?gender=male&height=185",
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

  const fetchBodyFatAndLeanMassData = async () => {
    try {
      fetch(
        "https://fitness-calculator.p.rapidapi.com/bodyfat?age=16&gender=male&weight=107&height=185&neck=50&waist=96&hip=92",
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

  const fetchCaloriesForActivityLevels = async () => {
    try {
      const requests = [];

      for (let i = 1; i <= 6; i++) {
        const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=16&gender=male&weight=110&height=185&activitylevel=level_${i}`;

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
    

  const fetchMacroNutrients = async () => {
    try {
      const requests = [];

      for (let i = 1; i <= 6; i++) {
        const url = `https://fitness-calculator.p.rapidapi.com/macrocalculator?age=16&gender=male&activitylevel=${i}&goal=weightlose&weight=107&height=185`;

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
  
  useEffect(() => {
    fetchPerfectWeightData();
    fetchBodyFatAndLeanMassData();
    fetchCaloriesForActivityLevels();
    fetchMacroNutrients();
  }, []);

  const perfectWeightWidgetsData: string[] = ['Хамви', 'Дивайн', 'Милър', 'Робинсън'];
  const bodyFatAndLeanMassWidgetsData: string[] = ['% телесни мазнини', 'Мастна телесна маса', 'Чиста телесна маса'];

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {isLoading ? (
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
            <Text color={textColor} fontSize="2xl" ms="24px" fontWeight="700">
              Какво е вашето перфектно тегло според формулите:
            </Text>
            <SimpleGrid columns={{ base: 1, md: 1, lg: 4 }} gap="160px" mb="0px">
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
            <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} gap="160" mb="0">
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
              Колко калории трябва да приемате на ден според целите:
            </Text>
            {activityLevel && (
              <CalorieRequirements
                calorieRequirements={dailyCaloryRequirements}
                selectedActivityLevel={activityLevel}
              />
            )}
            <Box pt={{ base: '130px', md: '10px', xl: '10px' }}>
              <Flex>
                <ButtonGroup spacing="4">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <Button
                      key={level}
                      colorScheme={activityLevel === level ? 'blue' : 'gray'}
                      onClick={() => setActivityLevel(level)}
                    >
                      Ниво {level}
                    </Button>
                  ))}
                </ButtonGroup>
              </Flex>
            </Box>
            <ColumnsTable tableName='Макронутриенти' tableData={tableData[activityLevel - 1]} columnsData={[
                { name: 'name', label: 'Тип диета' },
                { name: 'protein', label: 'Протеин (гр.)' },
                { name: 'fat', label: 'Мазнини (гр.)' },
                { name: 'carbs', label: 'Въглехидрати (гр.)' }	
              ]} 
            />
          </Card>
        </Box>
      )}    
    </Box> 
  );
}