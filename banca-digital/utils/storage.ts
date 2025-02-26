// utils/storage.ts

const LOCAL_STORAGE_KEY = 'transactions';

// Obtener transacciones desde localStorage
export const getStoredTransactions = () => {
  const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedTransactions ? JSON.parse(storedTransactions) : [];
};

// Guardar una nueva transacción en localStorage
export const saveTransaction = (transaction: any) => {
  const transactions = getStoredTransactions();
  transactions.push(transaction);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
};
