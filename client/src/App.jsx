import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './services/api';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await api.get('/user/me');
        setUser(response.data.user);
        const userData = response.data.user;
        console.log("Fetched user data:", userData);
      }
      catch (error) {
        console.log("No authenticated user", error);
        setUser(null);
      }
      finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [setUser]);


  const login = async (email, password) => {
    const response = await api.post('/user/signin', { email, password });
    // Backend doesn't return user object on login, so we create a placeholder
    const userData = response.data.user || { name: "User", email: email };
    setUser(userData);
    return response.data;
  };

  const signup = async (name, email, password) => {
    const response = await api.post('/user/signup', { username: name, email, password });
    // Backend might crash here, but if fixed, it returns { User: ... }
    const userData = response.data.User || response.data.user || { name, email };
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/user/logout');
    } catch (error) {
      console.error("Logout failed", error);
    }
    setUser(null);
  };

  return (
    <Router>
      {!loading ? <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/signup" element={<Signup signup={signup} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div> : <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-200 font-sans">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
      </div>}
    </Router>
  );
}

export default App;
