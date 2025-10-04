import { useState, useMemo } from 'react'; // React hooks for managing state and memoizing values.
import { SearchBar } from '../components/SearchBar'; // Component for searching crypto icons.
import { Stats } from '../components/Stats'; // Component for displaying icon statistics.
import { IconCard } from '../components/IconCard'; // Component for displaying individual crypto icon cards.
import { PreviewModal } from '../components/PreviewModal'; // Component for displaying a detailed icon preview.
import { ToastContainer } from '../components/Toast'; // Component for displaying toast notifications.
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching crypto icons.
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications.
import { CryptoIcon } from '../types'; // Type definition for a cryptocurrency icon.
import { Loader2 } from 'lucide-react'; // Icon component for displaying loading states.

export default function HomePage() { // Main page component for displaying crypto icons.
  const { icons, loading, error } = useCryptoIcons(); // Fetches and manages the state of crypto icons.
  const { toasts, addToast, removeToast } = useToast(); // Manages toast notifications for user feedback.
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input value.
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // Stores the icon selected for preview.
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the visibility of the preview modal.

  const filteredIcons = useMemo(() => { // Memoized list of icons based on search query.
    if (!searchQuery.trim()) return icons;
    
    const query = searchQuery.toLowerCase(); // Converts the search query to lowercase for case-insensitive matching.
    return icons.filter(icon =>
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  const handleCopy = async (content: string, name: string) => { // Handles copying icon SVG to clipboard.
      await navigator.clipboard.writeText(content);
      addToast(`${name} SVG copied to clipboard!`, 'success');
  };

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading the icon SVG file.
    const link = document.createElement('a'); // Creates a temporary anchor element for downloading.
    link.href = icon.path;
    link.download = icon.fileName;
    document.body.appendChild(link); // Appends the link to the document body to trigger download.
    link.click(); // Programmatically clicks the link to initiate the download.
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

  if (loading) { // Displays a loading spinner while fetching icons.
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading crypto icons...</p>
        </div>
      </div>
    );
  }

  if (error) { // Displays an error message if icon fetching fails.
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

  return ( // Main container for the application layout.
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Main content area with responsive padding and width. */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8"> {/* Container for the search bar. */}
          <SearchBar // Input component for filtering icons based on user search.
            value={searchQuery} // Binds the search bar's value to the searchQuery state.
            onChange={setSearchQuery} // Updates the searchQuery state as the user types.
            placeholder="Search crypto icons by name or symbol..." // Provides a hint to the user about the search functionality.
          />
        </div>

        {/* Stats */}
        <Stats // Displays statistics about the total and filtered icons.
          totalIcons={icons.length} // Passes the total number of available icons.
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
        {searchQuery.trim() && ( /* Conditionally displays search results information if a search query is active. */
          <div className="mb-6"> {/* Container for the search results message. */}
            <p className="text-gray-600">
              {filteredIcons.length > 0 
                ? `Found ${filteredIcons.length} icon${filteredIcons.length === 1 ? '' : 's'} matching "${searchQuery}"`
                : `No icons found matching "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {/* Icons Grid */}
        {filteredIcons.length > 0 ? ( /* Displays the grid of icons if there are any to show based on filtering. */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredIcons.map((icon) => (
              <IconCard // Renders each icon as a card with copy, download, and preview actions.
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
