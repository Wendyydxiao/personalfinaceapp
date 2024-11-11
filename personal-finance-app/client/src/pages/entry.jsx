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
    useToast,
    HStack,
    Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CATEGORIES, GET_USER_ENTRIES } from "../utils/queries";
import {
    ADD_TRANSACTION,
    ADD_CATEGORY,
    DELETE_ENTRY,
} from "../utils/mutations";

const DEFAULT_CATEGORIES = {
    income: [
        "Salary",
        "Bonus",
        "Freelancing",
        "Investments",
        "Rental Income",
        "Business Revenue",
        "Side Hustles",
        "Gifts",
        "Other",
    ],
    expense: [
        "Rent/Mortgage",
        "Utilities",
        "Groceries",
        "Dining Out",
        "Transportation",
        "Healthcare",
        "Insurance",
        "Debt Payments",
        "Education",
        "Personal Care",
        "Entertainment",
        "Clothing",
        "Savings/Investments",
        "Gifts/Donations",
        "Travel/Vacation",
        "Miscellaneous",
    ],
};

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
    const [deleteTransaction] = useMutation(DELETE_ENTRY);

    const toast = useToast();

    useEffect(() => {
        if (categoryData?.getCategories) {
            const userCategories = categoryData.getCategories.map((cat) => ({
                name: cat.name,
                type: cat.type,
            }));
            setCategories(userCategories);
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

            toast({
                title: "Transaction Added",
                description: "Your transaction has been successfully added.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error adding transaction:", err.message);
            toast({
                title: "Error Adding Transaction",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleDeleteEntry = async (id) => {
        try {
            await deleteTransaction({
                variables: { id },
            });
            refetch();
            toast({
                title: "Transaction Deleted",
                description: "The transaction has been successfully deleted.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (err) {
            console.error("Error deleting transaction:", err.message);
            toast({
                title: "Error Deleting Transaction",
                description: err.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const filteredCategories = [
        ...DEFAULT_CATEGORIES[newEntry.type.toLowerCase()],
        ...categories
            .filter((cat) => cat.type === newEntry.type.toLowerCase())
            .map((cat) => cat.name),
    ];

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
                            {filteredCategories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
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

            <Box
                maxW="lg"
                w="full"
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="xl"
                textAlign="center"
                mx="auto"
            >
                <Heading fontSize="2xl" color="purple.600" mb={6}>
                    Your Transactions
                </Heading>
                {data?.getTransactions.map((transaction) => (
                    <Box
                        key={transaction.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        mb={4}
                        bg="gray.50"
                    >
                        <Text fontWeight="bold">
                            {transaction.type.toUpperCase()} -{" "}
                            {transaction.category.name}
                        </Text>
                        <Text>{transaction.description}</Text>
                        <Text>${transaction.amount}</Text>
                        <Text>
                            {new Date(transaction.date).toLocaleDateString()}
                        </Text>
                        <Button
                            colorScheme="red"
                            mt={2}
                            onClick={() => handleDeleteEntry(transaction.id)}
                        >
                            Delete
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Entry;
