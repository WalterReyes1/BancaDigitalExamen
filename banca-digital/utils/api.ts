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
    const response = await fetch(`${API_URL}/accounts`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json(); // Esto debería retornar un array de objetos de cuentas
  } catch (error) {
    console.error("Error en fetchAccounts:", error);
    throw error;
  }
};


// Obtener detalles de una cuenta específica
export const fetchAccount = async (accountId: string) => {
  try {
      console.log("Fetching account details for account ID inside fetchAccount:", accountId); // Verifica el ID
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


export const transferFunds = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description: string,
  currency: string
) => {
  try {
    // Obtener las cuentas involucradas
    const fromAccountResponse = await fetch(`${API_URL}/accounts/${fromAccountId}`);
    const fromAccount = await fromAccountResponse.json();

    const toAccountResponse = await fetch(`${API_URL}/accounts/${toAccountId}`);
    const toAccount = await toAccountResponse.json();

    if (!fromAccount || !toAccount) {
      throw new Error('Una de las cuentas no es válida');
    }

    // Validar si hay suficiente saldo en la cuenta de origen
    if (fromAccount.balance < amount) {
      throw new Error('Saldo insuficiente');
    }

    // Crear la transacción
    const transaction = {
      origin: fromAccountId,
      destination: toAccountId,
      amount: {
        currency: currency,
        value: amount,
      },
      description: description,
      transaction_date: new Date().toISOString(),
    };

    // Registrar la transacción en el backend
    const transactionResponse = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });

    if (!transactionResponse.ok) {
      throw new Error('Error al registrar la transacción');
    }

    const transactionData = await transactionResponse.json();

    // Actualizar los balances de las cuentas
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    // Devolver el mensaje y los detalles de la transacción
    return { message: 'Transferencia realizada con éxito', transactionData };
  } catch (error) {
    console.error('Error en la transferencia:', error);
    throw new Error('Hubo un problema con la transferencia');
  }
};

// Obtener transacciones de una cuenta específica
interface Transaction {
  items: any[];
}

export const fetchAccountTransaction = async () => {
  try {
    // Hacemos la solicitud para obtener una transacción específica de una cuenta
    const response = await fetch(`${API_URL}/accounts/1/transactions`);

    // Verificar si la respuesta es correcta
    if (!response.ok) {
      throw new Error(`Error al obtener la transacción con ID`);
    }

    const transaction = await response.json();

    return transaction; // Retornamos la transacción obtenida
  } catch (error) {
    console.error("Error al obtener la transacción:", error);
    throw new Error("No se pudo obtener la transacción.");
  }
};




  


