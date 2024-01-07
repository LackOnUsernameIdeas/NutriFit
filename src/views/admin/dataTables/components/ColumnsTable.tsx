import { Flex, Box, Table, Checkbox, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import * as React from 'react';

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable
} from '@tanstack/react-table';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
 
const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ColumnTable(props: { 
	tableName: string, 
	tableData: any, 
	columnsData: { name: string, label: string }[], 
	backgroundColor?: string;
	setState?: React.Dispatch<React.SetStateAction<{
		name: string,
		protein: number,
		fat: number,
		carbs: number
	}>>
}) {
	
	const { tableName, tableData, columnsData, setState, backgroundColor } = props;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

	const [ sorting, setSorting ] = React.useState<SortingState>([]);
	const [ data, setData ] = React.useState(() => tableData);

	const [selectedRow, setSelectedRow] = React.useState(null);

	const columns = columnsData.map(column => {
		return columnHelper.accessor(column.name as any, {
			id: column.name,
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					{column.label}
				</Text>
			),
			cell: (info: any) => (
				<Flex align='center'> 
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		})
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
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex justify="space-between" align="start" px={{ base: "0px", "2xl": "10px" }} pt="5px" w="100%">
				<Text color={textColor} fontSize='22px' mb="4px" fontWeight='700' lineHeight='100%'>
					{tableName}
				</Text>
				{/*<Menu />    <-- BUTTON TOP RIGHT OF TABLE DISPLAYING PANELS */}
			</Flex>
			<Box>
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<Th
											key={header.id}
											colSpan={header.colSpan}
											pe='10px'
											borderColor={borderColor}
											cursor='pointer'
											onClick={header.column.getToggleSortingHandler()}>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '10px', lg: '12px' }}
												color='gray.400'>
												{flexRender(header.column.columnDef.header, header.getContext())}{{
													asc: '',
													desc: '',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
										</Th>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.slice(0, 11).map((row) => {
							return (
								<Tr 
									key={row.id} 
									onClick={() => {
										setState((table.getRowModel().rows[parseFloat(row.id)].original as any)); 
										setSelectedRow(row.id);
									}} 
									backgroundColor={row.id === selectedRow ? backgroundColor : undefined}
								>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												fontSize={{ sm: '14px' }}
												minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												borderColor='transparent'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
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