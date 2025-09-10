import { useEffect, useRef } from 'react';

const DateTimePicker = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  initialValue, 
  mode = 'date',
  position = 'bottom-right' 
}) => {
  const pickerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Para el selector de fecha
      if (mode === 'date') {
        inputRef.current.type = 'date';
        inputRef.current.value = initialValue || '';
        setTimeout(() => {
          inputRef.current.showPicker();
        }, 100);
      }
      // Para el selector de hora
      else if (mode === 'time') {
        inputRef.current.type = 'time';
        inputRef.current.value = initialValue || '';
        setTimeout(() => {
          inputRef.current.showPicker();
        }, 100);
      }
    }
  }, [isOpen, initialValue, mode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      onSelect(selectedValue);
    }
  };

  if (!isOpen) return null;

  const positionClass = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-full left-0',
    'bottom-right': 'bottom-full right-0'
  }[position] || 'bottom-right';

  return (
    <div 
      ref={pickerRef}
      className={`absolute z-50 bg-white p-4 rounded-lg shadow-lg ${positionClass}`}
    >
      <input
        ref={inputRef}
        onChange={handleChange}
        onBlur={() => onClose()}
        className="opacity-0 absolute"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default DateTimePicker;