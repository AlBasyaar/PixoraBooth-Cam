import React from 'react';
import { Sliders, Clock, Zap, Grid } from 'lucide-react';

interface SettingsPanelProps {
  settings: {
    resolution: string;
    timer: number;
    flash: boolean;
    gridLines: boolean;
  };
  onUpdateSettings: (settings: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings }) => {
  const handleResolutionChange = (resolution: string) => {
    onUpdateSettings({ ...settings, resolution });
  };
  
  const handleTimerChange = (timer: number) => {
    onUpdateSettings({ ...settings, timer });
  };
  
  const handleFlashToggle = () => {
    onUpdateSettings({ ...settings, flash: !settings.flash });
  };
  
  const handleGridLinesToggle = () => {
    onUpdateSettings({ ...settings, gridLines: !settings.gridLines });
  };
  
  return (
    <div className="h-full bg-gray-800 p-6 overflow-y-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-8">
          <Sliders size={24} className="text-blue-400 mr-3" />
          <h2 className="text-2xl font-bold text-white">Camera Settings</h2>
        </div>
        
        <div className="space-y-8">
          {/* Resolution Setting */}
          <div className="bg-gray-700 rounded-lg p-5">
            <h3 className="text-lg font-medium text-white mb-4">Resolution</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleResolutionChange('standard')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  settings.resolution === 'standard' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                Standard (640×480)
              </button>
              <button 
                onClick={() => handleResolutionChange('hd')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  settings.resolution === 'hd' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                HD (1280×720)
              </button>
            </div>
          </div>
          
          {/* Timer Setting */}
          <div className="bg-gray-700 rounded-lg p-5">
            <div className="flex items-center mb-4">
              <Clock size={18} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Countdown Timer</h3>
            </div>
            <div className="flex space-x-3">
              {[0, 3, 5, 10].map(seconds => (
                <button 
                  key={seconds}
                  onClick={() => handleTimerChange(seconds)}
                  className={`py-2 px-4 rounded-lg font-medium flex-1 transition-all ${
                    settings.timer === seconds 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {seconds === 0 ? 'Off' : `${seconds}s`}
                </button>
              ))}
            </div>
          </div>
          
          {/* Toggle Settings */}
          <div className="space-y-4">
            <ToggleSetting 
              icon={<Zap size={18} className="text-yellow-400" />}
              label="Flash Effect" 
              description="Add a flash effect when taking photos"
              isEnabled={settings.flash}
              onToggle={handleFlashToggle}
            />
            
            <ToggleSetting 
              icon={<Grid size={18} className="text-blue-400" />}
              label="Grid Lines" 
              description="Show composition grid lines on camera"
              isEnabled={settings.gridLines}
              onToggle={handleGridLinesToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToggleSettingProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({ 
  icon, 
  label, 
  description, 
  isEnabled, 
  onToggle 
}) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="bg-gray-600 p-2 rounded-full mr-3">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-white">{label}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative ${
          isEnabled ? 'bg-blue-500' : 'bg-gray-600'
        } transition-colors duration-200`}
      >
        <span 
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
            isEnabled ? 'left-7' : 'left-1'
          }`} 
        />
      </button>
    </div>
  );
};

export default SettingsPanel;