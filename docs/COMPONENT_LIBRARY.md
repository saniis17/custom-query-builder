# Custom Query Builder - Component Library

## Table of Contents
1. [Component Overview](#component-overview)
2. [Core Components](#core-components)
3. [Query Builder Components](#query-builder-components)
4. [UI Components](#ui-components)
5. [Form Components](#form-components)
6. [Utility Components](#utility-components)
7. [Styling Guidelines](#styling-guidelines)
8. [Best Practices](#best-practices)

## Component Overview

### Component Architecture
The component library follows a hierarchical 7-tab structure with reusable components that can be composed to build complex interfaces.

```
App (Root - Tab Navigation)
├── Tab 1: ConfigInput          # Configuration file input
├── Tab 2: EligibilityBuilder   # Eligibility criteria builder
├── Tab 3: RankingBuilder       # Ranking algorithm builder
├── Tab 4: RuleBuilder          # Visual rule builder
│   ├── ConditionBuilder        # "if" conditions
│   ├── DataSelector           # "get" field selection
│   └── OperationSelector      # Scoring operations
├── Tab 5: SelectionBuilder     # Selection & sorting
├── Tab 6: ScoreMethodBuilder   # Global scoring methods
├── Tab 7: JsonPreview          # JSON output & validation
├── Shared Components
│   ├── QueryValidator         # Validation logic
│   ├── AssignmentMethodBuilder # Assignment methods
│   └── Common UI Components   # Buttons, inputs, etc.
└── Utility Components
    ├── ErrorBoundary
    ├── LoadingSpinner
    └── ValidationMessage
```

### Design System
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.3 utility-first framework
- **State Management**: Zustand for global state
- **Form Management**: React Hook Form for form handling
- **Icons**: Lucide React icon library for consistency
- **Drag & Drop**: DND Kit for rule reordering
- **Validation**: Zod for runtime type validation

## Core Components

### App Component
**File**: `src/App.tsx`
**Purpose**: Root application component that manages global state and navigation

#### Props
```typescript
interface AppProps {
  // No props - root component
}
```

#### Features
- 7-tab navigation interface
- Global state management with Zustand
- Real-time validation feedback
- Import/Export functionality
- Sample data loading
- Responsive layout with Tailwind CSS
- Error boundary integration

#### Usage
```typescript
import App from './App';

// Root component usage
ReactDOM.render(<App />, document.getElementById('root'));
```

#### State Management
```typescript
const [activeTab, setActiveTab] = useState<'config' | 'eligibility' | 'ranking' | 'rules' | 'selection' | 'scoring' | 'preview'>('config');
const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] }>({ isValid: true, errors: [] });
const [config, setConfig] = useState<any>(null);
const [eligibility, setEligibility] = useState<any>(null);
const [ranking, setRanking] = useState<any>(null);

// Zustand store integration
const { query, updateScoreMethod, resetQuery, updateRules, updateSelections, importQuery } = useQueryStore();
```

#### Styling
```css
/* Tailwind classes used */
.min-h-screen.bg-gray-100 /* Main container */
.bg-white.shadow-sm.border-b /* Header */
.max-w-7xl.mx-auto.px-4.py-6 /* Content wrapper */
```

## Tab Components (7 Main Interfaces)

### Tab Navigation Structure
```typescript
const tabs = [
  { id: 'config', label: 'Config Input', icon: FileText, description: 'Input configuration JSON' },
  { id: 'eligibility', label: 'Eligibility Builder', icon: Filter, description: 'Build eligibility criteria' },
  { id: 'ranking', label: 'Ranking Builder', icon: Trophy, description: 'Build ranking criteria' },
  { id: 'rules', label: 'Rules', icon: Settings, description: 'Define data processing rules' },
  { id: 'selection', label: 'Selection', icon: Target, description: 'Configure selection criteria' },
  { id: 'scoring', label: 'Scoring', icon: Database, description: 'Set up global scoring methods' },
  { id: 'preview', label: 'JSON Preview', icon: Code, description: 'View generated JSON' }
];
```

### Tab 1: ConfigInput Component
**File**: `src/components/ConfigInput/ConfigInput.tsx`
**Purpose**: Handle configuration file input, validation, and management
**Tab Position**: First tab in the workflow

#### Props
```typescript
interface ConfigInputProps {
  onConfigLoad: (config: Configuration) => void;
}
```

#### Features
- File upload with drag-and-drop support
- JSON validation with error reporting
- Sample configuration loading
- Real-time validation feedback

#### Usage
```typescript
import ConfigInput from '@/components/ConfigInput/ConfigInput';

const handleConfigLoad = (config: Configuration) => {
  console.log('Configuration loaded:', config);
};

<ConfigInput onConfigLoad={handleConfigLoad} />
```

#### State Management
```typescript
const [configText, setConfigText] = useState('');
const [isValid, setIsValid] = useState(true);
const [error, setError] = useState('');
```

#### Key Methods
- `handleConfigChange(value: string)`: Updates configuration text
- `validateAndLoadConfig()`: Validates and loads configuration
- `handleFileUpload(event: ChangeEvent<HTMLInputElement>)`: Handles file uploads
- `loadSampleConfig()`: Loads sample configuration

#### Styling
```css
/* Key styling classes */
.bg-blue-50.p-4.rounded-lg.border.border-blue-200 /* Info panel */
.w-full.h-96.p-3.border.rounded-md.font-mono.text-sm /* Text area */
.px-4.py-2.bg-gray-500.text-white.rounded-md.hover:bg-gray-600 /* Buttons */
```

### Tab 2: EligibilityBuilder Component
**File**: `src/components/EligibilityBuilder/EligibilityBuilder.tsx`
**Purpose**: Visual interface for creating eligibility criteria
**Tab Position**: Second tab in the workflow

#### Props
```typescript
interface EligibilityBuilderProps {
  config?: Configuration;
  onEligibilityChange: (eligibility: EligibilityQuery) => void;
}
```

#### Features
- Visual rule creation interface
- Multiple operator support
- AND/OR logic combinations
- Course-specific rule configuration
- Export functionality

#### Usage
```typescript
import EligibilityBuilder from '@/components/EligibilityBuilder/EligibilityBuilder';

const handleEligibilityChange = (eligibility: EligibilityQuery) => {
  console.log('Eligibility updated:', eligibility);
};

<EligibilityBuilder 
  config={config} 
  onEligibilityChange={handleEligibilityChange} 
/>
```

#### Data Structure
```typescript
interface EligibilityRule {
  step_name: string;
  field_key: string;
  operator: OperatorType;
  value: any;
  course?: string[];
}

interface EligibilityQuery {
  sign: "None" | "AND" | "OR";
  condition: "AND" | "OR";
  rules: EligibilityRule[];
  createNewFields?: ComputedField;
}
```

#### Key Methods
- `addRule()`: Adds new eligibility rule
- `removeRule(index: number)`: Removes rule at index
- `updateRule(index: number, field: string, value: any)`: Updates rule property
- `handleValueChange(index: number, value: string)`: Handles value changes
- `exportEligibility()`: Exports eligibility configuration

#### Operators Supported
```typescript
const operators = [
  { value: 'in', label: 'In' },
  { value: 'between', label: 'Between' },
  { value: 'equals', label: 'Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'not_in', label: 'Not In' }
];
```

### Tab 3: RankingBuilder Component
**File**: `src/components/RankingBuilder/RankingBuilder.tsx`
**Purpose**: Visual interface for creating ranking algorithms
**Tab Position**: Third tab in the workflow

#### Props
```typescript
interface RankingBuilderProps {
  config?: Configuration;
  onRankingChange: (ranking: RankingQuery) => void;
}
```

#### Features
- Multiple scoring methods
- Assignment-based scoring
- Weighted scoring
- Conditional scoring rules
- Export functionality

#### Usage
```typescript
import RankingBuilder from '@/components/RankingBuilder/RankingBuilder';

const handleRankingChange = (ranking: RankingQuery) => {
  console.log('Ranking updated:', ranking);
};

<RankingBuilder 
  config={config} 
  onRankingChange={handleRankingChange} 
/>
```

#### Data Structure
```typescript
interface RankingRule {
  Data: DataBlock[];
  scoreMethod?: ScoreMethod[];
  assignMethod?: AssignMethod[];
}

interface RankingQuery {
  rules: RankingRule[];
  Selection: SelectionCriteria[];
  scoreMethod: GlobalScoreMethod[];
}
```

#### Key Methods
- `addRule()`: Adds new ranking rule
- `removeRule(index: number)`: Removes rule at index
- `updateRule(index: number, field: string, value: any)`: Updates rule
- `toggleRuleType(index: number, type: 'scoreMethod' | 'assignMethod')`: Switches rule type
- `addAssignMethod(ruleIndex: number)`: Adds assignment method
- `updateAssignMethod(ruleIndex: number, assignIndex: number, field: string, value: any)`: Updates assignment

#### Scoring Operations
```typescript
const operations = [
  { value: 'Percentile', label: 'Percentile' },
  { value: 'Multiplication', label: 'Multiplication' },
  { value: 'Addition', label: 'Addition' },
  { value: 'Subtraction', label: 'Subtraction' },
  { value: 'Division', label: 'Division' },
  { value: 'Inverse', label: 'Inverse' }
];
```

### Tab 4: RuleBuilder Component
**File**: `src/components/RuleBuilder/RuleBuilder.tsx`
**Purpose**: Main visual rule builder interface with drag-and-drop support
**Tab Position**: Fourth tab in the workflow

#### Props
```typescript
interface RuleBuilderProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
}
```

#### Features
- Drag-and-drop rule reordering
- Add/remove rules
- Nested data blocks
- Condition and field selection
- Score and assignment methods
- Real-time validation

#### Sub-Components
- **ConditionBuilder**: Creates "if" conditions for filtering
- **DataSelector**: Selects "get" fields for data retrieval
- **OperationSelector**: Configures scoring operations

### Tab 5: SelectionBuilder Component
**File**: `src/components/SelectionBuilder/SelectionBuilder.tsx`
**Purpose**: Configure selection criteria and sorting methods
**Tab Position**: Fifth tab in the workflow

#### Props
```typescript
interface SelectionBuilderProps {
  selections: Selection[];
  onChange: (selections: Selection[]) => void;
}
```

#### Features
- Quantity sort order configuration
- Sort method creation
- Data block configuration
- Ascending/Descending order
- Multiple selection criteria

### Tab 6: ScoreMethodBuilder Component
**File**: `src/components/ScoreMethodBuilder/ScoreMethodBuilder.tsx`
**Purpose**: Global scoring method configuration
**Tab Position**: Sixth tab in the workflow

#### Props
```typescript
interface ScoreMethodBuilderProps {
  scoreMethods: ScoreMethod[];
  onChange: (scoreMethods: ScoreMethod[]) => void;
  title: string;
  showDropEmptyRow?: boolean;
}
```

#### Features
- Global score method configuration
- Multiple operations support
- Drop empty row options
- Operation chaining
- Value assignment

### Tab 7: JsonPreview Component
**File**: `src/components/JsonPreview/JsonPreview.tsx`
**Purpose**: JSON output visualization and export functionality
**Tab Position**: Seventh tab in the workflow

#### Props
```typescript
interface JsonPreviewProps {
  query: QueryStructure;
  isValid: boolean;
  validationErrors: string[];
}
```

#### Features
- Formatted JSON display
- Syntax highlighting
- Copy to clipboard
- Download functionality
- Validation status integration

#### Usage
```typescript
import JsonPreview from '@/components/JsonPreview/JsonPreview';

<JsonPreview
  query={query}
  isValid={validationResult.isValid}
  validationErrors={validationResult.errors}
/>
```

#### Key Methods
- `formatJSON(query: QueryStructure)`: Formats JSON for display
- `copyToClipboard()`: Copies JSON to clipboard
- `downloadJSON()`: Downloads JSON as file
- `validateAndExport()`: Validates before export

## UI Components

### Button Component
**Purpose**: Reusable button component with consistent styling

#### Props
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}
```

#### Usage
```typescript
import { Button } from '@/components/ui/Button';

<Button 
  variant="primary" 
  size="md" 
  icon={<Plus size={16} />}
  onClick={handleClick}
  loading={isLoading}
>
  Add Rule
</Button>
```

#### Variants
```css
/* Primary button */
.bg-blue-500.text-white.hover:bg-blue-600

/* Secondary button */
.bg-gray-500.text-white.hover:bg-gray-600

/* Danger button */
.bg-red-500.text-white.hover:bg-red-600

/* Success button */
.bg-green-500.text-white.hover:bg-green-600
```

### Input Component
**Purpose**: Reusable input component with validation support

#### Props
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

#### Usage
```typescript
import { Input } from '@/components/ui/Input';

<Input
  label="Field Key"
  placeholder="Enter field key"
  value={value}
  onChange={handleChange}
  error={error}
  helperText="Enter a valid field key from configuration"
/>
```

#### Styling States
```css
/* Normal state */
.border-gray-300.focus:ring-2.focus:ring-blue-500

/* Error state */
.border-red-300.focus:ring-2.focus:ring-red-500

/* Success state */
.border-green-300.focus:ring-2.focus:ring-green-500
```

### Select Component
**Purpose**: Reusable select dropdown with search functionality

#### Props
```typescript
interface SelectProps {
  options: SelectOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

#### Usage
```typescript
import { Select } from '@/components/ui/Select';

<Select
  options={operatorOptions}
  value={selectedOperator}
  onChange={handleOperatorChange}
  placeholder="Select operator"
  searchable={true}
/>
```

### Modal Component
**Purpose**: Reusable modal dialog component

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closable?: boolean;
}
```

#### Usage
```typescript
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={handleModalClose}
  title="Export Configuration"
  size="md"
  footer={
    <div className="flex gap-2">
      <Button variant="secondary" onClick={handleModalClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleExport}>
        Export
      </Button>
    </div>
  }
>
  <p>Are you sure you want to export this configuration?</p>
</Modal>
```

### Toast Component
**Purpose**: Notification component for user feedback

#### Props
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}
```

#### Usage
```typescript
import { Toast } from '@/components/ui/Toast';

<Toast
  message="Configuration saved successfully"
  type="success"
  duration={3000}
  onClose={handleToastClose}
/>
```

## Form Components

### FormField Component
**Purpose**: Wrapper component for form fields with label and validation

#### Props
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

#### Usage
```typescript
import { FormField } from '@/components/form/FormField';

<FormField
  label="Family Income"
  error={errors.familyIncome}
  helperText="Enter annual family income"
  required={true}
>
  <Input
    type="number"
    value={familyIncome}
    onChange={handleIncomeChange}
  />
</FormField>
```

### FormGroup Component
**Purpose**: Groups related form fields together

#### Props
```typescript
interface FormGroupProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}
```

#### Usage
```typescript
import { FormGroup } from '@/components/form/FormGroup';

<FormGroup
  title="Personal Information"
  description="Enter your personal details"
>
  <FormField label="Name">
    <Input value={name} onChange={handleNameChange} />
  </FormField>
  <FormField label="Email">
    <Input type="email" value={email} onChange={handleEmailChange} />
  </FormField>
</FormGroup>
```

### ValidationMessage Component
**Purpose**: Display validation errors and messages

#### Props
```typescript
interface ValidationMessageProps {
  errors: string[];
  warnings?: string[];
  type: 'error' | 'warning' | 'info';
}
```

#### Usage
```typescript
import { ValidationMessage } from '@/components/form/ValidationMessage';

<ValidationMessage
  errors={validationErrors}
  warnings={validationWarnings}
  type="error"
/>
```

## Utility Components

### ErrorBoundary Component
**Purpose**: Catch and handle React component errors

#### Props
```typescript
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<ErrorBoundaryState>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
}
```

#### Usage
```typescript
import { ErrorBoundary } from '@/components/utility/ErrorBoundary';

<ErrorBoundary
  fallback={ErrorFallback}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### LoadingSpinner Component
**Purpose**: Loading indicator component

#### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
}
```

#### Usage
```typescript
import { LoadingSpinner } from '@/components/utility/LoadingSpinner';

<LoadingSpinner
  size="md"
  color="primary"
  text="Loading configuration..."
/>
```

### ConfirmDialog Component
**Purpose**: Confirmation dialog for destructive actions

#### Props
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  dangerous?: boolean;
}
```

#### Usage
```typescript
import { ConfirmDialog } from '@/components/utility/ConfirmDialog';

<ConfirmDialog
  isOpen={isConfirmOpen}
  onClose={handleConfirmClose}
  onConfirm={handleDeleteConfirm}
  title="Delete Rule"
  message="Are you sure you want to delete this rule? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  dangerous={true}
/>
```

## Styling Guidelines

### Design Tokens
```css
/* Colors */
--color-primary: #3B82F6; /* Blue-500 */
--color-secondary: #6B7280; /* Gray-500 */
--color-success: #10B981; /* Emerald-500 */
--color-warning: #F59E0B; /* Amber-500 */
--color-error: #EF4444; /* Red-500 */

/* Spacing */
--spacing-xs: 0.25rem; /* 4px */
--spacing-sm: 0.5rem; /* 8px */
--spacing-md: 1rem; /* 16px */
--spacing-lg: 1.5rem; /* 24px */
--spacing-xl: 2rem; /* 32px */

/* Typography */
--font-size-xs: 0.75rem; /* 12px */
--font-size-sm: 0.875rem; /* 14px */
--font-size-base: 1rem; /* 16px */
--font-size-lg: 1.125rem; /* 18px */
--font-size-xl: 1.25rem; /* 20px */
```

### Component Styling Patterns
```css
/* Card component pattern */
.card {
  @apply bg-white rounded-lg shadow-sm border p-6;
}

/* Button component pattern */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

/* Form field pattern */
.form-field {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
```

### Responsive Design
```css
/* Mobile first approach */
.container {
  @apply px-4 mx-auto;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    @apply px-6;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    @apply px-8 max-w-7xl;
  }
}
```

## Best Practices

### Component Development
1. **Single Responsibility**: Each component should have one clear purpose
2. **Prop Validation**: Use TypeScript interfaces for prop validation
3. **Default Props**: Provide sensible defaults for optional props
4. **Error Handling**: Implement proper error boundaries
5. **Accessibility**: Include ARIA labels and keyboard navigation

### Performance Optimization
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* Component content */}</div>;
});

// Use useMemo for expensive calculations
const processedData = useMemo(() => {
  return processData(rawData);
}, [rawData]);

// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

### State Management
```typescript
// Use custom hooks for complex state logic
const useFormState = (initialState: FormState) => {
  const [state, setState] = useState(initialState);
  
  const updateField = useCallback((field: string, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);
  
  const resetForm = useCallback(() => {
    setState(initialState);
  }, [initialState]);
  
  return { state, updateField, resetForm };
};
```

### Testing Components
```typescript
// Component testing pattern
describe('ConfigInput Component', () => {
  const defaultProps = {
    onConfigLoad: jest.fn()
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders without crashing', () => {
    render(<ConfigInput {...defaultProps} />);
  });
  
  test('calls onConfigLoad when valid config is loaded', () => {
    const { getByText } = render(<ConfigInput {...defaultProps} />);
    const loadButton = getByText('Load Configuration');
    
    fireEvent.click(loadButton);
    
    expect(defaultProps.onConfigLoad).toHaveBeenCalled();
  });
});
```

### Code Organization
```typescript
// Component file structure
src/components/ComponentName/
├── ComponentName.tsx          // Main component
├── ComponentName.test.tsx     // Tests
├── ComponentName.stories.tsx  // Storybook stories
├── types.ts                   // Type definitions
├── utils.ts                   // Utility functions
└── index.ts                   // Export file
```

### Documentation
```typescript
/**
 * ConfigInput Component
 * 
 * A component for inputting and validating configuration files.
 * Supports JSON file upload, validation, and sample data loading.
 * 
 * @example
 * ```tsx
 * <ConfigInput onConfigLoad={handleConfigLoad} />
 * ```
 */
interface ConfigInputProps {
  /** Callback fired when configuration is loaded */
  onConfigLoad: (config: Configuration) => void;
  /** Optional initial configuration text */
  initialConfig?: string;
  /** Whether to show sample data button */
  showSampleButton?: boolean;
}
```

---

## Component File Structure

```
src/components/
├── ConfigInput/           # Tab 1
│   └── ConfigInput.tsx
├── EligibilityBuilder/    # Tab 2
│   └── EligibilityBuilder.tsx
├── RankingBuilder/        # Tab 3
│   └── RankingBuilder.tsx
├── RuleBuilder/           # Tab 4
│   ├── RuleBuilder.tsx
│   ├── ConditionBuilder.tsx
│   ├── DataSelector.tsx
│   └── OperationSelector.tsx
├── SelectionBuilder/      # Tab 5
│   └── SelectionBuilder.tsx
├── ScoreMethodBuilder/    # Tab 6
│   └── ScoreMethodBuilder.tsx
├── JsonPreview/          # Tab 7
│   └── JsonPreview.tsx
├── AssignmentMethodBuilder/
│   └── AssignmentMethodBuilder.tsx
└── QueryValidator/
    └── QueryValidator.ts
```

## Technology Integration

### State Management with Zustand
```typescript
// queryStore.ts
interface QueryStore {
  query: QueryStructure;
  updateRules: (rules: Rule[]) => void;
  updateSelections: (selections: Selection[]) => void;
  updateScoreMethod: (scoreMethods: ScoreMethod[]) => void;
  resetQuery: () => void;
  importQuery: (query: QueryStructure) => boolean;
}
```

### Validation with Zod
```typescript
// Validation schemas
const RuleSchema = z.object({
  Data: z.array(DataBlockSchema),
  scoreMethod: z.array(ScoreMethodSchema).optional(),
  assignMethod: z.array(AssignMethodSchema).optional()
});
```

### Drag and Drop with DND Kit
```typescript
// Rule reordering
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
```

### Form Handling with React Hook Form
```typescript
// Form management
const { register, handleSubmit, formState: { errors }, setValue } = useForm();
```

## Branch Development Strategy

### Development Workflow
- **Main Branch**: `main` - Stable releases
- **Development Branch**: `r_and_d` - Active development
- **Feature Branches**: Created from `r_and_d` for specific features

### Component Development
1. Create feature branch from `r_and_d`
2. Develop component with TypeScript
3. Add Tailwind styling
4. Integrate with Zustand store
5. Add validation with Zod
6. Test component functionality
7. Create pull request to `r_and_d`

---

*Last Updated: January 2025*
*Version: 2.0.0*
*Updated for React 18 + TypeScript + Vite + 7-Tab Architecture*