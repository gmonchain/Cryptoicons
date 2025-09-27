import { useState, useMemo } from 'react'; // React hooks for managing state and memoizing values
import { SearchBar } from '../components/SearchBar'; // Component for searching icons
import { Stats } from '../components/Stats'; // Component to display icon statistics
import { IconCard } from '../components/IconCard'; // Component for displaying individual icons
import { PreviewModal } from '../components/PreviewModal'; // Modal for displaying a larger icon preview
import { ToastContainer } from '../components/Toast'; // Component for displaying toast notifications
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching crypto icons
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications
import { CryptoIcon } from '../types'; // Type definition for cryptocurrency icon data
import { Loader2 } from 'lucide-react'; // Loading spinner component from Lucide React

// Main page component for displaying crypto icons
export default function HomePage() {
  // Destructure values from the useCryptoIcons hook for icon data and loading/error states
  const { icons, loading, error } = useCryptoIcons();
  // Destructure values from the useToast hook for managing notifications
  const { toasts, addToast, removeToast } = useToast();
  // State to manage the user's search input
  const [searchQuery, setSearchQuery] = useState('');
  // State to store the icon selected for preview
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null);
  // State to control the visibility of the preview modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Memoized filtering of icons based on search query for performance
  const filteredIcons = useMemo(() => {
    // If search query is empty, return all icons
    if (!searchQuery.trim()) return icons;
    
    // Convert search query to lowercase for case-insensitive matching
    const query = searchQuery.toLowerCase();
    return icons.filter(icon =>
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  // Asynchronously copies the provided content to the user's clipboard
  const handleCopy = async (content: string, name: string) => {
      await navigator.clipboard.writeText(content);
      addToast(`${name} SVG copied to clipboard!`, 'success');
  };

  // Initiates the download of an SVG icon by creating a temporary anchor element
  const handleDownload = (icon: CryptoIcon) => {
    const link = document.createElement('a');
    link.href = icon.path;
    link.download = icon.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${icon.displayName} downloaded!`, 'success');
  };

  // Sets the selected icon and opens the preview modal for detailed inspection
  const handlePreview = (icon: CryptoIcon) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  // Closes the preview modal and resets the selected icon state
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  // Conditionally renders a loading spinner when icon data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading crypto icons...</p>
        </div>
      </div>
    );
  }

  // Displays an error message and a warning icon if icon data fails to load
  if (error) {
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
        {/* Search Bar Component for filtering icons */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats Component to display icon counts */}
        <Stats
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Conditional display for search results information */}
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

        {/* Grid display for filtered cryptocurrency icons */}
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

      {/* Preview Modal for detailed icon view */}
      <PreviewModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* Toast Notifications for user feedback */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
