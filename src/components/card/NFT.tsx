// Chakra imports
import {
  AvatarGroup,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card";
// Assets
import { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

export default function RecipeWidget(props: {
  image?: string;
  name: any;
  author: any;
  currentbid: any;
}) {
  const { image, name, author, currentbid } = props;
  const [like, setLike] = useState(false);
  const textColor = useColorModeValue("navy.700", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  return (
    <Card p="0" borderColor={borderColor} borderWidth="3px">
      <Flex direction={{ base: "column" }} justify="center">
        <Box mb={{ base: "20px", "2xl": "20px" }} position="relative">
          {image && (
            <Link href={image} target="_blank">
              <Image
                src={image}
                w={{ base: "100%", "3xl": "100%" }}
                h={{ base: "100%", "3xl": "100%" }}
                borderRadius="20px"
                maxH={{ base: "400px", md: "300px", lg: "220px" }}
                objectFit="cover"
              />
            </Link>
          )}
          <Flex
            justify="center"
            direction={{
              base: "row",
              md: "column",
              lg: "row",
              xl: "column",
              "2xl": "row"
            }}
            mt="20px"
          >
            <Text
              color={textColor}
              fontSize={{
                base: "xl",
                md: "lg",
                lg: "lg",
                xl: "lg",
                "2xl": "md",
                "3xl": "lg"
              }}
              fontWeight="bold"
            >
              {name}
            </Text>
          </Flex>
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
        <Flex flexDirection="column" justify="space-between" h="100%">
          <Flex justify="center">
            <Text
              color="secondaryGray.600"
              fontSize={{
                base: "sm"
              }}
              fontWeight="400"
            >
              {author}
            </Text>
          </Flex>
          <Flex justify="center" mb="20px">
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
