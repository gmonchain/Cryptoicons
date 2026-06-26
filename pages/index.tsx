import { useState, useMemo } from 'react'; // React hooks for managing state and memoizing values.
import { SearchBar } from '../components/SearchBar'; // Component for searching icons.
import { FilterBar } from '../components/FilterBar'; // Component for filtering icons by market data.
import { Stats } from '../components/Stats'; // Component for displaying icon statistics.
import { IconCard } from '../components/IconCard'; // Component for displaying individual icons.
import { PreviewModal } from '../components/PreviewModal'; // Modal for icon preview.
import { ToastContainer } from '../components/Toast'; // Container for toast notifications.
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching crypto icon data.
import { useMarketData } from '../hooks/useMarketData'; // Custom hook for fetching market cap data.
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications.
import { CryptoIcon } from '../types'; // Type definition for cryptocurrency icons.
import { Loader2 } from 'lucide-react'; // Icon component for displaying loading animations.

export default function HomePage() { // Main component for the cryptocurrency icon application.
  const { icons, loading, error } = useCryptoIcons();
  const { marketData, loading: marketLoading, isTop100Coin, isActiveCoin, apiKeyConfigured, hasActiveData } = useMarketData();
  const { toasts, addToast, removeToast } = useToast(); // Manages toast notifications for user feedback.
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input value.
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // Stores the icon selected for preview.
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the visibility of the preview modal.
  const [showTop100Only, setShowTop100Only] = useState(false); // Filter to show only top 100 coins by market cap.
  const [showActiveOnly, setShowActiveOnly] = useState(true); // Filter to show only active coins (default: true).

  const filteredIcons = useMemo(() => { // Memoized list of icons based on search query and filters.
    let filtered = icons;

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(icon =>
        icon.displayName.toLowerCase().includes(query) ||
        icon.name.toLowerCase().includes(query) ||
        icon.symbol?.toLowerCase().includes(query)
      );
    }

    // Apply Top 100 filter
    if (showTop100Only && marketData) {
      filtered = filtered.filter(icon => {
        if (!icon.symbol) return false; // No symbol = can't verify if in top 100
        return isTop100Coin(icon.symbol);
      });
    }

    // Apply Active coins filter
    if (showActiveOnly && marketData) {
      filtered = filtered.filter(icon => {
        if (!icon.symbol) return true; // No symbol = can't verify active status, so show it
        return isActiveCoin(icon.symbol);
      });
    }

    return filtered;
  }, [icons, searchQuery, showTop100Only, showActiveOnly, marketData, isTop100Coin, isActiveCoin]);

  const handleCopy = async (content: string, name: string) => { // Handles copying icon SVG to clipboard.
      await navigator.clipboard.writeText(content);
      addToast(`${name} SVG copied to clipboard!`, 'success');
  };

  const handleDownload = (icon: CryptoIcon) => { // Handles downloading the icon SVG file.
    const link = document.createElement('a');
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
        <div className="sticky top-0 z-50 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-8 pt-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8"> {/* Sticky container for the search bar. */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search crypto icons by name or symbol..."
            />
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          showTop100Only={showTop100Only}
          onToggleTop100={() => setShowTop100Only(!showTop100Only)}
          showActiveOnly={showActiveOnly}
          onToggleActive={() => setShowActiveOnly(!showActiveOnly)}
          isLoading={marketLoading}
          apiKeyConfigured={apiKeyConfigured}
          hasActiveData={hasActiveData}
        />

        {/* Stats */}
        <Stats // Displays statistics about the total and filtered icons.
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
        {searchQuery.trim() && ( // Conditionally renders search results information.
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
        {filteredIcons.length > 0 ? ( // Conditionally renders the grid of icons or a "no results" message.
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredIcons.map((icon) => ( // Renders each icon as an `IconCard` component.
              <IconCard
                key={icon.name}
                icon={icon}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onPreview={handlePreview}
              />
            ))}
          </div>
        ) : searchQuery.trim() ? ( // Displays a message when no icons match the search query.
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
      <PreviewModal // Modal component for displaying a larger preview of the selected icon.
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
