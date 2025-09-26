import React, { useState } from 'react';

interface SvgViewerProps {
  svgPaths: string[];
}

const SvgViewer: React.FC<SvgViewerProps> = ({ svgPaths }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSvgPaths = svgPaths.filter(path =>
    path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Crypto Icons</h1>
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search icons..."
          className="p-3 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredSvgPaths.map((path, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-md bg-white">
            <img src={path} alt={`Crypto Icon ${index}`} className="w-16 h-16 object-contain mb-2" />
            <span className="text-sm text-gray-700 text-center">{path.split('/').pop()?.replace('.svg', '')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SvgViewer;
