import React, { useState } from 'react';
import { Download, Copy, Eye, ExternalLink } from 'lucide-react';
import { CryptoIcon } from '../types';

interface IconCardProps {
  icon: CryptoIcon;
  onCopy: (content: string, name: string) => void;
  onDownload: (icon: CryptoIcon) => void;
  onPreview: (icon: CryptoIcon) => void;
}

export const IconCard: React.FC<IconCardProps> = ({ 
  icon, 
  onCopy, 
  onDownload, 
  onPreview 
}) => {
  const [imageError, setImageError] = useState(false);

  const handleCopyClick = async () => {
    try {
      const response = await fetch(icon.path);
      const svgContent = await response.text();
      onCopy(svgContent, icon.displayName);
    } catch (error) {
      console.error('Failed to copy SVG:', error);
    }
  };

  return (
    <div 
      className="group relative bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      itemScope itemType="https://schema.org/ImageObject"
    >
      <div className="p-6">
        {/* Icon Display */}
        <div className="flex items-center justify-center h-24 mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          {!imageError ? (
            <img
              src={icon.path}
              itemProp="contentUrl"
              alt={icon.displayName}
              itemProp="description"
              className="w-16 h-16 object-contain transition-transform duration-200 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-xs">SVG</span>
            </div>
          )}
        </div>

        {/* Icon Info */}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-gray-900 truncate" title={icon.displayName} itemProp="name">
            {icon.displayName}
          </h3>
          {icon.symbol && (
            <p className="text-sm text-gray-500 mt-1">{icon.symbol}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onPreview(icon)}
            className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Preview"
            aria-label={`Preview ${icon.displayName} icon`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyClick}
            className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Copy SVG"
            aria-label={`Copy ${icon.displayName} SVG`}
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(icon)}
            className="flex items-center justify-center p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            title="Download"
            aria-label={`Download ${icon.displayName} icon`}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};