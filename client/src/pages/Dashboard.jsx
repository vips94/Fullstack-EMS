import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import EmployeeDashboard from "../components/EmployeeDashboard";
import AdminDashboard from "../components/Admin-dashboard";
import api from "../api/axios";
import toast from "react-hot-toast";

/**
 * Dashboard - Main dashboard page that displays role-specific content
 * Shows admin dashboard for admins and employee dashboard for employees
 */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches dashboard data on component mount
   * Shows appropriate dashboard based on user role
   */
  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch((error) =>
        toast.error(error.response?.data?.error || error?.message),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data)
    return (
      <p className="text-center text-slate-500 py-12">
        Failed to load dashboard
      </p>
    );

  if (data.role === "ADMIN") {
    return <AdminDashboard data={data} />;
  } else {
    return <EmployeeDashboard data={data} />;
  }
};

export default Dashboard;
