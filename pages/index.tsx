// This is the main page of the Cryptoicons application, displaying a list of cryptocurrency icons.
import { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';

import { Stats } from '../components/Stats';
import { IconCard } from '../components/IconCard';
import { PreviewModal } from '../components/PreviewModal';
import { ToastContainer } from '../components/Toast';
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching crypto icon data.
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications.
import { CryptoIcon } from '../types'; // Type definition for a cryptocurrency icon.
import { Loader2 } from 'lucide-react'; // Icon component for loading states.

// Main component for the homepage, displaying crypto icons and search functionality.
export default function HomePage() {
  const { icons, loading, error } = useCryptoIcons(); // Fetches all crypto icon data, along with loading and error states.
  const { toasts, addToast, removeToast } = useToast(); // State and functions for managing toast notifications.
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input value.
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // State for the currently selected icon for preview.
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the preview modal.

  const filteredIcons = useMemo(() => { // Memoized list of icons based on search query.
    if (!searchQuery.trim()) return icons; // If search query is empty, return all icons.
    
    const query = searchQuery.toLowerCase(); // Converts the search query to lowercase for case-insensitive matching.
    return icons.filter(icon => // Filters icons based on display name, name, or symbol.
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  const handleCopy = async (content: string, name: string) => { // Handles copying SVG content to clipboard.
      await navigator.clipboard.writeText(content); // Writes the provided SVG content to the clipboard.
      addToast(`${name} SVG copied to clipboard!`, 'success'); // Displays a success toast notification.
  };

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading the icon SVG file.
    const link = document.createElement('a'); // Creates a temporary anchor element for downloading.
    link.href = icon.path;
    link.download = icon.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${icon.displayName} downloaded!`, 'success');
  };

  const handlePreview = (icon: CryptoIcon) => { // Sets the selected icon and opens the preview modal.
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => { // Closes the preview modal and clears the selected icon.
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  if (loading) { // Displays a loading spinner and message while icons are being fetched.
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading crypto icons...</p>
        </div>
      </div>
    );
  }

  if (error) { // Displays an error message if icon data fails to load.
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"> {/* Main container for the application with a background gradient. */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Main content area with responsive padding and max-width. */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8"> {/* Container for the search bar to center it and add margin. */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats */}
        <Stats // Displays statistics about the total and filtered icons.
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
        {searchQuery.trim() && ( // Conditionally renders search result information.
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredIcons.length > 0 
                ? `Found ${filteredIcons.length} icon${filteredIcons.length === 1 ? '' : 's'} matching "${searchQuery}"`
                : `No icons found matching "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? ( // Conditionally renders the grid of icons or a no-results message.
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredIcons.map((icon) => ( // Maps through filtered icons to display each as an IconCard.
              <IconCard
                key={icon.name}
                icon={icon}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : searchQuery.trim() ? ( // Displays a message when no icons are found for the current search query.
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No icons found</h3>
            <p className="text-gray-600">Try searching with different keywords or check the spelling.</p>
          </div>
        ) : null}
      </main>

      {/* Preview Modal */}
      <PreviewModal // Modal component for displaying a larger preview of a selected icon.
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} /> {/* Container for displaying transient toast notifications. */}
    </div>
  );
}
