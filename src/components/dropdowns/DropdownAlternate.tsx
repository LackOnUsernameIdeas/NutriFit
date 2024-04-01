import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import Card from "components/card/Card";
import { useSpring, animated } from "react-spring";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface DropdownProps {
  dropdownVisible: boolean;
  handleDropdownToggle: () => void; // Функция за контролиране на state-та на дропдауна
  children: React.ReactNode;
}

export default function DropdownAlternate({
  dropdownVisible,
  handleDropdownToggle,
  children
}: DropdownProps) {
  const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
  const tipFontWeight = useColorModeValue("500", "100");
  const TipBoxBg = useColorModeValue("#a7ddfc", "#395182");
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

  return (
    <Box>
      <Alert
        status="info"
        borderRadius="20px"
        fontWeight={tipFontWeight}
        p="20px"
        w="100%"
        mb="20px"
        bg={TipBoxBg}
        onClick={handleDropdownToggle}
        cursor="pointer"
        zIndex="1"
        position="relative"
      >
        <Flex
          justify="space-between"
          alignItems="center"
          direction="row"
          w="100%"
        >
          <Flex>
            <AlertIcon />
            <Text userSelect="none">
              <b>Съвет:</b> Натиснете тук, за да видите състоянието на вашето
              тегло, дали трябва да сваляте или да качвате тегло и тогава си
              съставете хранително меню за деня, за да прецените правилно каква
              цел да си поставите.
            </Text>
          </Flex>
          <Flex alignItems="center">
            <Icon
              as={dropdownVisible ? FaAngleUp : FaAngleDown}
              boxSize={6}
              color="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
            />
          </Flex>
        </Flex>
      </Alert>
      {renderDropdown && (
        <animated.div style={{ ...slideAnimationDrop, position: "relative" }}>
          <Card bg={boxBg} minH={{ base: "700px", md: "300px", xl: "180px" }}>
            {children}
          </Card>
        </animated.div>
      )}
    </Box>
  );
}
