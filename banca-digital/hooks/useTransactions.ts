import { useState, useEffect } from 'react';
import { getTransaction, createTransaction } from '../utils/api';

export default function useTransactions(accountId: string) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getTransaction(accountId);
      setTransactions(data);
      setLoading(false);
    };

    fetchTransactions();
  }, [accountId]);

  const addTransaction = async (transactionData: any) => {
    const newTransaction = await createTransaction(transactionData);
    setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  };

  return { transactions, loading, addTransaction };
}