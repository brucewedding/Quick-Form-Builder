import React, { useState } from 'react';

const solidColorSchemes = {
  blue: {
    selected: 'bg-blue-500 border-blue-600',
    hover: 'hover:border-blue-400',
    text: 'text-blue-600'
  },
  green: {
    selected: 'bg-green-500 border-green-600',
    hover: 'hover:border-green-400',
    text: 'text-green-600'
  },
  purple: {
    selected: 'bg-purple-500 border-purple-600',
    hover: 'hover:border-purple-400',
    text: 'text-purple-600'
  },
  red: {
    selected: 'bg-red-500 border-red-600',
    hover: 'hover:border-red-400',
    text: 'text-red-600'
  },
  amber: {
    selected: 'bg-amber-500 border-amber-600',
    hover: 'hover:border-amber-400',
    text: 'text-amber-600'
  }
};

const gradientColorSchemes = {
  severity: {
    colors: ['green', 'yellow', 'red'],
    labels: {
      start: { color: 'text-green-600', hover: 'hover:border-green-400' },
      middle: { color: 'text-yellow-600', hover: 'hover:border-yellow-400' },
      end: { color: 'text-red-600', hover: 'hover:border-red-400' }
    }
  },
  satisfaction: {
    colors: ['red', 'yellow', 'green'],
    labels: {
      start: { color: 'text-red-600', hover: 'hover:border-red-400' },
      middle: { color: 'text-yellow-600', hover: 'hover:border-yellow-400' },
      end: { color: 'text-green-600', hover: 'hover:border-green-400' }
    }
  },
  temperature: {
    colors: ['blue', 'green', 'red'],
    labels: {
      start: { color: 'text-blue-600', hover: 'hover:border-blue-400' },
      middle: { color: 'text-green-600', hover: 'hover:border-green-400' },
      end: { color: 'text-red-600', hover: 'hover:border-red-400' }
    }
  }
};

const getColorForValue = (value, minValue, maxValue, gradientScheme) => {
  const position = (value - minValue) / (maxValue - minValue);
  const colors = gradientColorSchemes[gradientScheme]?.colors;
  
  if (!colors) return null;

  if (position <= 0.33) {
    return {
      selected: `bg-${colors[0]}-500 border-${colors[0]}-600`,
      hover: `hover:border-${colors[0]}-400`
    };
  } else if (position <= 0.66) {
    return {
      selected: `bg-${colors[1]}-500 border-${colors[1]}-600`,
      hover: `hover:border-${colors[1]}-400`
    };
  } else {
    return {
      selected: `bg-${colors[2]}-500 border-${colors[2]}-600`,
      hover: `hover:border-${colors[2]}-400`
    };
  }
};

const OneToTen = ({ 
  question = "Rate your pain level",
  minLabel = "Mild",
  midLabel = "Moderate",
  maxLabel = "Severe",
  minValue = 0,
  maxValue = 10,
  defaultValue = null,
  colorScheme = 'blue',
  gradientScheme = null,
  onChange = (value) => console.log('Selected value:', value)
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [hoveredValue, setHoveredValue] = useState(null);
  
  const useGradient = gradientScheme && gradientColorSchemes[gradientScheme];
  const gradientLabels = useGradient ? gradientColorSchemes[gradientScheme].labels : null;
  const solidColors = solidColorSchemes[colorScheme] || solidColorSchemes.blue;
  
  // Calculate the range of values
  const values = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => i + minValue
  );
  
  const handleSelection = (value) => {
    setSelectedValue(value);
    onChange(value);
  };

  const getButtonColors = (value) => {
    if (useGradient) {
      return getColorForValue(value, minValue, maxValue, gradientScheme);
    }
    return {
      selected: solidColors.selected,
      hover: solidColors.hover
    };
  };

  const getLabelColor = (position) => {
    if (!useGradient) return solidColors.text;
    
    switch(position) {
      case 'start': return gradientLabels.start.color;
      case 'middle': return gradientLabels.middle.color;
      case 'end': return gradientLabels.end.color;
      default: return solidColors.text;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Question Label */}
      <div className="text-center mb-6 transform transition-all duration-300 ease-in-out">
        <h3 className={`text-lg font-medium ${getLabelColor('middle')}`}>{question}</h3>
      </div>
      
      {/* Radio Button Group */}
      <div className="flex justify-between items-center mb-4">
        {values.map((value) => {
          const colors = getButtonColors(value);
          return (
            <div 
              key={value} 
              className="flex flex-col items-center"
              onMouseEnter={() => setHoveredValue(value)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <button
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                  transform transition-all duration-200 ease-in-out
                  ${selectedValue === value 
                    ? `${colors.selected} text-white scale-110` 
                    : `bg-white ${colors.hover}`}
                  ${hoveredValue === value ? 'scale-105' : ''}
                  ${hoveredValue !== null && hoveredValue !== value ? 'opacity-50' : 'opacity-100'}
                `}
                onClick={() => handleSelection(value)}
                aria-label={`Select ${value}`}
              >
                <span className="text-sm font-medium">{value}</span>
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Label Row */}
      <div className="flex justify-between px-4 transition-opacity duration-300">
        <span className={`text-sm ${getLabelColor('start')} transform transition-all duration-300
          ${hoveredValue !== null && hoveredValue <= minValue + (maxValue - minValue) / 3 ? 'scale-110 font-medium' : ''}`}>
          {minLabel}
        </span>
        <span className={`text-sm ${getLabelColor('middle')} transform transition-all duration-300
          ${hoveredValue !== null && hoveredValue > minValue + (maxValue - minValue) / 3 && hoveredValue < maxValue - (maxValue - minValue) / 3 ? 'scale-110 font-medium' : ''}`}>
          {midLabel}
        </span>
        <span className={`text-sm ${getLabelColor('end')} transform transition-all duration-300
          ${hoveredValue !== null && hoveredValue >= maxValue - (maxValue - minValue) / 3 ? 'scale-110 font-medium' : ''}`}>
          {maxLabel}
        </span>
      </div>
    </div>
  );
};

export default OneToTen;