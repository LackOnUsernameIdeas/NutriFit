// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
  Tooltip
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card";
import { useState } from "react";

export default function Default(props: {
  startContent?: JSX.Element;
  endContent?: JSX.Element;
  name: string;
  growth?: string | number;
  value: string | number;
  tooltipLabel?: string;
  onClick?: () => void;
  backgroundColor?: string;
  hasBorder?: boolean;
  borderColor?: boolean;
  hasHoverAndFocus?: boolean;
}) {
  const {
    startContent,
    endContent,
    name,
    growth,
    value,
    tooltipLabel,
    onClick,
    backgroundColor,
    hasHoverAndFocus = false,
    hasBorder = false,
    borderColor = false
  } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgHover = useColorModeValue("secondaryGray.400", "whiteAlpha.50");
  const bgFocus = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const defaultBorderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const [isSelected, setIsSelected] = useState(false);
  const handleSelect = () => {
    setIsSelected(!isSelected);
  };
  return (
    <Tooltip label={tooltipLabel} placement="top" hasArrow openDelay={200}>
      <Card
        py="15px"
        onClick={() => {
          onClick && onClick();
          handleSelect();
        }}
        backgroundColor={backgroundColor}
        _hover={
          hasHoverAndFocus && {
            backgroundColor: isSelected ? "hoverColorSelected" : bgHover
          }
        }
        _focus={
          hasHoverAndFocus && {
            boxShadow: `0 0 0 2px ${
              isSelected ? "focusColorSelected" : bgFocus
            }`
          }
        }
        borderWidth={hasBorder ? "1px" : "0"}
        borderColor={
          borderColor ? "rgba(75, 15, 229, 0.8)" : defaultBorderColor
        }
      >
        <Flex
          my="auto"
          h="100%"
          align={{ base: "center", xl: "start" }}
          justify={{ base: "center", xl: "center" }}
        >
          {startContent}
          <Stat my="auto" ms={startContent ? "18px" : "0px"}>
            <StatLabel
              lineHeight="100%"
              color={textColor}
              fontSize={{
                base: "sm"
              }}
            >
              {name}
            </StatLabel>
            <StatNumber
              color={textColor}
              fontSize={{
                base: "2xl"
              }}
            >
              {value}
            </StatNumber>
            {growth ? (
              <Flex align="center">
                <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
                  {growth}
                </Text>
                <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                  since last month
                </Text>
              </Flex>
            ) : null}
          </Stat>
          <Flex ms="auto" w="max-content">
            {endContent}
          </Flex>
        </Flex>
      </Card>
    </Tooltip>
  );
}
