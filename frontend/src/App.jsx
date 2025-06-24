import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import EmergencyButton from './components/Emergency/EmergencyButton';
import EmergencyList from './components/Emergency/EmergencyList';
import UserManagement from './components/Admin/UserManagement';
import Header from './components/Layout/Header';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando Urgences...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {user && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/emergency" element={user ? <EmergencyButton /> : <Navigate to="/login" />} />
          <Route path="/emergencies" element={user ? <EmergencyList /> : <Navigate to="/login" />} />
          <Route path="/users" element={user?.tipo_usuario === 'operador' ? <UserManagement /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
