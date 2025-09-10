import { HiOutlineTrash } from "react-icons/hi";

const ParticipantsTable = ({ participants = [], onRemoveParticipant }) => {
    // Función para mapear los estados
    const getStatusInfo = (statusId) => {
        switch(statusId) {
            case 1: 
                return { text: 'Planeado', color: 'bg-blue-100 text-blue-800' };
            case 2: 
                return { text: 'En curso', color: 'bg-yellow-100 text-yellow-800' };
            case 3: 
                return { text: 'Finalizado', color: 'bg-green-100 text-green-800' };
            case 4: 
                return { text: 'Cancelado', color: 'bg-red-100 text-red-800' };
            default:
                return { text: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
        }
    };

    // Verificación adicional para asegurar que participants sea un array
    const safeParticipants = Array.isArray(participants) ? participants : [];

    return (
        <div className="space-y-4">
            {safeParticipants.length > 0 ? (
                <>
                    {/* Encabezados */}
                    <div className="grid grid-cols-12 gap-4 pb-2 border-b border-gray-200">
                        <div className="col-span-7 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Correo electrónico
                        </div>
                        <div className="col-span-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                        </div>
                        <div className="col-span-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Acción
                        </div>
                    </div>
                    
                    {/* Items de participantes */}
                    {safeParticipants.map((participant, index) => {
                        const status = getStatusInfo(participant?.participant_status_id);
                        return (
                            <div 
                                key={index} 
                                className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="col-span-7">
                                    <p className="text-sm font-medium text-gray-900">
                                        {participant?.participant_email || 'Correo no disponible'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Evento ID: {participant?.event_id || 'N/A'}
                                    </p>
                                </div>
                                <div className="col-span-3">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${status?.color || 'bg-gray-100 text-gray-800'}`}>
                                        {status?.text || 'Desconocido'}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    <button
                                        onClick={() => onRemoveParticipant?.(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Eliminar participante"
                                    >
                                        <HiOutlineTrash className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
                    <p className="text-gray-500">No hay participantes registrados</p>
                </div>
            )}
        </div>
    );
};

export default ParticipantsTable;