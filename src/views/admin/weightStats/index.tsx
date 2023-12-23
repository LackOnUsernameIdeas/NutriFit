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
import { HealthInfo, BodyMass, DailyCaloryRequirement, MacroNutrients, ActivityLevel } from '../../../types/weightStats';
import ColumnsTable from 'views/admin/dataTables/components/ColumnsTable';
import tableDataColumns from 'views/admin/dataTables/variables/tableDataColumns';

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

  const [dailyCaloryRequirement, setDailyCaloryRequirement] =
    useState<DailyCaloryRequirement>({
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
  
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(1);

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

    fetch(`https://fitness-calculator.p.rapidapi.com/dailycalorie?age=16&gender=male&weight=110&height=185&activitylevel=level_${activityLevel}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
        'X-RapidAPI-Key': 'e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab', 
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
        .then((data) => {
            const dailyCaloryRequirement: DailyCaloryRequirement = {
              "BMR": data.data.BMR.toFixed(2),
              "goals": {
                  "maintain weight": data.data.goals["maintain weight"].toFixed(2),
                  "Mild weight loss": {
                      "loss weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Mild weight loss"].calory.toFixed(2)
                  },
                  "Weight loss": {
                      "loss weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Weight loss"].calory.toFixed(2)
                  },
                  "Extreme weight loss": {
                      "loss weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Extreme weight loss"].calory.toFixed(2)
                  },
                  "Mild weight gain": {
                      "gain weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Mild weight gain"].calory.toFixed(2)
                  },
                  "Weight gain": {
                      "gain weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Weight gain"].calory.toFixed(2)
                  },
                  "Extreme weight gain": {
                      "gain weight": "1 kg",
                      "calory": data.data.goals["Extreme weight gain"].calory.toFixed(2)
                  }
              }
            }

            console.log(dailyCaloryRequirement);
            setDailyCaloryRequirement(dailyCaloryRequirement);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, [activityLevel]);    

  useEffect(() => {
    fetch(`https://fitness-calculator.p.rapidapi.com/macrocalculator?age=16&gender=male&activitylevel=${activityLevel}&goal=weightlose&weight=107&height=185`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
        'X-RapidAPI-Key': 'e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab', 
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
        .then((data) => {

            const gosho: MacroNutrients = {
              "balanced": {
                "protein": data.data.balanced.protein.toFixed(2),
                "fat": data.data.balanced.fat.toFixed(2),
                "carbs": data.data.balanced.carbs.toFixed(2)
              },
              "lowfat": {
                  "protein": data.data.lowfat.protein.toFixed(2),
                  "fat": data.data.lowfat.fat.toFixed(2),
                  "carbs": data.data.lowfat.carbs.toFixed(2)
              },
              "lowcarbs": {
                  "protein": data.data.lowcarbs.protein.toFixed(2),
                  "fat": data.data.lowcarbs.fat.toFixed(2),
                  "carbs": data.data.lowcarbs.carbs.toFixed(2)
              },
              "highprotein": {
                  "protein": data.data.highprotein.protein.toFixed(2),
                  "fat": data.data.highprotein.fat.toFixed(2),
                  "carbs": data.data.highprotein.carbs.toFixed(2)
              }
            };

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
            setMacroNutrients(gosho);
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
              <Button
                colorScheme={activityLevel === 1 ? 'blue' : 'gray'}
                onClick={() => setActivityLevel(1)}
              >
                Level 1
              </Button>
              <Button
                colorScheme={activityLevel === 2 ? 'blue' : 'gray'}
                onClick={() => setActivityLevel(2)}
              >
                Level 2
              </Button>
              <Button
                colorScheme={activityLevel === 3 ? 'blue' : 'gray'}
                onClick={() => setActivityLevel(3)}
              >
                Level 3
              </Button>
              <Button
                colorScheme={activityLevel === 4 ? 'blue' : 'gray'}
                onClick={() => setActivityLevel(4)}
              >
                Level 4
              </Button>
              <Button
                colorScheme={activityLevel === 5 ? 'blue' : 'gray'}
                onClick={() => setActivityLevel(5)}
              >
                Level 5
              </Button>
              <Button
                colorScheme={activityLevel === 6 ? 'blue' : 'gray'}
                onClick={() => setActivityLevel(6)}
              >
                Level 6
              </Button>
            </ButtonGroup>
          </Flex>
        </Box> 
          
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
          
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
            name="Базов метаболизъм"
            value={dailyCaloryRequirement.BMR}
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
            name="Запазване на тегло"
            value={dailyCaloryRequirement.goals["maintain weight"]}
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
            name="Леко сваляне на тегл"
            value={dailyCaloryRequirement.goals["Mild weight loss"].calory}
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
            name="Сваляне на тегло"
            value={dailyCaloryRequirement.goals["Weight loss"].calory}
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
            name="Екстремно сваляне на тегло"
            value={dailyCaloryRequirement.goals["Extreme weight loss"].calory}
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
            name="Леко качване на тегло"
            value={dailyCaloryRequirement.goals["Mild weight gain"].calory}
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
            name="Качване на тегло"
            value={dailyCaloryRequirement.goals["Weight gain"].calory}
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
            name="Екстремно качване на тегло"
            value={dailyCaloryRequirement.goals["Extreme weight gain"].calory}
          />
        </SimpleGrid>
      </Card>
      <ColumnsTable tableData={tableData} 
      />
        
      {/* <Flex
        mt='45px'
        mb='20px'
        justifyContent='space-between'
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'start', md: 'center' }}>
        <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'
      >
          Trending NFTs
        </Text>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
        <NFT
          name='Abstract Colors'
          author='By Esthera Jackson'
          bidders={[]}
          image={Nft1}
          currentbid='0.91 ETH'
          download='#'
        />
        <NFT
          name='ETH AI Brain'
          author='By Nick Wilson'
          bidders={[ Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1 ]}
          image={Nft2}
          currentbid='0.91 ETH'
          download='#'
        />
        <NFT
          name='Mesh Gradients '
          author='By Will Smith'
          bidders={[ Avatar1, Avatar2, Avatar3, Avatar4, Avatar1, Avatar1, Avatar1, Avatar1 ]}
          image={Nft3}
          currentbid='0.91 ETH'
          download='#'
        />
      </SimpleGrid> */}
    </Box>
  );
}
