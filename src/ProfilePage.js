import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import { useAuth } from './context/AuthContext';
import { useAlbums } from './context/AlbumsContext';
import { getRecipesByUserId } from './api/recipeAPI';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { user, logoutUser } = useAuth();
  const { albums } = useAlbums();
  const [recipeCount, setRecipeCount] = useState(null);
  const [loadingCounts, setLoadingCounts] = useState(true);

  const initials = useMemo(() => {
    if (!user?.username) return '?';
    return user.username.substring(0, 2).toUpperCase();
  }, [user?.username]);

  useEffect(() => {
    const loadCounts = async () => {
      if (!user?.username) {
        setRecipeCount(null);
        setLoadingCounts(false);
        return;
      }
      try {
        const recipes = await getRecipesByUserId(user.username);
        setRecipeCount(Array.isArray(recipes) ? recipes.length : 0);
      } catch (_) {
        setRecipeCount(null);
      } finally {
        setLoadingCounts(false);
      }
    };
    loadCounts();
  }, [user?.username]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      <Header />
      <main className="container mx-auto px-4 py-10">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-green-50 to-transparent" />
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 text-white flex items-center justify-center text-xl font-bold shadow-md">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {user ? `Welcome, ${user.username}` : 'Welcome'}
                </h1>
                <p className="text-gray-600">Manage your recipes, albums, and account</p>
              </div>
            </div>

            <div className="md:ml-auto flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">My recipes</p>
              <p className="text-2xl font-bold text-gray-900">{loadingCounts ? '—' : (recipeCount ?? 0)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">My albums</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(albums) ? albums.length : 0}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Saved items</p>
              <p className="text-2xl font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Link to="/add-recipe" className="group rounded-2xl bg-white p-6 shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create a new recipe</h3>
              <span className="text-green-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <p className="mt-2 text-gray-600">Share your best dishes with the community.</p>
          </Link>

          <Link to="/my-recipes" className="group rounded-2xl bg-white p-6 shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">View my recipes</h3>
              <span className="text-green-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <p className="mt-2 text-gray-600">Edit or manage your uploaded recipes.</p>
          </Link>

          <Link to="/albums" className="group rounded-2xl bg-white p-6 shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Manage my albums</h3>
              <span className="text-green-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <p className="mt-2 text-gray-600">Organize favorites into collections.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;


