import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FacilityBooking from "./pages/FacilityBooking";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import ManageResidents from "./pages/admin/ManageResidents";
import ViewComplaints from "./pages/admin/ViewComplaints";
import ApproveBookings from "./pages/admin/ApproveBookings";
import ManagePayments from "./pages/admin/ManagePayments";
import Notices from "./pages/admin/Notices";
import Home from "./pages/Home";
import VisitorLogs from "./pages/security/VisitorLogs";
import Header from "./components/Header";
import Bottom from "./components/Bottom";
import "tailwindcss/tailwind.css";
import { Flowbite } from "flowbite-react";


function App() {
  return (
    <Flowbite>
    <Router>
      <Header />
      <div className="container mx-auto p-4">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/facility-booking" element={<FacilityBooking />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/admin/manage-residents" element={<ManageResidents />} />
            <Route path="/admin/view-complaints" element={<ViewComplaints />} />
            <Route path="/admin/approve-bookings" element={<ApproveBookings />} />
            <Route path="/admin/manage-payments" element={<ManagePayments />} />
            <Route path="/admin/notices" element={<Notices />} />
            <Route path="/security/visitor-logs" element={<VisitorLogs />} />
          </Routes>
          </div>
      <Bottom />
    </Router>
    </Flowbite>

  );
}

export default App;
