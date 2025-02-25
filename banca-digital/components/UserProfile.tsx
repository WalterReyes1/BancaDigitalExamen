import { useEffect, useState } from 'react';
import { fetchUser } from '../utils/api';

interface User {
  id: string;
  full_name: string;
  email: string;
  profile_photo: string;
}

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return user ? (
    <div className="p-6 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700">Perfil de Usuario</h2>
      <img src={user.profile_photo} alt={user.full_name} className="w-16 h-16 rounded-full mt-4" />
      <p className="text-gray-600 mt-2">
        Nombre: <span className="font-semibold">{user.full_name}</span>
      </p>
      <p className="text-gray-600">
        Email: <span className="font-semibold">{user.email}</span>
      </p>
    </div>
  ) : (
    <p>Cargando...</p>
  );
}