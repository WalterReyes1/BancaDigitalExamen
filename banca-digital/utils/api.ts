const API_URL = "/api"; // Usa el rewrite de Next.js

// Obtener un usuario por su ID
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

// Obtener todas las cuentas (sin filtrar por usuario)
export const fetchAccounts = async () => {
  try {
    const response = await fetch(`${API_URL}/users/accounts/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error en fetchAccounts:", error);
    throw error;
  }
};

// Obtener detalles de una cuenta específica
export const fetchAccount = async (accountId: string) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${accountId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error en fetchAccount:", error);
    throw error;
  }
};

// Obtener transacciones de una cuenta específica
export const fetchAccountTransactions = async (accountId: string) => {
  try {
    const response = await fetch(`${API_URL}/accounts/${accountId}/transactions/`);
    
    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
    }

    // Verifica si el cuerpo de la respuesta no está vacío
  
    const data = await response.json();
    

    if (!data || !data.items || data.items.length === 0) {
      throw new Error('No se encontraron transacciones para esta cuenta.');
    }
    
    return data;  // Retorna los datos obtenidos
  } catch (error) {
    // Manejo de errores
    console.error("Error en fetchAccountTransactions:", error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    throw new Error(`No se pudieron cargar las transacciones: ${errorMessage}`);
  }
};


// Crear una transacción
export const createTransaction = async (transactionData: {
  accountId: string;
  amount: number;
  type: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error en createTransaction:", error);
    throw error;
  }
};
