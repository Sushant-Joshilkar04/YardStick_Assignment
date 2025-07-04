import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

export default function MonthlyExpensesChart({ transactions }) {
  const generateChartData = () => {
    const endDate = new Date();
    const startDate = subMonths(endDate, 5); 
    
    const months = eachMonthOfInterval({
      start: startDate,
      end: endDate
    });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthlyExpenses = transactions
        .filter(transaction => {
          const transactionDate = parseISO(transaction.date);
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        expenses: monthlyExpenses
      };
    });
  };

  const chartData = generateChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value.toFixed(2)}`, 'Expenses']}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="expenses" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
