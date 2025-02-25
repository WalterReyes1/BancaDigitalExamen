const API_URL = "/api"; // Usa el rewrite de Next.js

export const fetchUser = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error en fetchUser:", error);
    throw error;
  }
};
export const fetchUsers = async () => {
  
  const response = await fetch('/api/users'); 
  const data = await response.json();
  return data;
};

export const fetchUserAccounts = async (userId: string) => {
 
  const response = await fetch(`/api/users/${userId}/accounts`); 
  const data = await response.json();
  return data;
};

export const fetchAccounts = async () => {
  const response = await fetch(`${API_URL}/accounts`);
  return response.json();
};

export const fetchAccount = async (accountId: string) => {
  const response = await fetch(`${API_URL}/accounts/${accountId}`);
  return response.json();
};

export const fetchAccountTransactions = async (accountId: string) => {
  const response = await fetch(`${API_URL}/accounts/${accountId}/transactions`);
  return response.json();
};

export const getTransaction = async (transactionId: string) => {
  const response = await fetch(`${API_URL}/transactions/${transactionId}`);
  return response.json();
};

export const createTransaction = async (transactionData: {
  accountId: string;
  amount: number;
  type: string;
}) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionData),
  });
  return response.json();
};
