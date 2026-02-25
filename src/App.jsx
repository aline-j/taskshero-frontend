import { ChildrenProvider } from "./context/ChildrenContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import Family from "./pages/Family";
import "./App.css";
import { useAuth } from "@clerk/clerk-react";
import ChildDetails from "./pages/ChildDetails";
import LandingPage from "./pages/LandingPage";
import Footer from "./components/Footer";

function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) return null;
  return (
    <>
      <ChildrenProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-12">
                <LandingPage />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-12">
                <Auth />
              </div>
            }
          />
          <Route
            path="/account"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-12">
                <Account />
              </div>
            }
          />
          <Route
            path="/family"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-12">
                <Family />
              </div>
            }
          />
          <Route
            path="/child/:childId/"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-14">
                <ChildDetails />
              </div>
            }
          />
          <Route
            path="/tasks"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-12">
                <Tasks />
              </div>
            }
          />
          <Route
            path="/rewards"
            element={
              <div className="max-w-screen-xl mx-auto p-4 mt-12">
                <Rewards />
              </div>
            }
          />
        </Routes>
        <Footer />
      </ChildrenProvider>
    </>
  );
}

export default App;
