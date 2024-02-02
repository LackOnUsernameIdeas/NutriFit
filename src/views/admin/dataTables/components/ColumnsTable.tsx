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
  const litUpBorderColor = useColorModeValue(
    "2px solid rgba(145, 132, 246, 0.8)",
    "2px solid rgba(96, 77, 235, 0.8)"
  );
  const bgSelected = useColorModeValue("secondaryGray.200", "whiteAlpha.50");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.200" },
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
                  proteinValue === clickedValueProtein ? bgSelected : undefined;
                const isLitUp =
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
                    _focus={bgHover}
                    borderWidth="1px"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td
                          key={cell.id}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          style={{
                            borderTop: isLitUp && litUpBorderColor,
                            borderBottom: isLitUp && litUpBorderColor,
                            borderColor: borderColor,
                            borderLeft:
                              (cell.id == "0_name" ||
                                cell.id == "1_name" ||
                                cell.id == "2_name" ||
                                cell.id == "3_name") &&
                              isLitUp &&
                              litUpBorderColor,
                            borderRight:
                              (cell.id == "0_carbs" ||
                                cell.id == "1_carbs" ||
                                cell.id == "2_carbs" ||
                                cell.id == "3_carbs") &&
                              isLitUp &&
                              litUpBorderColor
                          }}
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
