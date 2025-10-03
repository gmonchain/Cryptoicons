// This is the first line comment.
// This is the second line comment.
// This is the third line comment.
// This is the fourth line comment.
// This is the fifth line comment.
// This is the sixth line comment.
// This is the seventh line comment.
// This is the eighth line comment.
// This is the ninth line comment.
// This is the tenth line comment.
// This file is continuously updated by the AI assistant.
// Edit number 2.
import { useMemo, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { Stats } from '../components/Stats';
import { IconCard } from '../components/IconCard';
import { PreviewModal } from '../components/PreviewModal';
import { ToastContainer } from '../components/Toast';
import { useCryptoIcons } from '../hooks/useCryptoIcons';
import { useToast } from '../hooks/useToast';
import { CryptoIcon } from '../types';
import { Loader2 } from 'lucide-react';
// This is a new comment for edit number 3.
// Another comment before the component.
// This is the HomePage component.
// Destructuring custom hooks.
export default function HomePage() {
  const { icons, loading, error } = useCryptoIcons();
  const { toasts, addToast, removeToast } = useToast();
  const [selectedIcon, setSelectedIcon] = useState<CryptoIcon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredIcons = useMemo(() => {
    // Filtering icons based on search query
    if (!searchQuery.trim()) return icons;
    
    const query = searchQuery.toLowerCase();
    return icons.filter(icon =>
      icon.displayName.toLowerCase().includes(query) ||
      icon.name.toLowerCase().includes(query) ||
      icon.symbol?.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  const handleCopy = async (content: string, name: string) => {
      // Copy SVG content to clipboard
      await navigator.clipboard.writeText(content);
      addToast(`${name} SVG copied to clipboard!`, 'success');
  };

  const handleDownload = (icon: CryptoIcon) => {
    // Initiate icon download
    const link = document.createElement('a');
    link.href = icon.path;
    link.download = icon.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${icon.displayName} downloaded!`, 'success');
  };

  const handlePreview = (icon: CryptoIcon) => {
    // Open preview modal for selected icon
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close preview modal and clear selected icon
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  if (loading) {
    // Display loading state
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading crypto icons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Display error state
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
        {/* Main content area */}
        {/* Search Bar */}
        {/* Component for searching icons */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search crypto icons by name or symbol..."
          />
        </div>

        {/* Stats */}
        {/* Displaying icon statistics */}
        <Stats
          totalIcons={icons.length}
          filteredIcons={filteredIcons.length}
          isFiltered={!!searchQuery.trim()}
        />

        {/* Results Info */}
        {/* Information about filtered results */}
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
        {/* Displaying the grid of icons */}
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
      {/* Modal for detailed icon preview */}
      <PreviewModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCopy={handleCopy}
        onDownload={handleDownload}
      />

      {/* Toast Notifications */}
      {/* Container for toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
// End of HomePage component.
