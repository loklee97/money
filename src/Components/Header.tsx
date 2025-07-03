
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import logoImage from '../assets/download.png';
import { recalculateapi, returnLogin } from '../api/RecordAPI.ts'
export default function Header({ }) {
    const { money, user, logout, resetMoney } = useAuth();
    const [showMoney, setShowMoney] = useState(true);
    const navigate = useNavigate();
    const handleRecalculate = async () => {
        const newMoney = await recalculateapi(user!)
        console.log('new money : ', newMoney)
        resetMoney(newMoney)
    }

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white shadow-md">
           <div className="flex items-center gap-2  hover:opacity-80 " onClick={() => navigate('/home')}>
                <img
                    src={logoImage}
                    alt="Logo"
                    className="w-10 h-10 rounded-full p-1 bg-white cursor-pointer"
                />
                <span className="text-lg font-semibold">Money</span>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => handleRecalculate()} className="text-sm cursor-pointer">
                    Recalculate
                </button>
                <button onClick={() => setShowMoney(!showMoney)} className="text-sm cursor-pointer">
                    {showMoney ? "👁️" : "🙈"}
                </button>
                <span className="text-sm">RM: {showMoney ? money : '*'.repeat(money.toString().length)}</span>
                <span className="text-sm">👤 {user}</span>
                <button
                    onClick={logout}
                    className="bg-black-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Logout
                </button>
            </div>
        </header>
    );
}