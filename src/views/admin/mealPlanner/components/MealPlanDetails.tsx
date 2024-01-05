import React from 'react';
import { CustomServingInput } from "./CustomServingInput";
import { MealPlan, NutrientState, SuggestedMaxServings, CustomServings } from "../variables/mealPlaner";
import { Box, Text, Flex, VStack, SimpleGrid } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import RecipeWidget from 'components/card/NFT';
import Pancakes from 'assets/img/nfts/pancakes.jpg';
import Shkembe from 'assets/img/nfts/shkembe-chorba.jpg';
import Sarma from 'assets/img/nfts/sarma.jpg';
import Avatar1 from 'assets/img/avatars/avatar1.png';
import Avatar2 from 'assets/img/avatars/avatar2.png';
import Avatar3 from 'assets/img/avatars/avatar3.png';
import Avatar4 from 'assets/img/avatars/avatar4.png';
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

const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({ customServings, suggestedMaxServings, mealPlan, calories, protein, carbs, fat, handleIncrement, handleDecrement }) => {
	return (
		<Card>
			<Flex justify="center" w="100%" >
				<Text fontSize="4xl">
					Generated Meal Plan
				</Text>
			</Flex>
			<HSeparator />
			<Flex direction='column'>
				<SimpleGrid columns={{ base: 1, md: 3 }} gap='20px'>
					{Object.keys(customServings).map((mealType) => (
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
									<Flex justify="center" pt="5px" w="100%" mt="5px">
										<Text fontSize="2xl">
											{mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {(mealPlan as any)[mealType]?.title || 'No recipe available'}
										</Text>
									</Flex>
								}
								author={
									<Flex justify="center" pt="2px" w="100%" mt="5px">
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
										<Flex justify="center" pt="5px" w="100%" mb="2%" mt="2%">
											<Text mr="4%" fontStyle='italic'>Serving: {(customServings as any)[mealType] !== 0 ? (customServings as any)[mealType] : (suggestedMaxServings as any)[mealType]}</Text>
											<Text mr="4%" fontStyle='italic'>Calories: {(calories as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
											<Text mr="4%" fontStyle='italic'>Protein: {(protein as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
											<Text mr="4%" fontStyle='italic'>Carbs: {(carbs as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
											<Text mr="4%" fontStyle='italic'>Fat: {(fat as any)[`${mealType}`]?.toFixed(2) || 'N/A'}</Text>
											<Text fontStyle='italic'>Грамаж: {`${(mealPlan as any)[mealType]?.weightPerServing.amount.toFixed(2)}${(mealPlan as any)[mealType]?.weightPerServing.unit}`  || 'N/A'}</Text>
										</Flex>
									</Box>		
								}
							/>
						</Box>
					))}
				</SimpleGrid>
			</Flex>
			<Box>
				<HSeparator />
				<Flex justify="center" pt="5px" w="100%" mt="20px">
					<Text mr="12%" fontSize="2xl">Summed Calories: {calories.summed?.toFixed(2) || 'N/A'}</Text>
					<Text mr="12%" fontSize="2xl">Summed Protein: {protein.summed?.toFixed(2) || 'N/A'}</Text>
					<Text mr="12%" fontSize="2xl">Summed Carbs: {carbs.summed?.toFixed(2) || 'N/A'}</Text>
					<Text fontSize="2xl">Summed Fat: {fat.summed?.toFixed(2) || 'N/A'}</Text>
				</Flex>
			</Box>
		</Card>
	);
};

export default MealPlanDetails;