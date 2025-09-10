import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react"; // Asegúrate de importar useState

const Tabs = ({ sections, currentPath, completed: propCompleted }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado de completado basado en sessionStorage (renombrado a tabsCompleted)
  const [tabsCompleted, setTabsCompleted] = useState(() => {
    const saved = {};
    sections.forEach(section => {
      saved[section.id] = !!sessionStorage.getItem(`tab_${section.id}_completed`);
    });
    return saved;
  });

  const currentIndex = sections.findIndex(section => 
    location.pathname.includes(section.path)
  );

  const handleTabClick = (path, sectionId) => {
    const targetIndex = sections.findIndex(s => s.path === path);
    
    // Permite navegar si:
    // 1. Es una sección anterior
    // 2. Está completada
    // 3. Es la sección actual
    if (targetIndex <= currentIndex || tabsCompleted[sectionId]) {
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
                      tabsCompleted[section.id] 
                        ? 'border-blue-500 blue-100 text-blue-500'
                        : ''
                    }`}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Nombre de la sección */}
                  <span className={`mt-2 text-lg ${
                    currentIndex === index ? 'font-bold text-blue-600' : 'text-gray-600'
                  }`}>
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

      {/* Barra de progreso para móviles sin nombres */}
      <div className="relative mb-4 md:hidden">
        <div className="flex items-center justify-between">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center z-10">
              {/* Indicador circular */}
              <div 
                onClick={() => handleTabClick(section.path, section.id)}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 cursor-pointer transition-colors ${
                  currentIndex >= index
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 bg-white'
                } ${
                  tabsCompleted[section.id] 
                    ? 'border-blue-500 blue-100 text-blue-500'
                    : ''
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
        
        {/* Línea de progreso */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{
              width: `${(currentIndex / (sections.length - 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Versión móvil (select) */}
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
              disabled={!tabsCompleted[section.id] && sections.findIndex(s => s.path === section.path) > currentIndex}
            >
              {section.name} {tabsCompleted[section.id] && '✓'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Tabs;