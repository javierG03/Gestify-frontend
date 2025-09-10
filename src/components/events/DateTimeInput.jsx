import { Fragment } from 'react';
import Label from './LabelForm';

const DateTimeInput = ({ 
  dateId, 
  timeId,
  label,
  dateValue,
  timeValue,
  onDateClick,
  onTimeClick, 
  dateError,
  timeError
}) => {
  return (
    <div className="col-span-1">
      <Label htmlFor={dateId}>{label}</Label>
      <div className="flex space-x-2">
        {/* Selector de fecha */}
        <div className="flex-1">
          <div
            className={`w-full h-11 rounded-lg border px-4 py-2.5 text-sm cursor-pointer flex items-center ${
              dateError ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={onDateClick}
          >
            {dateValue ? new Date(dateValue).toLocaleDateString() : "Seleccionar fecha"}
          </div>
          {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
        </div>

        {/* Selector de hora */}
        <div className="flex-1">
          <div
            className={`w-full h-11 rounded-lg border px-4 py-2.5 text-sm cursor-pointer flex items-center ${
              timeError ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            onClick={onTimeClick}
          >
            {timeValue 
              ? timeValue 
              : "Seleccionar hora"}
          </div>
          {timeError && <p className="text-red-500 text-xs mt-1">{timeError}</p>}
        </div>
      </div>
    </div>
  );
};

export default DateTimeInput;