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
  Link,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdAddTask,
  MdAttachMoney,
  MdHealing,
  MdFileCopy,
} from "react-icons/md";

// --from Kaloyan hands --

import { useState, useEffect } from 'react';

type HealthInfo = {
  "Hamwi": number,
  "Devine": number,
  "Miller": number,
  "Robinson": number
};

type BodyMass = {
  "Body Fat (U.S. Navy Method)": number,
  "Body Fat Mass": number,
  "Lean Body Mass": number
};

type DailyCaloryRequirement = {
  "BMR": number,
  "goals": {
      "maintain weight": number,
      "Mild weight loss": {
          "loss weight": string,
          "calory": number
      },
      "Weight loss": {
          "loss weight": string,
          "calory": number
      },
      "Extreme weight loss": {
          "loss weight": string,
          "calory": number
      },
      "Mild weight gain": {
          "gain weight": string,
          "calory": number
      },
      "Weight gain": {
          "gain weight": string,
          "calory": number
      },
      "Extreme weight gain": {
          "gain weight": string,
          "calory": number
      }
  }
};

// --from Kaloyan hands --

export default function WeightStats() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorBrand = useColorModeValue('brand.500', 'white');

  const [perfectWeight, setPerfectWeight] = useState<HealthInfo>({
    "Hamwi": null,
    "Devine": null,
    "Miller": null,
    "Robinson": null
  });

  const [bodyFatMassAndLeanMass, setBodyFatMassAndLeanMass] = useState<BodyMass>({
    "Body Fat (U.S. Navy Method)": null,
    "Body Fat Mass": null,
    "Lean Body Mass": null
  });

  const [dailyCaloryRequirement, setDailyCaloryRequirement] = useState<DailyCaloryRequirement>({
    "BMR": null,
    "goals": {
        "maintain weight": null,
        "Mild weight loss": {
            "loss weight": "",
            "calory": null
        },
        "Weight loss": {
            "loss weight": "",
            "calory": null
        },
        "Extreme weight loss": {
            "loss weight": "",
            "calory": null
        },
        "Mild weight gain": {
            "gain weight": "",
            "calory": null
        },
        "Weight gain": {
            "gain weight": "",
            "calory": null
        },
        "Extreme weight gain": {
            "gain weight": "",
            "calory": null
        }
    }
  });  

  useEffect(() => {
    fetch('https://fitness-calculator.p.rapidapi.com/idealweight?gender=male&height=185', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
        'X-RapidAPI-Key': 'e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab', // Replace with your actual RapidAPI key
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
        .then((data) => {
            const bodyMassInfo: HealthInfo = {
              "Hamwi": data.data.Hamwi,
              "Devine": data.data.Devine,
              "Miller": data.data.Miller,
              "Robinson": data.data.Robinson
            };
            console.log(bodyMassInfo);
            setPerfectWeight(bodyMassInfo);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);
  
  useEffect(() => {
    fetch('https://fitness-calculator.p.rapidapi.com/bodyfat?age=16&gender=male&weight=107&height=185&neck=50&waist=96&hip=92', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com',
        'X-RapidAPI-Key': 'e3ed959789msh812fb49d4659a43p1f5983jsnd957c64a5aab', 
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
        .then((data) => {
            const bodyMassInfo: BodyMass = {
              "Body Fat (U.S. Navy Method)": data.data['Body Fat (U.S. Navy Method)'],
              "Body Fat Mass": data.data['Body Fat Mass'],
              "Lean Body Mass": data.data['Lean Body Mass']
            };
            console.log(bodyMassInfo);
            setBodyFatMassAndLeanMass(bodyMassInfo);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);  

  useEffect(() => {
    fetch('https://fitness-calculator.p.rapidapi.com/dailycalorie?age=16&gender=male&weight=110&height=185&activitylevel=level_1', {
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
              "BMR": data.data.BMR,
              "goals": {
                  "maintain weight": data.data.goals["maintain weight"],
                  "Mild weight loss": {
                      "loss weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Mild weight loss"].calory
                  },
                  "Weight loss": {
                      "loss weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Weight loss"].calory
                  },
                  "Extreme weight loss": {
                      "loss weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Extreme weight loss"].calory
                  },
                  "Mild weight gain": {
                      "gain weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Mild weight gain"].calory
                  },
                  "Weight gain": {
                      "gain weight": data.data.goals["Mild weight loss"]["loss weight"],
                      "calory": data.data.goals["Weight gain"].calory
                  },
                  "Extreme weight gain": {
                      "gain weight": "1 kg",
                      "calory": data.data.goals["Extreme weight gain"].calory
                  }
              }
            }

            console.log(dailyCaloryRequirement);
            setDailyCaloryRequirement(dailyCaloryRequirement);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);    

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>Какво е вашето перфектно тегло според формулите:</Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
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

      <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>Колко от вашето тегло е :</Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
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
          value={bodyFatMassAndLeanMass['Body Fat (U.S. Navy Method)']}
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
          value={bodyFatMassAndLeanMass['Body Fat Mass']}
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
          value={bodyFatMassAndLeanMass['Lean Body Mass']}
        />
      </SimpleGrid>

      <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>Колко калории трябва да приемате на ден според целите:</Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap="20px"
        mb="20px"
      >
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
          name="Сваляне на тегл"
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
