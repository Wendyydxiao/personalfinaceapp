import React, { useEffect, useState } from "react";
import { Box, Heading, Spinner, VStack } from "@chakra-ui/react";
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

            // Group transactions by category and calculate totals
            const categoryTotals = transactions.reduce((acc, transaction) => {
                const category = transaction.category.name;
                acc[category] = (acc[category] || 0) + transaction.amount;
                return acc;
            }, {});

            // Separate income and expenses for pie chart
            const incomeTotal = transactions
                .filter((transaction) => transaction.type === "income")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            const expenseTotal = transactions
                .filter((transaction) => transaction.type === "expense")
                .reduce((sum, transaction) => sum + transaction.amount, 0);

            // Prepare Bar Chart Data
            setBarChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        label: "Income and Expenses by Category",
                        data: Object.values(categoryTotals),
                        backgroundColor: Object.keys(categoryTotals).map(
                            (category) =>
                                transactions.find(
                                    (t) => t.category.name === category
                                )?.type === "income"
                                    ? "rgba(75, 192, 192, 0.5)" // Green for income
                                    : "rgba(255, 99, 132, 0.5)" // Red for expense
                        ),
                        borderColor: Object.keys(categoryTotals).map(
                            (category) =>
                                transactions.find(
                                    (t) => t.category.name === category
                                )?.type === "income"
                                    ? "rgba(75, 192, 192, 1)" // Green border
                                    : "rgba(255, 99, 132, 1)" // Red border
                        ),
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
        <Box p={6} bgGradient="linear(to-r, purple.500, blue.500)" minH="100vh">
            <Box
                bg="white"
                p={10}
                borderRadius="lg"
                boxShadow="xl"
                textAlign="center"
            >
                <Heading fontSize="2xl" mb={6} color="purple.600">
                    Dashboard Overview
                </Heading>

                <VStack spacing={8}>
                    {barChartData && (
                        <Box w="full">
                            <Bar
                                data={barChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: "top" },
                                        title: {
                                            display: true,
                                            text: "Expense and Income Breakdown by Category",
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}

                    {pieChartData && (
                        <Box w="full">
                            <Pie
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: "top" },
                                        title: {
                                            display: true,
                                            text: "Income vs. Expense Overview",
                                        },
                                    },
                                }}
                            />
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
};

export default Dashboard;
