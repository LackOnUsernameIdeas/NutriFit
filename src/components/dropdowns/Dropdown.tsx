import React, { useEffect } from "react";
import { Box, Flex, Icon, useColorModeValue, Text } from "@chakra-ui/react";
import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface DropdownProps {
  title: string;
  dropdownVisible: boolean;
  handleDropdownToggle: () => void; // Функция за контролиране на state-та на дропдауна
  icon?: IconType;
  children: React.ReactNode;
  isForMale?: boolean;
  isForFemale?: boolean;
  titleBg?: string;
  titleBorderColour?: string;
}

export default function Dropdown({
  title,
  dropdownVisible,
  handleDropdownToggle,
  icon,
  children,
  isForMale,
  isForFemale,
  titleBg,
  titleBorderColour
}: DropdownProps) {
  const gradientLight = "linear-gradient(90deg, #422afb 0%, #715ffa 100%)";
  const gradientDark = "linear-gradient(90deg, #715ffa 0%, #422afb 100%)";
  const gradient = useColorModeValue(gradientLight, gradientDark);
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const bg = useColorModeValue("white", "navy.800");
  const dropdownBoxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const dropdownActiveBoxBg = useColorModeValue("#d8dced", "#171F3D");
  const [miniStatisticsVisible, setMiniStatisticsVisible] =
    React.useState(false);
  const [renderDropdown, setRenderDropdown] = React.useState(false);

  // useEffect за анимациите и рендъра на дропдауна.
  useEffect(() => {
    const handleDropdownVisibilityChange = async () => {
      if (dropdownVisible) {
        setMiniStatisticsVisible(true);
        setRenderDropdown(true);
      } else {
        setMiniStatisticsVisible(false);
        await new Promise<void>((resolve) =>
          setTimeout(() => {
            resolve();
            setRenderDropdown(false);
          }, 150)
        );
      }
    };

    handleDropdownVisibilityChange();
  }, [dropdownVisible]);

  // Custom анимация за сваляне/качване на children-ите на дропдауна.
  const slideAnimationDrop = useSpring({
    opacity: miniStatisticsVisible ? 1 : 0,
    transform: `translateY(${dropdownVisible ? -50 : -80}px)`,
    config: {
      tension: dropdownVisible ? 170 : 200,
      friction: dropdownVisible ? 12 : 20
    }
  });

  let titleColor = isForMale ? "#513bff" : "#8170ff";

  return (
    <Box>
      <Card
        onClick={handleDropdownToggle}
        cursor="pointer"
        zIndex="1"
        position="relative"
        bg={
          titleBg
            ? titleBg
            : dropdownVisible
            ? dropdownActiveBoxBg
            : dropdownBoxBg
        }
        borderColor={titleBorderColour}
        borderWidth={titleBorderColour && "5px"}
      >
        <Flex justify="space-between" alignItems="center">
          <Box>
            <Flex alignItems="center" justifyContent="center">
              <Text
                fontSize="2xl"
                fontWeight="medium"
                textAlign="center"
                color={dropdownVisible && titleColor}
                style={
                  dropdownVisible && !(isForMale || isForFemale)
                    ? {
                        backgroundImage: gradient,
                        WebkitBackgroundClip: "text",
                        color: "transparent"
                      }
                    : {}
                }
                userSelect="none"
              >
                {dropdownVisible ? <b>{title}</b> : title}
              </Text>
              {icon && (
                <Icon
                  w="30px"
                  h="30px"
                  as={icon}
                  color={isForMale ? "#513bff" : "#8170ff"}
                />
              )}
            </Flex>
          </Box>
          <Icon
            as={dropdownVisible ? FaAngleUp : FaAngleDown}
            boxSize={6}
            color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
          />
        </Flex>
      </Card>
      {renderDropdown && (
        <animated.div style={{ ...slideAnimationDrop, position: "relative" }}>
          <Card
            bg={titleBorderColour ? bg : boxBg}
            minH={{ base: "700px", md: "300px", xl: "180px" }}
          >
            {children}
          </Card>
        </animated.div>
      )}
    </Box>
  );
}
