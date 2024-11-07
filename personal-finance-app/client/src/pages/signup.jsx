
import { useState } from "react";
import { Box, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SIGNUP_USER } from "../utils/mutations";
import SignupForm from "../components/SignupForm";


function Signup() {
    const navigate = useNavigate();
    const [username, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const [signupUser, { loading }] = useMutation(SIGNUP_USER, {
        onCompleted: (data) => {
            localStorage.setItem("id_token", data.signup.token);
            navigate("/dashboard");
        },
        onError: (error) => {
            setErrorMessage(error.message);
        },
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setErrorMessage("All fields are required");
            return;
        }
        try {
            await signupUser({
                variables: {
                    username,
                    email,
                    password,
                },
            });
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    return (
        <Flex
            direction="column"
            align="center"
            justify="center"
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
                    Create Your Account
                </Heading>

                <SignupForm
                    username={username}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    handleSignup={handleSignup}
                    loading={loading}
                    errorMessage={errorMessage}
                />

                <Text mt={4} color="gray.600">
                    Already have an account?{" "}
                    <Button
                        variant="link"
                        colorScheme="purple"
                        onClick={() => navigate("/")}
                    >
                        Log In
                    </Button>
                </Text>
            </Box>
        </Flex>
    );
}

export default Signup;
