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
  const { icons, loading, error } = useCryptoIcons(); // State and functions for handling crypto icon data
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

  // Handles copying SVG content to clipboard and showing a toast notification
  const handleCopy = async (content: string, name: string) => {
      await navigator.clipboard.writeText(content);
      addToast(`${name} SVG copied to clipboard!`, 'success');
  };

  // Handles downloading an SVG icon file and showing a toast notification
  const handleDownload = (icon: CryptoIcon) => {
    const link = document.createElement('a');
    link.href = icon.path;
    link.download = icon.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${icon.displayName} downloaded!`, 'success');
  };

  // Handles opening the preview modal for a selected icon
  const handlePreview = (icon: CryptoIcon) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  // Handles closing the preview modal and clearing the selected icon
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  // Display a loading spinner while icons are being fetched
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

  // Display an error message if icon data failed to load
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
