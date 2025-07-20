import React, { useState, useEffect } from 'react';
import { useQueryStore } from '@/store/queryStore';
import { QueryValidator } from '@/components/QueryValidator/QueryValidator';
import RuleBuilder from '@/components/RuleBuilder/RuleBuilder';
import SelectionBuilder from '@/components/SelectionBuilder/SelectionBuilder';
import ScoreMethodBuilder from '@/components/ScoreMethodBuilder/ScoreMethodBuilder';
import JsonPreview from '@/components/JsonPreview/JsonPreview';
import ConfigInput from '@/components/ConfigInput/ConfigInput';
import EligibilityBuilder from '@/components/EligibilityBuilder/EligibilityBuilder';
import RankingBuilder from '@/components/RankingBuilder/RankingBuilder';
import { Settings, Code, Database, Target, Download, FileText, Filter, Trophy } from 'lucide-react';

function App() {
  const { query, updateScoreMethod, resetQuery, updateRules, updateSelections, importQuery } = useQueryStore();
  const [activeTab, setActiveTab] = useState<'config' | 'eligibility' | 'ranking' | 'rules' | 'selection' | 'scoring' | 'preview'>('config');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
  const [config, setConfig] = useState<any>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [ranking, setRanking] = useState<any>(null);
  
  // Use the variables to prevent TypeScript warnings
  React.useEffect(() => {
    if (eligibility) {
      console.log('Eligibility state updated:', eligibility);
    }
  }, [eligibility]);
  
  React.useEffect(() => {
    if (ranking) {
      console.log('Ranking state updated:', ranking);
    }
  }, [ranking]);

  useEffect(() => {
    const result = QueryValidator.validateQuery(query);
    setValidationResult(result);
  }, [query]);

  const handleExportTemplate = () => {
    const template = {
      name: 'Custom Query Template',
      created: new Date().toISOString(),
      query
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSampleQuery = () => {
    const sampleQuery = {
      "rules": [
        {
          "Data": [
            {
              "if": [],
              "get": [
                {
                  "field_key": "familyIncome",
                  "step_name": "personal info step"
                }
              ]
            }
          ],
          "scoreMethod": [
            {
              "value": "Inverse",
              "operation": "Percentile"
            },
            {
              "value": 25,
              "operation": "Multiplication"
            }
          ]
        },
        {
          "Data": [
            {
              "if": [],
              "get": [
                {
                  "field_key": "otherPersonalDetails",
                  "step_name": "personal info step"
                }
              ]
            }
          ],
          "assignMethod": [
            {
              "value": 0,
              "option": "default"
            },
            {
              "value": 0,
              "option": "isEmpty"
            },
            {
              "value": 15,
              "option": "Orphan"
            },
            {
              "value": 15,
              "option": "Single Parent"
            }
          ]
        }
      ],
      "Selection": [
        {
          "quantity": {
            "sortOrder": "Ascending"
          },
          "sortMethod": [
            {
              "Data": [
                {
                  "if": [],
                  "get": [
                    {
                      "field_key": "submittedDate",
                      "step_name": "application info step"
                    }
                  ]
                }
              ],
              "sortOrder": "Ascending"
            }
          ]
        }
      ],
      "scoreMethod": [
        {
          "value": "Addition",
          "operation": "many2one",
          "dropEmptyRow": "all"
        }
      ]
    };
    
    const success = importQuery(sampleQuery);
    if (success) {
      alert('Sample query loaded successfully!');
      setActiveTab('rules');
    } else {
      alert('Error loading sample query.');
    }
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          
          // Check if it's a template with query property or direct query
          const queryData = importedData.query || importedData;
          
          // Import the query
          const success = importQuery(queryData);
          
          if (success) {
            alert('Query imported successfully!');
            // Switch to rules tab to show imported data
            setActiveTab('rules');
          } else {
            alert('Error importing query. Please check the file format.');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
          alert('Error parsing JSON file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    
    // Clear the input so the same file can be imported again
    event.target.value = '';
  };

  const handleConfigLoad = (loadedConfig: any) => {
    setConfig(loadedConfig);
    console.log('Config loaded:', loadedConfig);
  };

  const handleEligibilityChange = (eligibilityData: any) => {
    setEligibility(eligibilityData);
    console.log('Eligibility updated:', eligibilityData);
  };

  const handleRankingChange = (rankingData: any) => {
    setRanking(rankingData);
    console.log('Ranking updated:', rankingData);
  };

  const tabs = [
    { id: 'config', label: 'Config Input', icon: FileText, description: 'Input configuration JSON' },
    { id: 'eligibility', label: 'Eligibility Builder', icon: Filter, description: 'Build eligibility criteria' },
    { id: 'ranking', label: 'Ranking Builder', icon: Trophy, description: 'Build ranking criteria' },
    { id: 'rules', label: 'Rules', icon: Settings, description: 'Define data processing rules' },
    { id: 'selection', label: 'Selection', icon: Target, description: 'Configure selection criteria' },
    { id: 'scoring', label: 'Scoring', icon: Database, description: 'Set up global scoring methods' },
    { id: 'preview', label: 'JSON Preview', icon: Code, description: 'View generated JSON' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Query Builder</h1>
              <p className="text-gray-600">Visual no-code query builder for complex data processing</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplate}
                className="hidden"
                id="import-template"
              />
              <label
                htmlFor="import-template"
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 cursor-pointer flex items-center gap-2"
              >
                <Download size={16} />
                Import
              </label>
              <button
                onClick={loadSampleQuery}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Database size={16} />
                Load Sample
              </button>
              <button
                onClick={handleExportTemplate}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={resetQuery}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'config' && (
              <ConfigInput onConfigLoad={handleConfigLoad} />
            )}

            {activeTab === 'eligibility' && (
              <EligibilityBuilder 
                config={config} 
                onEligibilityChange={handleEligibilityChange} 
              />
            )}

            {activeTab === 'ranking' && (
              <RankingBuilder 
                config={config} 
                onRankingChange={handleRankingChange} 
              />
            )}

            {activeTab === 'rules' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Rules Configuration</h3>
                  <p className="text-sm text-blue-700">
                    Define data processing rules with conditions, field selections, scoring methods, and assignment methods.
                  </p>
                </div>
                <RuleBuilder
                  rules={query.rules}
                  onChange={updateRules}
                />
              </div>
            )}

            {activeTab === 'selection' && (
              <div className="space-y-4">
                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                  <h3 className="font-medium text-teal-800 mb-2">Selection Configuration</h3>
                  <p className="text-sm text-teal-700">
                    Configure selection criteria and sorting methods for result processing.
                  </p>
                </div>
                <SelectionBuilder
                  selections={query.Selection}
                  onChange={updateSelections}
                />
              </div>
            )}

            {activeTab === 'scoring' && (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-purple-800 mb-2">Global Scoring Methods</h3>
                  <p className="text-sm text-purple-700">
                    Configure global scoring methods that apply to the entire query result.
                  </p>
                </div>
                <ScoreMethodBuilder
                  scoreMethods={query.scoreMethod}
                  onChange={updateScoreMethod}
                  title="Global Score Methods"
                  showDropEmptyRow={true}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-4">
                <JsonPreview
                  query={query}
                  isValid={validationResult.isValid}
                  validationErrors={validationResult.errors}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Status: {validationResult.isValid ? (
                <span className="text-green-600 font-medium">Valid Configuration</span>
              ) : (
                <span className="text-red-600 font-medium">
                  {validationResult.errors.length} Error(s)
                </span>
              )}
            </div>
            <div>
              Rules: {query.rules.length} | 
              Selections: {query.Selection.length} | 
              Score Methods: {query.scoreMethod.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;