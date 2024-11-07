import React from "react";
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Text,
} from "@chakra-ui/react";

function SignupForm({
    username,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    handleSignup,
    loading,
    errorMessage,
}) {
    return (
        <form onSubmit={handleSignup}>
            <VStack spacing={5}>
                <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder="Your name"
                        value={username}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>

                <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>

                {errorMessage && <Text color="red.500">{errorMessage}</Text>}

                <Button
                    colorScheme="purple"
                    type="submit"
                    isLoading={loading}
                    width="full"
                >
                    Sign Up
                </Button>
            </VStack>
        </form>
    );
}

export default SignupForm;
