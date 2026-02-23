import { ChildrenProvider } from "./context/ChildrenContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import Family from "./pages/Family";
import "./App.css";
import ChildTasks from "./pages/ChildTasks";
import ChildRewards from "./pages/ChildRewards";
import { useAuth } from "@clerk/clerk-react";
import ChildDetails from "./pages/ChildDetails";
import LandingPage from "./pages/LandingPage";

function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  return (
    <>
      <ChildrenProvider>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <LandingPage />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <Auth />
              </div>
            }
          />
          <Route
            path="/account"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <Account />
              </div>
            }
          />
          <Route
            path="/family"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <Family />
              </div>
            }
          />
          <Route
            path="/child/:childId/"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <ChildDetails />
              </div>
            }
          />
          <Route
            path="/child/:childId/tasks"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <ChildTasks />
              </div>
            }
          />
          <Route
            path="/child/:childId/rewards"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <ChildRewards />
              </div>
            }
          />
          <Route
            path="/tasks"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <Tasks />
              </div>
            }
          />
          <Route
            path="/rewards"
            element={
              <div className="max-w-screen-xl mx-auto p-4">
                <Rewards />
              </div>
            }
          />
        </Routes>
      </ChildrenProvider>
    </>
  );
}

export default App;
