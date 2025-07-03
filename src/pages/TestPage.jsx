import React from 'react';

const TestPage = () => {
  const handleClick = () => {
    console.log('Button clicked!');
    alert('Button clicked!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-800 shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Test Page</h1>
          <p className="text-gray-400">Testing button visibility</p>
        </div>

        <button
          onClick={handleClick}
          className="btn-primary w-full flex items-center justify-center"
        >
          Click Me (Primary)
        </button>

        <button
          onClick={handleClick}
          className="btn-secondary w-full mt-4 flex items-center justify-center"
        >
          Click Me (Secondary)
        </button>

        <button
          onClick={handleClick}
          className="mt-4 w-full py-2 px-4 border border-blue-500 rounded-lg text-blue-500 hover:bg-blue-500 hover:bg-opacity-10 transition-colors"
        >
          Click Me (Custom)
        </button>
      </div>
    </div>
  );
};

export default TestPage;