import React from 'react';
import { ScoreMethod } from '@/types';
import OperationSelector from '../RuleBuilder/OperationSelector';

interface ScoreMethodBuilderProps {
  scoreMethods: ScoreMethod[];
  onChange: (scoreMethods: ScoreMethod[]) => void;
  title?: string;
  showDropEmptyRow?: boolean;
}

const ScoreMethodBuilder: React.FC<ScoreMethodBuilderProps> = ({ 
  scoreMethods, 
  onChange, 
  title = "Score Methods",
  showDropEmptyRow = false
}) => {
  return (
    <div className="space-y-4">
      <OperationSelector 
        scoreMethods={scoreMethods}
        onChange={onChange}
        title={title}
        showDropEmptyRow={showDropEmptyRow}
      />
      
      {scoreMethods.length > 0 && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h4 className="font-medium mb-2">Score Method Guidelines:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Addition:</strong> Adds numeric values together</li>
            <li><strong>Multiplication:</strong> Multiplies the score by the specified value</li>
            <li><strong>Percentile:</strong> Converts to percentile ranking (use "Inverse" for inverse percentile)</li>
            <li><strong>Many2One:</strong> Combines multiple values into one using specified method</li>
            <li><strong>None:</strong> No scoring applied, passes through original values</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreMethodBuilder;