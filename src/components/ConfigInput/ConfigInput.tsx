import React, { useState } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';

interface ConfigInputProps {
  onConfigLoad: (config: any) => void;
}

const ConfigInput: React.FC<ConfigInputProps> = ({ onConfigLoad }) => {
  const [configText, setConfigText] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  const handleConfigChange = (value: string) => {
    setConfigText(value);
    setError('');
    setIsValid(true);
  };

  const validateAndLoadConfig = () => {
    try {
      const config = JSON.parse(configText);
      setIsValid(true);
      setError('');
      onConfigLoad(config);
    } catch (err) {
      setIsValid(false);
      setError('Invalid JSON format. Please check your configuration.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setConfigText(content);
        handleConfigChange(content);
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const loadSampleConfig = () => {
    const sampleConfig = {
      "ScholarshipInfo": {
        "id": "24525",
        "name": "Legrand Empowering Scholarship Program 2024-25",
        "description": "Supporting education for deserving students"
      },
      "ScholarshipConfig": {
        "steps": [
          {
            "step_name": "personal info step",
            "fields": [
              {
                "field_key": "gender",
                "label": "Gender",
                "validations": ["required"],
                "data_options": ["Male", "Female", "Third/Transgender"],
                "valueType": "string"
              },
              {
                "field_key": "familyIncome",
                "label": "Family Income",
                "validations": ["required", "numeric"],
                "valueType": "number"
              },
              {
                "field_key": "dob",
                "label": "Date of Birth",
                "validations": ["required", "date"],
                "valueType": "date"
              }
            ]
          },
          {
            "step_name": "education info step",
            "fields": [
              {
                "field_key": "present_class",
                "label": "Present Class",
                "validations": ["required"],
                "data_options": ["Class 10", "Class 11", "Class 12", "Graduation", "Post Graduation"],
                "valueType": "string"
              },
              {
                "field_key": "percentage",
                "label": "Percentage",
                "validations": ["required", "numeric"],
                "valueType": "number"
              }
            ]
          }
        ]
      }
    };
    
    const configString = JSON.stringify(sampleConfig, null, 2);
    setConfigText(configString);
    handleConfigChange(configString);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Configuration Input</h3>
        <p className="text-sm text-blue-700">
          Input your scholarship configuration JSON here. This will be used to generate eligibility and ranking query builders.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
          id="config-file-input"
        />
        <label
          htmlFor="config-file-input"
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 cursor-pointer flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Config File
        </label>
        <button
          onClick={loadSampleConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <FileText size={16} />
          Load Sample Config
        </button>
        <button
          onClick={validateAndLoadConfig}
          disabled={!configText.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 flex items-center gap-2"
        >
          {isValid ? <Check size={16} /> : <X size={16} />}
          Load Configuration
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <X size={16} className="text-red-600" />
            <span className="text-red-800 font-medium">Error:</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Configuration JSON
        </label>
        <textarea
          value={configText}
          onChange={(e) => handleConfigChange(e.target.value)}
          placeholder="Paste your configuration JSON here..."
          className={`w-full h-96 p-3 border rounded-md font-mono text-sm ${
            isValid ? 'border-gray-300' : 'border-red-300'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Status: {isValid ? (
            <span className="text-green-600 font-medium">Valid JSON</span>
          ) : (
            <span className="text-red-600 font-medium">Invalid JSON</span>
          )}
        </div>
        <div>
          Characters: {configText.length}
        </div>
      </div>
    </div>
  );
};

export default ConfigInput;