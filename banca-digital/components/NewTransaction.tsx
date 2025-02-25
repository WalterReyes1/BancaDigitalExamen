import { useState } from 'react';
import { createTransaction } from '../utils/api';

export default function NewTransaction({ accountId, onTransactionCreated }: { accountId: string; onTransactionCreated: (transaction: any) => void }) {
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTransaction = await createTransaction({ accountId, amount, type: 'deposit' });
      onTransactionCreated(newTransaction);
      alert('Transacción exitosa');
      setAmount(0);
    } catch (err) {
      setError('Error al realizar la transacción');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-green-700 mb-4">Nueva Transacción</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-2 border rounded mb-4"
        placeholder="Monto"
      />
      <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
        Depositar
      </button>
    </form>
  );
}