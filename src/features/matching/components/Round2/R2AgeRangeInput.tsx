import React from 'react';
import { R2AgeRangeSlider } from './R2AgeRangeSlider';

export const R2AgeRangeInput = ({ value, onChange, onNext, onBack }) => (
  <R2AgeRangeSlider 
    value={value} 
    onChange={onChange} 
    onNext={onNext} 
    onBack={onBack} 
  />
);
