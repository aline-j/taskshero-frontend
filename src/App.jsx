import { Routes, Route } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route
          path="/profile"
          element={
            <div className="max-w-screen-xl mx-auto p-4">
              <Profile />
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
    </>
  );
}

export default App;
