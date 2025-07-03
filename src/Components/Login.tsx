import React, { useState } from 'react';
import { login, loginapi } from '../api/RecordAPI';
import { useAuth } from './AuthContext';
import { useNavigate } from "react-router-dom";
import LoadingPage from './Loading';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userName || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const logindata: login = {
      userName: userName,
      password: password
    }
    try {
      setIsLoading(true)
      const res = await loginapi(logindata);
      console.log('money :', res.money)
      console.log('user :', res.userName)
      login(res.userName, res.money)
      if (res) {
        setIsLoading(false)
        navigate(`/home`);
        alert(`Logging in with ${userName}`);
      }

    } catch (error) {
      setIsLoading(false)
      console.error("Failed login client", error);
      alert("Failed login ");
    } finally {
      setIsLoading(false); // Stop loading once API call is done
    }

  }
  if (isLoading) return <LoadingPage />

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          {error && (
            <div className="mb-4 text-red-600 text-center font-medium">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userName" className="block mb-1 font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="User Name"

              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                autoComplete="current-password"
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-600 text-black font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>

  );
};

export default Login;
