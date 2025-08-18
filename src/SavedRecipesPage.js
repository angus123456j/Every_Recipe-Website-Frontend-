import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';

function SavedRecipesPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to albums page
    navigate('/albums');
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Redirecting to Albums...</h1>
      </div>
    </div>
  );
}

export default SavedRecipesPage;