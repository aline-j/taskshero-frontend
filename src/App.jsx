import { Routes, Route } from "react-router-dom";
import { Navbar } from "./shared/Navbar/Navbar";
import Auth from "./pages/Auth/Auth";
import { Profile } from "./pages/Profile/Profile";
import { Tasks } from "./pages/Tasks/Tasks";
import { Rewards } from "./pages/Rewards/Rewards";
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
