// src/components/InverseFunctionCalculator.tsx

import React, { useState } from 'react';

const InverseFunctionCalculator: React.FC = () => {
  const [functionInput, setFunctionInput] = useState<string>('');
  const [inverseOutput, setInverseOutput] = useState<string>('');

  const handleCalculateInverse = () => {
    try {
      // Simple parser for linear functions of the form y = mx + b
      const match = functionInput.match(/y\s*=\s*([+-]?\d*\.?\d*)x\s*([+-]\s*\d+\.?\d*)?/i);
      if (!match) {
        setInverseOutput('Please enter a linear function in the form y = mx + b');
        return;
      }

      let m = parseFloat(match[1]);
      let b = match[2] ? parseFloat(match[2].replace(/\s+/g, '')) : 0;

      if (m === 0) {
        setInverseOutput('The function is not invertible (m cannot be zero).');
        return;
      }

      // Inverse of y = mx + b is x = (y - b)/m
      let inverseM = 1 / m;
      let inverseB = -b / m;

      // Formatting the inverse function
      let inverseFunction = 'y = ';
      if (inverseM !== 1) inverseFunction += `${inverseM}x `;
      else inverseFunction += 'x ';
      inverseFunction += inverseB >= 0 ? `+ ${inverseB}` : `- ${Math.abs(inverseB)}`;

      setInverseOutput(inverseFunction);
    } catch (error) {
      setInverseOutput('An error occurred while calculating the inverse.');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Inverse Function Calculator</h2>
      <div>
        <label htmlFor="functionInput">Enter a linear function (e.g., y = 2x + 3):</label>
        <br />
        <input
          type="text"
          id="functionInput"
          value={functionInput}
          onChange={(e) => setFunctionInput(e.target.value)}
          style={{ width: '300px', padding: '5px', marginTop: '5px' }}
          placeholder="y = mx + b"
        />
      </div>
      <button onClick={handleCalculateInverse} style={{ marginTop: '10px', padding: '5px 10px' }}>
        Calculate Inverse
      </button>
      {inverseOutput && (
        <div style={{ marginTop: '15px' }}>
          <strong>Inverse Function:</strong> {inverseOutput}
        </div>
      )}
    </div>
  );
};

export default InverseFunctionCalculator;
