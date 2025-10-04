import { useState, useMemo } from 'react'; // React hooks for managing state and memoizing values.
import { SearchBar } from '../components/SearchBar'; // Component for searching crypto icons.
import { Stats } from '../components/Stats'; // Component for displaying icon statistics.
import { IconCard } from '../components/IconCard'; // Component for displaying individual crypto icons.
import { PreviewModal } from '../components/PreviewModal'; // Modal for displaying a larger view of a selected icon.
import { ToastContainer } from '../components/Toast'; // Container for displaying toast notifications.
import { useCryptoIcons } from '../hooks/useCryptoIcons'; // Custom hook for fetching and managing crypto icon data.
import { useToast } from '../hooks/useToast'; // Custom hook for managing toast notifications.
import { CryptoIcon } from '../types'; // Type definition for cryptocurrency icons.
import { Loader2 } from 'lucide-react'; // Icon component used for loading indicators.

export default function HomePage() { // Main page component for displaying and managing crypto icons.
  const { icons, loading, error } = useCryptoIcons(); // Fetches and manages the list of crypto icons, loading state, and any errors.
  const { toasts, addToast, removeToast } = useToast(); // Manages toast notifications for user feedback.
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input value.
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null); // Stores the icon selected for preview.
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the visibility of the preview modal.

  const filteredIcons = useMemo(() => { // Memoized list of icons based on search query.
    if (!searchQuery.trim()) return icons;
    
    const query = searchQuery.toLowerCase(); // Converts search query to lowercase for case-insensitive matching.
    return icons.filter(icon => // Filters icons based on display name, name, or symbol.
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
    document.body.appendChild(link); // Appends the link to the document body to trigger the download.
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
        <div className="max-w-2xl mx-auto mb-8"> {/* Container for the search bar, ensuring responsiveness. */}
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
        {searchQuery.trim() && ( // Conditionally displays search results information to the user.
          <div className="mb-6">
            <p className="text-gray-600"> {/* Displays a dynamic message based on the number of filtered icons. */}
              {filteredIcons.length > 0 
                ? `Found ${filteredIcons.length} icon${filteredIcons.length === 1 ? '' : 's'} matching "${searchQuery}"`
                : `No icons found matching "${searchQuery}"`
              }
            </p>
          </div>
        )}

        {/* Icon Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Grid layout for displaying crypto icon cards. */}
          {filteredIcons.map(icon => (
            <IconCard // Renders an individual icon card with copy, download, and preview functionality.
              key={icon.id}
              icon={icon}
              onCopy={handleCopy}
              onDownload={handleDownload}
              onPreview={handlePreview}
            />
          ))}
        </div>
      </main>

      {/* Preview Modal */}
      {selectedIcon && ( // Conditionally renders the preview modal if an icon is selected.
        <PreviewModal // Displays a detailed view of the selected icon.
          icon={selectedIcon}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} /> {/* Displays temporary notifications to the user. */}
    </div>
  );
}