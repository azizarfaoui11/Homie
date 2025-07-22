import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import ChatPage from "./pages/chat";
import UsersListPage from "./pages/UsersListPage";
import UserProfile from "./pages/userprofil";
import Profile from "./pages/Profile";
import CreateEvent from "./pages/CreateEvent";
import EventsList from "./pages/EventList";
import EventPage from "./pages/EventPages";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import Gallery from "./pages/Gallery";
import FollowButton from "./components/FollowButton";
import AllUsers from "./pages/allusers";
import SuggestedUsers from "./pages/SuggestedUsers";

const queryClient = new QueryClient();

// Séparation en composant pour utiliser useLocation()
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-step1" element={<RegisterStep1 />} />
        <Route path="/register-step2" element={<RegisterStep2 />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profil" element={<UserProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/createevent" element={<CreateEvent />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/allusers" element={<AllUsers />} />
        <Route path="/suggested" element={<SuggestedUsers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
