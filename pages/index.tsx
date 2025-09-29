// This file defines the main home page for the Cryptoicons application.
import { useState, useMemo } from 'react'; // Import React hooks for managing state and memoization.
import { SearchBar } from '../components/SearchBar'; // Component for searching icons.
import { Stats } from '../components/Stats'; // Component to display icon statistics.
import { IconCard } from '../components/IconCard'; // Component to display individual icon details.
import { PreviewModal } from '../components/PreviewModal'; // Modal for displaying a larger icon preview.
import { ToastContainer } from '../components/Toast'; // Container for toast notifications.
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching crypto icon data.
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications.
import { CryptoIcon } from '../types'; // TypeScript type definition for a crypto icon.
import { Loader2 } from 'lucide-react'; // Icon component for loading states.

export default function HomePage() { // Main component for the home page of the application.
  const { icons, loading, error } = useCryptoIcons(); // Fetch crypto icons and their loading/error states.
  const { toasts, addToast, removeToast } = useToast(); // Manage toast notifications for user feedback.
  const [searchQuery, setSearchQuery] = useState(''); // State for storing the user's search query.
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // State for the currently selected icon for preview.
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the preview modal.

  const filteredIcons = useMemo(() => { // Memoized list of icons based on the search query.
    if (!searchQuery.trim()) return icons; // If search query is empty, return all icons.
    
    const query = searchQuery.toLowerCase(); // Convert search query to lowercase for case-insensitive matching.
    return icons.filter(icon => // Filter icons based on display name, name, or symbol.
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  const handleCopy = async (content: string, name: string) => { // Handles copying icon SVG to clipboard.
      await navigator.clipboard.writeText(content); // Writes the provided content to the clipboard.
      addToast(`${name} SVG copied to clipboard!`, 'success'); // Displays a success toast notification.
  };

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading an icon as an SVG file.
    const link = document.createElement('a'); // Creates a temporary anchor element for downloading.
    link.href = icon.path; // Sets the SVG file path as the download link.
    link.download = icon.fileName; // Sets the suggested file name for the download.
    document.body.appendChild(link); // Appends the link to the document body to make it clickable.
    link.click(); // Programmatically clicks the link to trigger the download.
    document.body.removeChild(link); // Removes the temporary link from the document body.
    addToast(`${icon.displayName} downloaded!`, 'success'); // Displays a success toast notification after download.
  };

  const handlePreview = (icon: CryptoIcon) => { // Sets the selected icon and opens the preview modal.
    setSelectedIcon(icon); // Sets the icon to be displayed in the modal.
    setIsModalOpen(true); // Opens the preview modal.
  };

  const handleCloseModal = () => { // Closes the preview modal and clears the selected icon.
    setIsModalOpen(false); // Closes the modal.
    setSelectedIcon(null); // Clears the currently selected icon.
  };

  if (loading) { // Displays a loading spinner while crypto icons are being fetched.
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" /> // Loading spinner icon.
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats */}
        <Stats
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
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

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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
        ) : searchQuery.trim() ? (
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
      <PreviewModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
