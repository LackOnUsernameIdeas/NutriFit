import React from "react";
import {
  Box,
  Heading,
  Stack,
  StackDivider,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import backgroundImageWhite from "../../assets/img/layout/blurry-gradient-haikei-light.svg";
import backgroundImageDark from "../../assets/img/layout/blurry-gradient-haikei-dark.svg";
import Card from "components/card/Card";
import CardBody from "components/card/Card";
import { UserData } from "../../variables/weightStats";

interface Props {
  userData: UserData;
}

const UserInfoCard: React.FC<Props> = ({ userData }) => {
  const fontWeight = useColorModeValue("550", "100");
  const { colorMode } = useColorMode();

  const backgroundImage =
    colorMode === "light" ? backgroundImageWhite : backgroundImageDark;

  const mapGenderToDisplayValue = (gender: string) => {
    switch (gender) {
      case "male":
        return "Мъж";
        break;
      case "female":
        return "Жена";
        break;
      default:
        return gender; // Return the original value if not found in the mapping
    }
  };

  // Функция за генериране на статистики
  const mapGoalToDisplayValue = (goal: string) => {
    switch (goal) {
      case "maintain":
        return "Запазване на Тегло";
        break;
      case "mildlose":
        return "Леко Сваляне на Тегло";
        break;
      case "weightlose":
        return "Сваляне на Тегло";
        break;
      case "extremelose":
        return "Екстремно Сваляне на Тегло";
        break;
      case "mildgain":
        return "Леко Качване на Тегло";
        break;
      case "weightlose":
        return "Качване на Тегло";
        break;
      case "extremegain":
        return "Екстремно Качване на Тегло";
        break;
      default:
        return goal; // Return the original value if not found in the mapping
    }
  };

  return (
    <Card
      p="20px"
      alignItems="center"
      flexDirection="column"
      w="100%"
      mb="20px"
      backgroundImage={`url(${backgroundImage})`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
      transition="background-image 0.25s ease-in-out"
    >
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Години:</b> {userData.age}
            </Heading>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Пол:</b> {mapGenderToDisplayValue(userData.gender)}
            </Heading>
          </Box>
          {userData.goal && (
            <Box>
              <Heading
                size="xs"
                textTransform="uppercase"
                fontWeight={fontWeight}
              >
                <b>Последно избрана цел:</b>{" "}
                {mapGoalToDisplayValue(userData.goal)}
              </Heading>
            </Box>
          )}
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Височина:</b> {userData.height} (см)
            </Heading>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Тегло:</b> {userData.weight} (кг)
            </Heading>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Обиколка на врата:</b> {userData.neck} (см)
            </Heading>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Обиколка на талията:</b> {userData.waist} (см)
            </Heading>
          </Box>
          <Box>
            <Heading
              size="xs"
              textTransform="uppercase"
              fontWeight={fontWeight}
            >
              <b>Обиколка на таза:</b> {userData.hip} (см)
            </Heading>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

// Export the UserInfoCard component
export default UserInfoCard;
