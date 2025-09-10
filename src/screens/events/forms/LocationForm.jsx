import PropTypes from 'prop-types';
import Label from "../../../components/events/LabelForm";
import Input from "../../../components/events/InputForm";

const LocationForm = ({
  data,
  errors,
  onChange,
  onNumberChange,
  onBlur
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nombre del Lugar */}
      <div>
        <Label htmlFor="ubicacion_name">Nombre del Lugar *</Label>
        <Input
          type="text"
          id="ubicacion_name"
          value={data.ubicacion_name}
          onChange={(e) => onChange("ubicacion_name", e.target.value)}
          onBlur={() => onBlur && onBlur("ubicacion_name")}
          className={`w-full ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          placeholder="Ingresa el nombre del lugar"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Dirección */}
      <div>
        <Label htmlFor="ubicacion_address">Dirección *</Label>
        <Input
          type="text"
          id="ubicacion_address"
          value={data.ubicacion_address}
          onChange={(e) => onChange("ubicacion_address", e.target.value)}
          onBlur={() => onBlur && onBlur("ubicacion_address")}
          className={`w-full ${errors.address ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          placeholder="Ingresa la dirección completa"
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>

      {/* Descripción */}
      <div className="md:col-span-2">
        <Label htmlFor="ubicacion_description">Descripción *</Label>
        <textarea
          id="ubicacion_description"
          value={data.ubicacion_description}
          onChange={(e) => onChange("ubicacion_description", e.target.value)}
          onBlur={() => onBlur && onBlur("ubicacion_description")}
          rows={4}
          placeholder="Describe las características del lugar"
          className={`w-full rounded-lg border px-4 py-2.5 text-sm ${
            errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Precio */}
      <div>
        <Label htmlFor="ubicacion_price">Precio del alquiler ($) *</Label>
        <Input
          type="number"
          id="ubicacion_price"
          value={data.ubicacion_price === null ? '' : data.ubicacion_price}
          onChange={(e) => onNumberChange("ubicacion_price", e.target.value)}
          onBlur={() => onBlur && onBlur("ubicacion_price")}
          min="0"
          step="0.01"
          placeholder="0.00"
          className={`w-full ${errors.price ? 'border-red-500 ring-1 ring-red-500' : ''}`}
        />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>
    </div>
  );
};

LocationForm.propTypes = {
  data: PropTypes.shape({
    ubicacion_name: PropTypes.string,
    ubicacion_description: PropTypes.string,
    ubicacion_price: PropTypes.number,
    ubicacion_address: PropTypes.string
  }).isRequired,
  errors: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onNumberChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func // Optional prop
};

export default LocationForm;
