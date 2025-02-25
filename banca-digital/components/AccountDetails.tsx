import { useEffect, useState } from 'react';
import { fetchAccount } from '../utils/api';

interface Account {
  id: string;
  alias: string;
  balance: number;
  currency: string;
}

export default function AccountDetails({ accountId }: { accountId: string }) {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccount(accountId).then(setAccount);
  }, [accountId]);

  return account ? (
    <div className="p-6 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700">Detalles de la Cuenta</h2>
      <p className="text-gray-600 mt-2">
        Alias: <span className="font-semibold">{account.alias}</span>
      </p>
      <p className="text-gray-600">
        Balance: <span className="font-semibold">${account.balance.toFixed(2)}</span>
      </p>
      <p className="text-gray-600">
        Moneda: <span className="font-semibold">{account.currency}</span>
      </p>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}