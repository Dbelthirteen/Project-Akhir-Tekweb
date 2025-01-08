// Pada App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ReminderTask from "./components/ReminderTask";
import DailyNote from "./components/DailyNote";
import LoveMessage from "./components/LoveMassage"; // Perbaiki typo jika ada

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Atur halaman awal sesuai keinginan */}
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reminder-task" element={<ReminderTask />} />
        <Route path="/daily-note" element={<DailyNote />} />
        <Route path="/love-message" element={<LoveMessage />} />
      </Routes>
    </Router>
  );
}

export default App;
