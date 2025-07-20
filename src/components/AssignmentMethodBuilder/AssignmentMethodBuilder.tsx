import React, { useState } from 'react';
import { AssignMethod } from '@/types';
import { X, Plus } from 'lucide-react';

interface AssignmentMethodBuilderProps {
  assignMethods: AssignMethod[];
  onChange: (assignMethods: AssignMethod[]) => void;
}

const AssignmentMethodBuilder: React.FC<AssignmentMethodBuilderProps> = ({ assignMethods, onChange }) => {
  const [value, setValue] = useState<string>('0');
  const [option, setOption] = useState<string>('default');
  const [optionType, setOptionType] = useState<'single' | 'multiple'>('single');
  const [multipleOptions, setMultipleOptions] = useState<string>('');

  const addAssignMethod = () => {
    if (!value) return;

    const newAssignMethod: AssignMethod = {
      value: Number(value),
      option: optionType === 'multiple' 
        ? multipleOptions.split(',').map(opt => opt.trim()).filter(opt => opt)
        : option
    };

    onChange([...assignMethods, newAssignMethod]);
    setValue('0');
    setOption('default');
    setOptionType('single');
    setMultipleOptions('');
  };

  const removeAssignMethod = (index: number) => {
    onChange(assignMethods.filter((_, i) => i !== index));
  };

  const updateAssignMethod = (index: number, field: keyof AssignMethod, newValue: any) => {
    const updatedMethods = assignMethods.map((method, i) => {
      if (i === index) {
        return { ...method, [field]: newValue };
      }
      return method;
    });
    onChange(updatedMethods);
  };

  const getOptionDisplay = (option: string | string[]): string => {
    if (Array.isArray(option)) {
      return option.join(', ');
    }
    return option;
  };

  const predefinedOptions = [
    'default',
    'isEmpty',
    'Orphan',
    'Single Parent',
    'Disabled',
    'Below Poverty Line',
    'Rural',
    'Urban',
    'General',
    'OBC',
    'SC',
    'ST'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Assignment Methods</h3>
        <span className="text-sm text-gray-500">Assign values based on options</span>
      </div>

      {assignMethods.map((method, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Assignment {index + 1}</span>
            <button
              onClick={() => removeAssignMethod(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="number"
                value={method.value}
                onChange={(e) => updateAssignMethod(index, 'value', Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Option</label>
              {Array.isArray(method.option) ? (
                <input
                  type="text"
                  value={method.option.join(', ')}
                  onChange={(e) => {
                    const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt);
                    updateAssignMethod(index, 'option', options);
                  }}
                  placeholder="option1, option2, option3..."
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                <select
                  value={method.option}
                  onChange={(e) => updateAssignMethod(index, 'option', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {predefinedOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <strong>Preview:</strong> Value: {method.value}, Option: {getOptionDisplay(method.option)}
          </div>
        </div>
      ))}

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <Plus size={16} />
          <span className="font-medium">Add New Assignment</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter numeric value (e.g., 15)"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Option Type</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="optionType"
                  value="single"
                  checked={optionType === 'single'}
                  onChange={(e) => setOptionType(e.target.value as 'single' | 'multiple')}
                  className="mr-2"
                />
                Single Option
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="optionType"
                  value="multiple"
                  checked={optionType === 'multiple'}
                  onChange={(e) => setOptionType(e.target.value as 'single' | 'multiple')}
                  className="mr-2"
                />
                Multiple Options
              </label>
            </div>
          </div>

          {optionType === 'single' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Option</label>
              <select
                value={option}
                onChange={(e) => setOption(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {predefinedOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Multiple Options</label>
              <input
                type="text"
                value={multipleOptions}
                onChange={(e) => setMultipleOptions(e.target.value)}
                placeholder="5, 10, 15, 20, 25..."
                className="w-full p-2 border rounded-md"
              />
              <div className="text-sm text-gray-500 mt-1">
                Separate options with commas
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-2 rounded text-sm">
            <strong>Preview:</strong> Value: {value}, Option: {
              optionType === 'multiple' 
                ? multipleOptions.split(',').map(opt => opt.trim()).filter(opt => opt).join(', ')
                : option
            }
          </div>
        </div>

        <button
          onClick={addAssignMethod}
          disabled={!value || (optionType === 'multiple' && !multipleOptions.trim())}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300"
        >
          Add Assignment
        </button>
      </div>

      {assignMethods.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-medium mb-2">Common Assignment Patterns:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Default:</strong> Base value when no specific condition is met</li>
            <li><strong>isEmpty:</strong> Value when field is empty or null</li>
            <li><strong>Specific Values:</strong> Values for categorical data (e.g., Orphan, Single Parent)</li>
            <li><strong>Range Values:</strong> Values for numeric ranges (e.g., disability percentages)</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssignmentMethodBuilder;