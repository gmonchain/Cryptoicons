import React from 'react';
import { X, Download, Copy, ExternalLink } from 'lucide-react';
import { CryptoIcon } from '../types';

interface PreviewModalProps {
  icon: CryptoIcon | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (content: string, name: string) => void;
  onDownload: (icon: CryptoIcon) => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  icon,
  isOpen,
  onClose,
  onCopy,
  onDownload
}) => {
  if (!isOpen || !icon) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{icon.displayName}</h2>
            {icon.symbol && (
              <p className="text-sm text-gray-500 mt-1">{icon.symbol}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Large Icon Display */}
          <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-6">
            <img
              src={icon.path}
              alt={icon.displayName}
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Icon Details */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <span className="font-medium text-gray-700">File Name:</span>
              <p className="text-gray-600 mt-1">{icon.fileName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Format:</span>
              <p className="text-gray-600 mt-1">SVG Vector</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Copy className="w-4 h-4" />
              Copy SVG
            </button>
            <button
              onClick={() => onDownload(icon)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => window.open(icon.path, '_blank')}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};