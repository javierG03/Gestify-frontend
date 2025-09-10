import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiAlertCircle, FiCoffee } from "react-icons/fi";
import foodService from "./services/FoodServices"; // Usa tu servicio de alimentos
import CardList from "../../../components/events/CardList";
import Swal from "sweetalert2"; // Para mostrar alertas de confirmación y errores
import { useCallback } from "react";

const FoodList = () => {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [foods, setFoods] = useState([]);  // Lista de alimentos
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Función para cargar los alimentos desde el servidor
  const loadFoods = async () => {
    if (!eventId) {
      setError("No se pudo identificar el evento. Por favor, regresa e intenta de nuevo.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const foodData = await foodService.getEventFoods(eventId);
      setFoods(foodData.data);
      setError(null); // No hay errores
    } catch (err) {
      setError("No se pudieron cargar los alimentos. Por favor, intenta de nuevo.");
      console.error("Error loading foods:", err);
    } finally {
      setLoading(false); // Fin de la carga
    }
  };

  useEffect(() => {
    loadFoods();
  }, [eventId]);

  // Recargar los alimentos cada vez que la pantalla se enfoque
  const handleAddFood = () => {
    navigate(`/dashboard/events/detail-events/${eventId}/add-food`);
  };

  const handleEditFood = (foodId) => {
    navigate(`/dashboard/events/detail-events/${eventId}/edit-food/${foodId}`);
  };

  const handleDeleteFood = async (foodId) => {
    Swal.fire({
      title: "¿Estás seguro de que deseas eliminar este alimento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await foodService.deleteFood(foodId);
          loadFoods();
          Swal.fire("Eliminado", "El alimento ha sido eliminado.", "success");
        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar el alimento.", "error");
        }
      }
    });
  };

  const renderFoodItem = (item) => {
    const foodId = item.id_food || item.id; // Asegurarse de que el ID se pase correctamente
    return (
      <CardList
        key={foodId}
        item={{
          name: item.name,
          quantity: `${item.quantity_available || item.quantity || 0} ${item.unit || ''}`,
          price: item.price,
          totalCost: (item.quantity_available || item.quantity || 0) * (item.price || 0),
          description: item.description || "Sin notas adicionales",
        }}
        onEdit={() => handleEditFood(foodId)}
        onDelete={() => handleDeleteFood(foodId)}
      />
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(`/dashboard/events/detail-events/${eventId}`)} className="text-gray-600 hover:text-indigo-600 flex items-center">
            <FiArrowLeft className="mr-2" /> Volver
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Alimentos del Evento</h1>
          <button
            onClick={handleAddFood}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FiPlus className="mr-2" /> Agregar Alimento
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <span className="animate-spin text-4xl">⏳</span>
            <p className="mt-4">Cargando alimentos...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mt-10">
            <FiAlertCircle size={40} className="mx-auto mb-4" />
            <p>{error}</p>
            <button
              onClick={loadFoods}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Reintentar
            </button>
          </div>
        ) : foods.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-20">
            <FiCoffee size={60} />
            <p className="text-lg font-semibold mt-4">No hay alimentos agregados</p>
            <p className="text-sm mt-2">Agrega alimentos para tu evento</p>
          </div>
        ) : (
          <div className="space-y-4">
            {foods.map(renderFoodItem)}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodList;