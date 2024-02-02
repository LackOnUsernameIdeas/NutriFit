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
import {
  DailyCaloryRequirements,
  UserData
} from "../../../../types/weightStats";
import { useState, useEffect } from "react";
import { saveGoal } from "database/setGoalUserData";
import { getAuth } from "firebase/auth";
export default function CalorieRequirements(props: {
  calorieRequirements: DailyCaloryRequirements[];
  selectedActivityLevel: number;
  clickedValueCalories?: number | null;
  setClickedValueCalories?: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedGoal?: React.Dispatch<React.SetStateAction<string>>;
  setUserData?: React.Dispatch<React.SetStateAction<UserData>>;
}) {
  const bgHover = useColorModeValue("secondaryGray.200", "whiteAlpha.50");
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.400", "whiteAlpha.100");
  const {
    clickedValueCalories,
    setClickedValueCalories,
    setSelectedGoal,
    setUserData
  } = props;

  const [dailyCaloryRequirements, setDailyCaloryRequirement] = useState<
    DailyCaloryRequirements[]
  >(props.calorieRequirements);

  useEffect(() => {
    setDailyCaloryRequirement(props.calorieRequirements);
  }, [props.calorieRequirements, props.selectedActivityLevel]);
  const uid = getAuth().currentUser.uid;
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
          tooltipLabel="Базов метаболизъм е общото количество енергия, което е нужно на тялото за да поддържа жизнените си функции."
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
          tooltipLabel={`За да отслабнете с ${
            selectedLevelData.goals["Mild weight loss"]["loss weight"]
          } на седмица, трябва да приемате приблизително ${selectedLevelData.goals[
            "Mild weight loss"
          ].calory.toFixed(2)} калории на ден`}
          name="Леко сваляне на тегло"
          value={
            selectedLevelData.goals["Mild weight loss"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(
                selectedLevelData.goals["Mild weight loss"].calory.toFixed(2)
              )
            );
            setSelectedGoal("mildlose");
            saveGoal(uid, "mildlose");
            setUserData((prevState) => ({ ...prevState, goal: "mildlose" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Mild weight loss"].calory.toFixed(2)
            )
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Mild weight loss"].calory.toFixed(2)
            )
              ? true
              : false
          }
          hasHoverAndFocus={true}
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
          tooltipLabel={`За да отслабнете с ${
            selectedLevelData.goals["Weight loss"]["loss weight"]
          } на седмица, трябва да приемате приблизително ${selectedLevelData.goals[
            "Weight loss"
          ].calory.toFixed(2)} калории на ден`}
          name="Сваляне на тегло"
          value={
            selectedLevelData.goals["Weight loss"].calory.toFixed(2) + " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(
                selectedLevelData.goals["Weight loss"].calory.toFixed(2)
              )
            );
            setSelectedGoal("weightlose");
            saveGoal(uid, "weightlose");
            setUserData((prevState) => ({ ...prevState, goal: "weightlose" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(selectedLevelData.goals["Weight loss"].calory.toFixed(2))
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(selectedLevelData.goals["Weight loss"].calory.toFixed(2))
              ? true
              : false
          }
          hasHoverAndFocus={true}
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
          tooltipLabel={`За да отслабнете с ${
            selectedLevelData.goals["Extreme weight loss"]["loss weight"]
          } на седмица, трябва да приемате приблизително ${selectedLevelData.goals[
            "Extreme weight loss"
          ].calory.toFixed(2)} калории на ден`}
          name="Екстремно сваляне на тегло"
          value={
            selectedLevelData.goals["Extreme weight loss"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(
                selectedLevelData.goals["Extreme weight loss"].calory.toFixed(2)
              )
            );
            setSelectedGoal("extremelose");
            saveGoal(uid, "extremelose");
            setUserData((prevState) => ({ ...prevState, goal: "extremelose" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Extreme weight loss"].calory.toFixed(2)
            )
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Extreme weight loss"].calory.toFixed(2)
            )
              ? true
              : false
          }
          hasHoverAndFocus={true}
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
          tooltipLabel={`За да поддържате теглото си, трябва да приемате приблизително ${selectedLevelData.goals[
            "maintain weight"
          ].toFixed(2)} калории на ден`}
          name="Запазване на тегло"
          value={
            selectedLevelData.goals["maintain weight"].toFixed(2) + " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(selectedLevelData.goals["maintain weight"].toFixed(2))
            );
            setSelectedGoal("maintain");
            saveGoal(uid, "maintain");
            setUserData((prevState) => ({ ...prevState, goal: "maintain" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(selectedLevelData.goals["maintain weight"].toFixed(2))
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(selectedLevelData.goals["maintain weight"].toFixed(2))
              ? true
              : false
          }
          hasHoverAndFocus={true}
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
          tooltipLabel={`За да качите ${
            selectedLevelData.goals["Mild weight gain"]["gain weight"]
          } на седмица, трябва да приемате приблизително ${selectedLevelData.goals[
            "Mild weight gain"
          ].calory.toFixed(2)} калории на ден`}
          name="Леко качване на тегло"
          value={
            selectedLevelData.goals["Mild weight gain"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(
                selectedLevelData.goals["Mild weight gain"].calory.toFixed(2)
              )
            );
            setSelectedGoal("mildgain");
            saveGoal(uid, "mildgain");
            setUserData((prevState) => ({ ...prevState, goal: "mildgain" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Mild weight gain"].calory.toFixed(2)
            )
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Mild weight gain"].calory.toFixed(2)
            )
              ? true
              : false
          }
          hasHoverAndFocus={true}
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
          tooltipLabel={`За да качите ${
            selectedLevelData.goals["Weight gain"]["gain weight"]
          } на седмица, трябва да приемате приблизително ${selectedLevelData.goals[
            "Weight gain"
          ].calory.toFixed(2)} калории на ден`}
          name="Качване на тегло"
          value={
            selectedLevelData.goals["Weight gain"].calory.toFixed(2) + " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(
                selectedLevelData.goals["Weight gain"].calory.toFixed(2)
              )
            );
            setSelectedGoal("weightgain");
            saveGoal(uid, "weightgain");
            setUserData((prevState) => ({ ...prevState, goal: "weightgain" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(selectedLevelData.goals["Weight gain"].calory.toFixed(2))
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(selectedLevelData.goals["Weight gain"].calory.toFixed(2))
              ? true
              : false
          }
          hasHoverAndFocus={true}
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
          tooltipLabel={`За да качите ${
            selectedLevelData.goals["Extreme weight gain"]["gain weight"]
          } на седмица, трябва да приемате приблизително ${selectedLevelData.goals[
            "Extreme weight gain"
          ].calory.toFixed(2)} калории на ден`}
          name="Екстремно качване на тегло"
          value={
            selectedLevelData.goals["Extreme weight gain"].calory.toFixed(2) +
            " kcal"
          }
          onClick={() => {
            setClickedValueCalories(
              parseFloat(
                selectedLevelData.goals["Extreme weight gain"].calory.toFixed(2)
              )
            );
            setSelectedGoal("extremegain");
            saveGoal(uid, "extremegain");
            setUserData((prevState) => ({ ...prevState, goal: "extremegain" }));
          }}
          backgroundColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Extreme weight gain"].calory.toFixed(2)
            )
              ? bgHover
              : undefined
          }
          hasBorder={true}
          borderColor={
            clickedValueCalories ===
            parseFloat(
              selectedLevelData.goals["Extreme weight gain"].calory.toFixed(2)
            )
              ? true
              : false
          }
          hasHoverAndFocus={true}
        />
      </SimpleGrid>
    </Card>
  );
}
