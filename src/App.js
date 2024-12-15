import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { CommunicationProvider } from "./context/data";
import AdminModule from "./routes/adminModule";
import UserDashboard from "./routes/userDashboard";
import CalendarView from "./components/notificationCalander";
import CompanyListPage from "./routes/companies";
import "./App.css";

function App() {
  return (
    <CommunicationProvider>
      <Router>
        <div className="app-container">
          <nav className="main-navigation">
            <div className="logo">Engage Calendar</div>
            <ul className="nav-links">
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/admin">Add Company</Link>
              </li>
              <li>
                <Link to="/company">Company List</Link>
              </li>
              <li>
                <Link to="/calendar">Calendar</Link>
              </li>
            </ul>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminModule />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/company" element={<CompanyListPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CommunicationProvider>
  );
}

export default App;
