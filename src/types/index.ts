export interface Condition {
  field_key: string;
  step_name: string;
  operator: 'in' | 'equals' | 'not equals';
  value: string[] | number[] | string | number;
}

export interface Field {
  field_key: string;
  step_name: string;
  course?: string;
}

export interface DataBlock {
  if: Condition[];
  get: Field[];
}

export interface ScoreMethod {
  value: string | number;
  operation: 'Percentile' | 'Multiplication' | 'Addition' | 'many2one' | 'Inverse' | 'None';
  dropEmptyRow?: 'all' | 'none';
}

export interface AssignMethod {
  value: number;
  option: string | string[];
}

export interface Rule {
  Data: DataBlock[];
  scoreMethod?: ScoreMethod[];
  assignMethod?: AssignMethod[];
}

export interface SortMethod {
  Data: DataBlock[];
  sortOrder: 'Ascending' | 'Descending';
}

export interface Selection {
  quantity: {
    sortOrder: 'Ascending' | 'Descending';
  };
  sortMethod: SortMethod[];
}

export interface QueryBuilderSchema {
  rules: Rule[];
  Selection: Selection[];
  scoreMethod: ScoreMethod[];
}

export type OperatorType = 'in' | 'equals' | 'not equals';
export type OperationType = 'Percentile' | 'Multiplication' | 'Addition' | 'many2one' | 'Inverse' | 'None';
export type SortOrderType = 'Ascending' | 'Descending';

export interface FieldOption {
  field_key: string;
  step_name: string;
  display_name: string;
  course?: string;
}

export interface StepOption {
  step_name: string;
  display_name: string;
  fields: FieldOption[];
}