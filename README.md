# 💰 Personal Finance Visualizer

A responsive full-stack finance tracking app built with **Next.js App Router**, **MongoDB**, **shadcn/ui**, and **Recharts**. It helps you manage expenses, visualize spending patterns, and stay within budget.

![Personal Finance Visualizer](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---
<img src="https://github.com/Sushant-Joshilkar04/YardStick_Assignment/issues/1#issue-3203800851" alt="App Preview" width="100%" />

##  Features

### ✅ Stage 1: Transactions
- Add / edit / delete transactions
- Inputs: Amount, Description, Date
- Clean and responsive design

### ✅ Stage 2: Categories
- Predefined categories (Food, Transport, Health, etc.)
- Assign category to each transaction
- Category-wise pie chart
- Dashboard summary cards:
  - Total expenses
  - Category breakdown
  - Recent transactions

### ✅ Stage 3: Budgeting & Insights
- Set monthly budgets per category
- Budget vs actual comparison bar chart
- Remaining budget visualization
- Simple spending insights

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui
- **Backend**: API Routes via Next.js
- **Database**: MongoDB (Mongoose)
- **Visualization**: Recharts
- **Icons**: Lucide-react

---

## 📦 Setup Instructions


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sushant-Joshilkar04/YardStick_Assignment.git
   cd YardStick_Assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
frontend/
├── node_modules/          # Dependencies
├── public/               # Static assets
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── favicon.ico   # App icon
│   │   ├── globals.css   # Global styles
│   │   ├── layout.jsx    # Root layout
│   │   └── page.jsx      # Home page
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utility functions and configurations
│   └── models/          # MongoDB models
├── .env.local           # Environment variables
├── .gitignore           # Git ignore rules
├── components.json      # shadcn/ui configuration
├── jsconfig.json        # JavaScript configuration
├── next.config.mjs      # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── package.json         # Dependencies and scripts
└── package-lock.json    # Dependency lock file
```

---

##  Usage

### Adding Transactions
1. Navigate to the transactions page
2. Click "Add Transaction"
3. Fill in amount, description, category, and date
4. Save to add to your expense tracker

### Viewing Analytics
- **Dashboard**: Get an overview of your spending
- **Category Breakdown**: See spending by category in pie charts
- **Budget Tracking**: Monitor your budget vs actual spending
- **Insights**: View spending patterns and recommendations

### Managing Budgets
1. Go to the budgets section
2. Set monthly limits for each category
3. Track progress with visual indicators
4. Receive alerts when approaching limits


---

## 🌟 Key Components

### shadcn/ui Components Used
- **Card**: Dashboard summary cards
- **Button**: Action buttons throughout the app
- **Input**: Form inputs for transactions
- **Select**: Category selection dropdown
- **Dialog**: Modal dialogs for adding/editing
- **Alert**: Notification and status messages

### Recharts Visualizations
- **PieChart**: Category-wise expense breakdown
- **BarChart**: Budget vs actual comparison
- **LineChart**: Spending trends over time
- **AreaChart**: Monthly expense patterns

---
