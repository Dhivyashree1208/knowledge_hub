import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; // Profile page for user
import HomePage from "./pages/HomePage"; // Home page
import AddDoc from "./pages/AddDoc";
import EditDoc from "./pages/EditDoc";
import Versions from "./pages/Versions";
import Search from "./pages/Search";
import QA from "./pages/QA";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* Profile Route */}
        <Route path="/add" element={<AddDoc />} />
        <Route path="/edit/:id" element={<EditDoc />} />
        <Route path="/doc/:id/versions" element={<Versions />} />
        <Route path="/search" element={<Search />} />
        <Route path="/qa" element={<QA />} />
      </Routes>
    </Router>
  );
}

export default App;
