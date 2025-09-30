import { useState, useMemo } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Stats } from '../components/Stats';
import { IconCard } from '../components/IconCard';
import { PreviewModal } from '../components/PreviewModal';
import { ToastContainer } from '../components/Toast';
import { useCryptoIcons } from '../hooks/useCryptoIcons';
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications
import { CryptoIcon } from '../types'; // Type definition for cryptocurrency icons
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  // This is the main page component for displaying crypto icons. - Edit 1
  const { icons, loading, error } = useCryptoIcons(); // Edit 2
  const { toasts, addToast, removeToast } = useToast(); // Edit 3
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the current search query - Edit 4
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // State for the currently selected icon for preview - Edit 5
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the visibility of the preview modal - Edit 6

  const filteredIcons = useMemo(() => { // Memoized filtering of icons based on search query - Edit 7
    if (!searchQuery.trim()) return icons;
    
    const query = searchQuery.toLowerCase(); // Edit 8
    return icons.filter(icon =>
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]); // Edit 9

  const handleCopy = async (content: string, name: string) => { // Handles copying SVG content to clipboard - Edit 10
      await navigator.clipboard.writeText(content); // Edit 11
      addToast(`${name} SVG copied to clipboard!`, 'success'); // Edit 12
  };

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading the SVG icon file - Edit 13
    const link = document.createElement('a'); // Edit 14
    link.href = icon.path; // Edit 15
    link.download = icon.fileName; 
    // This is Edit 16
    document.body.appendChild(link); 
    // This is Edit 17
    link.click(); // Edit 18
    document.body.removeChild(link); 
    // This is Edit 19
    addToast(`${icon.displayName} downloaded!`, 'success'); // Edit 20
  };

  const handlePreview = (icon: CryptoIcon) => { // Handles opening the preview modal for a selected icon - Edit 21
    setSelectedIcon(icon); 
    // This is Edit 22
    setIsModalOpen(true); 
    // This is Edit 23
  };

  // This is Edit 24
  const handleCloseModal = () => { // Handles closing the preview modal and resetting selected icon state
    setIsModalOpen(false); // Edit 25
    setSelectedIcon(null); // Edit 26
  };

  if (loading) { // Displays a loading spinner while fetching icons - Edit 27
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Main content area with max width and padding */}
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
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
        {filteredIcons.length > 0 ? ( // Renders the grid of icon cards or a no-results message
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredIcons.map((icon) => (
              <IconCard // Individual icon card component
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
      <PreviewModal // Modal for displaying a larger preview of the selected icon
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} /> {/* Container for displaying toast notifications */}
    </div>
  );
}
