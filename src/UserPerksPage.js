import React from 'react';
import Header from './components/Header';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  PencilIcon,
  FolderIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const perks = [
  {
    title: 'Save recipes to albums',
    desc: 'Create custom albums (e.g., Breakfast, Party, Mexican) and save recipes with one click.',
    icon: FolderIcon,
  },
  {
    title: 'Quick save from recipe page',
    desc: 'Tap the heart to save. Already saved items show a solid red heart so you always know.',
    icon: HeartIcon,
  },
  {
    title: 'Upload your own',
    desc: 'Add your favorite recipes with photos, ingredients, and steps. Edit them anytime.',
    icon: PencilIcon,
  },
  {
    title: 'Personal profile',
    desc: 'A clean profile with quick links to your recipes and albums.',
    icon: UserCircleIcon,
  },
  {
    title: 'Smart search & filters',
    desc: 'Filter by tags and time ranges to find the perfect recipe fast.',
    icon: ClockIcon,
  },
  {
    title: 'Secure sessions',
    desc: 'Protected routes and data tied to your account—your content stays yours.',
    icon: ShieldCheckIcon,
  },
];

function UserPerksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-green-50 to-transparent" />
          <div className="relative p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Why create an account?</h1>
            <p className="mt-3 text-gray-600 max-w-2xl">
              Unlock powerful features to organize, personalize, and manage your cooking life.
            </p>
            <div className="mt-6">
              <Link
                to="/signUp"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>

        {/* Perks grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map(({ title, desc, icon: Icon }) => (
            <div key={title} className="group rounded-2xl bg-white p-6 shadow hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-xl bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-1 text-gray-600">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </main>
    </div>
  );
}

export default UserPerksPage;



