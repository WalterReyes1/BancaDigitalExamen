import { useState, useEffect } from 'react';
import { fetchUser, fetchAccount, fetchAccountTransaction } from '../utils/api'; // Asegúrate de importar la función de la transacción API
import TransferForm from '../components/TransferForm';

interface User {
    full_name: string;
    profile_photo: string;
    products?: any[];
}

interface Account {
    id: string;
    account_number: string;
    balance: number;
    currency: string;
    name: string;
    alias: string;
}

interface Transaction {
    transaction_number: string;
    description: string;
    transaction_type: string;
    amount: {
        currency: string;
        value: number;
    };
    transaction_date: string;
}

const transformTransactions = (apiResponse: any) => {
    // Verificamos si apiResponse tiene la propiedad 'items' y si es un array
    const newTransactions = apiResponse.items && Array.isArray(apiResponse.items) 
        ? apiResponse.items 
        : [apiResponse]; // Si no, retornamos apiResponse tal cual, envuelto en un array

    return newTransactions;
};


const LOCAL_STORAGE_KEY = 'transactions';
const ACCOUNTS_STORAGE_KEY = 'accounts';

const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fromAccount, setFromAccount] = useState<Account | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const userId = '1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUser(userId);
                setUser(userData);

                let accountDetails;
                const accountsData = userData.products || [];
                accountDetails = await Promise.all(accountsData.map((account: any) => fetchAccount(account.id)));
                localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accountDetails));
                setAccounts(accountDetails);

                const storedTransactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

                // Traemos la transacción de la API (ahora con accountId y transactionId)
                const apiTransaction = await fetchAccountTransaction();
                console.log('Transacción de la API:', apiTransaction);
                // Combinamos las transacciones de la API con las almacenadas localmente
                const transformedTransactions = transformTransactions(apiTransaction); 
                const allTransactions = [...storedTransactions, ...transformedTransactions];
                setTransactions(allTransactions);
                setFilteredTransactions(allTransactions); // Inicializamos con todas las transacciones
                console.log('Transacciones:', allTransactions);
            } catch (error) {
                console.error('Error al cargar los datos del dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const openModal = (account: Account | null) => {
        setFromAccount(account);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleTransfer = (amount: number, fromAccountId: string, toAccountId: string, description: string) => {
        // Agregamos la nueva transacción
        const newTransaction = {
            transaction_number: Math.random().toString(36).substr(2, 9),
            description: `Transferencia de ${fromAccountId} a ${toAccountId}`,
            transaction_type: 'Transfer',
            amount: { currency: 'NIO', value: amount },
            transaction_date: new Date().toISOString(),
        };

        const updatedTransactions = [...transactions, newTransaction];
        setTransactions(updatedTransactions);
        setFilteredTransactions(updatedTransactions);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTransactions));

        // Actualizamos las cuentas
        const updatedAccounts = accounts.map(account => {
            if (account.account_number === fromAccountId) {
                return { ...account, balance: account.balance - amount };
            } else if (account.account_number === toAccountId) {
                return { ...account, balance: account.balance + amount };
            }
            return account;
        });

        setAccounts(updatedAccounts);
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
        closeModal();
    };

    // Filtrar transacciones por fechas
    const filterTransactionsByDate = () => {
        if (startDate && endDate) {
            const filtered = transactions.filter(transaction => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
            });
            setFilteredTransactions(filtered);
        } else {
            setFilteredTransactions(transactions); // Si no hay fechas, mostramos todas las transacciones
        }
    };

    // Ejecutar el filtrado cada vez que cambian las fechas
    useEffect(() => {
        filterTransactionsByDate();
    }, [startDate, endDate, transactions]);

    if (loading) {
        return <div className="text-center text-green-600">Cargando...</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen relative">
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                    <h1 className="text-3xl font-semibold text-green-800 text-center">{user.full_name}</h1>
                    <img src={user.profile_photo} alt="Profile" className="w-32 h-32 rounded-full mt-6 mx-auto" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <div>
                            <h2 className="text-xl font-semibold text-green-700 mb-4">Mis Cuentas</h2>
                            {accounts.map(account => (
                                <div key={account.account_number} className="p-4 border border-green-300 rounded-lg mt-4 bg-white shadow-lg">
                                    <h3 className="font-semibold text-xl text-green-700">{account.name}</h3>
                                    <p className="text-gray-600">{account.alias}</p>
                                    <p className="text-lg font-bold text-green-600 mt-2">Saldo: {account.balance} {account.currency}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-green-700 mb-4">Transacciones Recientes</h2>

                            {/* Filtro de fechas */}
                            <div className="mb-4">
                                <label htmlFor="startDate" className="block text-sm text-green-700">Desde:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="endDate" className="block text-sm text-green-700">Hasta:</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg w-full"
                                />
                            </div>

                            <div>
                                {filteredTransactions.map((transaction, index) => (
                                    <div key={index} className="p-4 border border-green-300 rounded-lg mt-4 bg-white shadow-lg">
                                        <h3 className="font-semibold text-lg text-green-700">{transaction.description}</h3>
                                        <p className="text-gray-600">
                                            {transaction.amount?.value || 'N/A'} {transaction.amount?.currency || 'N/A'}
                                        </p>

                                        <p className="text-sm text-gray-500">{transaction.transaction_date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <TransferForm
                            accounts={accounts}
                            onTransfer={handleTransfer}
                            fromAccount={fromAccount}
                        />
                        <button onClick={closeModal} className="mt-4 p-2 bg-red-500 text-white rounded-lg w-full">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Botón flotante para abrir el modal */}
            <button
                onClick={() => openModal(null)}
                className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-300"
            >
                <span className="text-2xl">+</span>
            </button>
        </div>
    );
};

export default Dashboard;
