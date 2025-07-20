import React, { useState } from 'react';
import { Plus, Trash2, Save, Download } from 'lucide-react';

interface RankingRule {
  Data: Array<{
    if: any[];
    get: Array<{
      field_key: string;
      step_name: string;
      course?: string;
    }>;
  }>;
  scoreMethod?: Array<{
    value: string | number;
    operation: string;
  }>;
  assignMethod?: Array<{
    value: number;
    option: string | string[];
  }>;
}

interface RankingBuilderProps {
  config?: any;
  onRankingChange: (ranking: any) => void;
}

const RankingBuilder: React.FC<RankingBuilderProps> = ({ 
  config, 
  onRankingChange 
}) => {
  // Use config to prevent TypeScript warning
  React.useEffect(() => {
    if (config) {
      console.log('Config available for ranking builder:', config);
    }
  }, [config]);
  const [ranking, setRanking] = useState({
    rules: [] as RankingRule[],
    Selection: [{
      quantity: { sortOrder: "Ascending" },
      sortMethod: [{
        Data: [{ if: [], get: [{ field_key: "submittedDate", step_name: "application info step" }] }],
        sortOrder: "Ascending"
      }]
    }],
    scoreMethod: [{ value: "Addition", operation: "many2one", dropEmptyRow: "all" }]
  });

  const operations = [
    { value: 'Percentile', label: 'Percentile' },
    { value: 'Multiplication', label: 'Multiplication' },
    { value: 'Addition', label: 'Addition' },
    { value: 'Subtraction', label: 'Subtraction' },
    { value: 'Division', label: 'Division' },
    { value: 'Inverse', label: 'Inverse' }
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
    const newRule: RankingRule = {
      Data: [{ if: [], get: [{ field_key: '', step_name: 'personal info step' }] }],
      scoreMethod: [{ value: 'Addition', operation: 'many2one' }]
    };
    
    const updatedRules = [...ranking.rules, newRule];
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const removeRule = (index: number) => {
    const updatedRules = ranking.rules.filter((_, i) => i !== index);
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const updateRule = (index: number, field: string, value: any) => {
    const updatedRules = ranking.rules.map((rule, i) => 
      i === index ? { ...rule, [field]: value } : rule
    );
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const updateRuleData = (ruleIndex: number, dataIndex: number, field: string, value: any) => {
    const updatedRules = ranking.rules.map((rule, i) => {
      if (i === ruleIndex) {
        const updatedData = rule.Data.map((data, j) => {
          if (j === dataIndex) {
            return { ...data, get: [{ ...data.get[0], [field]: value }] };
          }
          return data;
        });
        return { ...rule, Data: updatedData };
      }
      return rule;
    });
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const toggleRuleType = (index: number, type: 'scoreMethod' | 'assignMethod') => {
    const updatedRules = ranking.rules.map((rule, i) => {
      if (i === index) {
        const newRule = { ...rule };
        if (type === 'scoreMethod') {
          delete newRule.assignMethod;
          newRule.scoreMethod = [{ value: 'Addition', operation: 'many2one' }];
        } else {
          delete newRule.scoreMethod;
          newRule.assignMethod = [
            { value: 0, option: 'default' },
            { value: 0, option: 'isEmpty' }
          ];
        }
        return newRule;
      }
      return rule;
    });
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const addAssignMethod = (ruleIndex: number) => {
    const updatedRules = ranking.rules.map((rule, i) => {
      if (i === ruleIndex && rule.assignMethod) {
        return {
          ...rule,
          assignMethod: [...rule.assignMethod, { value: 0, option: '' }]
        };
      }
      return rule;
    });
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const removeAssignMethod = (ruleIndex: number, assignIndex: number) => {
    const updatedRules = ranking.rules.map((rule, i) => {
      if (i === ruleIndex && rule.assignMethod) {
        return {
          ...rule,
          assignMethod: rule.assignMethod.filter((_, j) => j !== assignIndex)
        };
      }
      return rule;
    });
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const updateAssignMethod = (ruleIndex: number, assignIndex: number, field: string, value: any) => {
    const updatedRules = ranking.rules.map((rule, i) => {
      if (i === ruleIndex && rule.assignMethod) {
        const updatedAssignMethod = rule.assignMethod.map((assign, j) => 
          j === assignIndex ? { ...assign, [field]: value } : assign
        );
        return { ...rule, assignMethod: updatedAssignMethod };
      }
      return rule;
    });
    const updatedRanking = { ...ranking, rules: updatedRules };
    setRanking(updatedRanking);
    onRankingChange(updatedRanking);
  };

  const loadSampleRanking = () => {
    const sample = {
      rules: [
        {
          Data: [{ if: [], get: [{ field_key: "familyIncome", step_name: "personal info step" }] }],
          scoreMethod: [
            { value: "Inverse", operation: "Percentile" },
            { value: 30, operation: "Multiplication" }
          ]
        },
        {
          Data: [{ if: [], get: [{ field_key: "gender", step_name: "personal info step" }] }],
          assignMethod: [
            { value: 0, option: "default" },
            { value: 0, option: "isEmpty" },
            { value: 10, option: "Female" },
            { value: 15, option: "Third/Transgender" }
          ]
        }
      ],
      Selection: [{
        quantity: { sortOrder: "Ascending" },
        sortMethod: [{
          Data: [{ if: [], get: [{ field_key: "submittedDate", step_name: "application info step" }] }],
          sortOrder: "Ascending"
        }]
      }],
      scoreMethod: [{ value: "Addition", operation: "many2one", dropEmptyRow: "all" }]
    };
    
    setRanking(sample);
    onRankingChange(sample);
  };

  const exportRanking = () => {
    const blob = new Blob([JSON.stringify(ranking, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ranking-query.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="font-medium text-purple-800 mb-2">Ranking Query Builder</h3>
        <p className="text-sm text-purple-700">
          Define ranking criteria and scoring methods to rank qualified candidates.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={loadSampleRanking}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Save size={16} />
          Load Sample
        </button>
        <button
          onClick={exportRanking}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
        >
          <Download size={16} />
          Export JSON
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Ranking Rules</h4>
          <button
            onClick={addRule}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Rule
          </button>
        </div>

        {ranking.rules.map((rule, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-700">Rule {index + 1}</h5>
              <button
                onClick={() => removeRule(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Key
                </label>
                <input
                  type="text"
                  value={rule.Data[0]?.get[0]?.field_key || ''}
                  onChange={(e) => updateRuleData(index, 0, 'field_key', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., familyIncome"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step Name
                </label>
                <select
                  value={rule.Data[0]?.get[0]?.step_name || 'personal info step'}
                  onChange={(e) => updateRuleData(index, 0, 'step_name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stepNames.map(step => (
                    <option key={step} value={step}>{step}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => toggleRuleType(index, 'scoreMethod')}
                className={`px-3 py-1 rounded-md text-sm ${
                  rule.scoreMethod ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Score Method
              </button>
              <button
                onClick={() => toggleRuleType(index, 'assignMethod')}
                className={`px-3 py-1 rounded-md text-sm ${
                  rule.assignMethod ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Assign Method
              </button>
            </div>

            {rule.scoreMethod && (
              <div className="space-y-2">
                <h6 className="font-medium text-gray-700">Score Method</h6>
                {rule.scoreMethod.map((score, scoreIndex) => (
                  <div key={scoreIndex} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={score.value}
                        onChange={(e) => {
                          const newScoreMethod = rule.scoreMethod!.map((s, i) => 
                            i === scoreIndex ? { ...s, value: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) } : s
                          );
                          updateRule(index, 'scoreMethod', newScoreMethod);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operation
                      </label>
                      <select
                        value={score.operation}
                        onChange={(e) => {
                          const newScoreMethod = rule.scoreMethod!.map((s, i) => 
                            i === scoreIndex ? { ...s, operation: e.target.value } : s
                          );
                          updateRule(index, 'scoreMethod', newScoreMethod);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {operations.map(op => (
                          <option key={op.value} value={op.value}>{op.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {rule.assignMethod && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h6 className="font-medium text-gray-700">Assign Method</h6>
                  <button
                    onClick={() => addAssignMethod(index)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                {rule.assignMethod.map((assign, assignIndex) => (
                  <div key={assignIndex} className="grid grid-cols-6 gap-4 items-end">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value
                      </label>
                      <input
                        type="number"
                        value={assign.value}
                        onChange={(e) => updateAssignMethod(index, assignIndex, 'value', Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(assign.option) ? assign.option.join(', ') : assign.option}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedOption = value.includes(',') 
                            ? value.split(',').map(v => v.trim())
                            : value;
                          updateAssignMethod(index, assignIndex, 'option', parsedOption);
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="option or option1, option2, ..."
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeAssignMethod(index, assignIndex)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingBuilder;