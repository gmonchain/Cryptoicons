import { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Stats } from '../components/Stats';
import { IconCard } from '../components/IconCard';
import { PreviewModal } from '../components/PreviewModal';
import { ToastContainer } from '../components/Toast';
import { useCryptoIcons } from '../hooks/useCryptoIcons';
import { useToast } from '../hooks/useToast';
import { CryptoIcon } from '../types';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // This is the main page component for displaying crypto icons.
  const { icons, loading, error } = useCryptoIcons();
  const { toasts, addToast, removeToast } = useToast();
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the current search query
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // State for the currently selected icon for preview
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the preview modal

  const filteredIcons = useMemo(() => { // Memoized filtering of icons based on search query
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

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading the SVG icon file
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

  const handleCloseModal = () => { // Handles closing the preview modal and resetting selected icon state
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  if (loading) { // Displays a loading spinner while fetching icons
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" /> {/* Spinner icon for loading state */}
          <p className="text-gray-600 text-lg">Loading crypto icons...</p> {/* Loading message */}
        </div>
      </div>
    );
  }

  if (error) { // Displays an error message if icon data fails to load
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md"> {/* Centered container for error message */}
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center"> {/* Styling for the warning icon */}
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Icons</h2> {/* Error title */}
          <p className="text-gray-600">{error}</p> {/* Dynamic error message content */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"> {/* Main container for the homepage, with a gradient background */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Main content area with max width and padding */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8"> {/* Container for the search bar, centered and with bottom margin */}
          <SearchBar // Component for searching icons
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats */}
        <Stats // Component for displaying icon statistics
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
        {searchQuery.trim() && ( // Displays search results count if a query is active
          <div className="mb-6"> {/* Container for the search results information */}
            <p className="text-gray-600"> {/* Displaying count of filtered icons */}
              {filteredIcons.length > 0 ? ( // Renders the grid of icon cards or a no-results message
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 py-2"> 
                  {filteredIcons.map((icon) => (
                    <IconCard
                      key={icon.name}
                      icon={icon}
                      onCopy={handleCopy}
                      onDownload={handleDownload}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">No icons found for your query.</p>
              )}
            </p>
          </div>
        )}

        {/* Preview Modal */}
        {selectedIcon && (
          <PreviewModal
            icon={selectedIcon}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}

        {/* Toast Container */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    </div>
  );
}