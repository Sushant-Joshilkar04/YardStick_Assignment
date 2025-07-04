import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DashboardSummary({ transactions }) {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  const categories = ['Food', 'Transport', 'Shopping', 'Health', 'Utilities', 'Other'];
  const byCategory = {};
  categories.forEach(cat => {
    byCategory[cat] = 0;
  });
  transactions.forEach(t => {
    if (t.category && byCategory.hasOwnProperty(t.category)) {
      byCategory[t.category] += t.amount;
    }
  });
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${total.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {categories.map(cat => (
              <li key={cat} className="flex justify-between items-center">
                <span>{cat}</span>
                <span>${byCategory[cat].toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {recent.map(t => (
              <li key={t.id} className="flex justify-between text-sm">
                <span>{t.description}</span>
                <span>${t.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}