import React, { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filterDate, setFilterDate] = useState<string>('');

  const filteredTransactions = transactions.filter((transaction) =>
    filterDate ? transaction.date.startsWith(filterDate) : true
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Historial de Transacciones</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filtrar por fecha</label>
        <input
          type="date"
          className="w-full p-2 border rounded mt-1"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
      <ul className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <li key={transaction.id} className="p-4 border rounded-lg hover:shadow-md">
            <p className="text-sm text-gray-600">{transaction.date}</p>
            <p className="font-semibold text-green-700">{transaction.description}</p>
            <p className="text-gray-800">Monto: ${transaction.amount.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;