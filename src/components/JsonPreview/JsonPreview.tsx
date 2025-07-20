import React, { useState, useEffect } from 'react';
import { QueryBuilderSchema } from '@/types';
import { Copy, Download, Eye, EyeOff } from 'lucide-react';

interface JsonPreviewProps {
  query: QueryBuilderSchema;
  isValid: boolean;
  validationErrors: string[];
}

const JsonPreview: React.FC<JsonPreviewProps> = ({ query, isValid, validationErrors }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [formattedJson, setFormattedJson] = useState('');

  useEffect(() => {
    try {
      setFormattedJson(JSON.stringify(query, null, 2));
    } catch (error) {
      setFormattedJson('Invalid JSON structure');
    }
  }, [query]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query-builder-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const stats = {
      rules: query.rules.length,
      selections: query.Selection.length,
      scoreMethods: query.scoreMethod.length,
      totalConditions: query.rules.reduce((acc, rule) => {
        return acc + rule.Data.reduce((dataAcc, data) => dataAcc + data.if.length, 0);
      }, 0),
      totalFields: query.rules.reduce((acc, rule) => {
        return acc + rule.Data.reduce((dataAcc, data) => dataAcc + data.get.length, 0);
      }, 0)
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">JSON Preview</h3>
          <div className={`px-2 py-1 rounded-full text-xs ${
            isValid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isValid ? 'Valid' : 'Invalid'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-1"
          >
            {isCollapsed ? <Eye size={16} /> : <EyeOff size={16} />}
            {isCollapsed ? 'Show' : 'Hide'}
          </button>
          
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
          >
            <Copy size={16} />
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
          
          <button
            onClick={downloadJson}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      {!isValid && validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-800 mb-2">Validation Errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg border">
        <h4 className="font-medium mb-2">Query Statistics:</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.rules}</div>
            <div className="text-gray-600">Rules</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl font-bold text-green-600">{stats.selections}</div>
            <div className="text-gray-600">Selections</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.scoreMethods}</div>
            <div className="text-gray-600">Score Methods</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalConditions}</div>
            <div className="text-gray-600">Conditions</div>
          </div>
          <div className="bg-white p-3 rounded border text-center">
            <div className="text-2xl font-bold text-teal-600">{stats.totalFields}</div>
            <div className="text-gray-600">Fields</div>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg border overflow-x-auto">
          <pre className="text-sm font-mono whitespace-pre-wrap">
            <code>{formattedJson}</code>
          </pre>
        </div>
      )}

      {isCollapsed && (
        <div className="bg-gray-100 p-4 rounded-lg border text-center text-gray-600">
          JSON preview is hidden. Click "Show" to view the generated JSON.
        </div>
      )}

      {isValid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">JSON Structure Valid!</h4>
          <p className="text-sm text-green-700">
            Your query configuration is valid and ready to use. The JSON follows the required schema format.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Usage Instructions:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Copy the JSON to use in your application</li>
          <li>• Download the JSON file for storage or sharing</li>
          <li>• The JSON structure matches the exact schema requirements</li>
          <li>• Use this configuration for scoring, assignment, and selection logic</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonPreview;