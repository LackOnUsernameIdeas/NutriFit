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
  lineChartForProtein: number[];
  lineChartForFat: number[];
  lineChartForCarbs: number[];
  lineChartForCalories: number[];
  dropdownVisible: boolean;
  handleDropdownToggle: () => void;
}

export default function NutrientsDropdown({
  lineChartLabels,
  lineChartForProtein,
  lineChartForFat,
  lineChartForCarbs,
  lineChartForCalories,
  dropdownVisible,
  handleDropdownToggle
}: GenderedDropdownsProps) {
  const [loading, setLoading] = React.useState(true);
  const chartsColor = useColorModeValue("brand.500", "white");

  // useEffect за зареждане на компонента докато не са подадени нужните данни.
  React.useEffect(() => {
    if (
      lineChartLabels &&
      lineChartForProtein &&
      lineChartForFat &&
      lineChartForCarbs &&
      lineChartForCalories &&
      loading
    ) {
      setLoading(false);
    }
  }, [
    lineChartLabels,
    lineChartForProtein,
    lineChartForFat,
    lineChartForCarbs,
    lineChartForCalories,
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
          title="Статистики за ВАШИТЕ средно приети нутриенти и тяхното изменение:"
          handleDropdownToggle={handleDropdownToggle}
          dropdownVisible={dropdownVisible}
        >
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mt="50px">
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  icon={<Icon w="32px" h="32px" as={FaFireAlt} color="white" />}
                />
              }
              name="Калории"
              value={
                lineChartLabels.length > 0
                  ? (
                      lineChartForCalories.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) / lineChartLabels.length
                    ).toFixed(2)
                  : 0
              }
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  icon={<Icon w="32px" h="32px" as={FaFireAlt} color="white" />}
                />
              }
              name="Протеин"
              value={
                lineChartLabels.length > 0
                  ? (
                      lineChartForProtein.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) / lineChartLabels.length
                    ).toFixed(2)
                  : 0
              }
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  icon={<Icon w="32px" h="32px" as={FaFireAlt} color="white" />}
                />
              }
              name="Въглехидрати"
              value={
                lineChartLabels.length > 0
                  ? (
                      lineChartForCarbs.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) / lineChartLabels.length
                    ).toFixed(2)
                  : 0
              }
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(90deg, #422afb 0%, #715ffa 100%)"
                  icon={<Icon w="32px" h="32px" as={FaFireAlt} color="white" />}
                />
              }
              name="Мазнини"
              value={
                lineChartLabels.length > 0
                  ? (
                      lineChartForFat.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      ) / lineChartLabels.length
                    ).toFixed(2)
                  : 0
              }
            />
          </SimpleGrid>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mt="20px">
            <Card
              fontSize="3xl"
              maxH={{ sm: "100px", md: "150px", lg: "100px" }}
              p="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              Вашите приети калории (kcal)
            </Card>
            {!isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашият приет протеин (g.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForCalories}
                lineChartLabelName="Изменение на калории(kcal)"
                textColor={chartsColor}
                color="rgba(67,24,255,1)"
              />
            </Card>
            {isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашият приет протеин (g.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForProtein}
                lineChartLabelName="Изменение на протеин(g)"
                textColor={chartsColor}
                color="rgba(67,24,255,1)"
              />
            </Card>
            <Card
              fontSize="3xl"
              maxH={{ sm: "100px", md: "150px", lg: "100px" }}
              p="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              Вашите приети мазнини (g.)
            </Card>
            {!isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашите приети въглехидрати (g.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForFat}
                lineChartLabelName="Изменение на мазнини(g)"
                textColor={chartsColor}
                color="#a194ff"
              />
            </Card>
            {isSmallScreen && (
              <Card
                fontSize="3xl"
                maxH={{ sm: "100px", md: "150px", lg: "100px" }}
                p="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                Вашите приети въглехидрати (g.)
              </Card>
            )}
            <Card
              alignItems="center"
              flexDirection="column"
              h="100%"
              w="100%"
              minH={{ sm: "400px", md: "300px", lg: "auto" }}
              minW={{ sm: "150px", md: "200px", lg: "auto" }}
              maxH={{ sm: "400px", md: "300px", lg: "auto" }}
            >
              <LineChart
                lineChartLabels={lineChartLabels}
                lineChartData={lineChartForCarbs}
                lineChartLabelName="Изменение на въглехидрати(g)"
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
