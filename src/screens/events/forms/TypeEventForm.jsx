import { useEffect, useState } from 'react';
import Label from '../../../components/events/LabelForm';
import Input from '../../../components/events/InputForm';

const TypeEventForm = ({
  localData,
  errors,
  handleChange,
  handleNumberChange,
  handleNumberChange2,
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const modeOptions = [
    { value: 'virtual', label: 'Virtual' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'hibrido', label: 'Híbrido' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error('Error al cargar las categorías');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setErrorCategories(error.message);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [API_URL]);

  return (
    <div className="flex flex-col space-y-6 mx-auto w-full max-w-2xl">
      {/* Modalidad */}
      <div className="w-full flex justify-center">
        <div className="w-3/4">
          <Label htmlFor="tipo_mode">Modalidad *</Label>
          <select
            id="tipo_mode"
            value={localData.tipo_mode}
            onChange={(e) => handleChange('tipo_mode', e.target.value)}
            className={`w-full h-11 border px-4 py-2.5 text-sm rounded-lg ${errors.mode ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Seleccione una modalidad</option>
            {modeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.mode && <p className="text-red-500 text-xs mt-1">{errors.mode}</p>}
        </div>
      </div>

      {/* Enlace de Videoconferencia */}
      {['virtual', 'hibrido'].includes(localData.tipo_mode) && (
        <div className="w-full flex justify-center">
          <div className="w-3/4">
            <Label htmlFor="tipo_videoLink">Enlace de Videoconferencia *</Label>
            <Input
              type="url"
              id="tipo_videoLink"
              value={localData.tipo_videoLink}
              onChange={(e) => handleChange('tipo_videoLink', e.target.value)}
              placeholder="https://..."
              className={`w-full ${errors.video_Conference_Link ? 'border-red-500' : ''}`}
            />
            {errors.video_Conference_Link && (
              <p className="text-red-500 text-xs mt-1">{errors.video_Conference_Link}</p>
            )}
          </div>
        </div>
      )}

      {/* Fecha y Hora de Inicio */}
      <div className="w-full flex justify-center">
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="tipo_startDate">Fecha de Inicio *</Label>
            <Input
              type="date"
              id="tipo_startDate"
              value={localData.tipo_startDate}
              onChange={(e) => handleChange('tipo_startDate', e.target.value)}
              className={`w-full ${errors.start_date ? 'border-red-500' : ''}`}
            />
            {errors.start_date && (
              <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
            )}
          </div>
          <div>
            <Label htmlFor="tipo_startTime">Hora de Inicio *</Label>
            <Input
              type="time"
              id="tipo_startTime"
              value={localData.tipo_startTime}
              onChange={(e) => handleChange('tipo_startTime', e.target.value)}
              className={`w-full ${errors.start_time ? 'border-red-500' : ''}`}
            />
            {errors.start_time && (
              <p className="text-red-500 text-xs mt-1">{errors.start_time}</p>
            )}
          </div>
        </div>
      </div>

      {/* Fecha y Hora de Fin */}
      <div className="w-full flex justify-center">
        <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="tipo_endDate">Fecha de Finalización *</Label>
            <Input
              type="date"
              id="tipo_endDate"
              value={localData.tipo_endDate}
              onChange={(e) => handleChange('tipo_endDate', e.target.value)}
              className={`w-full ${errors.end_date ? 'border-red-500' : ''}`}
            />
            {errors.end_date && (
              <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
            )}
          </div>
          <div>
            <Label htmlFor="tipo_endTime">Hora de Finalización *</Label>
            <Input
              type="time"
              id="tipo_endTime"
              value={localData.tipo_endTime}
              onChange={(e) => handleChange('tipo_endTime', e.target.value)}
              className={`w-full ${errors.end_time ? 'border-red-500' : ''}`}
            />
            {errors.end_time && (
              <p className="text-red-500 text-xs mt-1">{errors.end_time}</p>
            )}
          </div>
        </div>
      </div>

      {/* Máximo de Participantes */}
      <div className="w-full flex justify-center">
        <div className="w-3/4">
          <Label htmlFor="tipo_maxParticipants">Numero Máximo de Participantes *</Label>
          <Input
            type="number"
            id="tipo_maxParticipants"
            value={localData.tipo_maxParticipants || ''}
            onChange={(e) => handleNumberChange('tipo_maxParticipants', e.target.value)}
            maxLength="3"
            className={`w-full ${errors.max_Participants ? 'border-red-500' : ''}`}
          />
          {errors.max_Participants && (
            <p className="text-red-500 text-xs mt-1">{errors.max_Participants}</p>
          )}
        </div>
      </div>

      {/* Precio */}
      <div className="w-full flex justify-center">
        <div className="w-3/4">
          <Label htmlFor="tipo_price">Precio del evento *(No incluye: recursos, alimentación, etc...)</Label>
          <Input
            type="number"
            id="tipo_price"
            value={localData.tipo_price || ''}
            onChange={(e) => handleNumberChange('tipo_price', e.target.value)}
            min="0"
            step="0.01"
            className={`w-full ${errors.price ? 'border-red-500' : ''}`}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypeEventForm;