import React, { useState } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    FormControl,
    FormLabel,
    Heading,
    Center,
    Alert,
    AlertIcon,
    Spinner,
    useToast,
    Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE } from "../utils/queries";
import { UPDATE_PASSWORD } from "../utils/mutations";
import AuthService from "../utils/auth";
import axios from "axios";
import { StarIcon } from "@chakra-ui/icons";

const Profile = () => {
    const toast = useToast();
    const { data, loading, error } = useQuery(GET_USER_PROFILE);

    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [updatePassword, { loading: updatingPassword }] =
        useMutation(UPDATE_PASSWORD);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    const handleUpdatePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please ensure both password fields match.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            await updatePassword({
                variables: {
                    newPassword: passwordData.newPassword,
                },
            });
            toast({
                title: "Password updated",
                description: "Your password has been successfully updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setPasswordData({
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            toast({
                title: "Error updating password",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = "/";
    };

    const handleUpgradeNow = async () => {
        const API_BASE_URL =
            process.env.REACT_APP_API_BASE_URL ||
            "https://personalfinaceapp-y9ns.onrender.com";

        try {
            const response = await axios.post(
                `${API_BASE_URL}/create-checkout-session`
            );
            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("Invalid response from the server");
            }
        } catch (error) {
            console.error("Failed to start checkout process:", error);
            toast({
                title: "Error",
                description:
                    "Failed to start checkout process. Please try again later.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    if (loading) return <Spinner size="xl" />;
    if (error)
        return (
            <Alert status="error">
                <AlertIcon />
                Error loading profile information: {error.message}
            </Alert>
        );

    const { username, email } = data.getUser;

    return (
        <Center
            minH="100vh"
            bgGradient="linear(to-r, purple.500, blue.500)"
            p={4}
        >
            <Box
                maxW="lg"
                w="full"
                bg="white"
                p={10}
                borderRadius="lg"
                boxShadow="xl"
                textAlign="center"
            >
                <Heading fontSize="2xl" mb={6} color="purple.600">
                    User Profile
                </Heading>

                <VStack spacing={4} align="stretch">
                    <FormControl id="name">
                        <FormLabel>Name</FormLabel>
                        <Input
                            type="text"
                            value={username}
                            isReadOnly
                            _focus={{ boxShadow: "none" }}
                            _hover={{ cursor: "not-allowed" }}
                        />
                    </FormControl>

                    <FormControl id="email">
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            isReadOnly
                            _focus={{ boxShadow: "none" }}
                            _hover={{ cursor: "not-allowed" }}
                        />
                    </FormControl>

                    <FormControl id="password">
                        <FormLabel>Update Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />
                    </FormControl>

                    <FormControl id="confirmPassword">
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />
                    </FormControl>

                    <Button
                        colorScheme="green"
                        width="full"
                        onClick={handleUpdatePassword}
                        isLoading={updatingPassword}
                    >
                        Update Password
                    </Button>

                    <Box mt={8} textAlign="center">
                        <Button
                            colorScheme="yellow"
                            width="full"
                            size="lg"
                            bgGradient="linear(to-r, orange.300, yellow.400)"
                            _hover={{
                                bgGradient:
                                    "linear(to-r, orange.400, yellow.500)",
                            }}
                            boxShadow="lg"
                            leftIcon={<StarIcon />}
                            onClick={handleUpgradeNow}
                        >
                            <Text fontSize="lg" fontWeight="bold">
                                Upgrade Now - Unlock Premium Features
                            </Text>
                        </Button>
                        <Text fontSize="sm" color="gray.500" mt={2}>
                            Enjoy more insights and personalized tools with
                            premium. Total cost is A$2.88.
                        </Text>
                    </Box>

                    <Link to="/dashboard">
                        <Button colorScheme="blue" width="full">
                            Go to Dashboard
                        </Button>
                    </Link>

                    <Button
                        colorScheme="purple"
                        width="full"
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Log Out
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
};

export default Profile;
