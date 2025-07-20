import React, { useState } from 'react';
import { ScoreMethod, OperationType } from '@/types';
import { X, Plus } from 'lucide-react';

interface OperationSelectorProps {
  scoreMethods: ScoreMethod[];
  onChange: (scoreMethods: ScoreMethod[]) => void;
  title?: string;
  showDropEmptyRow?: boolean;
}

const OperationSelector: React.FC<OperationSelectorProps> = ({ 
  scoreMethods, 
  onChange, 
  title = "Score Methods",
  showDropEmptyRow = false
}) => {
  const [operation, setOperation] = useState<OperationType>('Addition');
  const [value, setValue] = useState<string>('');
  const [dropEmptyRow, setDropEmptyRow] = useState<'all' | 'none'>('all');

  const addScoreMethod = () => {
    if (!value && operation !== 'None') return;

    const newScoreMethod: ScoreMethod = {
      value: getValueForOperation(operation, value),
      operation,
      ...(showDropEmptyRow && { dropEmptyRow })
    };

    onChange([...scoreMethods, newScoreMethod]);
    setValue('');
    setOperation('Addition');
  };

  const getValueForOperation = (op: OperationType, val: string): string | number => {
    switch (op) {
      case 'Percentile':
        return val === 'Inverse' || val === 'None' ? val : Number(val) || 0;
      case 'Multiplication':
      case 'Addition':
        return Number(val) || 0;
      case 'many2one':
        return val || 'Addition';
      case 'Inverse':
        return val || 'Inverse';
      case 'None':
        return 'None';
      default:
        return val;
    }
  };

  const removeScoreMethod = (index: number) => {
    onChange(scoreMethods.filter((_, i) => i !== index));
  };

  const updateScoreMethod = (index: number, field: keyof ScoreMethod, newValue: any) => {
    const updatedMethods = scoreMethods.map((method, i) => {
      if (i === index) {
        return { ...method, [field]: newValue };
      }
      return method;
    });
    onChange(updatedMethods);
  };

  const getPlaceholder = (op: OperationType): string => {
    switch (op) {
      case 'Percentile':
        return 'Enter "Inverse", "None", or a number';
      case 'Multiplication':
      case 'Addition':
        return 'Enter a number (e.g., 25)';
      case 'many2one':
        return 'Enter "Addition" or other method';
      case 'Inverse':
        return 'Enter "Inverse"';
      case 'None':
        return 'Value will be "None"';
      default:
        return 'Enter value';
    }
  };

  const isValueRequired = (op: OperationType): boolean => {
    return op !== 'None';
  };

  const getValueOptions = (op: OperationType): string[] => {
    switch (op) {
      case 'Percentile':
        return ['Inverse', 'None'];
      case 'many2one':
        return ['Addition'];
      case 'Inverse':
        return ['Inverse'];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-gray-500">Configure scoring operations</span>
      </div>

      {scoreMethods.map((method, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Operation {index + 1}</span>
            <button
              onClick={() => removeScoreMethod(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Operation</label>
              <select
                value={method.operation}
                onChange={(e) => updateScoreMethod(index, 'operation', e.target.value as OperationType)}
                className="w-full p-2 border rounded-md"
              >
                <option value="Addition">Addition</option>
                <option value="Multiplication">Multiplication</option>
                <option value="Percentile">Percentile</option>
                <option value="many2one">Many to One</option>
                <option value="Inverse">Inverse</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              {getValueOptions(method.operation).length > 0 ? (
                <select
                  value={method.value.toString()}
                  onChange={(e) => updateScoreMethod(index, 'value', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {getValueOptions(method.operation).map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={method.operation === 'Multiplication' || method.operation === 'Addition' ? 'number' : 'text'}
                  value={method.value.toString()}
                  onChange={(e) => updateScoreMethod(index, 'value', getValueForOperation(method.operation, e.target.value))}
                  placeholder={getPlaceholder(method.operation)}
                  className="w-full p-2 border rounded-md"
                  disabled={method.operation === 'None'}
                />
              )}
            </div>

            {showDropEmptyRow && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Drop Empty Rows</label>
                <select
                  value={method.dropEmptyRow || 'all'}
                  onChange={(e) => updateScoreMethod(index, 'dropEmptyRow', e.target.value as 'all' | 'none')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All</option>
                  <option value="none">None</option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <strong>Preview:</strong> {method.operation} → {method.value}
            {method.dropEmptyRow && ` (Drop empty: ${method.dropEmptyRow})`}
          </div>
        </div>
      ))}

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Plus size={16} />
          <span className="font-medium">Add New Operation</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Operation</label>
            <select
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value as OperationType);
                setValue('');
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="Addition">Addition</option>
              <option value="Multiplication">Multiplication</option>
              <option value="Percentile">Percentile</option>
              <option value="many2one">Many to One</option>
              <option value="Inverse">Inverse</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            {getValueOptions(operation).length > 0 ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select value...</option>
                {getValueOptions(operation).map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={operation === 'Multiplication' || operation === 'Addition' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getPlaceholder(operation)}
                className="w-full p-2 border rounded-md"
                disabled={operation === 'None'}
              />
            )}
          </div>

          {showDropEmptyRow && (
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Drop Empty Rows</label>
              <select
                value={dropEmptyRow}
                onChange={(e) => setDropEmptyRow(e.target.value as 'all' | 'none')}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">All</option>
                <option value="none">None</option>
              </select>
            </div>
          )}
        </div>

        {operation && (isValueRequired(operation) ? value : true) && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <strong>Preview:</strong> {operation} → {getValueForOperation(operation, value)}
            {showDropEmptyRow && ` (Drop empty: ${dropEmptyRow})`}
          </div>
        )}

        <button
          onClick={addScoreMethod}
          disabled={isValueRequired(operation) && !value}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300"
        >
          Add Operation
        </button>
      </div>
    </div>
  );
};

export default OperationSelector;