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
  name?: string;
  growth?: string | number;
  decrease?: string | number;
  subtext?: string;
  value: string | number;
  tooltipLabel?: string;
  onClick?: () => void;
  backgroundColor?: string;
  loading?: boolean;
  hasBorder?: boolean;
  borderColor?: boolean;
  hasHoverAndFocus?: boolean;
}) {
  const {
    startContent,
    endContent,
    name,
    growth,
    decrease,
    subtext,
    value,
    tooltipLabel,
    onClick,
    backgroundColor,
    loading = false,
    hasHoverAndFocus = false,
    hasBorder = false,
    borderColor = false
  } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgHover = useColorModeValue("secondaryGray.400", "whiteAlpha.50");
  const bgFocus = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const defaultBorderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const litUpBorderColor = useColorModeValue(
    "rgba(145, 132, 246, 0.8)",
    "rgba(96, 77, 235, 0.8)"
  );
  const fontWeight = useColorModeValue("550", "550");
  const [isSelected, setIsSelected] = useState(false);
  const handleSelect = () => {
    setIsSelected(!isSelected);
  };
  const fadeInOutStyle = {
    opacity: loading ? 0 : 1,
    transition: "opacity 0.5s ease-in-out"
  };
  return (
    <Tooltip
      label={tooltipLabel}
      placement="top"
      hasArrow
      openDelay={200}
      borderRadius="10px"
    >
      <Card
        py="15px"
        onClick={() => {
          onClick && onClick();
          handleSelect();
        }}
        backgroundColor={backgroundColor}
        _hover={
          hasHoverAndFocus && {
            backgroundColor: bgHover
          }
        }
        _focus={
          hasHoverAndFocus && {
            boxShadow: `0 0 0 2px ${bgFocus}`
          }
        }
        borderWidth={hasBorder ? "3px" : "0"}
        borderColor={borderColor ? litUpBorderColor : defaultBorderColor}
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
              fontWeight={fontWeight}
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
              style={fadeInOutStyle}
            >
              {value}
            </StatNumber>
            {growth ? (
              <Flex align="center">
                <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
                  {growth}
                </Text>
                <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                  {subtext ? subtext : ""}
                </Text>
              </Flex>
            ) : decrease ? (
              <Flex align="center">
                <Text color="red.500" fontSize="xs" fontWeight="700" me="5px">
                  {decrease}
                </Text>
                <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                  {subtext ? subtext : ""}
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
