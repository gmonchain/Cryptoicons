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
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        if (window.pageYOffset > 300) { // Show button after scrolling down 300px
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

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

  const handleDownload = async (path: string, iconName: string) => {
    try {
      const response = await fetch(path);
      const svgBlob = await response.blob();
      const url = URL.createObjectURL(svgBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${iconName}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading SVG:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={"container mx-auto p-2 sm:p-4 bg-[var(--background)] text-[var(--text-light)] dark:text-[var(--text-dark)] min-h-screen"}>      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 sm:mb-8">Crypto Icons</h1>
      <p className="text-center text-sm sm:text-lg text-[var(--text-light)] dark:text-[var(--text-dark)] mb-4 sm:mb-6">Total Icons: {svgPaths.length}</p>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="mb-3 sm:mb-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--button-bg-light)] text-[var(--button-text-light)] dark:bg-[var(--button-bg-dark)] dark:text-[var(--button-text-dark)] rounded-lg text-sm sm:text-base transition-colors"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="mb-4 sm:mb-6 relative flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">        <input
          type="text"
          placeholder="Search icons..."
          className="flex-grow w-full sm:w-auto p-2.5 sm:p-3 pr-8 sm:pr-10 border border-[var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition duration-200 ease-in-out bg-[var(--card-bg-light)] text-[var(--text-light)] dark:bg-[var(--button-bg-dark)] dark:border-[var(--border-color)] dark:text-[var(--text-dark)] text-sm sm:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--primary-color)] dark:text-[var(--text-dark)] dark:hover:text-[var(--primary-color)]"
            onClick={() => setSearchTerm('')}
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
          className="w-full sm:w-auto p-2.5 sm:p-3 border border-[var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition duration-200 ease-in-out bg-[var(--card-bg-light)] text-[var(--text-light)] dark:bg-[var(--button-bg-dark)] dark:border-[var(--border-color)] dark:text-[var(--text-dark)] text-sm sm:text-base"
        >
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
          <option value={200}>200 per page</option>
        </select>
      </div>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">        {currentItems.length > 0 ? (
          currentItems.map((path, index) => {
            const iconName = path.split('/').pop()?.replace('.svg', '');
            return (
              <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md bg-[var(--card-bg-light)] dark:bg-[var(--card-bg-dark)] transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer">
                <img src={path} alt={iconName || "Crypto Icon"} className="w-16 h-16 object-contain mb-2" loading="lazy" />
                <span className="text-sm text-[var(--text-light)] dark:text-[var(--text-dark)] text-center mb-2">{iconName}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCopy(iconName || '')}
                    className="text-xs bg-[var(--primary-color)] text-white px-2 py-1 rounded-full hover:bg-[var(--primary-color)]/80 transition-colors"
                  >
                    {copied === iconName ? 'Copied!' : 'Copy Name'}
                  </button>
                  <button
                    onClick={() => handleDownload(path, iconName || '')}
                    className="text-xs bg-[var(--secondary-color)] text-white px-2 py-1 rounded-full hover:bg-[var(--secondary-color)]/80 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-[var(--text-light)] dark:text-[var(--text-dark)] p-8">No icons found matching your criteria.</p>
        )}
      </section>
      {isLoading && (
        <p className="col-span-full text-center text-[var(--text-light)] dark:text-[var(--text-dark)] p-8">Loading icons...</p>
      )}
      {totalPages > 1 && (
        <nav className="flex flex-col sm:flex-row justify-center mt-6 sm:mt-8 space-y-2 sm:space-y-0 sm:space-x-2">          <button
            onClick={() => paginate(currentPage - 1)}            disabled={currentPage === 1}            className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg bg-[var(--button-bg-light)] dark:bg-[var(--button-bg-dark)] dark:border-[var(--border-color)] text-[var(--button-text-light)] dark:text-[var(--button-text-dark)] disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
   Previous
          </button>
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center text-[var(--text-light)] dark:text-[var(--text-dark)] text-sm sm:text-base">            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}            disabled={currentPage === totalPages}            className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-lg bg-[var(--button-bg-light)] dark:bg-[var(--button-bg-dark)] dark:border-[var(--border-color)] text-[var(--button-text-light)] dark:text-[var(--button-text-dark)] disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
   Next
          </button>
        </nav>
      )}

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-[var(--primary-color)] text-white p-2.5 sm:p-3 rounded-full shadow-lg hover:bg-[var(--primary-color)]/80 transition-colors"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default SvgViewer;