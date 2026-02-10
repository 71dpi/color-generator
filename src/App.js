import React, { useState } from 'react';

export default function App() {
  const generateRandomHex = () => {
    const hex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return `#${hex}`;
  };

  const initialColor = generateRandomHex();
  const [color, setColor] = useState(initialColor);
  const [inputValue, setInputValue] = useState(initialColor);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showSliders, setShowSliders] = useState(false);

  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum;
  };

  const isLightColor = getLuminance(color) > 128;
  const contrastColor = isLightColor ? '#000000' : '#ffffff';

  const hexToRgb = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    return {
      r: (rgb >> 16) & 0xff,
      g: (rgb >> 8) & 0xff,
      b: (rgb >> 0) & 0xff,
    };
  };

  const rgbToHex = (r, g, b) => {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  };

  const isValidHex = (hex) => {
    const hexPattern = /^#?[A-Fa-f0-9]{6}$/;
    return hexPattern.test(hex);
  };

  const normalizeHex = (hex) => {
    hex = hex.replace('#', '');
    return `#${hex.toLowerCase()}`;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError('');

    if (isValidHex(value)) {
      const normalized = normalizeHex(value);
      setColor(normalized);
      setInputValue(normalized);
      setCopied(false);
    } else if (value.trim() !== '') {
      setError('Hex codes use # followed by exactly 6 characters (0-9, A-F). For example: #FF5733');
    }
  };

  const handleSliderChange = (channel, value) => {
    const rgb = hexToRgb(color);
    rgb[channel] = parseInt(value);
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor(newColor);
    setInputValue(newColor);
    setError('');
    setCopied(false);
  };

  const handleShuffle = () => {
    const newColor = generateRandomHex();
    setColor(newColor);
    setInputValue(newColor);
    setCopied(false);
    setError('');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ease-in-out relative"
      style={{ backgroundColor: color }}
    >
      <div className="flex flex-col items-center gap-8 animate-fadeIn w-full max-w-2xl px-4">
        <div className="flex flex-col items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="text-6xl md:text-8xl font-mono font-bold text-center tracking-wider bg-transparent border-none outline-none transition-colors duration-700 select-all px-4"
            style={{ 
              color: contrastColor,
              textShadow: `0 0 40px ${isLightColor ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'}`,
            }}
          />
          {error && (
            <p 
              className="text-sm max-w-md text-center px-4 py-2 rounded animate-fadeIn"
              style={{ 
                color: contrastColor,
                opacity: 0.8,
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-4 w-full max-w-sm px-4">
          <button
            onClick={handleShuffle}
            className="group relative px-6 py-3 font-semibold tracking-wide transition-all duration-300 overflow-hidden rounded-lg w-full md:w-auto"
            style={{ 
              color: contrastColor,
              border: `2px solid ${contrastColor}`,
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Shuffle
            </span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"
              style={{ backgroundColor: contrastColor }}
            />
          </button>

          <button
            onClick={() => setShowSliders(!showSliders)}
            className="group relative px-6 py-3 font-semibold tracking-wide transition-all duration-300 overflow-hidden rounded-lg w-full md:w-auto"
            style={{ 
              color: contrastColor,
              border: `2px solid ${contrastColor}`,
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {showSliders ? 'Hide' : 'Edit'}
            </span>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"
              style={{ backgroundColor: contrastColor }}
            />
          </button>

          <button
            onClick={handleCopy}
            className="group relative px-6 py-3 font-semibold tracking-wide transition-all duration-300 rounded-lg w-full md:w-auto"
            style={{ 
              backgroundColor: contrastColor,
              color: color,
            }}
          >
            <span className="flex items-center justify-center gap-2">
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </span>
          </button>
        </div>

        {showSliders && (
          <div className="flex flex-col gap-6 mt-8 w-full max-w-sm px-6 animate-fadeIn">
            {['r', 'g', 'b'].map((channel) => {
              const rgb = hexToRgb(color);
              const value = rgb[channel];
              const label = channel.toUpperCase();
              
              return (
                <div key={channel} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label 
                      className="font-mono font-semibold tracking-wider"
                      style={{ color: contrastColor }}
                    >
                      {label}
                    </label>
                    <span 
                      className="font-mono text-sm"
                      style={{ color: contrastColor, opacity: 0.7 }}
                    >
                      {value}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={value}
                    onChange={(e) => handleSliderChange(channel, e.target.value)}
                    className="slider w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        ${rgbToHex(
                          channel === 'r' ? 0 : rgb.r,
                          channel === 'g' ? 0 : rgb.g,
                          channel === 'b' ? 0 : rgb.b
                        )} 0%, 
                        ${rgbToHex(
                          channel === 'r' ? 255 : rgb.r,
                          channel === 'g' ? 255 : rgb.g,
                          channel === 'b' ? 255 : rgb.b
                        )} 100%)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <a
        href="https://71dpi.github.io/alex/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 text-xs tracking-wide transition-all duration-300 hover:tracking-widest hover:scale-105"
        style={{ 
          color: contrastColor,
          opacity: 0.5,
        }}
      >
        71dpi.github.io/alex
      </a>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        button {
          position: relative;
          transform-style: preserve-3d;
        }

        button:active {
          transform: scale(0.95);
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${contrastColor};
          cursor: pointer;
          border: 2px solid ${color};
          transition: transform 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${contrastColor};
          cursor: pointer;
          border: 2px solid ${color};
          transition: transform 0.2s;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}