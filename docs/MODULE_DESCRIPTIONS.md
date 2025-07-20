# React No-Code Query Builder - Module Descriptions

## Table of Contents
1. [Core Application Module](#core-application-module)
2. [Configuration Management](#configuration-management)
3. [Query Builder Modules](#query-builder-modules)
4. [Validation Module](#validation-module)
5. [State Management Module](#state-management-module)
6. [UI Components](#ui-components)
7. [Utility Modules](#utility-modules)
8. [Type Definitions](#type-definitions)

## Core Application Module

### App.tsx
**Purpose**: Main application component that orchestrates the entire query builder interface

**Responsibilities**:
- Tab navigation management
- Global state coordination
- Error boundary handling
- User interface layout

**Key Features**:
- Tabbed interface with 7 main sections
- Real-time validation status display
- Import/export functionality
- Responsive design implementation

**Props**: None (Root component)

**State Management**:
- Active tab tracking
- Configuration data storage
- Eligibility and ranking query storage
- Validation result management

**Dependencies**:
- All major UI components
- Zustand store for state management
- React hooks for local state

**Usage Example**:
```typescript
// Main application entry point
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

**Error Handling**:
- Graceful fallback for component errors
- Validation error display
- User-friendly error messages

## Configuration Management

### ConfigInput.tsx
**Purpose**: Handles configuration file input, validation, and management

**Responsibilities**:
- JSON file upload and parsing
- Configuration validation
- Sample data loading
- User input sanitization

**Key Features**:
- File drag-and-drop support
- Real-time JSON validation
- Sample configuration loading
- Error message display

**Props**:
```typescript
interface ConfigInputProps {
  onConfigLoad: (config: any) => void;
}
```

**State Management**:
- Configuration text storage
- Validation state tracking
- Error message management

**Methods**:
- `handleConfigChange(value: string)`: Updates configuration text
- `validateAndLoadConfig()`: Validates and loads configuration
- `handleFileUpload(event)`: Processes file uploads
- `loadSampleConfig()`: Loads predefined sample data

**Validation Rules**:
- Valid JSON structure
- Required fields presence
- Data type validation
- Schema compliance

**Error Handling**:
- JSON parsing errors
- File reading errors
- Validation failures
- Network errors (if applicable)

## Query Builder Modules

### EligibilityBuilder.tsx
**Purpose**: Visual interface for creating eligibility criteria and rules

**Responsibilities**:
- Rule creation and management
- Operator selection
- Value input handling
- Conditional logic configuration

**Key Features**:
- Visual rule builder interface
- Multiple operator support (in, between, equals, etc.)
- AND/OR logic combinations
- Course-specific rule configuration

**Props**:
```typescript
interface EligibilityBuilderProps {
  config?: any;
  onEligibilityChange: (eligibility: any) => void;
}
```

**State Management**:
- Eligibility rule storage
- Sign and condition settings
- Field creation configuration

**Methods**:
- `addRule()`: Adds new eligibility rule
- `removeRule(index)`: Removes rule at specified index
- `updateRule(index, field, value)`: Updates existing rule
- `handleValueChange(index, value)`: Processes value changes
- `loadSampleEligibility()`: Loads sample eligibility data
- `exportEligibility()`: Exports current eligibility configuration

**Supported Operators**:
- `in`: Value must be in specified array
- `between`: Value must be within range
- `equals`: Value must equal specified value
- `greater_than`: Value must be greater than specified value
- `less_than`: Value must be less than specified value
- `not_in`: Value must not be in specified array

**Data Structure**:
```typescript
interface EligibilityRule {
  step_name: string;
  field_key: string;
  operator: string;
  value: any;
  course?: string[];
}
```

### RankingBuilder.tsx
**Purpose**: Visual interface for creating ranking algorithms and scoring methods

**Responsibilities**:
- Ranking rule creation
- Scoring method configuration
- Assignment method setup
- Weight distribution management

**Key Features**:
- Multiple scoring methods (Percentile, Multiplication, Addition, Inverse)
- Assignment-based scoring with option matching
- Conditional scoring rules
- Weight-based scoring combinations

**Props**:
```typescript
interface RankingBuilderProps {
  config?: any;
  onRankingChange: (ranking: any) => void;
}
```

**State Management**:
- Ranking rule storage
- Selection criteria configuration
- Global scoring method settings

**Methods**:
- `addRule()`: Adds new ranking rule
- `removeRule(index)`: Removes rule at specified index
- `updateRule(index, field, value)`: Updates existing rule
- `toggleRuleType(index, type)`: Switches between score and assign methods
- `addAssignMethod(ruleIndex)`: Adds assignment method option
- `removeAssignMethod(ruleIndex, assignIndex)`: Removes assignment option
- `updateAssignMethod()`: Updates assignment method configuration
- `loadSampleRanking()`: Loads sample ranking data
- `exportRanking()`: Exports current ranking configuration

**Scoring Methods**:
- `Percentile`: Calculates percentile rank
- `Multiplication`: Multiplies values
- `Addition`: Adds values
- `Inverse`: Inverts values for inverse scoring

**Assignment Methods**:
- Value-option mapping
- Default value assignment
- Empty value handling
- Multi-option support

### RuleBuilder.tsx
**Purpose**: Advanced rule creation interface with complex condition support

**Responsibilities**:
- Complex rule creation
- Conditional logic setup
- Data field selection
- Operation configuration

**Key Features**:
- Drag-and-drop rule building
- Complex conditional logic
- Multiple data source support
- Real-time validation

**Props**:
```typescript
interface RuleBuilderProps {
  rules: Rule[];
  onChange: (rules: Rule[]) => void;
}
```

**Sub-Components**:
- `ConditionBuilder`: Handles condition creation
- `DataSelector`: Manages data field selection
- `OperationSelector`: Provides operation selection interface

**Methods**:
- `addRule()`: Adds new rule
- `removeRule(index)`: Removes rule
- `updateRule(index, updates)`: Updates rule properties
- `validateRule(rule)`: Validates rule configuration
- `duplicateRule(index)`: Duplicates existing rule

## Validation Module

### QueryValidator.ts
**Purpose**: Comprehensive validation engine for query structures

**Responsibilities**:
- Query structure validation
- Rule consistency checking
- Data type validation
- Performance impact assessment

**Key Features**:
- Multi-level validation
- Detailed error reporting
- Performance warnings
- Compatibility checking

**Methods**:
```typescript
class QueryValidator {
  static validateQuery(query: QueryStructure): ValidationResult;
  static validateRule(rule: Rule): ValidationResult;
  static validateSelection(selection: Selection): ValidationResult;
  static validateScoreMethod(scoreMethod: ScoreMethod): ValidationResult;
}
```

**Validation Types**:
- **Structural**: Validates object structure
- **Semantic**: Validates logical consistency
- **Performance**: Checks for performance issues
- **Compatibility**: Ensures backend compatibility

**Error Categories**:
- **Critical**: Prevents query execution
- **Warning**: May cause issues
- **Info**: Optimization suggestions
- **Deprecated**: Legacy feature usage

## State Management Module

### queryStore.ts
**Purpose**: Centralized state management using Zustand

**Responsibilities**:
- Global state management
- State persistence
- Action dispatch
- Subscriber management

**State Structure**:
```typescript
interface QueryStore {
  // Core Query State
  query: QueryBuilderSchema;
  
  // Validation State
  validationResult: ValidationResult;
  
  // UI State
  activeTab: TabType;
  isLoading: boolean;
  errors: ErrorState[];
  
  // Actions
  updateRules: (rules: Rule[]) => void;
  updateSelections: (selections: Selection[]) => void;
  updateScoreMethod: (scoreMethods: ScoreMethod[]) => void;
  resetQuery: () => void;
  importQuery: (query: QueryStructure) => boolean;
  validateQuery: () => ValidationResult;
}
```

**Actions**:
- `updateRules`: Updates rule configurations
- `updateSelections`: Updates selection criteria
- `updateScoreMethod`: Updates scoring methods
- `resetQuery`: Resets query to initial state
- `importQuery`: Imports external query configuration
- `validateQuery`: Triggers validation process

**Middleware**:
- Persistence middleware for local storage
- Validation middleware for automatic validation
- Logger middleware for debugging

## UI Components

### JsonPreview.tsx
**Purpose**: JSON output visualization and export functionality

**Responsibilities**:
- JSON formatting and display
- Syntax highlighting
- Export functionality
- Validation result display

**Key Features**:
- Formatted JSON display
- Copy-to-clipboard functionality
- Download as file
- Validation status integration

**Props**:
```typescript
interface JsonPreviewProps {
  query: QueryStructure;
  isValid: boolean;
  validationErrors: string[];
}
```

**Methods**:
- `formatJSON(query)`: Formats JSON for display
- `copyToClipboard()`: Copies JSON to clipboard
- `downloadJSON()`: Downloads JSON as file
- `validateAndExport()`: Validates before export

### SelectionBuilder.tsx
**Purpose**: Interface for configuring selection criteria and sorting

**Responsibilities**:
- Selection quantity configuration
- Sort method setup
- Sort order specification
- Selection preview

**Key Features**:
- Quantity-based selection
- Multiple sort criteria
- Ascending/descending options
- Real-time preview

**Props**:
```typescript
interface SelectionBuilderProps {
  selections: Selection[];
  onChange: (selections: Selection[]) => void;
}
```

**Methods**:
- `addSelection()`: Adds new selection criteria
- `removeSelection(index)`: Removes selection criteria
- `updateSelection(index, updates)`: Updates selection properties
- `addSortMethod(selectionIndex)`: Adds sort method
- `removeSortMethod(selectionIndex, sortIndex)`: Removes sort method

### ScoreMethodBuilder.tsx
**Purpose**: Interface for configuring global scoring methods

**Responsibilities**:
- Global scoring method configuration
- Operation selection
- Value input handling
- Method combination setup

**Key Features**:
- Multiple operation support
- Value configuration
- Method chaining
- Preview functionality

**Props**:
```typescript
interface ScoreMethodBuilderProps {
  scoreMethods: ScoreMethod[];
  onChange: (scoreMethods: ScoreMethod[]) => void;
  title: string;
  showDropEmptyRow?: boolean;
}
```

**Methods**:
- `addScoreMethod()`: Adds new scoring method
- `removeScoreMethod(index)`: Removes scoring method
- `updateScoreMethod(index, updates)`: Updates method properties
- `previewScoring()`: Shows scoring preview

### AssignmentMethodBuilder.tsx
**Purpose**: Interface for configuring assignment-based scoring

**Responsibilities**:
- Assignment method configuration
- Value-option mapping
- Default value setup
- Multi-option support

**Key Features**:
- Value-option pair management
- Default value configuration
- Empty value handling
- Multi-select options

**Props**:
```typescript
interface AssignmentMethodBuilderProps {
  assignMethods: AssignMethod[];
  onChange: (assignMethods: AssignMethod[]) => void;
  title: string;
}
```

**Methods**:
- `addAssignMethod()`: Adds new assignment method
- `removeAssignMethod(index)`: Removes assignment method
- `updateAssignMethod(index, updates)`: Updates method properties
- `addOption(methodIndex)`: Adds option to assignment method
- `removeOption(methodIndex, optionIndex)`: Removes option

## Utility Modules

### Type Definitions (types/index.ts)
**Purpose**: Comprehensive TypeScript type definitions

**Key Types**:
```typescript
// Core Query Structure
interface QueryBuilderSchema {
  rules: Rule[];
  Selection: Selection[];
  scoreMethod: ScoreMethod[];
}

// Rule Definition
interface Rule {
  Data: DataBlock[];
  scoreMethod?: ScoreMethod[];
  assignMethod?: AssignMethod[];
}

// Data Block
interface DataBlock {
  if: Condition[];
  get: Field[];
}

// Condition
interface Condition {
  field_key: string;
  step_name: string;
  operator: OperatorType;
  value: string[] | number[] | string | number;
}

// Field
interface Field {
  field_key: string;
  step_name: string;
  course?: string;
}

// Score Method
interface ScoreMethod {
  value: string | number;
  operation: OperationType;
  dropEmptyRow?: 'all' | 'none';
}

// Assignment Method
interface AssignMethod {
  value: number;
  option: string | string[];
}

// Selection
interface Selection {
  quantity: {
    sortOrder: SortOrderType;
  };
  sortMethod: SortMethod[];
}

// Sort Method
interface SortMethod {
  Data: DataBlock[];
  sortOrder: SortOrderType;
}
```

**Enums and Unions**:
```typescript
type OperatorType = 'in' | 'equals' | 'not equals';
type OperationType = 'Percentile' | 'Multiplication' | 'Addition' | 'many2one' | 'Inverse' | 'None';
type SortOrderType = 'Ascending' | 'Descending';
```

**Utility Types**:
```typescript
interface FieldOption {
  field_key: string;
  step_name: string;
  display_name: string;
  course?: string;
}

interface StepOption {
  step_name: string;
  display_name: string;
  fields: FieldOption[];
}
```

## Integration Points

### External API Integration
- Configuration import endpoints
- Query export endpoints
- Validation service integration
- Template management APIs

### Backend Data Flow
```typescript
// Query submission flow
Client Query → Validation → Transformation → Backend API → Response
```

### Error Handling Integration
- Global error boundary
- Component-level error handling
- Validation error propagation
- User notification system

## Performance Considerations

### Optimization Strategies
1. **Component Memoization**: Using React.memo for expensive renders
2. **State Optimization**: Minimizing re-renders with proper state structure
3. **Lazy Loading**: Loading components on demand
4. **Debounced Updates**: Preventing excessive state updates

### Memory Management
- Proper cleanup of event listeners
- State cleanup on component unmount
- Efficient data structures
- Garbage collection optimization

## Testing Strategy

### Unit Testing
- Individual component testing
- State management testing
- Utility function testing
- Type validation testing

### Integration Testing
- Component interaction testing
- State flow testing
- API integration testing
- Error handling testing

### End-to-End Testing
- Complete workflow testing
- User journey testing
- Performance testing
- Accessibility testing

---

*Last Updated: July 2025*
*Version: 1.0.0*