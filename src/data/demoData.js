const today = new Date();
const d = (daysAgo) => {
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

let id = 1;
const tx = (type, amount, category, description, daysAgo, recurring = false) => ({
  id: id++,
  type,
  amount,
  category,
  description,
  date: d(daysAgo),
  recurring,
});

export const demoTransactions = [
  // Income
  tx('income', 5500, 'income', 'Monthly Salary', 1),
  tx('income', 800, 'income', 'Freelance Project', 5),
  tx('income', 200, 'income', 'Stock Dividends', 12),
  tx('income', 5500, 'income', 'Monthly Salary', 30, true),
  tx('income', 150, 'income', 'Cashback Reward', 18),

  // Food
  tx('expense', 45, 'food', 'Grocery Shopping', 0),
  tx('expense', 28, 'food', 'Restaurant Dinner', 2),
  tx('expense', 12, 'food', 'Coffee & Snacks', 3),
  tx('expense', 65, 'food', 'Weekly Groceries', 7),
  tx('expense', 18, 'food', 'Lunch at Office', 9),

  // Travel
  tx('expense', 55, 'travel', 'Uber Rides', 1),
  tx('expense', 120, 'travel', 'Train Tickets', 8),
  tx('expense', 40, 'travel', 'Fuel', 14),

  // Shopping
  tx('expense', 250, 'shopping', 'New Headphones', 4),
  tx('expense', 85, 'shopping', 'Clothing', 11),
  tx('expense', 35, 'shopping', 'Books', 15),

  // Bills
  tx('expense', 95, 'bills', 'Electricity Bill', 2, true),
  tx('expense', 50, 'bills', 'Internet Bill', 3, true),
  tx('expense', 45, 'bills', 'Phone Bill', 5, true),
  tx('expense', 1200, 'bills', 'Rent', 1, true),

  // Health
  tx('expense', 60, 'health', 'Gym Membership', 1, true),
  tx('expense', 35, 'health', 'Pharmacy', 6),
  tx('expense', 120, 'health', 'Doctor Visit', 20),

  // Education
  tx('expense', 200, 'education', 'Online Course', 10),
  tx('expense', 45, 'education', 'Study Materials', 16),

  // Entertainment
  tx('expense', 15, 'entertainment', 'Netflix', 2, true),
  tx('expense', 30, 'entertainment', 'Movie Night', 6),
  tx('expense', 25, 'entertainment', 'Spotify + Games', 8, true),

  // Others
  tx('expense', 40, 'others', 'Gift for Friend', 4),
  tx('expense', 20, 'others', 'Charity Donation', 13),
];

export const demoBudgets = {
  food: 400,
  travel: 300,
  shopping: 500,
  bills: 1500,
  health: 300,
  education: 350,
  entertainment: 150,
  others: 200,
};
