import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

/**
 * Layout - Main layout wrapper for authenticated pages
 * Provides sidebar navigation and content area for all protected routes
 * Redirects to login if user is not authenticated
 */
const Layout = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <Sidebar />
      <main className="flex overflow-auto">
        <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 w-400 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
