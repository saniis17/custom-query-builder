import React, { useState } from 'react';
import { Condition, OperatorType, FieldOption } from '@/types';
import { useQueryStore } from '@/store/queryStore';
import { X, Plus } from 'lucide-react';

interface ConditionBuilderProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ conditions, onChange }) => {
  const { stepOptions } = useQueryStore();
  const [selectedStep, setSelectedStep] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [operator, setOperator] = useState<OperatorType>('in');
  const [value, setValue] = useState<string>('');

  const addCondition = () => {
    if (!selectedStep || !selectedField) return;

    const newCondition: Condition = {
      field_key: selectedField,
      step_name: selectedStep,
      operator,
      value: operator === 'in' ? [value] : value
    };

    onChange([...conditions, newCondition]);
    setSelectedStep('');
    setSelectedField('');
    setValue('');
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, field: keyof Condition, newValue: any) => {
    const updatedConditions = conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, [field]: newValue };
      }
      return condition;
    });
    onChange(updatedConditions);
  };

  const getFieldsForStep = (stepName: string): FieldOption[] => {
    const step = stepOptions.find(s => s.step_name === stepName);
    return step?.fields || [];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Conditions (If)</h3>
        <span className="text-sm text-gray-500">Filter data based on conditions</span>
      </div>

      {conditions.map((condition, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Condition {index + 1}</span>
            <button
              onClick={() => removeCondition(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Step</label>
              <select
                value={condition.step_name}
                onChange={(e) => updateCondition(index, 'step_name', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {stepOptions.map(step => (
                  <option key={step.step_name} value={step.step_name}>
                    {step.display_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Field</label>
              <select
                value={condition.field_key}
                onChange={(e) => updateCondition(index, 'field_key', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {getFieldsForStep(condition.step_name).map(field => (
                  <option key={field.field_key} value={field.field_key}>
                    {field.display_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Operator</label>
              <select
                value={condition.operator}
                onChange={(e) => updateCondition(index, 'operator', e.target.value as OperatorType)}
                className="w-full p-2 border rounded-md"
              >
                <option value="in">In</option>
                <option value="equals">Equals</option>
                <option value="not equals">Not Equals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              <input
                type="text"
                value={Array.isArray(condition.value) ? condition.value.join(', ') : condition.value}
                onChange={(e) => {
                  const newValue = condition.operator === 'in' 
                    ? e.target.value.split(',').map(v => v.trim())
                    : e.target.value;
                  updateCondition(index, 'value', newValue);
                }}
                placeholder={condition.operator === 'in' ? 'value1, value2, ...' : 'value'}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Plus size={16} />
          <span className="font-medium">Add New Condition</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Step</label>
            <select
              value={selectedStep}
              onChange={(e) => {
                setSelectedStep(e.target.value);
                setSelectedField('');
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select step...</option>
              {stepOptions.map(step => (
                <option key={step.step_name} value={step.step_name}>
                  {step.display_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Field</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!selectedStep}
            >
              <option value="">Select field...</option>
              {getFieldsForStep(selectedStep).map(field => (
                <option key={field.field_key} value={field.field_key}>
                  {field.display_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Operator</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value as OperatorType)}
              className="w-full p-2 border rounded-md"
            >
              <option value="in">In</option>
              <option value="equals">Equals</option>
              <option value="not equals">Not Equals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={operator === 'in' ? 'value1, value2, ...' : 'value'}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <button
          onClick={addCondition}
          disabled={!selectedStep || !selectedField || !value}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Add Condition
        </button>
      </div>
    </div>
  );
};

export default ConditionBuilder;