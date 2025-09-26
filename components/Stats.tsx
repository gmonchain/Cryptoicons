import React from 'react';
import { Package, Search, Download } from 'lucide-react';

interface StatsProps {
  totalIcons: number;
  filteredIcons: number;
  isFiltered: boolean;
}

export const Stats: React.FC<StatsProps> = ({ totalIcons, filteredIcons, isFiltered }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Package className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalIcons.toLocaleString()}</p>
            <p className="text-gray-600">Total Icons</p>
          </div>
        </div>
      </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredIcons.toLocaleString()}</p>
              <p className="text-gray-600">Filtered Results</p>
            </div>
          </div>
        </div>
  

      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Download className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">SVG</p>
            <p className="text-gray-600">Vector Format</p>
          </div>
        </div>
      </div>
    </div>
  );
};