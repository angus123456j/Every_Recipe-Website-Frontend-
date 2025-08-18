import React from 'react';
import logo from '../assets/logo.png'; // Using your provided logo import path
import pen from '../assets/pen.png'; 
import heart2 from '../assets/heart2.png';
import profile from '../assets/profile.png'; 
import { useAuth } from '../context/AuthContext';
import { SparklesIcon } from '@heroicons/react/24/solid';

import { Link } from 'react-router-dom';


function Header() {
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      {/* Left side - Logo */}
      <Link to="/">
        <div className="flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105">
          <img src={logo} alt="Every Recipe Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-green-700">Every_Recipe</h1>
        </div>
      </Link>

      {/* Right side - Navigation buttons and Auth section */}
      <div className="flex items-center space-x-4">
        {!user && (
          <Link
            to="/perks"
            className="px-3 py-1.5 rounded-full border border-green-600 text-green-700 hover:bg-green-50 transition-colors duration-200"
          >
            <span className="inline-flex items-center gap-1.5">
              <SparklesIcon className="h-4 w-4 text-yellow-500" />
              <span>User perks</span>
            </span>
          </Link>
        )}
        {user && (
          <>
            <Link to="/my-recipes" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 shadow-sm hover:shadow-md hover:shadow-green-300 transition-shadow duration-200 hover:scale-105" >
              <span className="text-lg"><img src={pen} alt="pen logo" className="h-6" /></span>
              <span className="font-bold">Add my recipe</span>
            </Link>

            <Link to="/saved-recipes" className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 shadow-sm hover:shadow-md hover:shadow-green-300 transition-shadow duration-200 hover:scale-105">
              <span className="text-lg"><img src={heart2} alt="heart logo" className="h-6" /></span>
              <span className='font-bold'>Saved Collection</span>
            </Link>
          </>
        )}

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-4">
              {/* Username Display */}
              <span 
                className="text-green-700 font-semibold max-w-40 truncate"
                title={`Hi, ${user.username}`}
              >
                Hi, {user.username}
              </span>
              
              {/* Profile Button */}
              <Link to="/profile">
                <button className="rounded-full w-10 h-10 bg-green-100 hover:bg-green-200 flex items-center justify-center transition-all duration-200 border border-green-200 shadow-sm hover:shadow-md">
                  <img src={profile} alt="profile logo" className="h-6 w-6" />
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/signin" className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md">
                Sign up / Login
              </Link>
              <Link to="/signin">
                <button className="rounded-full w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-sm hover:shadow-md hover:from-green-200 hover:to-emerald-200 transition-all duration-200 border border-green-200">
                  <img src={profile} alt="profile logo" className="h-6 w-6" />
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;