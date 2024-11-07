import React, { useState } from "react";
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
} from "@chakra-ui/react";
import {
    ViewIcon,
    ViewOffIcon,
    ArrowForwardIcon,
    CheckCircleIcon,
    StarIcon,
} from "@chakra-ui/icons";
import { Link as ScrollLink, Element } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import AuthService from "../utils/auth";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handlePasswordVisibility = () => setShowPassword(!showPassword);

    // Define the mutation for logging in the user
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            // Use AuthService to save the token and redirect
            AuthService.login(data.login.token);
            navigate("/dashboard");
        },
        onError: (error) => {
            // Handle any errors during login
            setErrorMessage(error.message);
        },
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setErrorMessage("Both email and password are required");
            return;
        }

        try {
            await loginUser({
                variables: { email, password },
            });
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
                <Heading fontSize="4xl" mb={4}>
                    Welcome to Your Personal Finance App
                </Heading>
                <Text fontSize="lg" mb={6}>
                    Track, manage, and optimize your finances effortlessly.
                </Text>
                <ScrollLink to="features-section" smooth={true} duration={500}>
                    <Button
                        colorScheme="yellow"
                        size="lg"
                        rightIcon={<ArrowForwardIcon />}
                    >
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
                            <Icon
                                as={CheckCircleIcon}
                                color="purple.500"
                                boxSize={6}
                                mr={3}
                            />
                            <Box>
                                <Text fontWeight="medium">
                                    Track your spending easily
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                    Stay on top of your finances with ease.
                                </Text>
                            </Box>
                        </Flex>
                        <Flex align="center" textAlign="left" w="full">
                            <Icon
                                as={StarIcon}
                                color="blue.400"
                                boxSize={6}
                                mr={3}
                            />
                            <Box>
                                <Text fontWeight="medium">
                                    Set and meet goals
                                </Text>
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
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>

                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                                <InputRightElement>
                                    <Button
                                        variant="ghost"
                                        onClick={handlePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <ViewOffIcon />
                                        ) : (
                                            <ViewIcon />
                                        )}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>

                        {errorMessage && (
                            <Text color="red.500" mt={4}>
                                {errorMessage}
                            </Text>
                        )}

                        <Center mt={4}>
                            <Button
                                colorScheme="purple"
                                w="50%"
                                onClick={handleLogin}
                                isLoading={loading}
                            >
                                Log In
                            </Button>
                        </Center>

                        <Text textAlign="center" mt={4}>
                            Don’t have an account?{" "}
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
