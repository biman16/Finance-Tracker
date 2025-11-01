import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider, { UserContext } from './context/UserContext';
import axiosInstance from './utils/axiosInstance';
import { API_PATHS } from './utils/apiPaths';

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

const AppContent = () => {
  const { updateUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER);
          updateUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data on app load:", error);
          localStorage.removeItem("token"); // Clear invalid token
        }
      }
    };
    fetchUserData();
  }, [updateUser]);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signUp" exact element={<SignUp />} />
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/income" exact element={<Income />} />
          <Route path="/expense" exact element={<Expense />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />);
};