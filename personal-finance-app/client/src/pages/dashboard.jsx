import React, { useEffect, useState } from "react";
import {
    Box,
    Heading,
    Spinner,
    VStack,
    Flex,
    Divider,
    Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_ENTRIES } from "../utils/queries";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [barChartData, setBarChartData] = useState(null);
    const [pieChartData, setPieChartData] = useState(null);
    const { data, loading, error } = useQuery(GET_USER_ENTRIES);

    useEffect(() => {
        if (data?.getTransactions) {
            const transactions = data.getTransactions;

            // Group transactions by type and category
            const categoryData = transactions.reduce((acc, transaction) => {
                const category = transaction.category.name;
                const type = transaction.type;

                if (!acc[category]) {
                    acc[category] = { income: 0, expense: 0 };
                }
                acc[category][type] += transaction.amount;

                return acc;
            }, {});

            const incomeTotal = transactions
                .filter((transaction) => transaction.type === "income")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            const expenseTotal = transactions
                .filter((transaction) => transaction.type === "expense")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            // Prepare Bar Chart Data
            setBarChartData({
                labels: Object.keys(categoryData),
                datasets: [
                    {
                        label: "Income",
                        data: Object.keys(categoryData).map(
                            (category) => categoryData[category].income
                        ),
                        backgroundColor: "rgba(75, 192, 192, 0.5)", // Green for income
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Expense",
                        data: Object.keys(categoryData).map(
                            (category) => categoryData[category].expense
                        ),
                        backgroundColor: "rgba(255, 99, 132, 0.5)", // Red for expense
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    },
                ],
            });

            // Prepare Pie Chart Data
            setPieChartData({
                labels: ["Income", "Expense"],
                datasets: [
                    {
                        data: [incomeTotal, expenseTotal],
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.5)", // Green for income
                            "rgba(255, 99, 132, 0.5)", // Red for expense
                        ],
                        borderColor: [
                            "rgba(75, 192, 192, 1)", // Green border
                            "rgba(255, 99, 132, 1)", // Red border
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [data]);

    if (loading) return <Spinner size="xl" />;
    if (error) return <Box>Error loading dashboard data</Box>;

    return (
        <Box p={6} bgGradient="linear(to-r, purple.600, blue.500)" minH="100vh">
            <Box
                maxW="4xl"
                mx="auto"
                bg="white"
                p={8}
                borderRadius="lg"
                boxShadow="2xl"
                textAlign="center"
            >
                <Heading fontSize="3xl" mb={6} color="purple.700">
                    Dashboard Overview
                </Heading>

                {/* Navigation Buttons */}
                <Flex justifyContent="space-between" mb={6}>
                    <Link to="/profile">
                        <Button colorScheme="purple">Go to Profile</Button>
                    </Link>
                    <Link to="/entry">
                        <Button colorScheme="teal">Add New Entry</Button>
                    </Link>
                </Flex>

                <VStack spacing={12} align="stretch">
                    {barChartData && (
                        <Box>
                            <Heading fontSize="xl" mb={4} color="gray.600">
                                Income and Expense Breakdown by Category
                            </Heading>
                            <Bar
                                data={barChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: "top" },
                                        title: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            stacked: true,
                                            ticks: { color: "gray" },
                                        },
                                        y: {
                                            stacked: true,
                                            ticks: { color: "gray" },
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <Divider />

                    {pieChartData && (
                        <Box maxW="md" mx="auto">
                            <Heading fontSize="xl" mb={4} color="gray.600">
                                Income vs. Expense Overview
                            </Heading>
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: "top" },
                                        title: {
                                            display: false,
                                        },
                                    },
                                }}
                                height={300} // Adjust the height of the pie chart
                                width={300} // Adjust the width of the pie chart
                            />
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default Dashboard;
