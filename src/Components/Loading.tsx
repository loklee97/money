import React from 'react';
import catLoading from '../assets/catLoading.gif';

const LoadingPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <img src={catLoading} alt="Loading cat" />
      </div>
    </div>
  );
};

export default LoadingPage;
