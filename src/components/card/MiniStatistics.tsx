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
  borderColor?: string;
  hover?: {
    background?: string;
    color?: string;
  };
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
    hover,
    hasBorder,
    borderColor
  } = props;
  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Tooltip label={tooltipLabel} placement="top" hasArrow openDelay={200}>
      <Card py="15px" onClick={onClick} backgroundColor={backgroundColor}>
        <Flex
          my="auto"
          h="100%"
          align={{ base: "center", xl: "start" }}
          justify={{ base: "center", xl: "center" }}
          _hover={hover}
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
