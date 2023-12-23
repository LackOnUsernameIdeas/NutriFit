import {
    Icon,
    SimpleGrid,
    useColorModeValue,
  } from "@chakra-ui/react";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { MdHealing } from "react-icons/md";
import {DailyCaloryRequirement} from '../../../../types/weightStats';
import { useState, useEffect } from "react";

export default function CalorieRequirements( props: { calorieRequirement: DailyCaloryRequirement } ) {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    
    const [dailyCaloryRequirement, setDailyCaloryRequirement] = useState<DailyCaloryRequirement>(props.calorieRequirement);

    useEffect(() => {
		setDailyCaloryRequirement(props.calorieRequirement);
	}, [props.calorieRequirement]);

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
    ); 
}