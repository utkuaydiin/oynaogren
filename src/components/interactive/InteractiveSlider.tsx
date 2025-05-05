
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';

interface InteractiveSliderProps {
  id: string;
  label: string;
  description: string;
  min: number;
  max: number;
  defaultValue: number;
  feedback: {[key: string]: string};
  onValueChange?: (value: number) => void;
}

const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  id,
  label,
  description,
  min,
  max,
  defaultValue,
  feedback,
  onValueChange
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const [currentFeedback, setCurrentFeedback] = useState<string>("");
  
  // Değere göre hangi geri bildirimin gösterileceğini belirle
  useEffect(() => {
    // Değeri yüzdeliğe dönüştür
    const valuePercentage = Math.round(((value - min) / (max - min)) * 100);
    
    // Geri bildirim eşik değerlerini tanımla
    const thresholds = Object.keys(feedback).map(Number).sort((a, b) => a - b);
    
    // En yakın eşik değerini bul
    let closestThreshold = thresholds[0];
    for (const threshold of thresholds) {
      if (Math.abs(threshold - valuePercentage) < Math.abs(closestThreshold - valuePercentage)) {
        closestThreshold = threshold;
      }
    }
    
    setCurrentFeedback(feedback[closestThreshold]);
  }, [value, feedback, min, max]);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue[0]);
    if (onValueChange) {
      onValueChange(newValue[0]);
    }
  };
  
  return (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label htmlFor={id} className="text-base font-medium text-slate-900">
            {label}
          </label>
          <span className="text-sm font-medium text-slate-700">
            {value}
          </span>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      
      <Slider
        id={id}
        min={min}
        max={max}
        defaultValue={[defaultValue]}
        step={1}
        className="w-full"
        onValueChange={handleValueChange}
      />
      
      <div className="mt-3 p-3 bg-white border border-slate-200 rounded text-sm text-slate-700">
        {currentFeedback}
      </div>
    </div>
  );
};

export default InteractiveSlider;
