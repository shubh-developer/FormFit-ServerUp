'use client';

import { useState } from 'react';
import { PainArea } from '@/types';

interface PainAreaSelectorProps {
  onPainAreasChange: (painAreas: PainArea[]) => void;
  selectedPainAreas?: PainArea[];
}

const PainAreaSelector = ({ onPainAreasChange, selectedPainAreas = [] }: PainAreaSelectorProps) => {
  const [painAreas, setPainAreas] = useState<PainArea[]>(selectedPainAreas);

  const painAreaOptions = [
    'Neck & Shoulders',
    'Upper Back',
    'Lower Back',
    'Arms & Hands',
    'Legs & Feet',
    'Head & Face',
    'Hips & Glutes',
    'Chest & Abdomen'
  ];

  const handlePainAreaToggle = (area: string) => {
    const existingArea = painAreas.find(pa => pa.area === area);
    
    if (existingArea) {
      const updatedAreas = painAreas.filter(pa => pa.area !== area);
      setPainAreas(updatedAreas);
      onPainAreasChange(updatedAreas);
    } else {
      const newPainArea: PainArea = {
        area,
        intensity: 3,
        description: ''
      };
      const updatedAreas = [...painAreas, newPainArea];
      setPainAreas(updatedAreas);
      onPainAreasChange(updatedAreas);
    }
  };

  const handleIntensityChange = (area: string, intensity: number) => {
    const updatedAreas = painAreas.map(pa => 
      pa.area === area ? { ...pa, intensity } : pa
    );
    setPainAreas(updatedAreas);
    onPainAreasChange(updatedAreas);
  };

  const handleDescriptionChange = (area: string, description: string) => {
    const updatedAreas = painAreas.map(pa => 
      pa.area === area ? { ...pa, description } : pa
    );
    setPainAreas(updatedAreas);
    onPainAreasChange(updatedAreas);
  };

  return (
    <div className="space-y-4 border-2 border-indigo-100 rounded-lg p-6 bg-indigo-50">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <span className="text-indigo-600 mr-2">🎯</span>
        Select Pain Areas (Optional)
      </h3>
      <p className="text-sm text-gray-600">This helps us focus on your specific needs</p>
      
      <div className="grid grid-cols-2 gap-3">
        {painAreaOptions.map((area) => {
          const isSelected = painAreas.some(pa => pa.area === area);
          const painArea = painAreas.find(pa => pa.area === area);
          
          return (
            <div key={area} className="space-y-2">
              <label className="flex items-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors bg-white">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handlePainAreaToggle(area)}
                  className="w-5 h-5 text-indigo-600 bg-white border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 mr-3"
                  style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                />
                <span className="text-sm font-medium text-gray-900">{area}</span>
              </label>
              
              {isSelected && painArea && (
                <div className="ml-6 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Pain Intensity (1-5)</label>
                    <select
                      value={painArea.intensity}
                      onChange={(e) => handleIntensityChange(area, parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>
                          {level} - {level === 1 ? 'Mild' : level === 2 ? 'Slight' : level === 3 ? 'Moderate' : level === 4 ? 'Severe' : 'Very Severe'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Description (Optional)</label>
                    <textarea
                      value={painArea.description || ''}
                      onChange={(e) => handleDescriptionChange(area, e.target.value)}
                      placeholder="Describe the pain..."
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      rows={2}
                      style={{ display: 'block', visibility: 'visible', opacity: 1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PainAreaSelector; 