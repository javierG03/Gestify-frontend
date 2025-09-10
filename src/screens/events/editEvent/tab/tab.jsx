import { useLocation, useNavigate } from "react-router-dom";

const Tabs = ({ sections, currentPath, completedSections }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = sections.findIndex(section =>
    location.pathname.includes(section.path)
  );

  const handleTabClick = (path, sectionId) => {
    const targetIndex = sections.findIndex(s => s.path === path);

    // Permitir navegación si:
    // - Es una sección anterior
    // - Está completada
    // - Es la sección actual
    if (
      targetIndex <= currentIndex ||
      completedSections[sectionId] ||
      sectionId === sections[currentIndex]?.id
    ) {
      navigate(path);
    }
  };

  return (
    <div className="w-full">
      {/* Barra de progreso para pantallas grandes */}
      <div className="relative mb-4 hidden md:block">
        <div className="flex items-center justify-center">
          <div className="flex-1 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              {sections.map((section, index) => (
                <div key={section.id} className="flex flex-col items-center z-10">
                  {/* Indicador circular */}
                  <div
                    onClick={() => handleTabClick(section.path, section.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-colors ${
                      currentIndex >= index
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-300 bg-white'
                    } ${
                      completedSections[section.id]
                        ? 'border-blue-500 bg-blue-100 text-blue-500'
                        : ''
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Nombre de la sección */}
                  <span
                    className={`mt-2 text-lg ${
                      currentIndex === index
                        ? 'font-bold text-blue-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {section.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Línea de progreso */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-full max-w-xl mx-auto h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${(currentIndex / (sections.length - 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Versión móvil sin nombres */}
      <div className="relative mb-4 md:hidden">
        <div className="flex items-center justify-between">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center z-10">
              <div
                onClick={() => handleTabClick(section.path, section.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors ${
                  currentIndex >= index
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 bg-white'
                } ${
                  completedSections[section.id]
                    ? 'border-blue-500 bg-blue-100 text-blue-500'
                    : ''
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${(currentIndex / (sections.length - 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Select móvil */}
      <div className="md:hidden mt-4">
        <select
          value={currentPath}
          onChange={(e) => {
            const section = sections.find(s => s.path === e.target.value);
            if (section) handleTabClick(section.path, section.id);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {sections.map((section) => (
            <option
              key={section.id}
              value={section.path}
              disabled={
                !completedSections[section.id] &&
                sections.findIndex(s => s.path === section.path) > currentIndex
              }
            >
              {section.name} {completedSections[section.id] && '✓'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Tabs;