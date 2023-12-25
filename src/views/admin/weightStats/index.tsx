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

// Chakra imports
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
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdHealing,
  MdFileCopy,
} from "react-icons/md";


// --from Kaloyan hands --


import { useState, useEffect } from "react";
import { HealthInfo, BodyMass, DailyCaloryRequirement, DailyCaloryRequirements, MacroNutrients } from '../../../types/weightStats';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns';
import CalorieRequirements from "./components/CalorieRequirements";

// --from Kaloyan hands --

export default function WeightStats() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorBrand = useColorModeValue("brand.500", "white");

  const [perfectWeight, setPerfectWeight] = useState<HealthInfo>({
    Hamwi: null,
    Devine: null,
    Miller: null,
    Robinson: null,
  });

  const [bodyFatMassAndLeanMass, setBodyFatMassAndLeanMass] =
    useState<BodyMass>({
      "Body Fat (U.S. Navy Method)": null,
      "Body Fat Mass": null,
      "Lean Body Mass": null,
    });

  const [dailyCaloryRequirement, setDailyCaloryRequirement] = useState<DailyCaloryRequirement>({
      BMR: null,
      goals: {
        "maintain weight": null,
        "Mild weight loss": {
          "loss weight": "",
          calory: null,
        },
        "Weight loss": {
          "loss weight": "",
          calory: null,
        },
        "Extreme weight loss": {
          "loss weight": "",
          calory: null,
        },
        "Mild weight gain": {
          "gain weight": "",
          calory: null,
        },
        "Weight gain": {
          "gain weight": "",
          calory: null,
        },
        "Extreme weight gain": {
          "gain weight": "",
          calory: null,
        },
      },
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

  const [macroNutrients, setMacroNutrients] = useState<MacroNutrients>({
    "balanced": {
      "protein": 0,
      "fat": 0,
      "carbs": 0
    },
    "lowfat": {
        "protein": 0,
        "fat": 0,
        "carbs": 0
    },
    "lowcarbs": {
        "protein": 0,
        "fat": 0,
        "carbs": 0
    },
    "highprotein": {
        "protein": 0,
        "fat": 0,
        "carbs": 0
    }
  });  

  const [tableData, setTableData] = useState([
    {
      name: 'Balanced',
      quantity: macroNutrients.balanced.protein,
      progress: macroNutrients.balanced.fat,
      date: macroNutrients.balanced.carbs, 
    },
    {
      name:'Lowfat',
      quantity: macroNutrients.lowfat.protein,
      progress: macroNutrients.lowfat.fat,
      date: macroNutrients.lowfat.carbs, 
    },
    {
      name: 'Lowcarbs',
      quantity: macroNutrients.lowcarbs.protein,
      progress: macroNutrients.lowcarbs.fat,
      date: macroNutrients.lowcarbs.carbs, 
    },
    {
      name: 'High Protein',
      quantity: macroNutrients.highprotein.protein,
      progress: macroNutrients.highprotein.fat,
      date: macroNutrients.highprotein.carbs, 
    }, 
  ]);
  
  const [activityLevel, setActivityLevel] = useState<number>(1);

  useEffect(() => {
    fetch(
      "https://fitness-calculator.p.rapidapi.com/idealweight?gender=male&height=185",
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
          "X-RapidAPI-Key":
            "e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab", // Replace with your actual RapidAPI key
          "Content-Type": "application/json",
        },
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
        console.log(bodyMassInfo);
        setPerfectWeight(bodyMassInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    fetch(
      "https://fitness-calculator.p.rapidapi.com/bodyfat?age=16&gender=male&weight=107&height=185&neck=50&waist=96&hip=92",
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "fitness-calculator.p.rapidapi.com",
          "X-RapidAPI-Key":
            "e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab",
          "Content-Type": "application/json",
        },
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
        console.log(bodyMassInfo);
        setBodyFatMassAndLeanMass(bodyMassInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    const fetchCaloriesForActivityLevels = async () => {
      try {
        // Create an array to store promises for each request
        const requests = [];
  
        // Iterate over the 6 activity levels
        for (let i = 1; i <= 6; i++) {
          const url = `https://fitness-calculator.p.rapidapi.com/dailycalorie?age=16&gender=male&weight=110&height=185&activitylevel=level_${i}`;
  
          // Push the promise for each request to the array
          requests.push(
            fetch(url, {
              method: 'GET',
              headers: {
                'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
                'X-RapidAPI-Key': 'e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab',
                'Content-Type': 'application/json',
              },
            })
          );
        }
  
        // Wait for all requests to complete
        const responses = await Promise.all(requests);
  
        // Extract the JSON data from each response
        const data = await Promise.all(responses.map((res) => res.json()));

        // Process the data as needed and set the state
        // (This example assumes that the data structure is the same for all activity levels)
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
  
        console.log(dailyCaloryRequirementsData, 'qqqqqqqqqq');
        // Set the state with the collected data
        setDailyCaloryRequirements(dailyCaloryRequirementsData);
      } catch (err: any) {
        console.error(err.message);
      }
    };
  
    fetchCaloriesForActivityLevels(); // Call the helper function
  }, []);
    

  useEffect(() => {
    fetch(`https://fitness-calculator.p.rapidapi.com/macrocalculator?age=16&gender=male&activitylevel=${activityLevel}&goal=weightlose&weight=107&height=185`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
        'X-RapidAPI-Key': 'e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab', 
        'Content-Type': 'application/json'
      },
    })
    .then((res) => res.json())
        .then((data) => {
          

            const tableDataaaa = [
              {
                name: 'Balanced',
                quantity: data.data.balanced.protein.toFixed(2),
                progress: data.data.balanced.fat.toFixed(2),
                date: data.data.balanced.carbs.toFixed(2), 
              },
              {
                name:'Lowfat',
                quantity: data.data.lowfat.protein.toFixed(2),
                progress: data.data.lowfat.fat.toFixed(2),
                date: data.data.lowfat.carbs.toFixed(2), 
              },
              {
                name: 'Lowcarbs',
                quantity: data.data.lowcarbs.protein.toFixed(2),
                progress: data.data.lowcarbs.fat.toFixed(2),
                date:data.data.lowcarbs.carbs.toFixed(2), 
              },
              {
                name: 'High Protein',
                quantity: data.data.highprotein.protein.toFixed(2),
                progress: data.data.highprotein.fat.toFixed(2),
                date: data.data.highprotein.carbs.toFixed(2), 
              }, 
            ]
            
            setTableData(tableDataaaa);
            console.log(macroNutrients);

        })
        .catch((err) => {
            console.log(err.message);
        });
  }, [activityLevel]);   

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
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
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Hamwi"
            value={perfectWeight.Hamwi}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Devine"
            value={perfectWeight.Devine}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Miller"
            value={perfectWeight.Miller}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Robinson"
            value={perfectWeight.Robinson}
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
        <SimpleGrid columns={{ base: 1, md: 1, lg: 3 }} gap="160" mb="0">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Body Fat %"
            value={bodyFatMassAndLeanMass["Body Fat (U.S. Navy Method)"]}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Body Fat Mass"
            value={bodyFatMassAndLeanMass["Body Fat Mass"]}
          />
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon w="32px" h="32px" as={MdHealing} color={brandColor} />
                }
              />
            }
            name="Lean Body Mass"
            value={bodyFatMassAndLeanMass["Lean Body Mass"]}
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
          Колко калории трябва да приемате на ден според целите:
        </Text>
        <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
          <Flex justify="left">
            <ButtonGroup spacing="4">
              {/* Render buttons based on activity levels */}
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <Button
                  key={level}
                  colorScheme={activityLevel === level ? 'blue' : 'gray'}
                  onClick={() => setActivityLevel(level)}
                >
                  Level {level}
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
        </Box>
        {activityLevel && (
          <CalorieRequirements
            calorieRequirements={dailyCaloryRequirements}
            selectedActivityLevel={activityLevel}
          />
        )}
      </Card>
      <ColumnsTable tableData={tableData} 
      />
    </Box>
  );
}