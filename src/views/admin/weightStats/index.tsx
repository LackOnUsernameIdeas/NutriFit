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
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns";
import tableDataComplex from "views/admin/default/variables/tableDataComplex";

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

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <DailyTraffic />
        <ComplexTable tableData={tableDataComplex} />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 2, md: 2, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 2, md: 2, xl: 2 }} gap="20px" mb="20px">
          <PieCard />
          <ColumnsTable tableData={tableDataColumns} />
        </SimpleGrid>
        <Tasks />
      </SimpleGrid>
    </Box>
  );
}
