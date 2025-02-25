import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AccountCard from '../components/AccountCard';
import { fetchUsers, fetchUserAccounts } from '../utils/api'; 
export interface User {
    id: number;
    full_name: string;
}

export interface Account {
    id: string;
    name: string;
    userId: number;
    balance: number;
    accountNumber: string;
}


export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Cargar los usuarios al inicio
  useEffect(() => {
    fetchUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  // Cargar las cuentas del usuario seleccionado
  useEffect(() => {
    if (selectedUser) {
      fetchUserAccounts(selectedUser.id.toString()).then((data) => {
        setAccounts(data);
      });
    }
  }, [selectedUser]);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Lista de usuarios */}
          <div className="border-r-2 pr-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">Usuarios</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedUser(user)}
                >
                  <p className="text-lg font-semibold text-green-700">{user.full_name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cuentas del usuario seleccionado */}
          <div className="pl-6">
            {selectedUser ? (
              <>
                <h2 className="text-xl font-bold text-green-700 mb-4">
                  Cuentas de {selectedUser.full_name}
                </h2>
                <div className="space-y-4">
                  {accounts.length > 0 ? (
                    accounts.map((account) => (
                      <AccountCard
                        key={account.id}
                        account={account}
                        isSelected={false}
                        onSelect={() => {}}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">Este usuario no tiene cuentas.</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500">Selecciona un usuario para ver sus cuentas.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
