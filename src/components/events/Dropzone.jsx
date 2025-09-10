import { useState, useEffect } from "react";

const Dropzone = ({ onFileSelect, imagePreview, onImageRemove, accept }) => {
  const [file, setFile] = useState(null);

  // Resetear el estado interno cuando la imagen preview cambia (incluido cuando se elimina)
  useEffect(() => {
    if (!imagePreview) {
      setFile(null);
    }
  }, [imagePreview]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
    }
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onImageRemove) {
      onImageRemove();
      // Resetear el input file para permitir seleccionar el mismo archivo nuevamente
      const inputElement = document.getElementById("dropzone-file");
      if (inputElement) {
        inputElement.value = "";
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full relative">
      {/* Botón de eliminar visible solo si hay preview */}
      {imagePreview && (
        <button
          onClick={handleRemoveClick}
          className="absolute top-4 right-4 z-20 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <label
        htmlFor={!imagePreview ? "dropzone-file" : undefined}
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 ${!imagePreview ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-default'}`}
        onClick={(e) => {
          if (imagePreview) {
            e.preventDefault(); // Bloquea el click si hay imagen
          }
        }}
      >
        {imagePreview ? (
          <div className="absolute w-full h-full rounded-lg overflow-hidden z-10">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Oprime aquí para cargar o arrastra</span>
              </p>
              <p className="text-xs text-gray-500">
                SVG, PNG, JPG o GIF (MAX. 800x400px)
              </p>
            </div>
          </>
        )}

        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
        />
      </label>
    </div>
  );
};

export default Dropzone;