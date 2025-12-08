import { Navigate, useLocation } from 'react-router-dom';
const ProtectedRoute = ({ children, user, loading }) => {
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
