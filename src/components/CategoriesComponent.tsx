// src/components/CategoriesComponent.tsx
import React from 'react';

interface CategoriesComponentProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
  themaFarbe?: string;
}

const CategoriesComponent: React.FC<CategoriesComponentProps> = ({
  categories,
  selectedCategory,
  onSelect,
  themaFarbe = '#111111',
}) => {
  if (!categories.length) return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ position: 'relative' }}>
        <select
          value={selectedCategory}
          onChange={(e: any) => onSelect(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 36px 10px 14px',
            fontSize: 15,
            fontWeight: 500,
            borderRadius: 10,
            border: `1.5px solid ${themaFarbe}`,
            background: 'white',
            color: selectedCategory === '' ? '#888' : '#111',
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Alle Abteilungen</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* Pfeil-Icon */}
        <div
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            width: 0,
            height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: `6px solid ${themaFarbe}`,
          }}
        />
      </div>
    </div>
  );
};

export default CategoriesComponent;
