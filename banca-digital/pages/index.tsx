import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../context/AppContext";
import { fetchUser } from "../utils/api";
import { motion } from "framer-motion";

export default function Home() {
  const { dispatch } = useAppContext();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = "1"; // Usuario predefinido
    fetchUser(userId)
      .then((data) => {
        dispatch({ type: "SET_USER", payload: data });
      })
      .catch((err) => {
        console.error("Error al obtener el usuario:", err);
        setError("Error al cargar la información del usuario.");
      });
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-700 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }} 
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-green-700">Bienvenido</h1>
        <p className="text-gray-500 mt-2">Accede con el usuario predefinido</p>

        {error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-left text-gray-700 font-medium">Usuario</label>
              <input
                type="text"
                value="usuario@banco.com"
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-left text-gray-700 font-medium">Contraseña</label>
              <input
                type="password"
                value="••••••••"
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700 focus:ring-2 focus:ring-green-500"
                disabled
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/dashboard")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md transition-all"
            >
              Entrar al Panel
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
