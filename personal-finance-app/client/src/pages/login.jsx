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
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import AuthService from '../utils/auth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginUser, { error }] = useMutation(LOGIN_USER);
  
  const handlePasswordVisibility = () => setShowPassword(!showPassword);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: { ...loginData },
      });
      AuthService.login(data.login.token);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

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

          <form onSubmit={handleLogin}>
            <Stack spacing={5}>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                />
              </FormControl>
              
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
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

              {error && (
                <Alert status="error">
                  <AlertIcon />
                  Invalid login credentials
                </Alert>
              )}

              <Center mt={4}>
                <Button colorScheme="purple" type="submit" w="50%">
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
          </form>
        </Box>
      </Element>
    </Flex>
  );
};

export default Login;

