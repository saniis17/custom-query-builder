import React, { useState } from 'react';
import { Field, FieldOption } from '@/types';
import { useQueryStore } from '@/store/queryStore';
import { X, Plus } from 'lucide-react';

interface DataSelectorProps {
  fields: Field[];
  onChange: (fields: Field[]) => void;
}

const DataSelector: React.FC<DataSelectorProps> = ({ fields, onChange }) => {
  const { stepOptions } = useQueryStore();
  const [selectedStep, setSelectedStep] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [course, setCourse] = useState<string>('');

  const addField = () => {
    if (!selectedStep || !selectedField) return;

    const newField: Field = {
      field_key: selectedField,
      step_name: selectedStep,
      ...(course && { course })
    };

    onChange([...fields, newField]);
    setSelectedStep('');
    setSelectedField('');
    setCourse('');
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: keyof Field, newValue: any) => {
    const updatedFields = fields.map((f, i) => {
      if (i === index) {
        const updated = { ...f, [field]: newValue };
        if (field === 'course' && !newValue) {
          delete updated.course;
        }
        return updated;
      }
      return f;
    });
    onChange(updatedFields);
  };

  const getFieldsForStep = (stepName: string): FieldOption[] => {
    const step = stepOptions.find(s => s.step_name === stepName);
    return step?.fields || [];
  };

  const getFieldDisplayName = (fieldKey: string, stepName: string): string => {
    const step = stepOptions.find(s => s.step_name === stepName);
    const field = step?.fields.find(f => f.field_key === fieldKey);
    return field?.display_name || fieldKey;
  };

  const getStepDisplayName = (stepName: string): string => {
    const step = stepOptions.find(s => s.step_name === stepName);
    return step?.display_name || stepName;
  };

  const selectedFieldInfo = getFieldsForStep(selectedStep).find(f => f.field_key === selectedField);
  const showCourseInput = selectedFieldInfo?.course !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Data Fields (Get)</h3>
        <span className="text-sm text-gray-500">Select fields to retrieve data from</span>
      </div>

      {fields.map((field, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Field {index + 1}</span>
            <button
              onClick={() => removeField(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Step</label>
              <select
                value={field.step_name}
                onChange={(e) => updateField(index, 'step_name', e.target.value)}
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
                value={field.field_key}
                onChange={(e) => updateField(index, 'field_key', e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {getFieldsForStep(field.step_name).map(fieldOption => (
                  <option key={fieldOption.field_key} value={fieldOption.field_key}>
                    {fieldOption.display_name}
                  </option>
                ))}
              </select>
            </div>

            {field.course !== undefined && (
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Course</label>
                <input
                  type="text"
                  value={field.course || ''}
                  onChange={(e) => updateField(index, 'course', e.target.value)}
                  placeholder="e.g., Class 12"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}
          </div>

          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <strong>Preview:</strong> {getStepDisplayName(field.step_name)} → {getFieldDisplayName(field.field_key, field.step_name)}
            {field.course && ` (${field.course})`}
          </div>
        </div>
      ))}

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Plus size={16} />
          <span className="font-medium">Add New Field</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Step</label>
            <select
              value={selectedStep}
              onChange={(e) => {
                setSelectedStep(e.target.value);
                setSelectedField('');
                setCourse('');
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
              onChange={(e) => {
                setSelectedField(e.target.value);
                const fieldInfo = getFieldsForStep(selectedStep).find(f => f.field_key === e.target.value);
                if (fieldInfo?.course) {
                  setCourse(fieldInfo.course);
                } else {
                  setCourse('');
                }
              }}
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

          {showCourseInput && (
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g., Class 12"
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
        </div>

        {selectedStep && selectedField && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            <strong>Preview:</strong> {getStepDisplayName(selectedStep)} → {getFieldDisplayName(selectedField, selectedStep)}
            {course && ` (${course})`}
          </div>
        )}

        <button
          onClick={addField}
          disabled={!selectedStep || !selectedField}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
        >
          Add Field
        </button>
      </div>
    </div>
  );
};

export default DataSelector;