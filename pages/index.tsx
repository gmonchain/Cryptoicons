import { useState, useMemo } from 'react'; // Importing necessary React hooks
import { SearchBar } from '../components/SearchBar'; // Component for searching icons
import { Stats } from '../components/Stats'; // Component for displaying icon statistics
import { IconCard } from '../components/IconCard'; // Component for individual icon display
import { PreviewModal } from '../components/PreviewModal'; // Modal for icon preview and actions
import { ToastContainer } from '../components/Toast'; // Component for displaying toast notifications
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching crypto icon data
import { useToast } from '../hooks/useToast';
import { CryptoIcon } from '../types';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // Main component for displaying and managing crypto icons
  const { icons, loading, error } = useCryptoIcons();
  const { toasts, addToast, removeToast } = useToast();
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the current search query
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // State to hold the currently selected icon for preview
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

  const handleCloseModal = () => { // Handles closing the preview modal
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  if (loading) { // Displays a loading spinner while icons are being fetched
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading crypto icons...</p>
        </div>
      </div>
    );
  }

  if (error) { // Displays an error message if icon data fails to load
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

  return ( // Main application layout and content
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Main content area */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8"> {/* Container for the search bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats */}
        <Stats // Displays statistics about the total and filtered icons
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
        {searchQuery.trim() && ( // Displays information about the search results
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
        {filteredIcons.length > 0 ? ( // Renders the grid of filtered icons
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredIcons.map((icon) => (
              <IconCard // Renders an individual icon card
                key={icon.name}
                icon={icon}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : searchQuery.trim() ? ( // Displays a message when no icons are found for the search query
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
      <PreviewModal // Modal component for displaying a larger preview of the selected icon
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} /> {/* Component for displaying toast notifications */}
    </div>
  );
}
