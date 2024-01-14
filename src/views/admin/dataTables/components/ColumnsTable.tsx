import {
  Flex,
  Box,
  Table,
  Checkbox,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  SimpleGrid,
  MenuButton,
  MenuList,
  useDisclosure,
  useColorModeValue,
  Icon,
  Menu,
  CSSObject
} from "@chakra-ui/react";
import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";

import { MdOutlineInfo } from "react-icons/md";
// Custom components
import Card from "components/card/Card";
import { HSeparator } from "components/separator/Separator";

const columnHelper = createColumnHelper();
// const columns = columnsDataCheck;
export default function ColumnTable(props: {
  tableName: string;
  tableData: any;
  columnsData: { name: string; label: string }[];
  backgroundColor?: string;
  setState?: React.Dispatch<
    React.SetStateAction<{
      name: string;
      protein: number;
      fat: number;
      carbs: number;
    }>
  >;
  clickedValueProtein?: number;
}) {
  const {
    tableName,
    tableData,
    columnsData,
    setState,
    clickedValueProtein,
    backgroundColor
  } = props;

  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("white", "whiteAlpha.100");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState(() => tableData);

  const [selectedRow, setSelectedRow] = React.useState(null);
  const {
    isOpen: isOpenDiet,
    onOpen: onOpenDiet,
    onClose: onCloseDiet
  } = useDisclosure();
  const columns = columnsData.map((column) => {
    return columnHelper.accessor(column.name as any, {
      id: column.name,
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: "10px", lg: "12px" }}
          color="gray.400"
        >
          {column.label}
        </Text>
      ),
      cell: (info: any) => (
        <Flex align="center">
          <Text color={textColor} fontSize="sm" fontWeight="700">
            {info.getValue()}
          </Text>
        </Flex>
      )
    });
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true
  });

  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex
        justify="space-between"
        align="start"
        px={{ base: "0px", "2xl": "10px" }}
        pt="5px"
        w="100%"
      >
        <Text
          color={textColor}
          fontSize="22px"
          mb="4px"
          fontWeight="700"
          lineHeight="100%"
        >
          {tableName}
        </Text>
        <SimpleGrid>
          <Menu isOpen={isOpenDiet} onClose={onCloseDiet}>
            <MenuButton
              alignItems="center"
              justifyContent="center"
              bg={bgButton}
              _hover={bgHover}
              _focus={bgFocus}
              _active={bgFocus}
              w="30px"
              h="30px"
              lineHeight="50%"
              onClick={onOpenDiet}
              borderRadius="10px"
              ml="10%"
            >
              <Icon as={MdOutlineInfo} color={iconColor} w="24px" h="24px" />
            </MenuButton>
            <MenuList
              w="100%"
              minW="unset"
              ml={{ base: "2%", lg: 0 }}
              mr={{ base: "2%", lg: 0 }}
              maxW={{ base: "80%", lg: "100%" }}
              border="transparent"
              backdropFilter="blur(100px)"
              bg={bgList}
              borderRadius="20px"
              p="15px"
            >
              <Box
                transition="0.2s linear"
                color={textColor}
                p="0px"
                borderRadius="8px"
                maxW={{ base: "2xl", lg: "100%" }}
              >
                <Flex align="center">
                  <Text fontSize="2xl" fontWeight="400">
                    Изберете тип диета по вашите предпочитания.
                  </Text>
                </Flex>
                <HSeparator />
                <Flex align="center">
                  <Text fontSize="1xl" fontWeight="400" mt="4px">
                    Балансирана:
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="sm" fontWeight="200" mb="10px">
                    Балансирано разпределение на макронутриенти с умерени нива
                    на протеини, въглехидрати и мазнини. Идеална за поддържане
                    на здравето.
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="1xl" fontWeight="400" mt="4px">
                    Ниско съдържание на мазнини:
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="sm" fontWeight="200" mb="10px">
                    Набляга на намаляване на приема на мазнини и поддържане на
                    адекватни нива на протеини и въглехидрати. Подходящ за тези,
                    които се стремят да намалят общия прием на калории и да
                    контролират теглото си.
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="1xl" fontWeight="400" mt="4px">
                    Ниско съдържание на въглехидрати:
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="sm" fontWeight="400" mb="10px">
                    Фокусира се върху минимизиране на приема на въглехидрати,
                    като същевременно осигурява достатъчно протеини и
                    здравословни мазнини.
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="1xl" fontWeight="400" mt="4px">
                    Високо съдържание на протеин:
                  </Text>
                </Flex>
                <Flex align="center">
                  <Text fontSize="sm" fontWeight="400">
                    Дава приоритет на по-висок прием на протеин с умерени нива
                    на въглехидрати и мазнини. Идеална за тези, които искат да
                    подпомогнат развитието на мускулите, особено при силови
                    тренировки или фитнес програми.
                  </Text>
                </Flex>
              </Box>
            </MenuList>
          </Menu>
        </SimpleGrid>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th
                      key={header.id}
                      colSpan={header.colSpan}
                      pe="10px"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <Flex
                        justifyContent="space-between"
                        align="center"
                        fontSize={{ sm: "10px", lg: "12px" }}
                        color="gray.400"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: ""
                        }[header.column.getIsSorted() as string] ?? null}
                      </Flex>
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table
              .getRowModel()
              .rows.slice(0, 11)
              .map((row) => {
                const proteinValue = (
                  table.getRowModel().rows[parseFloat(row.id)].original as any
                ).protein
                  ? (
                      table.getRowModel().rows[parseFloat(row.id)]
                        .original as any
                    ).protein
                  : -1; // Adjust this based on your data structure
                const rowBackgroundColor =
                  proteinValue === clickedValueProtein
                    ? "rgba(0, 0, 0, 0.3)"
                    : undefined;
                const litUp =
                  proteinValue === clickedValueProtein ? true : false;
                return (
                  <Tr
                    key={row.id}
                    onClick={() => {
                      setState(
                        table.getRowModel().rows[parseFloat(row.id)]
                          .original as any
                      );
                      setSelectedRow(row.id);
                    }}
                    backgroundColor={rowBackgroundColor}
                    h="80px"
                    _hover={bgHover}
                    _focus={bgFocus}
                    borderWidth="1px"
                    borderColor={litUp ? "rgba(75, 15, 229, 0.8)" : borderColor}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}
