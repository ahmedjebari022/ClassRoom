import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import NavigationBar from "./components/common/NavigationBar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import Home from "./components/home/Home";
import useAuthStore from "./stores/authStore";
import Profile from "./components/user/Profile";

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is still authenticated on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <NavigationBar />
      <main className="w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
