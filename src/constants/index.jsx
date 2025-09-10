import { Home, Calendar, ClipboardList, HelpCircle, User } from "lucide-react";

export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Inicio",
                icon: Home,
                path: "inicio",
            },
            {
                label: "Mis Eventos",
                icon: Calendar,
                path: "events",
            },
            {
                label: "Perfil",
                icon: User,
                path: "profile",
            },
        ],
    }
];