import React, { useState } from 'react';
import { Rule, DataBlock } from '@/types';
// import { useQueryStore } from '@/store/queryStore';
import { X, Plus, Settings } from 'lucide-react';
import ConditionBuilder from './ConditionBuilder';
import DataSelector from './DataSelector';
import ScoreMethodBuilder from '../ScoreMethodBuilder/ScoreMethodBuilder';
import AssignmentMethodBuilder from '../AssignmentMethodBuilder/AssignmentMethodBuilder';

interface RuleBuilderProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({ rules, onChange }) => {
  const [expandedRules, setExpandedRules] = useState<number[]>([]);

  const addRule = () => {
    const newRule: Rule = {
      Data: [{
        if: [],
        get: []
      }]
    };
    onChange([...rules, newRule]);
    setExpandedRules([...expandedRules, rules.length]);
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
    setExpandedRules(expandedRules.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  const updateRule = (index: number, updatedRule: Rule) => {
    const updatedRules = rules.map((rule, i) => i === index ? updatedRule : rule);
    onChange(updatedRules);
  };

  const toggleRuleExpansion = (index: number) => {
    setExpandedRules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const addDataBlock = (ruleIndex: number) => {
    const rule = rules[ruleIndex];
    const newDataBlock: DataBlock = {
      if: [],
      get: []
    };
    const updatedRule = {
      ...rule,
      Data: [...rule.Data, newDataBlock]
    };
    updateRule(ruleIndex, updatedRule);
  };

  const removeDataBlock = (ruleIndex: number, dataBlockIndex: number) => {
    const rule = rules[ruleIndex];
    const updatedRule = {
      ...rule,
      Data: rule.Data.filter((_, i) => i !== dataBlockIndex)
    };
    updateRule(ruleIndex, updatedRule);
  };

  const updateDataBlock = (ruleIndex: number, dataBlockIndex: number, updatedDataBlock: DataBlock) => {
    const rule = rules[ruleIndex];
    const updatedRule = {
      ...rule,
      Data: rule.Data.map((dataBlock, i) => i === dataBlockIndex ? updatedDataBlock : dataBlock)
    };
    updateRule(ruleIndex, updatedRule);
  };

  const getRuleTypeDisplay = (rule: Rule): string => {
    if (rule.scoreMethod && rule.scoreMethod.length > 0) {
      return 'Scoring Rule';
    }
    if (rule.assignMethod && rule.assignMethod.length > 0) {
      return 'Assignment Rule';
    }
    return 'Data Rule';
  };

  const getRuleIcon = (rule: Rule): React.ReactNode => {
    if (rule.scoreMethod && rule.scoreMethod.length > 0) {
      return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
    }
    if (rule.assignMethod && rule.assignMethod.length > 0) {
      return <div className="w-3 h-3 bg-orange-500 rounded-full"></div>;
    }
    return <div className="w-3 h-3 bg-gray-500 rounded-full"></div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Rules</h3>
          <span className="text-sm text-gray-500">Define data processing rules</span>
        </div>
        <button
          onClick={addRule}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Rule
        </button>
      </div>

      {rules.map((rule, ruleIndex) => (
        <div key={ruleIndex} className="bg-white border rounded-lg shadow-sm">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRuleIcon(rule)}
                <div>
                  <h4 className="font-medium">Rule {ruleIndex + 1}</h4>
                  <p className="text-sm text-gray-600">{getRuleTypeDisplay(rule)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleRuleExpansion(ruleIndex)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-1"
                >
                  <Settings size={14} />
                  {expandedRules.includes(ruleIndex) ? 'Collapse' : 'Expand'}
                </button>
                <button
                  onClick={() => removeRule(ruleIndex)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {expandedRules.includes(ruleIndex) && (
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Data Blocks</h5>
                  <button
                    onClick={() => addDataBlock(ruleIndex)}
                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Data Block
                  </button>
                </div>

                {rule.Data.map((dataBlock, dataBlockIndex) => (
                  <div key={dataBlockIndex} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <h6 className="font-medium">Data Block {dataBlockIndex + 1}</h6>
                      <button
                        onClick={() => removeDataBlock(ruleIndex, dataBlockIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <ConditionBuilder
                        conditions={dataBlock.if}
                        onChange={(conditions) => {
                          const updatedDataBlock = { ...dataBlock, if: conditions };
                          updateDataBlock(ruleIndex, dataBlockIndex, updatedDataBlock);
                        }}
                      />

                      <DataSelector
                        fields={dataBlock.get}
                        onChange={(fields) => {
                          const updatedDataBlock = { ...dataBlock, get: fields };
                          updateDataBlock(ruleIndex, dataBlockIndex, updatedDataBlock);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`scoreMethod-${ruleIndex}`}
                      checked={rule.scoreMethod !== undefined}
                      onChange={(e) => {
                        const updatedRule = { ...rule };
                        if (e.target.checked) {
                          updatedRule.scoreMethod = [];
                        } else {
                          delete updatedRule.scoreMethod;
                        }
                        updateRule(ruleIndex, updatedRule);
                      }}
                    />
                    <label htmlFor={`scoreMethod-${ruleIndex}`} className="text-sm font-medium">
                      Enable Score Methods
                    </label>
                  </div>

                  {rule.scoreMethod && (
                    <ScoreMethodBuilder
                      scoreMethods={rule.scoreMethod}
                      onChange={(scoreMethods) => {
                        const updatedRule = { ...rule, scoreMethod: scoreMethods };
                        updateRule(ruleIndex, updatedRule);
                      }}
                      title="Rule Score Methods"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`assignMethod-${ruleIndex}`}
                      checked={rule.assignMethod !== undefined}
                      onChange={(e) => {
                        const updatedRule = { ...rule };
                        if (e.target.checked) {
                          updatedRule.assignMethod = [];
                        } else {
                          delete updatedRule.assignMethod;
                        }
                        updateRule(ruleIndex, updatedRule);
                      }}
                    />
                    <label htmlFor={`assignMethod-${ruleIndex}`} className="text-sm font-medium">
                      Enable Assignment Methods
                    </label>
                  </div>

                  {rule.assignMethod && (
                    <AssignmentMethodBuilder
                      assignMethods={rule.assignMethod}
                      onChange={(assignMethods) => {
                        const updatedRule = { ...rule, assignMethod: assignMethods };
                        updateRule(ruleIndex, updatedRule);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {rules.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">
            <Settings size={48} className="mx-auto mb-2" />
            <p className="text-lg font-medium">No rules defined yet</p>
            <p className="text-sm">Add your first rule to start building your query</p>
          </div>
          <button
            onClick={addRule}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Add First Rule
          </button>
        </div>
      )}

      {rules.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-2">Rule Building Tips:</h4>
          <ul className="text-sm space-y-1">
            <li>• Each rule can have multiple data blocks for complex logic</li>
            <li>• Use conditions (if) to filter data before processing</li>
            <li>• Use fields (get) to specify which data to retrieve</li>
            <li>• Enable score methods for mathematical operations</li>
            <li>• Enable assignment methods for value assignments</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default RuleBuilder;