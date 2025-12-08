import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Profile({ user }) {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.put('/user/password', { oldPassword, newPassword });
            setMessage(response.data.message);
            setOldPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password');
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await api.delete('/user/me');
                window.location.href = '/'; // Force reload/redirect to clear state effectively
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete account');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-indigo-400">User Profile</h1>

            <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-lg shadow-lg border border-slate-800">
                <div className="mb-6">
                    <label className="block text-slate-400 text-sm font-bold mb-2">Username</label>
                    <p className="text-xl text-white">{user?.username || user?.name || 'User'}</p>
                </div>
                <div className="mb-8">
                    <label className="block text-slate-400 text-sm font-bold mb-2">Email</label>
                    <p className="text-xl text-white">{user?.email}</p>
                </div>

                <hr className="border-slate-700 my-6" />

                <h2 className="text-xl font-semibold mb-4 text-indigo-300">Change Password</h2>
                {message && <div className="bg-green-500/10 text-green-400 p-3 rounded mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-500/10 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleUpdatePassword}>
                    <div className="mb-4">
                        <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="oldPassword">
                            Old Password
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-400 text-sm font-bold mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-indigo-500"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Update Password
                    </button>
                </form>

                <hr className="border-slate-700 my-8" />

                <h2 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h2>
                <button
                    onClick={handleDeleteAccount}
                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-500 border border-red-600/50 font-bold py-2 px-4 rounded transition duration-200"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}

export default Profile;
