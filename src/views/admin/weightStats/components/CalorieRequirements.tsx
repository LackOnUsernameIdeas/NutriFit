import {
    Icon,
    SimpleGrid,
    useColorModeValue,
  } from "@chakra-ui/react";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { MdHealing } from "react-icons/md";
import { DailyCaloryRequirements } from '../../../../types/weightStats';
import { useState, useEffect } from "react";

export default function CalorieRequirements( props: { calorieRequirements: DailyCaloryRequirements[], selectedActivityLevel: number } ) {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    
    const [dailyCaloryRequirements, setDailyCaloryRequirement] = useState<DailyCaloryRequirements[]>(props.calorieRequirements);

    useEffect(() => {
		setDailyCaloryRequirement(props.calorieRequirements);
	}, [props.calorieRequirements, props.selectedActivityLevel]);

    const selectedLevelData = dailyCaloryRequirements[props.selectedActivityLevel - 1];

    console.log(dailyCaloryRequirements, selectedLevelData, 'tezi')
    return (
        <Card>
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
                value={selectedLevelData.BMR.toFixed(2)}
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
                value={selectedLevelData.goals["maintain weight"].toFixed(2)}
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
                value={selectedLevelData.goals["Mild weight loss"].calory.toFixed(2)}
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
                value={selectedLevelData.goals["Weight loss"].calory.toFixed(2)}
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
                value={selectedLevelData.goals["Extreme weight loss"].calory.toFixed(2)}
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
                value={selectedLevelData.goals["Mild weight gain"].calory.toFixed(2)}
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
                value={selectedLevelData.goals["Weight gain"].calory.toFixed(2)}
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
                value={selectedLevelData.goals["Extreme weight gain"].calory.toFixed(2)}
            />
            </SimpleGrid>
        </Card>
    ); 
}