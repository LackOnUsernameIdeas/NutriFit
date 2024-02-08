// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import Card from "components/card/Card";
// Custom components
import { ColumnChart } from "components/charts/BarCharts";
import React from "react";
import {
  barChartDataConsumption,
  barChartOptionsConsumption
} from "variables/chartjs";
import { MdBarChart } from "react-icons/md";

export default function WeeklyRevenue(props: { [x: string]: any }) {
  const { ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  return (
    <Card alignItems="center" flexDirection="column" w="100%" {...rest}>
      <Flex justify="space-between" align="start" px="10px" pt="5px" w="100%">
        <Flex flexDirection="column" align="start" me="20px">
          <Text
            me="auto"
            color={textColor}
            fontSize="xl"
            fontWeight="700"
            lineHeight="100%"
          >
            Weekly Revenue
          </Text>
        </Flex>
        <Flex align="center">
          <Button
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            w="37px"
            h="37px"
            lineHeight="100%"
            borderRadius="10px"
            {...rest}
          >
            <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
          </Button>
        </Flex>
      </Flex>
      <Card
        alignItems="center"
        flexDirection="column"
        w="100%"
        h="100%"
        minH={{ sm: "100px", md: "300px", lg: "auto" }}
        minW={{ sm: "150px", md: "200px", lg: "auto" }}
      >
        <ColumnChart
          chartData={barChartDataConsumption}
          chartOptions={barChartOptionsConsumption}
          chartLabels={["babati", "dqdoti", "strinkati"]}
          chartLabelName={"Chart Data"}
        />
      </Card>
    </Card>
  );
}
