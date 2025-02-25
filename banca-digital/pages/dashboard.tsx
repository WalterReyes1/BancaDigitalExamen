import { useState, useEffect } from 'react';
import { fetchUser, fetchAccount, fetchAccountTransactions } from '../utils/api';

type Account = {
    alias: string;
    account_number: number;
    balance: number;
    currency: string;
};

type Transaction = {
    transaction_number: string;
    description: string;
    transaction_type: string;
    amount: {
        currency: string;
        value: number;
    };
    transaction_date: string;
};

const AccountCard = ({ account }: { account: Account }) => {
    return (
        <div className="p-4 border border-green-300 rounded-lg mt-4 bg-white shadow-lg w-full max-w-xs transform transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="font-semibold text-xl text-green-700">Cuenta ID: {account.account_number}</h3>
            <p className="text-gray-600">Tipo de cuenta: {account.alias}</p>
            <p className="text-lg font-bold text-green-600 mt-2">Saldo: {account.balance} {account.currency}</p>
        </div>
    );
};

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    return (
        <div className="p-4 border border-green-300 rounded-lg mt-4 bg-white shadow-lg w-full max-w-xs transform transition-all hover:scale-105 hover:shadow-2xl">
            <h3 className="font-semibold text-lg text-green-700">{transaction.transaction_type} - {transaction.description}</h3>
            <p className="text-gray-600">
                {transaction.amount.value} {transaction.amount.currency}
            </p>
            <p className="text-sm text-gray-500">{transaction.transaction_date}</p>
        </div>
    );
};

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const userId = '1'; // Reemplaza con el ID real del usuario

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Obtener la información del usuario
                const userData = await fetchUser(userId);
                setUser(userData);

                // Obtener las IDs de las cuentas del usuario
                const accountsData = userData.products || [];
                const accountIds = accountsData.map((account: any) => account.id);

                // Realizar una llamada a la API para obtener la información de cada cuenta usando las IDs
                const accountDetails = await Promise.all(
                    accountIds.map(async (accountId: string) => {
                        const response = await fetchAccount(accountId); // Llama a tu API con el ID de la cuenta
                        return response;
                    })
                );

                // Actualizar el estado con la información completa de las cuentas
                setAccounts(accountDetails);

                // Obtener las transacciones para cada cuenta
                const allTransactions = await Promise.all(
                    accountDetails.map(async (account: any) => {
                        const response = await fetchAccountTransactions(account.id);
                        return response.items || [];
                    })
                );

                setTransactions(allTransactions.flat());

            } catch (error) {
                console.error('Error al cargar los datos del dashboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) {
        return <div className="text-center text-green-600">Cargando...</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen relative">
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl mx-auto">
                    <h1 className="text-3xl font-semibold text-green-800 text-center">{user.full_name}</h1>
                    <img
                        src={user.profile_photo}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mt-6 mx-auto"
                    />
                    <h2 className="text-xl mt-6 text-green-700 text-center">Mis Cuentas</h2>
                    {accounts.length > 0 ? (
                        <div className="flex justify-center items-center flex-wrap gap-6 mt-4">
                            {accounts.map((account) => (
                                <AccountCard key={account.account_number} account={account} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No hay cuentas disponibles.</p>
                    )}

                    <h2 className="text-xl mt-8 text-green-700 text-center">Transacciones Recientes</h2>
                    {transactions.length > 0 ? (
                        <div className="flex justify-center items-center flex-wrap gap-6 mt-4">
                            {transactions.map((transaction, index) => (
                                <TransactionCard key={index} transaction={transaction} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center">No hay transacciones disponibles.</p>
                    )}
                </div>
            )}

            {/* Botón flotante circular */}
            <button
                onClick={openModal}
                className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-xl hover:bg-green-700 transform transition-all"
            >
                <span className="text-2xl">+</span>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-80">
                        <h2 className="text-2xl font-semibold text-green-700">Nuevo Modal</h2>
                        <p className="text-gray-600 mt-4">Contenido del modal...</p>
                        <button
                            onClick={closeModal}
                            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
