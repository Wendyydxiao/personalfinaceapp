import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Input,
    VStack,
    FormControl,
    FormLabel,
    Heading,
    Select,
    Spinner,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORIES, GET_USER_ENTRIES } from "../utils/queries";
import { ADD_TRANSACTION, ADD_CATEGORY } from "../utils/mutations";

const Entry = () => {
    const [newEntry, setNewEntry] = useState({
        type: "Expense",
        category: "",
        amount: "",
        date: "",
        description: "",
    });

    const [categories, setCategories] = useState([]);
    const { data: categoryData, loading: categoryLoading } =
        useQuery(GET_CATEGORIES);
    const {
        data,
        loading: transactionLoading,
        error,
        refetch,
    } = useQuery(GET_USER_ENTRIES);

    const [addTransaction] = useMutation(ADD_TRANSACTION);
    const [addCategory] = useMutation(ADD_CATEGORY);

    useEffect(() => {
        if (categoryData?.getCategories) {
            setCategories(categoryData.getCategories);
        }
    }, [categoryData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleAddEntry = async () => {
        try {
            const normalizedType = newEntry.type.toLowerCase();
            let category = categories.find(
                (cat) => cat.name === newEntry.category
            );

            if (!category) {
                const { data: newCategory } = await addCategory({
                    variables: {
                        name: newEntry.category,
                        type: normalizedType,
                    },
                });
                category = newCategory.addCategory;
                setCategories([...categories, category]);
            }

            await addTransaction({
                variables: {
                    input: {
                        type: normalizedType,
                        amount: parseFloat(newEntry.amount),
                        date: newEntry.date,
                        description: newEntry.description,
                        category: category.name,
                    },
                },
            });

            setNewEntry({
                type: "Expense",
                category: "",
                amount: "",
                date: "",
                description: "",
            });

            refetch();
        } catch (err) {
            console.error("Error adding transaction:", err.message);
        }
    };

    if (transactionLoading || categoryLoading) return <Spinner size="xl" />;
    if (error)
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching entries
            </Alert>
        );

    return (
        <Box minH="100vh" bgGradient="linear(to-r, purple.500, blue.500)" p={6}>
            <Box
                maxW="lg"
                w="full"
                bg="white"
                p={10}
                borderRadius="lg"
                boxShadow="xl"
                textAlign="center"
                mx="auto"
                mb={10}
            >
                <Heading fontSize="2xl" color="purple.600" mb={6}>
                    Add a New Transaction
                </Heading>

                <VStack spacing={4} align="stretch">
                    <FormControl id="type">
                        <FormLabel>Transaction Type</FormLabel>
                        <Select
                            name="type"
                            value={newEntry.type}
                            onChange={handleInputChange}
                        >
                            <option value="Income">Income</option>
                            <option value="Expense">Expense</option>
                        </Select>
                    </FormControl>

                    <FormControl id="category">
                        <FormLabel>Category</FormLabel>
                        <Select
                            placeholder="Select or enter a category"
                            name="category"
                            value={newEntry.category}
                            onChange={handleInputChange}
                        >
                            {categories
                                .filter(
                                    (cat) =>
                                        cat.type === newEntry.type.toLowerCase()
                                )
                                .map((category) => (
                                    <option
                                        key={category._id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                        </Select>
                        <Input
                            mt={2}
                            placeholder="Add a new category"
                            value={newEntry.category}
                            onChange={(e) =>
                                setNewEntry({
                                    ...newEntry,
                                    category: e.target.value,
                                })
                            }
                        />
                    </FormControl>

                    <FormControl id="amount">
                        <FormLabel>Amount</FormLabel>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            name="amount"
                            value={newEntry.amount}
                            onChange={handleInputChange}
                        />
                    </FormControl>

                    <FormControl id="date">
                        <FormLabel>Date</FormLabel>
                        <Input
                            type="date"
                            name="date"
                            value={newEntry.date}
                            onChange={handleInputChange}
                        />
                    </FormControl>

                    <FormControl id="description">
                        <FormLabel>Description</FormLabel>
                        <Input
                            type="text"
                            placeholder="Optional description"
                            name="description"
                            value={newEntry.description}
                            onChange={handleInputChange}
                        />
                    </FormControl>

                    <Button
                        colorScheme="purple"
                        onClick={handleAddEntry}
                        width="full"
                    >
                        Add Entry
                    </Button>
                </VStack>
            </Box>
        </Box>
    );
};

export default Entry;
