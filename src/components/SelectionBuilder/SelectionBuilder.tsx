import React, { useState } from 'react';
import { Selection, SortMethod, SortOrderType, DataBlock } from '@/types';
// import { useQueryStore } from '@/store/queryStore';
import { X, Plus } from 'lucide-react';
import ConditionBuilder from '../RuleBuilder/ConditionBuilder';
import DataSelector from '../RuleBuilder/DataSelector';

interface SelectionBuilderProps {
  selections: Selection[];
  onChange: (selections: Selection[]) => void;
}

const SelectionBuilder: React.FC<SelectionBuilderProps> = ({ selections, onChange }) => {
  const [quantitySortOrder, setQuantitySortOrder] = useState<SortOrderType>('Ascending');
  const [sortMethods, setSortMethods] = useState<SortMethod[]>([]);

  const addSelection = () => {
    const newSelection: Selection = {
      quantity: {
        sortOrder: quantitySortOrder
      },
      sortMethod: [...sortMethods]
    };

    onChange([...selections, newSelection]);
    setQuantitySortOrder('Ascending');
    setSortMethods([]);
  };

  const removeSelection = (index: number) => {
    onChange(selections.filter((_, i) => i !== index));
  };

  const updateSelection = (index: number, field: keyof Selection, newValue: any) => {
    const updatedSelections = selections.map((selection, i) => {
      if (i === index) {
        return { ...selection, [field]: newValue };
      }
      return selection;
    });
    onChange(updatedSelections);
  };

  const addSortMethod = () => {
    const newSortMethod: SortMethod = {
      Data: [{
        if: [],
        get: []
      }],
      sortOrder: 'Ascending'
    };

    setSortMethods([...sortMethods, newSortMethod]);
  };

  const removeSortMethod = (index: number) => {
    setSortMethods(sortMethods.filter((_, i) => i !== index));
  };

  const updateSortMethod = (index: number, field: keyof SortMethod, newValue: any) => {
    const updatedSortMethods = sortMethods.map((method, i) => {
      if (i === index) {
        return { ...method, [field]: newValue };
      }
      return method;
    });
    setSortMethods(updatedSortMethods);
  };

  const updateSortMethodData = (sortIndex: number, dataIndex: number, newData: DataBlock) => {
    const updatedSortMethods = sortMethods.map((method, i) => {
      if (i === sortIndex) {
        const updatedData = method.Data.map((data, j) => {
          if (j === dataIndex) {
            return newData;
          }
          return data;
        });
        return { ...method, Data: updatedData };
      }
      return method;
    });
    setSortMethods(updatedSortMethods);
  };

  const updateSelectionSortMethod = (selectionIndex: number, sortIndex: number, field: keyof SortMethod, newValue: any) => {
    const updatedSelections = selections.map((selection, i) => {
      if (i === selectionIndex) {
        const updatedSortMethods = selection.sortMethod.map((method, j) => {
          if (j === sortIndex) {
            return { ...method, [field]: newValue };
          }
          return method;
        });
        return { ...selection, sortMethod: updatedSortMethods };
      }
      return selection;
    });
    onChange(updatedSelections);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">Selection Configuration</h3>
        <span className="text-sm text-gray-500">Configure sorting and selection criteria</span>
      </div>

      {selections.map((selection, selectionIndex) => (
        <div key={selectionIndex} className="bg-gray-50 p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium">Selection {selectionIndex + 1}</span>
            <button
              onClick={() => removeSelection(selectionIndex)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Quantity Sort Order</label>
            <select
              value={selection.quantity.sortOrder}
              onChange={(e) => updateSelection(selectionIndex, 'quantity', { sortOrder: e.target.value as SortOrderType })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Sort Methods</h4>
            {selection.sortMethod.map((sortMethod, sortIndex) => (
              <div key={sortIndex} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sort Method {sortIndex + 1}</span>
                  <button
                    onClick={() => {
                      const updatedSortMethods = selection.sortMethod.filter((_, i) => i !== sortIndex);
                      updateSelection(selectionIndex, 'sortMethod', updatedSortMethods);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <select
                    value={sortMethod.sortOrder}
                    onChange={(e) => updateSelectionSortMethod(selectionIndex, sortIndex, 'sortOrder', e.target.value as SortOrderType)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                  </select>
                </div>

                {sortMethod.Data.map((dataBlock, dataIndex) => (
                  <div key={dataIndex} className="bg-gray-50 p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">Data Block {dataIndex + 1}</h5>
                    
                    <div className="mb-4">
                      <ConditionBuilder
                        conditions={dataBlock.if}
                        onChange={(conditions) => {
                          const newDataBlock = { ...dataBlock, if: conditions };
                          const updatedSortMethods = selection.sortMethod.map((method, i) => {
                            if (i === sortIndex) {
                              const updatedData = method.Data.map((data, j) => {
                                if (j === dataIndex) {
                                  return newDataBlock;
                                }
                                return data;
                              });
                              return { ...method, Data: updatedData };
                            }
                            return method;
                          });
                          updateSelection(selectionIndex, 'sortMethod', updatedSortMethods);
                        }}
                      />
                    </div>

                    <div>
                      <DataSelector
                        fields={dataBlock.get}
                        onChange={(fields) => {
                          const newDataBlock = { ...dataBlock, get: fields };
                          const updatedSortMethods = selection.sortMethod.map((method, i) => {
                            if (i === sortIndex) {
                              const updatedData = method.Data.map((data, j) => {
                                if (j === dataIndex) {
                                  return newDataBlock;
                                }
                                return data;
                              });
                              return { ...method, Data: updatedData };
                            }
                            return method;
                          });
                          updateSelection(selectionIndex, 'sortMethod', updatedSortMethods);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={() => {
                const newSortMethod: SortMethod = {
                  Data: [{
                    if: [],
                    get: []
                  }],
                  sortOrder: 'Ascending'
                };
                const updatedSortMethods = [...selection.sortMethod, newSortMethod];
                updateSelection(selectionIndex, 'sortMethod', updatedSortMethods);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={16} className="inline mr-2" />
              Add Sort Method
            </button>
          </div>
        </div>
      ))}

      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
        <div className="flex items-center gap-2 mb-4">
          <Plus size={20} />
          <span className="text-lg font-medium">Add New Selection</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Quantity Sort Order</label>
            <select
              value={quantitySortOrder}
              onChange={(e) => setQuantitySortOrder(e.target.value as SortOrderType)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Sort Methods</h4>
            {sortMethods.map((sortMethod, sortIndex) => (
              <div key={sortIndex} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Sort Method {sortIndex + 1}</span>
                  <button
                    onClick={() => removeSortMethod(sortIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Sort Order</label>
                  <select
                    value={sortMethod.sortOrder}
                    onChange={(e) => updateSortMethod(sortIndex, 'sortOrder', e.target.value as SortOrderType)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                  </select>
                </div>

                {sortMethod.Data.map((dataBlock, dataIndex) => (
                  <div key={dataIndex} className="bg-gray-50 p-4 rounded-lg border">
                    <h5 className="font-medium mb-2">Data Block {dataIndex + 1}</h5>
                    
                    <div className="mb-4">
                      <ConditionBuilder
                        conditions={dataBlock.if}
                        onChange={(conditions) => {
                          const newDataBlock = { ...dataBlock, if: conditions };
                          updateSortMethodData(sortIndex, dataIndex, newDataBlock);
                        }}
                      />
                    </div>

                    <div>
                      <DataSelector
                        fields={dataBlock.get}
                        onChange={(fields) => {
                          const newDataBlock = { ...dataBlock, get: fields };
                          updateSortMethodData(sortIndex, dataIndex, newDataBlock);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              onClick={addSortMethod}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={16} className="inline mr-2" />
              Add Sort Method
            </button>
          </div>
        </div>

        <button
          onClick={addSelection}
          disabled={sortMethods.length === 0}
          className="mt-6 px-6 py-3 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:bg-gray-300"
        >
          Add Selection
        </button>
      </div>

      {selections.length > 0 && (
        <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
          <h4 className="font-medium mb-2">Selection Guidelines:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Quantity Sort Order:</strong> Defines how results are ordered by quantity</li>
            <li><strong>Sort Methods:</strong> Define the sorting criteria and data sources</li>
            <li><strong>Data Blocks:</strong> Specify conditions and fields for sorting</li>
            <li><strong>Ascending:</strong> Sort from lowest to highest</li>
            <li><strong>Descending:</strong> Sort from highest to lowest</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectionBuilder;