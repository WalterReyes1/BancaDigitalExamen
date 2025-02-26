import { transferFunds } from '@/utils/api';
import React, { useState, useEffect, JSX } from 'react';

interface Account {
  currency: string;
  id: string;
  account_number: string;
  name: string;
  balance: number;
}

interface TransferFormProps {
  onTransfer: (amount: number, fromAccountId: string, toAccountId: string, description: string) => void;
  accounts: Account[];
  fromAccount: Account | null;
}

const TransferForm: React.FC<TransferFormProps> = ({ onTransfer }): JSX.Element => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [toAccountId, setToAccountId] = useState<string>('');
  const [fromAccountId, setFromAccountId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Cargar cuentas desde localStorage
  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }
  }, []);

  const handleTransfer = async () => {
    setError('');
    setSuccess('');
  
    // Validar que todos los campos estén completos
    if (amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }
    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }
  
    // Encontrar las cuentas de origen y destino dentro del array
    const selectedFromAccount = accounts.find(account => account.id === fromAccountId);
    const selectedToAccount = accounts.find(account => account.id === toAccountId);

    try {
      // Realizar la transferencia
      const result = await transferFunds(fromAccountId, toAccountId, amount, description, "NIO");
  
      // Actualizar las cuentas con el nuevo saldo
      const updatedAccounts = [...accounts];
      const fromAccountIndex = updatedAccounts.findIndex(account => account.id === fromAccountId);
      const toAccountIndex = updatedAccounts.findIndex(account => account.id === toAccountId);
  
      // Restar el monto de la cuenta de origen y sumar a la cuenta destino
      if (fromAccountIndex !== -1) {
        updatedAccounts[fromAccountIndex].balance -= amount;
      }
      if (toAccountIndex !== -1) {
        updatedAccounts[toAccountIndex].balance += amount;
      }
  
      // Guardar las cuentas actualizadas en localStorage
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  
      // Actualizar el estado con las cuentas modificadas
      setAccounts(updatedAccounts);
  
      // Llamar a la función onTransfer
      onTransfer(amount, fromAccountId, toAccountId, description);
  
      // Mostrar mensaje de éxito
      setSuccess(result.message);
      setAmount(0);
      setDescription('');
      setToAccountId('');
    } catch (error) {
      setError('Error al realizar la transferencia. Verifica la información e intenta nuevamente.');
    }
  };

  return (
    <div className="mb-8 p-6 border rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Realizar Transferencia</h2>

      {/* Cuenta de origen */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Cuenta de origen</label>
        <select
          className="w-full p-2 border border-green-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={fromAccountId}
          onChange={(e) => setFromAccountId(e.target.value.trim())}
        >
          <option value="">Seleccionar cuenta de origen</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_number} - {account.currency} - {account.balance}
            </option>
          ))}
        </select>
      </div>

      {/* Cuenta de destino */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Seleccionar cuenta destino</label>
        <select
          className="w-full p-2 border border-green-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={toAccountId}
          onChange={(e) => setToAccountId(e.target.value.trim())}
        >
          <option value="">Seleccionar cuenta destino</option>
          {accounts.filter((account) => account.id !== fromAccountId).map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_number} - {account.currency} - {account.balance}
            </option>
          ))}
        </select>
      </div>

      {/* Monto */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Monto</label>
        <input
          type="text" // Cambié de "number" a "text"
          className="w-full p-2 border border-green-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={amount}
          onChange={(e) => {
            // Validación para permitir solo números
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setAmount(value ? Number(value) : 0);
            }
          }}
        />
      </div>

      {/* Descripción */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Descripción de la transferencia</label>
        <textarea
          className="w-full p-2 border border-green-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Mensajes de error o éxito */}
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      {success && <p className="mt-2 text-green-500 text-sm">{success}</p>}

      {/* Botón de transferencia */}
      <button
        onClick={handleTransfer}
        className="mt-6 w-full p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Transferir
      </button>
    </div>
  );
};

export default TransferForm;
