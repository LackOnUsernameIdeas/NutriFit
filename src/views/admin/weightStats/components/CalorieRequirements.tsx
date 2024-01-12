import { Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import { MdLocalFireDepartment } from "react-icons/md";
import { TbActivityHeartbeat } from "react-icons/tb";
import {
  FaAngleDown,
  FaAngleDoubleDown,
  FaGripLines,
  FaAngleDoubleUp,
  FaAngleUp
} from "react-icons/fa";
import { DailyCaloryRequirements } from "../../../../types/weightStats";
import { useState, useEffect } from "react";

export default function CalorieRequirements(props: {
  calorieRequirements: DailyCaloryRequirements[];
  selectedActivityLevel: number;
  clickedValueCalories?: number | null;
  setClickedValueCalories?: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

  const { clickedValueCalories, setClickedValueCalories } = props;

  const [dailyCaloryRequirements, setDailyCaloryRequirement] = useState<
    DailyCaloryRequirements[]
  >(props.calorieRequirements);

  useEffect(() => {
    setDailyCaloryRequirement(props.calorieRequirements);
  }, [props.calorieRequirements, props.selectedActivityLevel]);

  const selectedLevelData =
    dailyCaloryRequirements[props.selectedActivityLevel - 1];

  return (
    <Card>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px">
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
                  as={MdLocalFireDepartment}
                  color={brandColor}
                />
              }
            />
          }
          name="Базов метаболизъм"
          value={selectedLevelData.BMR.toFixed(2) + " kcal"}
        />
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
                  as={TbActivityHeartbeat}
                  color={brandColor}
                />
              }
            />
          }
          name="Леко сваляне на тегл"
          value={
            selectedLevelData.goals["Mild weight loss"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() =>
            setClickedValueCalories(
              selectedLevelData.goals["Mild weight loss"].calory
            )
          }
          backgroundColor={
            clickedValueCalories ===
            selectedLevelData.goals["Mild weight loss"].calory
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={FaAngleDown} color={brandColor} />
              }
            />
          }
          name="Сваляне на тегло"
          value={
            selectedLevelData.goals["Weight loss"].calory.toFixed(2) + " kcal"
          }
          onClick={() =>
            setClickedValueCalories(
              selectedLevelData.goals["Weight loss"].calory
            )
          }
          backgroundColor={
            clickedValueCalories ===
            selectedLevelData.goals["Weight loss"].calory
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
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
                  as={FaAngleDoubleDown}
                  color={brandColor}
                />
              }
            />
          }
          name="Екстремно сваляне на тегло"
          value={
            selectedLevelData.goals["Extreme weight loss"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() =>
            setClickedValueCalories(
              selectedLevelData.goals["Extreme weight loss"].calory
            )
          }
          backgroundColor={
            clickedValueCalories ===
            selectedLevelData.goals["Extreme weight loss"].calory
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={FaGripLines} color={brandColor} />
              }
            />
          }
          name="Запазване на тегло"
          value={
            selectedLevelData.goals["maintain weight"].toFixed(2) + " kcal"
          }
          onClick={() =>
            setClickedValueCalories(selectedLevelData.goals["maintain weight"])
          }
          backgroundColor={
            clickedValueCalories === selectedLevelData.goals["maintain weight"]
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
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
                  as={TbActivityHeartbeat}
                  color={brandColor}
                />
              }
            />
          }
          name="Леко качване на тегло"
          value={
            selectedLevelData.goals["Mild weight gain"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() =>
            setClickedValueCalories(
              selectedLevelData.goals["Mild weight gain"].calory
            )
          }
          backgroundColor={
            clickedValueCalories ===
            selectedLevelData.goals["Mild weight gain"].calory
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={FaAngleUp} color={brandColor} />
              }
            />
          }
          name="Качване на тегло"
          value={
            selectedLevelData.goals["Weight gain"].calory.toFixed(2) + " kcal"
          }
          onClick={() =>
            setClickedValueCalories(
              selectedLevelData.goals["Weight gain"].calory
            )
          }
          backgroundColor={
            clickedValueCalories ===
            selectedLevelData.goals["Weight gain"].calory
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
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
                  as={FaAngleDoubleUp}
                  color={brandColor}
                />
              }
            />
          }
          name="Екстремно качване на тегло"
          value={
            selectedLevelData.goals["Extreme weight gain"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() =>
            setClickedValueCalories(
              selectedLevelData.goals["Extreme weight gain"].calory
            )
          }
          backgroundColor={
            clickedValueCalories ===
            selectedLevelData.goals["Extreme weight gain"].calory
              ? "rgba(0, 0, 0, 0.3)"
              : undefined
          }
        />
      </SimpleGrid>
    </Card>
  );
}
