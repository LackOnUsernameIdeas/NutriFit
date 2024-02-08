// React and Firebase imports
import React, { useEffect, useState } from "react";
import { DocumentData, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { booksCollection } from "../../../../database/getCollection";
import { NewBookType } from "../../../../types/book";

// Chakra UI imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card";
import { LineChart } from "components/charts/LineCharts";

// Icons imports
import { IoCheckmarkCircle } from "react-icons/io5";
import { MdBarChart, MdOutlineCalendarToday } from "react-icons/md";
import { RiArrowUpSFill } from "react-icons/ri";

export default function TotalSpent(props: { [x: string]: any }) {
  const { ...rest } = props;

  const [books, setBooks] = useState<NewBookType[]>([]);

  useEffect(
    () =>
      onSnapshot(booksCollection, (snapshot: QuerySnapshot<DocumentData>) => {
        setBooks(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      }),
    []
  );

  const titles = books.map((book) => book.title);
  const ranks = books.map((book) => book.rank);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
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
          <Flex w="100%">
            <Text
              me="auto"
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
            >
              Total Spent
            </Text>
          </Flex>
          <Flex align="end">
            <Text
              color={textColor}
              fontSize="34px"
              fontWeight="700"
              lineHeight="100%"
            >
              2.579
            </Text>
            <Text
              ms="6px"
              color="secondaryGray.600"
              fontSize="sm"
              fontWeight="500"
            >
              Visitors
            </Text>
          </Flex>
        </Flex>
        <Flex align="center">
          <Icon as={RiArrowUpSFill} color="green.500" />
          <Text color="green.500" fontSize="sm" fontWeight="700">
            +2.45%
          </Text>
        </Flex>
      </Flex>
      <Card
        alignItems="center"
        flexDirection="column"
        h="100%"
        w="100%"
        minH={{ sm: "100px", md: "300px", lg: "auto" }}
        minW={{ sm: "150px", md: "200px", lg: "auto" }}
      >
        <LineChart
          lineChartLabels={titles}
          lineChartData={ranks}
          lineChartLabelName="sth"
        />
      </Card>
    </Card>
  );
}
