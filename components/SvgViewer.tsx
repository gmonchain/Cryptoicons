import React, { useState, useEffect } from 'react';

interface SvgViewerProps {
  svgPaths: string[];
}

const SvgViewer: React.FC<SvgViewerProps> = ({ svgPaths }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(60); // Default items per page
  const [copied, setCopied] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 300); // 300ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(null);
      }, 1500); // Hide "Copied!" message after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const filteredSvgPaths = svgPaths.filter(path =>
    path.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSvgPaths.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSvgPaths.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1) setCurrentPage(1);
    else if (pageNumber > totalPages) setCurrentPage(totalPages);
    else setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (iconName: string) => {
    navigator.clipboard.writeText(iconName);
    setCopied(iconName);
  };

  return (
    <div className={"container mx-auto p-4 bg-white text-gray-800 dark:bg-gray-900 dark:text-white min-h-screen"}>      <h1 className="text-4xl font-bold text-center mb-8">Crypto Icons</h1>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="mb-6 relative flex items-center space-x-4">        <input
          type="text"
          placeholder="Search icons..."
          className="flex-grow p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page when items per page changes
          }}
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
          <option value={200}>200 per page</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">        {currentItems.length > 0 ? (
          currentItems.map((path, index) => {
            const iconName = path.split('/').pop()?.replace('.svg', '');
            return (
              <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">                <img src={path} alt={iconName || "Crypto Icon"} className="w-16 h-16 object-contain mb-2" loading="lazy" />
                <span className="text-sm text-gray-700 text-center mb-2 dark:text-gray-300">{iconName}</span>
                <button
                  onClick={() => handleCopy(iconName || '')}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200 dark:bg-blue-700 dark:text-blue-200 dark:hover:bg-blue-500"
                >
                  {copied === iconName ? 'Copied!' : 'Copy Name'}
                </button>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 p-8">No icons found matching your criteria.</p>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">          <button
            onClick={() => paginate(currentPage - 1)}            disabled={currentPage === 1}            className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"          >
            Previous
          </button>
          <span className="px-4 py-2 flex items-center justify-center text-gray-700 dark:text-gray-300">            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}            disabled={currentPage === totalPages}            className="px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"          >
            Next
          </button>
        </div>
      )}    </div>
  );
};

export default SvgViewer;