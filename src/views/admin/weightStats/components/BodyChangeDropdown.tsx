import React from "react";
// Chakra imports
import {
  Icon,
  SimpleGrid,
  useColorModeValue,
  useMediaQuery,
  Center
} from "@chakra-ui/react";
import { LineChart } from "components/charts/LineCharts";
import { FaFireAlt } from "react-icons/fa";
import Dropdown from "components/dropdowns/Dropdown";
import MiniStatistics from "components/card/MiniStatistics";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import Loading from "views/admin/weightStats/components/Loading";

interface GenderedDropdownsProps {
  lineChartLabels: string[];
  lineChartForKilogramsData: number[];
  lineChartForBodyFatMassData: number[];
  lineChartForLeanBodyMassData: number[];
  lineChartForDifferenceFromPerfectWeightData: number[];
  lineChartForBMI: number[];
  lineChartForBodyFatData: number[];
  dropdownVisible: boolean;
  handleDropdownToggle: () => void;
}

function BodyChangeDropdown({
  lineChartLabels,
  lineChartForKilogramsData,
  lineChartForBodyFatMassData,
  lineChartForLeanBodyMassData,
  lineChartForDifferenceFromPerfectWeightData,
  lineChartForBodyFatData,
  lineChartForBMI,
  dropdownVisible,
  handleDropdownToggle
}: GenderedDropdownsProps) {
  const [loading, setLoading] = React.useState(true);
  const chartsColor = useColorModeValue("brand.500", "white");

  // useEffect за зареждане на компонента докато не са подадени нужните данни.
  React.useEffect(() => {
    if (
      lineChartLabels &&
      lineChartForKilogramsData &&
      lineChartForBodyFatMassData &&
      lineChartForLeanBodyMassData &&
      lineChartForDifferenceFromPerfectWeightData &&
      lineChartForBodyFatData &&
      lineChartForBMI &&
      loading
    ) {
      setLoading(false);
    }
  }, [
    lineChartLabels,
    lineChartForKilogramsData,
    lineChartForBodyFatMassData,
    lineChartForLeanBodyMassData,
    lineChartForDifferenceFromPerfectWeightData,
    lineChartForBodyFatData,
    lineChartForBMI,
    loading
  ]);

  const [isSmallScreen] = useMediaQuery("(max-width: 767px)");

  return (
    <>
      {loading ? (
        <Center>
          <Loading />
        </Center>
      ) : (
        <Dropdown
          title="Статистики за вашето телесно изменение:"
          handleDropdownToggle={handleDropdownToggle}
          dropdownVisible={dropdownVisible}
        >
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mt="50px">
            <Card
              fontSize="3xl"
              maxH={{ sm: "100px", md: "150px", lg: "60px" }}
              p="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              Вашето тегло (кг.)
            </Card>
            {!isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашият Индекс на Телесна Маса
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "300px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "100px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForKilogramsData}
                lineChartLabelName="Изменение на тегло(кг)"
                textColor={chartsColor}
                color="rgba(67,24,255,1)"
              />
            </Card>
            {isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашият Индекс на Телесна Маса
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "300px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForBMI}
                lineChartLabelName="Изменение на ИТМ(Индекс на Телесна Маса)"
                textColor={chartsColor}
                color="rgba(67,24,255,1)"
              />
            </Card>
            <Card
              fontSize="3xl"
              maxH={{ sm: "100px", md: "150px", lg: "60px" }}
              p="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              Вашият % телесни мазнини
            </Card>
            {!isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашата мастна телесна маса (кг.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "300px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForBodyFatData}
                lineChartLabelName="Изменение на % телесни мазнини"
                textColor={chartsColor}
                color="#7c6bff"
              />
            </Card>
            {isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашата мастна телесна маса (кг.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "300px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForBodyFatMassData}
                lineChartLabelName="Изменение на мастна телесна маса"
                textColor={chartsColor}
                color="#7c6bff"
              />
            </Card>
            <Card
              fontSize="3xl"
              maxH={{ sm: "100px", md: "150px", lg: "60px" }}
              p="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              Вашата чиста телесна маса (кг.)
            </Card>
            {!isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                fontWeight="500"
              >
                Теглото ви под/над нормата (кг.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "300px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForLeanBodyMassData}
                lineChartLabelName="Изменение на чиста телесна маса"
                textColor={chartsColor}
                color="#a194ff"
              />
            </Card>
            {isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "60px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                fontWeight="500"
              >
                Теглото ви под/над нормата (кг.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "300px" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "150px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForDifferenceFromPerfectWeightData}
                lineChartLabelName={`Изменение в килограмите ви под/над нормата`}
                textColor={chartsColor}
                color="#a194ff"
              />
            </Card>
          </SimpleGrid>
        </Dropdown>
      )}
    </>
  );
}

export default BodyChangeDropdown;
