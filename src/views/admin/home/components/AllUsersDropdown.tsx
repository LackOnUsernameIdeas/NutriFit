import React from "react";
// Chakra imports
import {
  Icon,
  SimpleGrid,
  useColorModeValue,
  useMediaQuery,
  CircularProgress,
  Center
} from "@chakra-ui/react";
// Assets
// Custom components
import { MdOutlineMale, MdOutlineFemale } from "react-icons/md";
import Dropdown from "components/dropdowns/Dropdown";
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import { BsPersonFillUp } from "react-icons/bs";

// Types
import {
  GenderAverageStats,
  Deviations
} from "../../../../variables/weightStats";

import { ColumnAvaragesChart } from "components/charts/BarCharts";
import { LineAvaragesChart } from "components/charts/LineCharts";

interface GenderedDropdownsProps {
  averageStats: GenderAverageStats;
  dropdownVisible: boolean;
  handleDropdownToggle: () => void;
}

export default function AllUsersDropdown({
  averageStats,
  dropdownVisible,
  handleDropdownToggle
}: GenderedDropdownsProps) {
  const [loading, setLoading] = React.useState(true);
  const chartsColor = useColorModeValue("brand.500", "white");

  React.useEffect(() => {
    // If averageStats has been provided and loading is true, set loading to false
    if (averageStats && loading) {
      setLoading(false);
    }
  }, [averageStats, loading]);

  const maleChartData = [
    averageStats.male.averageCalories,
    averageStats.male.averageProtein,
    averageStats.male.averageCarbs,
    averageStats.male.averageFat,
    averageStats.male.averageWeight,
    averageStats.male.averageBodyFatPercentage
  ];

  const femaleChartData = [
    averageStats.female.averageCalories,
    averageStats.female.averageProtein,
    averageStats.female.averageCarbs,
    averageStats.female.averageFat,
    averageStats.female.averageWeight,
    averageStats.female.averageBodyFatPercentage
  ];

  const allUsersStatsLabels = [
    "Калории",
    "Протеин",
    "Въглехидрати",
    "Мазнини",
    "Тегло",
    "% телесни мазнини"
  ];
  const [isSmallScreen] = useMediaQuery("(max-width: 767px)");

  if (loading) {
    return (
      <Center>
        <CircularProgress isIndeterminate color="green.300" />
      </Center>
    );
  }

  return (
    <Dropdown
      title="Средни статистики за ВСИЧКИ потребители:"
      handleDropdownToggle={handleDropdownToggle}
      dropdownVisible={dropdownVisible}
    >
      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3, "2xl": 3 }}
        gap="20px"
        mt="50px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
              icon={<Icon w="32px" h="32px" as={MdOutlineMale} color="white" />}
            />
          }
          name="Мъже"
          value={
            averageStats.male.totalUsers !== null
              ? averageStats.male.totalUsers.toString()
              : "0"
          }
          loading={loading}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
              icon={
                <Icon w="32px" h="32px" as={BsPersonFillUp} color="white" />
              }
            />
          }
          name="Потребители"
          value={
            averageStats.male.totalUsers !== null
              ? (
                  averageStats.male.totalUsers + averageStats.female.totalUsers
                ).toString()
              : "0"
          }
          loading={loading}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
              icon={
                <Icon w="32px" h="32px" as={MdOutlineFemale} color="white" />
              }
            />
          }
          name="Жени"
          value={
            averageStats.female.totalUsers !== null
              ? averageStats.female.totalUsers.toString()
              : "0"
          }
          loading={loading}
        />
      </SimpleGrid>
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 2 }}
        gap="20px"
        mt={isSmallScreen ? "0px" : "40px"}
      >
        <Card
          alignItems="center"
          flexDirection="column"
          minH={{ sm: "400px", md: "300px", lg: "300px" }}
          minW={{ sm: "200px", md: "200px", lg: "auto" }}
          maxH="400px"
        >
          <LineAvaragesChart
            lineChartData={maleChartData}
            lineChartData2={femaleChartData}
            lineChartLabels={allUsersStatsLabels}
            lineChartLabelName={"Мъже"}
            lineChartLabelName2={"Жени"}
            textColor={chartsColor}
          />
        </Card>
        <Card
          alignItems="center"
          flexDirection="column"
          minH={{ sm: "400px", md: "300px", lg: "300px" }}
          minW={{ sm: "200px", md: "200px", lg: "auto" }}
          maxH="400px"
        >
          <ColumnAvaragesChart
            chartData={maleChartData}
            chartData2={femaleChartData}
            chartLabels={allUsersStatsLabels}
            chartLabelName={"Мъже"}
            chartLabelName2={"Жени"}
            textColor={chartsColor}
          />
        </Card>
      </SimpleGrid>
    </Dropdown>
  );
}
