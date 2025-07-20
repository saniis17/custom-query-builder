import React, { useState } from 'react';
import { Plus, Trash2, Save, Download } from 'lucide-react';

interface EligibilityRule {
  step_name: string;
  field_key: string;
  operator: string;
  value: any;
  course?: string[];
}

interface EligibilityBuilderProps {
  config?: any;
  onEligibilityChange: (eligibility: any) => void;
}

const EligibilityBuilder: React.FC<EligibilityBuilderProps> = ({ 
  config, 
  onEligibilityChange 
}) => {
  // Use config to prevent TypeScript warning
  React.useEffect(() => {
    if (config) {
      console.log('Config available for eligibility builder:', config);
    }
  }, [config]);
  const [eligibility, setEligibility] = useState({
    sign: "None",
    condition: "AND",
    rules: [] as EligibilityRule[],
    createNewFields: null as any
  });

  const operators = [
    { value: 'in', label: 'In' },
    { value: 'between', label: 'Between' },
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'not_in', label: 'Not In' }
  ];

  const stepNames = [
    'personal info step',
    'education info step',
    'family info step',
    'references step',
    'bank details step',
    'questions',
    'application info step'
  ];

  const addRule = () => {
    const newRule: EligibilityRule = {
      step_name: 'personal info step',
      field_key: '',
      operator: 'in',
      value: []
    };
    
    const updatedRules = [...eligibility.rules, newRule];
    const updatedEligibility = { ...eligibility, rules: updatedRules };
    setEligibility(updatedEligibility);
    onEligibilityChange(updatedEligibility);
  };

  const removeRule = (index: number) => {
    const updatedRules = eligibility.rules.filter((_, i) => i !== index);
    const updatedEligibility = { ...eligibility, rules: updatedRules };
    setEligibility(updatedEligibility);
    onEligibilityChange(updatedEligibility);
  };

  const updateRule = (index: number, field: string, value: any) => {
    const updatedRules = eligibility.rules.map((rule, i) => 
      i === index ? { ...rule, [field]: value } : rule
    );
    const updatedEligibility = { ...eligibility, rules: updatedRules };
    setEligibility(updatedEligibility);
    onEligibilityChange(updatedEligibility);
  };

  const handleValueChange = (index: number, value: string) => {
    const rule = eligibility.rules[index];
    let parsedValue;
    
    if (rule.operator === 'between') {
      // Parse comma-separated values for between operator
      const values = value.split(',').map(v => {
        const trimmed = v.trim();
        return isNaN(Number(trimmed)) ? trimmed : Number(trimmed);
      });
      parsedValue = values.length === 2 ? values : [0, 100];
    } else if (rule.operator === 'in' || rule.operator === 'not_in') {
      // Parse comma-separated values for in/not_in operators
      parsedValue = value.split(',').map(v => v.trim()).filter(v => v);
    } else {
      // Single value for other operators
      parsedValue = isNaN(Number(value)) ? value : Number(value);
    }
    
    updateRule(index, 'value', parsedValue);
  };

  const loadSampleEligibility = () => {
    const sample = {
      sign: "None",
      condition: "AND",
      rules: [
        {
          step_name: "personal info step",
          field_key: "familyIncome",
          operator: "between",
          value: [0, 500000]
        },
        {
          step_name: "personal info step",
          field_key: "gender",
          operator: "in",
          value: ["Female"]
        },
        {
          step_name: "education info step",
          field_key: "present_class",
          operator: "in",
          value: ["Graduation"]
        }
      ],
      createNewFields: {
        step_name: "personal info step",
        new_field_key: "age",
        rqdFieldkeys: [{"step_name": "personal info step", "field_key": ["dob"]}],
        ReferenceValue: "2024-09-11"
      }
    };
    
    setEligibility(sample);
    onEligibilityChange(sample);
  };

  const exportEligibility = () => {
    const blob = new Blob([JSON.stringify(eligibility, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eligibility-query.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-800 mb-2">Eligibility Query Builder</h3>
        <p className="text-sm text-green-700">
          Define eligibility criteria that candidates must meet to qualify for the scholarship.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={loadSampleEligibility}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Save size={16} />
          Load Sample
        </button>
        <button
          onClick={exportEligibility}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Download size={16} />
          Export JSON
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sign
            </label>
            <select
              value={eligibility.sign}
              onChange={(e) => {
                const updated = { ...eligibility, sign: e.target.value };
                setEligibility(updated);
                onEligibilityChange(updated);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="None">None</option>
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Condition
            </label>
            <select
              value={eligibility.condition}
              onChange={(e) => {
                const updated = { ...eligibility, condition: e.target.value };
                setEligibility(updated);
                onEligibilityChange(updated);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Eligibility Rules</h4>
            <button
              onClick={addRule}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Rule
            </button>
          </div>

          {eligibility.rules.map((rule, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Step Name
                  </label>
                  <select
                    value={rule.step_name}
                    onChange={(e) => updateRule(index, 'step_name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {stepNames.map(step => (
                      <option key={step} value={step}>{step}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Key
                  </label>
                  <input
                    type="text"
                    value={rule.field_key}
                    onChange={(e) => updateRule(index, 'field_key', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., familyIncome"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operator
                  </label>
                  <select
                    value={rule.operator}
                    onChange={(e) => updateRule(index, 'operator', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(rule.value) ? rule.value.join(', ') : rule.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={rule.operator === 'between' ? 'min, max' : 'value1, value2, ...'}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course (optional)
                  </label>
                  <input
                    type="text"
                    value={rule.course ? rule.course.join(', ') : ''}
                    onChange={(e) => updateRule(index, 'course', e.target.value ? e.target.value.split(',').map(v => v.trim()) : undefined)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Class 12, Graduation"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeRule(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EligibilityBuilder;