import { useState } from "react";
import api from "../services/api";

function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const { data } = await api.post('/auth/register', { email, password });
    sessionStorage.setItem('token', data.token);
    onRegister(data.token);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full opacity-30 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-800 rounded-full opacity-20 -ml-48 -mb-48"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-yellow-300">lem</span>
                <span className="text-yellow-400">🍋</span>
                <span className="text-green-400">n</span>
                <span className="text-green-500">pay</span>
              </h1>
              <p className="text-blue-100 text-sm">Your success is our focus</p>
            </div>
            
            <div className="mt-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join 1000 Businesses
              </h2>
              <p className="text-2xl md:text-3xl font-semibold">
                <span className="text-yellow-300">Powering Growth with</span>
                <br />
                <span>Lemonpay!</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Sign Up System</h2>
            <p className="text-gray-600 mb-8">Your gateway to seamless transactions and easy payments.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shafiq@lemonpay.tech"
                  className="w-full px-4 py-3 bg-indigo-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 bg-indigo-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 bg-indigo-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  onClick={onSwitchToLogin}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Sign In
                </button>
              </div>
              
              <button
                onClick={handleSubmit}
                className="w-full bg-white text-indigo-600 font-semibold py-3 px-4 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;