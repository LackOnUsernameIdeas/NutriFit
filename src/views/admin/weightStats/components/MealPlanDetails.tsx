import React from 'react';
import { CustomServingInput } from "./CustomServingInput";
import { MealPlan, NutrientState, SuggestedMaxServings, CustomServings } from "../variables/mealPlaner";
import { Box, Text, Flex, VStack, SimpleGrid } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import RecipeWidget from 'components/card/NFT';
import Card from "components/card/Card";

interface MealPlanDetailsProps {
	customServings: CustomServings;
	suggestedMaxServings: SuggestedMaxServings;
	mealPlan: MealPlan;
	calories: NutrientState;
	protein: NutrientState;
	carbs: NutrientState;
	fat: NutrientState;
	handleIncrement: (mealType: keyof CustomServings) => void;
	handleDecrement: (mealType: keyof CustomServings) => void;
}
const bulgarianMealType: string[] = ["Закуска","Обяд","Вечеря"];

const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({ customServings, suggestedMaxServings, mealPlan, calories, protein, carbs, fat, handleIncrement, handleDecrement }) => {
	return (
		<Card>
			<Flex justify="center" w="100%" mb="1%">
				<Text fontSize="5xl">
					Създаден хранителен план
				</Text>
			</Flex>
			<HSeparator />
			<Flex direction='column'>
				<SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
					{Object.keys(customServings).map((mealType, index) => (
				// <Box key={mealType}>
				  // <Flex justify="center" pt="5px" w="100%" mt="5px">
				  //   <Text fontSize="2xl">
				  //     {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {(mealPlan as any)[mealType]?.title || 'No recipe available'}
				  //   </Text>
				  // </Flex>
				//   <Flex justify="center" pt="2px" w="100%" mt="5px">
				//     <CustomServingInput
				//       mealType={mealType}
				//       value={(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}
				//       onIncrement={() => handleIncrement((mealType as keyof typeof customServings))}
				//       onDecrement={() => handleDecrement((mealType as keyof typeof customServings))}
				//     />
				//   </Flex>  
				//   <Flex justify="center" pt="5px" w="100%" mb="13%">
				//     <Text mr="5%" fontStyle='italic'>Serving: {(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}</Text>
				//     <Text mr="5%" fontStyle='italic'>Calories: {(calories as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
				//     <Text mr="5%" fontStyle='italic'>Protein: {(protein as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
				//     <Text mr="5%" fontStyle='italic'>Carbs: {(carbs as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
				//     <Text mr="5%" fontStyle='italic'>Fat: {(fat as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
				//   </Flex>
				// </Box>
						<Box key={mealType}>
							<RecipeWidget
								name={
									<Flex justify="center" pt="5px" w="100%" mt="5px" overflow="hidden">
										<Text fontSize="2xl" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
											{bulgarianMealType[index]}: {(mealPlan as any)[mealType]?.title || 'Няма рецепта'}
										</Text>
									</Flex>
								}
								author={
									<Flex direction="column" justify="center" align="center" pt="2px" w="100%" mt="5px">
										<CustomServingInput
											mealType={mealType}
											value={(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}
											onIncrement={() => handleIncrement((mealType as keyof typeof customServings))}
											onDecrement={() => handleDecrement((mealType as keyof typeof customServings))}
										/>
									</Flex>
								}
								image={(mealPlan as any)[mealType]?.photo}
								currentbid={
									<Box>
										<Flex direction={{ base: 'column', md: 'row' }} justify="center" pt="5px" w="100%" mb="2%" mt="2%">
											<Flex direction="column" mr={{ base: '10%', md: '15%' }} mb={{ base: '2%', md: 0 }}>
												<Text textStyle="italic" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} mb={{ base: '2%', md: 0, lg: "3%" }} fontStyle='italic'>
													Порция: {(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}
												</Text>
												<Text textStyle="italic" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} mb={{ base: '2%', md: 0, lg: "3%" }} fontStyle='italic'>
													Калории: {(calories as any)[`${mealType}`]?.toFixed(2) || 'N/A'}
												</Text>
												<Text textStyle="italic" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} fontStyle='italic'>
													Протеин: {(protein as any)[`${mealType}`]?.toFixed(2) || 'N/A'}
												</Text>
											</Flex>
											<Flex direction="column">
												<Text textStyle="italic" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} mb={{ base: '2%', md: 0, lg: "3%" }} fontStyle='italic'>
													Въглехидрати: {(carbs as any)[`${mealType}`]?.toFixed(2) || 'N/A'}
												</Text>
												<Text textStyle="italic" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} mb={{ base: '2%', md: 0, lg: "3%" }} fontStyle='italic'>
													Мазнини: {(fat as any)[`${mealType}`]?.toFixed(2) || 'N/A'}
												</Text>
												<Text textStyle="italic" fontSize={{ base: 'sm', md: 'md', lg: 'lg' }} fontStyle='italic'>
													Грамаж: {`${(mealPlan as any)[mealType]?.weightPerServing.amount.toFixed(2)}${(mealPlan as any)[mealType]?.weightPerServing.unit}` || 'N/A'}
												</Text>
											</Flex>
										</Flex>
									</Box>		
								}
							/>
						</Box>
					))}
				</SimpleGrid>
			</Flex>
			<HSeparator />
			<Flex justify="center" pt="5px" w="100%" mt="20px">
				<SimpleGrid columns={{ base: 2, md: 1, lg: 4 }} spacing="3%" alignItems="center">
					<Text mr="20%" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>Сумирани Калории: {calories.summed?.toFixed(2) || 'N/A'}</Text>
					<Text mr="20%" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>Сумирани Протеин: {protein.summed?.toFixed(2) || 'N/A'}</Text>
					<Text mr="20%" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>Сумирани Въглехидрати: {carbs.summed?.toFixed(2) || 'N/A'}</Text>
					<Text mr="20%" fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>Сумирани Мазнини: {fat.summed?.toFixed(2) || 'N/A'}</Text>
				</SimpleGrid>
			</Flex>
		</Card>
	);
};

export default MealPlanDetails;