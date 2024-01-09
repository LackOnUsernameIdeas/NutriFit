// Chakra imports
import { AvatarGroup, Avatar, Box, Button, Flex, Icon, Image, Link, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
// Assets
import { useState } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';

export default function RecipeWidget(props: {
	image: string;
	name: any;
	author: any;
	currentbid: any;
}) {
	const { image, name, author, currentbid } = props;
	const [ like, setLike ] = useState(false);
	const textColor = useColorModeValue('navy.700', 'white');
	const textColorBid = useColorModeValue('brand.500', 'white');
	return (
		<Card p='20px'>
			<Flex direction={{ base: 'column' }} justify='center'>
				<Box mb={{ base: '20px', '2xl': '20px' }} position='relative'>
					<Image
						src={image}
						w={{ base: '100%', '3xl': '100%' }}
						h={{ base: '100%', '3xl': '100%' }}
						borderRadius='20px'
						maxH="300px"
						objectFit='cover'
					/>
					{/* 
					----LIKE BUTTON----
					
					<Button
						position='absolute'
						bg='white'
						_hover={{ bg: 'whiteAlpha.900' }}
						_active={{ bg: 'white' }}
						_focus={{ bg: 'white' }}
						p='0px !important'
						top='14px'
						right='14px'
						borderRadius='50%'
						minW='36px'
						h='36px'
						onClick={() => {
							setLike(!like);
						}}>
						<Icon
							transition='0.2s linear'
							w='20px'
							h='20px'
							as={like ? IoHeart : IoHeartOutline}
							color='brand.500'
						/>
					</Button> */}
				</Box>
				<Flex flexDirection='column' justify='space-between' h='100%'>
					<Flex
						justify="center"
						direction={{
							base: 'row',
							md: 'column',
							lg: 'row',
							xl: 'column',
							'2xl': 'row'
						}}
						mb='auto'>
						<Text
							color={textColor}
							fontSize={{
								base: 'xl',
								md: 'lg',
								lg: 'lg',
								xl: 'lg',
								'2xl': 'md',
								'3xl': 'lg'
							}}
							mb='5px'
							fontWeight='bold'
							me='14px'>
							{name}
						</Text>
					</Flex>
					<Flex justify="center">
						<Text
							color='secondaryGray.600'
							fontSize={{
								base: 'sm'
							}}
							fontWeight='400'
							me='14px'>
							{author}
						</Text>
					</Flex>
					<Flex justify="center">
						{currentbid}
					</Flex>
					{/* 
					
					----BUTTON, COULD BE USED FOR RECIPES?----
					
					<Link
						href={download}
						mt={{
							base: '0px',
							md: '10px',
							lg: '0px',
							xl: '10px',
							'2xl': '0px'
						}}>
						<Button
							variant='darkBrand'
							color='white'
							fontSize='sm'
							fontWeight='500'
							borderRadius='70px'
							px='24px'
							py='5px'>
							Place Bid
						</Button>
					</Link> */}
				</Flex>
			</Flex>
		</Card>
	);
}
