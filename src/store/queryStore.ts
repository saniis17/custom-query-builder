import { create } from 'zustand';
import { QueryBuilderSchema, Rule, Selection, ScoreMethod, StepOption } from '@/types';

interface QueryState {
  query: QueryBuilderSchema;
  stepOptions: StepOption[];
  updateRule: (index: number, rule: Rule) => void;
  addRule: (rule: Rule) => void;
  removeRule: (index: number) => void;
  updateSelection: (index: number, selection: Selection) => void;
  addSelection: (selection: Selection) => void;
  removeSelection: (index: number) => void;
  updateScoreMethod: (scoreMethods: ScoreMethod[]) => void;
  setStepOptions: (options: StepOption[]) => void;
  resetQuery: () => void;
  setQuery: (query: QueryBuilderSchema) => void;
  importQuery: (queryData: any) => boolean;
  updateRules: (rules: Rule[]) => void;
  updateSelections: (selections: Selection[]) => void;
}

const initialQuery: QueryBuilderSchema = {
  rules: [],
  Selection: [],
  scoreMethod: []
};

const defaultStepOptions: StepOption[] = [
  {
    step_name: 'personal info step',
    display_name: 'Personal Info',
    fields: [
      { field_key: 'familyIncome', step_name: 'personal info step', display_name: 'Family Income' },
      { field_key: 'otherPersonalDetails', step_name: 'personal info step', display_name: 'Other Personal Details' },
      { field_key: 'disabilityPercent', step_name: 'personal info step', display_name: 'Disability Percent' }
    ]
  },
  {
    step_name: 'education info step',
    display_name: 'Education Info',
    fields: [
      { field_key: 'present_class', step_name: 'education info step', display_name: 'Present Class' },
      { field_key: 'percentage', step_name: 'education info step', display_name: 'Percentage', course: 'Class 12' }
    ]
  },
  {
    step_name: 'application info step',
    display_name: 'Application Info',
    fields: [
      { field_key: 'submittedDate', step_name: 'application info step', display_name: 'Submitted Date' }
    ]
  },
  {
    step_name: 'questions',
    display_name: 'Questions',
    fields: [
      { field_key: 'If_you_are_a_student_of_2nd_year_or_above,_please_write_the_percentage_scored_in_the_previous_year._(If_1st_year_students_please_mention_your_class_12th_percentage)', step_name: 'questions', display_name: 'Previous Year Percentage' }
    ]
  }
];

export const useQueryStore = create<QueryState>((set) => ({
  query: initialQuery,
  stepOptions: defaultStepOptions,
  
  updateRule: (index: number, rule: Rule) => {
    set(state => ({
      query: {
        ...state.query,
        rules: state.query.rules.map((r, i) => i === index ? rule : r)
      }
    }));
  },
  
  addRule: (rule: Rule) => {
    set(state => ({
      query: {
        ...state.query,
        rules: [...state.query.rules, rule]
      }
    }));
  },
  
  removeRule: (index: number) => {
    set(state => ({
      query: {
        ...state.query,
        rules: state.query.rules.filter((_, i) => i !== index)
      }
    }));
  },
  
  updateSelection: (index: number, selection: Selection) => {
    set(state => ({
      query: {
        ...state.query,
        Selection: state.query.Selection.map((s, i) => i === index ? selection : s)
      }
    }));
  },
  
  addSelection: (selection: Selection) => {
    set(state => ({
      query: {
        ...state.query,
        Selection: [...state.query.Selection, selection]
      }
    }));
  },
  
  removeSelection: (index: number) => {
    set(state => ({
      query: {
        ...state.query,
        Selection: state.query.Selection.filter((_, i) => i !== index)
      }
    }));
  },
  
  updateScoreMethod: (scoreMethods: ScoreMethod[]) => {
    set(state => ({
      query: {
        ...state.query,
        scoreMethod: scoreMethods
      }
    }));
  },
  
  setStepOptions: (options: StepOption[]) => {
    set({ stepOptions: options });
  },
  
  resetQuery: () => {
    set({ query: initialQuery });
  },

  setQuery: (query: QueryBuilderSchema) => {
    set({ query });
  },

  importQuery: (queryData: any) => {
    try {
      // Validate and set the imported query
      const importedQuery: QueryBuilderSchema = {
        rules: queryData.rules || [],
        Selection: queryData.Selection || [],
        scoreMethod: queryData.scoreMethod || []
      };
      set({ query: importedQuery });
      return true;
    } catch (error) {
      console.error('Error importing query:', error);
      return false;
    }
  },

  updateRules: (rules: Rule[]) => {
    set(state => ({
      query: {
        ...state.query,
        rules
      }
    }));
  },

  updateSelections: (selections: Selection[]) => {
    set(state => ({
      query: {
        ...state.query,
        Selection: selections
      }
    }));
  }
}));