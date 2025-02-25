import { useEffect, useState } from 'react';
import { fetchAccountTransactions } from '../utils/api';

type Transaction = {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  description: string;
  date: string;
};

export default function TransactionList({ accountId }: { accountId: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchAccountTransactions(accountId).then(setTransactions);
  }, [accountId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Historial de Transacciones</h2>
      <ul className="space-y-4">
        {transactions.map((t) => (
          <li key={t.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-600">{t.date}</p>
            <p className="font-semibold text-green-700">{t.description}</p>
            <p className={`text-gray-800 ${t.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
              {t.type === 'deposit' ? '+' : '-'}${t.amount.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}