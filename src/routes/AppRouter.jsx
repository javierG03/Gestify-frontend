import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "../config/AuthProvider";
import PrivateRoute from "../config/PrivateRoute";

import Layout from "./layout";

  //Paginas
  import Login from "../pages/auth/Login";
  import Homepage from "../pages/Homepage";
  import VerifyAccount from "../pages/auth/VerifyAccount"
  //import VerificationSuccess from "../pages/auth/VerificationSuccess"
  //import VerificationRedirect from "../pages/auth/VerificationRedirect"
  import Register from "../pages/auth/Register";
  import ResetPassword from "../pages/forgotpassword/ResetPassword";
  import ResetPasswordForm from "../pages/forgotpassword/ResetPasswordForm";
  //import ParticipantsEvent from "../components/screens/events/eventscreate/form/ParticipantsEvent";
  //import FeedingEvent from "../components/screens/events/eventscreate/form/FeedingEvent";
  import Profile from "../pages/dashboard/Profile";
  

  // Componentes de creación de eventos
  import CardsView from "../screens/events/CardsView";
  import Event from "../screens/events/createEvent/tabs/Event";
  import TypeEvent from "../screens/events/createEvent/tabs/TypeEvent";
  import LocationEvent from "../screens/events/createEvent/tabs/LocationEvent";
  import CreateEvent from "../screens/events/createEvent/CreateEvent";

  // Componentes de edición de eventos
  import EditEvent from "../screens/events/editEvent/EditEvent";
  import EditEventTab from "../screens/events/editEvent/tab/event";
  import EditTypeEventTab from "../screens/events/editEvent/tab/TypeEvent";
  import EditLocationEventTab from "../screens/events/editEvent/tab/LocationEvent";

  // Componentes de tabs de eventos

  //participantes
  import ParticipantList from "../pages/events/participants/ParticipantList";
  import InviteParticipant from "../pages/events/participants/InviteParticipant";
  import ParticipantStatus from "../pages/events/participants/ParticipantStatus";
  import InvitationResponse from "../pages/events/participants/InvitationResponse";

  //Recursos
  import AddResource from "../pages/events/resources/AddResource";
  import ResourceList from "../pages/events/resources/ResourceList";
  import EditResource from "../pages/events/resources/EditResource";

  //Alimentos
  import AddFood from "../pages/events/foods/AddFood";
  import FoodList from "../pages/events/foods/FoodList";
  import EditFood from "../pages/events/foods/EditFood";

  //Paginas Dashboard
  import HomeDashboard from "../pages/dashboard/home";
  import Reports from "../pages/dashboard/Reports";
  import NotificationsPage from "../pages/notifications/NotificationsPage";
  import EventDetail from "../pages/events/EventDetail";
  import EventBilling from "../pages/billing/EventBilling";
  import PaymentView from "../pages/billing/PaymentView";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/verify-email/:token",
      element: <VerifyAccount />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "/reset-password-form",
      element: <ResetPasswordForm />,
    },
    {
      path: "/notifications",
      element: <PrivateRoute element={<NotificationsPage />} />,
    },

    {
      path: "/invitacion/:action/:token",
      element: <InvitationResponse />
    },
    {
      path: "/invitacion/:token",
      element: <InvitationResponse />
    },

    
    {
      path: "/dashboard",
      element: <PrivateRoute element={<Layout />} />,
      children: [
        {
          index: true,
          element: <Navigate to="inicio" replace />,
        },
        {
          path: "inicio",
          element: <HomeDashboard />,
        },
        {
          path: "events",
          element: <CardsView />,
        },
         {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "reports",
          element: <PrivateRoute element={<Reports />} />,
        },
        {
          path: "help",
          element: <h1 className="title">Ayuda</h1>,
        },      
        {
          path: "events/create-event",
          element: <PrivateRoute element={<CreateEvent />} />,
          children: [
            { index: true, element: <Navigate to="evento" replace /> },
            { path: "evento", element: <Event /> },
            { path: "tipoEvento", element: <TypeEvent /> },
            { path: "ubicacion", element: <LocationEvent /> },
          ],
        },
        // Nueva sección para la edición de eventos
        {
          path: "events/edit-event",
          element: <PrivateRoute element={<EditEvent />} />,
          children: [
            { index: true, element: <Navigate to="editarEvento" replace /> },
            { path: "editarEvento", element: <EditEventTab /> },
            { path: "editarTipoEvento", element: <EditTypeEventTab /> },
            { path: "editarUbicacion", element: <EditLocationEventTab /> },
          ],
        },

        {
          path: "events/detail-events/:id",
          element: <PrivateRoute element={<EventDetail />} />,
        },

        //Rutas para tab participantes

        {
          path: "events/participants/:id",  // Ruta para la lista de participantes
          element: <PrivateRoute element={<ParticipantList />} />,
        },

        {
          path: "events/:id/participants/:participantId",
          element: <PrivateRoute element={<ParticipantStatus />} />
        },
        
        {
          path: "events/invite/:id",
          element: <PrivateRoute element={<InviteParticipant />} />,
        },

        //Rutas para tab de recursos

        {
          path: "events/detail-events/:id/add-resource",
          element: <PrivateRoute element={<AddResource />} />,
        },

        {
          path: "events/detail-events/:id/resource-list",
          element: <PrivateRoute element={<ResourceList />} />,
        },

        {
          path: "events/detail-events/:id/edit-resource/:idResource",
          element: <PrivateRoute element={<EditResource />} />,
        },

        //Rutas para tab de alimentos
        {
          path: "events/detail-events/:id/add-food",
          element: <PrivateRoute element={<AddFood />} />,
        },

        {
          path: "events/detail-events/:id/food-list",
          element: <PrivateRoute element={<FoodList />} />,
        },

        {
          path: "events/detail-events/:id/edit-food/:idFood",
          element: <PrivateRoute element={<EditFood />} />,
        },

        {
          
          path: "events/billing-event/:id",
          element: <PrivateRoute element={<EventBilling />} />,

        },

        {
          
          path: "events/billing-event/:id/payment-view",
          element: <PrivateRoute element={<PaymentView />} />,

        },
      ],
    },
  ]);

  function AppRouter() {
    return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    );
  }
  
  export default AppRouter;