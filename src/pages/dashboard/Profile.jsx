import { useContext } from "react";
import { AuthContext } from "../../config/AuthProvider";
import { FaUser } from "react-icons/fa"; // Importa el icono


export default function Profile() {
      const { name, email, last_name } = useContext(AuthContext)

    return (
        <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-md">
                <FaUser className="text-white text-4xl" /> 
            </div>
            <h1 className="text-3xl font-extrabold mb-2 text-gray-800">Mi Perfil</h1>
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-semibold text-gray-600">Nombre</span>
                    <span className="text-gray-900">{name || ""}</span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-semibold text-gray-600">Correo</span>
                    <span className="text-gray-900">{email || "Sin correo"}</span>
                </div>
            </div>
        </div>
    );
}