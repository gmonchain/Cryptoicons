import { useState, useMemo } from 'react'; // Importing necessary React hooks for state management and memoization
import { SearchBar } from '../components/SearchBar'; // Importing the SearchBar component for icon searching
import { Stats } from '../components/Stats'; // Importing the Stats component to display icon statistics
import { IconCard } from '../components/IconCard'; // Importing the IconCard component to render individual icon cards
import { PreviewModal } from '../components/PreviewModal'; // Importing the PreviewModal component for icon details
import { ToastContainer } from '../components/Toast'; // Importing the ToastContainer for displaying notifications
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching cryptocurrency icons
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications
import { CryptoIcon } from '../types'; // Importing the CryptoIcon type definition
import { Loader2 } from 'lucide-react'; // Importing the Loader2 icon for loading indicators

export default function HomePage() { // Main component for the cryptocurrency icon gallery
  const { icons, loading, error } = useCryptoIcons(); // Fetching icons, loading state, and error from the custom hook
  const { toasts, addToast, removeToast } = useToast(); // Managing toast notifications with a custom hook
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the current search query
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // State to hold the icon currently selected for preview
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the preview modal

  const filteredIcons = useMemo(() => { // Memoized list of icons based on the search query
    if (!searchQuery.trim()) return icons;
    
    const query = searchQuery.toLowerCase();
    return icons.filter(icon =>
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  const handleCopy = async (content: string, name: string) => { // Handles copying SVG content to clipboard
      await navigator.clipboard.writeText(content);
      addToast(`${name} SVG copied to clipboard!`, 'success');
  };

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading an SVG icon file
    const link = document.createElement('a');
    link.href = icon.path;
    link.download = icon.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${icon.displayName} downloaded!`, 'success');
  };

  const handlePreview = (icon: CryptoIcon) => { // Handles opening the preview modal for a selected icon
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { // Handles closing the preview modal
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  if (loading) { // Display a loading spinner while icons are being fetched
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center"> {/* Centered container for loading state */}
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" /> {/* Loading spinner icon */}
          <p className="text-gray-600 text-lg">Loading crypto icons...</p>
        </div>
      </div>
    );
  }

  if (error) { // Display an error message if icon fetching fails
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center"> {/* Centered container for error message */}
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Icons</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"> {/* Main container for the entire page layout */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Main content area of the page */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8"> {/* Container for the SearchBar component */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats */} {/* Displays statistics about the icons */}
        <Stats
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */} {/* Displays information about the search results */}
        {searchQuery.trim() && (
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredIcons.length > 0 
                ? `Found ${filteredIcons.length} icon${filteredIcons.length === 1 ? '' : 's'} matching "${searchQuery}"`
                : `No icons found matching "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {/* Icons Grid */} {/* Container for displaying the cryptocurrency icons in a grid layout */}
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredIcons.map((icon) => ( // Maps through filtered icons and renders an IconCard for each
              <IconCard
                key={icon.name}
                icon={icon}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : searchQuery.trim() ? ( // Display a message if no icons are found for the current search query
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No icons found</h3>
            <p className="text-gray-600">Try searching with different keywords or check the spelling.</p>
          </div>
        ) : null}
      </main>

      {/* Preview Modal */} {/* Modal for displaying a larger preview of a selected icon */}
      <PreviewModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />
      {/* Toast Notifications */} {/* Container for displaying toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
