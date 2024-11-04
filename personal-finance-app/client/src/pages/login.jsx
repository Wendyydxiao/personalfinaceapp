import React from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  VStack,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  Divider,
  Heading,
  Center,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowForwardIcon, CheckCircleIcon, StarIcon } from '@chakra-ui/icons';
import { Link as ScrollLink, Element } from 'react-scroll';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Flex
      direction="column"
      align="center"
      justify="start"
      minH="100vh"
      bgGradient="linear(to-r, purple.500, blue.500)"
      p={4}
    >
      <Box w="full" textAlign="center" py={20} color="white">
        <Heading fontSize="4xl" mb={4}>Welcome to Your Personal Finance App</Heading>
        <Text fontSize="lg" mb={6}>Track, manage, and optimize your finances effortlessly.</Text>
        <ScrollLink to="features-section" smooth={true} duration={500}>
          <Button colorScheme="yellow" size="lg" rightIcon={<ArrowForwardIcon />}>
            Explore Now
          </Button>
        </ScrollLink>
      </Box>

      <Element name="features-section">
        <Box
          maxW="xl"
          w="full"
          bg="white"
          p={10}
          mt={2}
          borderRadius="lg"
          boxShadow="xl"
          textAlign="center"
        >
          <VStack spacing={6} mb={8}>
            <Flex align="center" textAlign="left" w="full">
              <Icon as={CheckCircleIcon} color="purple.500" boxSize={6} mr={3} />
              <Box>
                <Text fontWeight="medium">Track your spending easily</Text>
                <Text fontSize="sm" color="gray.500">
                  Stay on top of your finances with ease.
                </Text>
              </Box>
            </Flex>
            <Flex align="center" textAlign="left" w="full">
              <Icon as={StarIcon} color="blue.400" boxSize={6} mr={3} />
              <Box>
                <Text fontWeight="medium">Set and meet goals</Text>
                <Text fontSize="sm" color="gray.500">
                  Your finances, organized and optimized.
                </Text>
              </Box>
            </Flex>
          </VStack>

          <Divider mb={6} />

          <Stack spacing={5}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="name@example.com" />
            </FormControl>
            
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Center mt={4}>
              <Button colorScheme="purple" w="50%">
                Log In
              </Button>
            </Center>

            <Text textAlign="center" mt={4}>
              Don’t have an account?{' '}
              <Link to="/signup">
                <Button colorScheme="purple" variant="link">
                  Sign Up
                </Button>
              </Link>
            </Text>
          </Stack>
        </Box>
      </Element>
    </Flex>
  );
};

export default Login;

