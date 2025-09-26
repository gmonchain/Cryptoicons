import React, { useState, useEffect } from 'react';

interface SvgViewerProps {
  svgPaths: string[];
}

const SvgViewer: React.FC<SvgViewerProps> = ({ svgPaths }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredSvgPaths = svgPaths.filter(path =>
    path.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">      <h1 className="text-4xl font-bold text-center mb-8">Crypto Icons</h1>
      <div className="mb-4 relative">        <input
          type="text"
          placeholder="Search icons..."
          className="w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={() => setSearchTerm(\'\')}
          >
            &times;
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">        {filteredSvgPaths.length > 0 ? (
          filteredSvgPaths.map((path, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md bg-white">              <img src={path} alt={} className="w-16 h-16 object-contain mb-2" />
              <span className="text-sm text-gray-700 text-center">{path.split('/')[path.split('/').length - 1]?.replace('.svg', \'\')}</span>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No icons found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default SvgViewer;