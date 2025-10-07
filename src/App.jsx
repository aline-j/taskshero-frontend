import { Routes, Route } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Tasks from "./pages/Tasks";
import Rewards from "./pages/Rewards";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
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
