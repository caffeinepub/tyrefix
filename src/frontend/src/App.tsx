import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CustomerDashboard from "./pages/CustomerDashboard";
import DealerDashboard from "./pages/DealerDashboard";
import LandingPage from "./pages/LandingPage";
import RequestTracker from "./pages/RequestTracker";

export type View = "landing" | "customer" | "dealer" | "tracker";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");

  const navigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header currentView={currentView} onNavigate={navigate} />
      <div className="flex-1">
        {currentView === "landing" && <LandingPage onNavigate={navigate} />}
        {currentView === "customer" && (
          <CustomerDashboard onNavigate={navigate} />
        )}
        {currentView === "dealer" && <DealerDashboard />}
        {currentView === "tracker" && <RequestTracker />}
      </div>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  );
}
