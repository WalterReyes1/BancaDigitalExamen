// components/TransferForm.tsx
import React, { useState } from 'react';

interface Account {
  id: string;
  name: string;
  balance: number;
}

interface TransferFormProps {
  fromAccount: Account;
  accounts: Account[];
}

const TransferForm: React.FC<TransferFormProps> = ({ fromAccount, accounts }) => {
  const [toAccountId, setToAccountId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleTransfer = () => {
    if (amount > fromAccount.balance) {
      setError('Saldo insuficiente');
      return;
    }

    // Aquí iría la lógica para realizar la transferencia
    setError('');
    alert('Transferencia realizada');
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-white">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Realizar Transferencia</h2>
      <p>Cuenta de origen: {fromAccount.name} (${fromAccount.balance.toFixed(2)})</p>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Seleccionar cuenta destino</label>
        <select
          className="w-full p-2 border rounded mt-1"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value)}
        >
          <option value="">Seleccionar cuenta</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          type="number"
          className="w-full p-2 border rounded mt-1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      {error && <p className="mt-2 text-red-500">{error}</p>}

      <button
        onClick={handleTransfer}
        className="mt-4 w-full p-2 bg-green-700 text-white rounded hover:bg-green-800"
      >
        Transferir
      </button>
    </div>
  );
};

export default TransferForm;
