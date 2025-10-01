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
      <div>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
