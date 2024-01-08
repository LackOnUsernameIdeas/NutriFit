import { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail, onAuthStateChanged, } from 'firebase/auth';
import 'firebase/compat/auth';
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
import Cookies from 'js-cookie';

function ForgotPass() {
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [email, setEmail] = useState('');
  const history = useHistory();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleForgotPass = async () => {
    try {
        const auth = getAuth();
        // --------------------------------------------------------------
        // DEPRECATED -- NO WAY TO CHECK FOR AN EXISTING EMAIL ADDRESS
        // --------------------------------------------------------------
        //
        // const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        // if (signInMethods.length === 0) {
        //     // Email is not registered
        //     setError('Email is not registered. Create an account using the button below.');
        //     return;
        // }
        await sendPasswordResetEmail(auth, email);
        // Password reset email sent successfully
        setSuccessMessage('Password reset email sent successfully! Check your inbox.');
        setError('');
        setTimeout(()=> {
            history.push('auth/sign-in')
        }, 5000)
    } catch (error) {
        if (error instanceof Error) {
          switch(error.message){
            case 'Firebase: Error (auth/invalid-email).':
              setError('An invalid email has been provided.');
              break;
            case 'Firebase: Error (auth/invalid-credential).':
              setError('Could not send email, please try again.');
              break;
            case 'Firebase: Error (auth/user-not-found).':
              setError('Could not sign in, please try again.');
              break;
            default:
              setError('An error has occurred while signing in: ' + error.message)
          }
        } else {
          setError('An error has occurred while signing in.');
        }
      }
  };  

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='center'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto' maxW="100%">
          <Heading color={textColor} fontSize='36px' mb='10px'>
            Забравена парола?
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            Моля напишете вашият email и си проверете пощата.
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius='15px'
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <FormControl>
            <Flex align='center' mb='25px'>
                <HSeparator />
            </Flex>
            <FormLabel
              display='flex'
              ms='4px'
              fontSize='sm'
              fontWeight='500'
              color={textColor}
              mb='8px'>
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant='auth'
              fontSize='sm'
              ms={{ base: "0px", md: "0px" }}
              type='email'
              placeholder='example@noit.eu'
              mb='24px'
              fontWeight='500'
              size='lg'
              onChange={(email) => setEmail(email.target.value)}
            />
            <Button
              onClick={handleForgotPass}
              fontSize='sm'
              variant='brand'
              fontWeight='500'
              w='100%'
              h='50'
              mb='24px'>
              Прати email за Възстановяване на Парола
            </Button>
            {successMessage && (
                <Text color='green' fontSize='sm' mb='8px'>
                {successMessage}
                </Text>
            )}
            {error && (
                <Text color='red' fontSize='sm' mb='8px'>
                {error}
                </Text>
            )}
          </FormControl>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              Не сте се регистрирали?
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  Създадете профил.
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}
export default ForgotPass;