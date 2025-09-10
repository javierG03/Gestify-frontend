import { forwardRef, useContext } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "../../constants/index";
import { cn } from "../../utils/cn";
import PropTypes from "prop-types";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from "../../config/AuthProvider";

// Filtra los links según el rol
const filterLinksByRole = (links, role) => {
    if (role === 1 || role === 2) return links;
    return links.map(section => ({
        ...section,
        links: section.links.filter(link => link.label !== "Inicio")
    }));
};

export const Sidebar = forwardRef(({ collapsed, onItemClick }, ref) => {
    const { role } = useContext(AuthContext);
    const filteredLinks = filterLinksByRole(navbarLinks, role);

    const handleItemClick = () => {
        // Solo colapsar en dispositivos móviles
        if (window.innerWidth < 768) {
            onItemClick?.();
        }
    };

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)]",
                collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            <div className="flex items-center p-3 gap-x-3">
                {!collapsed && <p className="text-lg font-medium transition-colors text-slate-900">EventosIA</p>}
            </div>
            <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
                {filteredLinks.map((navbarLink) => (
                    <nav
                        key={navbarLink.title}
                        className={cn("sidebar-group", collapsed && "md:items-center")}
                    >
                        <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>{navbarLink.title}</p>
                        {navbarLink.links.map((link) => (
                            <NavLink
                                key={link.label}
                                to={link.path}
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                                onClick={handleItemClick}
                            >
                                <link.icon
                                    size={22}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                            </NavLink>
                        ))}
                    </nav>
                ))}
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
    onItemClick: PropTypes.func,
};