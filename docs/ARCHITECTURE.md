# Custom Query Builder - Architecture Documentation

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Component Hierarchy](#component-hierarchy)
3. [Data Flow Architecture](#data-flow-architecture)
4. [State Management](#state-management)
5. [File Structure](#file-structure)
6. [Design Patterns](#design-patterns)
7. [Integration Points](#integration-points)
8. [Architecture Decisions](#architecture-decisions)

## System Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     React 18 + TypeScript + Vite                   │
├─────────────────────────────────────────────────────────────────────┤
│                          7-Tab Interface                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │   Config    │ │ Eligibility │ │   Ranking   │ │    Rules    │  │
│  │   Input     │ │   Builder   │ │   Builder   │ │   Builder   │  │
│  │   (Tab 1)   │ │   (Tab 2)   │ │   (Tab 3)   │ │   (Tab 4)   │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                  │
│  │  Selection  │ │   Scoring   │ │    JSON     │                  │
│  │   Builder   │ │   Builder   │ │   Preview   │                  │
│  │   (Tab 5)   │ │   (Tab 6)   │ │   (Tab 7)   │                  │
│  └─────────────┘ └─────────────┘ └─────────────┘                  │
├─────────────────────────────────────────────────────────────────────┤
│                        Shared Components                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │  Validation │ │  DnD Kit    │ │  Tailwind   │ │  Lucide     │  │
│  │  (Zod)      │ │  (Sorting)  │ │  (Styling)  │ │  (Icons)    │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                       State Management                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │   Zustand   │ │ React Hook  │ │    Local    │ │ Validation  │  │
│  │    Store    │ │    Form     │ │   Storage   │ │    State    │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│                        Build & Dev Tools                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │    Vite     │ │ TypeScript  │ │   ESLint    │ │   PostCSS   │  │
│  │   (Build)   │ │  (Types)    │ │  (Linting)  │ │   (CSS)     │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Single Responsibility**: Each tab and component has one clear purpose
2. **Separation of Concerns**: UI, logic, and data are distinctly separated
3. **Composition over Inheritance**: Components are composed rather than inherited
4. **Immutability**: State updates are immutable using Zustand
5. **Declarative**: UI describes what should be rendered, not how
6. **Type Safety**: Full TypeScript coverage for runtime safety
7. **Performance**: Optimized with React 18 features and Vite HMR
8. **Developer Experience**: Modern tooling with fast feedback loops

## Component Hierarchy

### Main Application Structure

```
App
├── Header (Navigation & Actions)
├── TabNavigation
│   ├── ConfigInput
│   ├── EligibilityBuilder
│   ├── RankingBuilder
│   ├── RuleBuilder
│   ├── SelectionBuilder
│   ├── ScoreMethodBuilder
│   └── JsonPreview
└── Footer (Status & Metadata)
```

### Component Dependency Graph

```
App
├── ConfigInput
│   ├── FileUpload
│   ├── JSONEditor
│   └── ValidationDisplay
├── EligibilityBuilder
│   ├── RuleCreator
│   ├── OperatorSelector
│   ├── ValueInput
│   └── LogicConnector
├── RankingBuilder
│   ├── ScoringMethodSelector
│   ├── AssignmentMethodBuilder
│   ├── WeightConfiguration
│   └── PreviewPanel
├── RuleBuilder
│   ├── ConditionBuilder
│   ├── DataSelector
│   ├── OperationSelector
│   └── RuleValidator
├── SelectionBuilder
│   ├── QuantitySelector
│   ├── SortMethodBuilder
│   └── SelectionPreview
├── ScoreMethodBuilder
│   ├── OperationSelector
│   ├── ValueInput
│   └── MethodPreview
└── JsonPreview
    ├── JSONFormatter
    ├── ValidationResults
    └── ExportControls
```

## Data Flow Architecture

### Unidirectional Data Flow

```
User Input → Component → State Update → UI Re-render
    ↓           ↓           ↓             ↓
  Events   → Handlers → Store Actions → View Updates
```

### Detailed Data Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Action   │───▶│  Event Handler  │───▶│  State Update   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Re-render  │◀───│   Subscribers   │◀───│   Store Change  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### State Flow Example

```javascript
// User clicks "Add Rule" button
onClick() 
  → addRule() 
  → updateRules(newRules) 
  → store.setState({rules: newRules})
  → Component re-renders with new rules
```

## State Management

### Zustand Store Architecture

```javascript
interface QueryStore {
  // Core State
  query: QueryStructure;
  validationResult: ValidationResult;
  
  // Configuration State
  config: ConfigurationData;
  
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
  
  // Validation Actions
  validateQuery: () => ValidationResult;
  clearErrors: () => void;
}
```

### State Layers

1. **Application State**: Global application state managed by Zustand
2. **Component State**: Local component state using React hooks
3. **Form State**: Form-specific state using React Hook Form
4. **Derived State**: Computed values derived from primary state

### State Update Patterns

```javascript
// Immutable Updates
const updateRule = (ruleIndex: number, newRule: Rule) => {
  const updatedRules = rules.map((rule, index) => 
    index === ruleIndex ? { ...rule, ...newRule } : rule
  );
  updateRules(updatedRules);
};

// Batch Updates
const updateMultipleFields = (updates: Partial<QueryStructure>) => {
  setState(state => ({ ...state, ...updates }));
};
```

## File Structure

### Project Organization

```
src/
├── components/                 # React components
│   ├── AssignmentMethodBuilder/
│   │   └── AssignmentMethodBuilder.tsx
│   ├── ConfigInput/
│   │   └── ConfigInput.tsx
│   ├── EligibilityBuilder/
│   │   └── EligibilityBuilder.tsx
│   ├── JsonPreview/
│   │   └── JsonPreview.tsx
│   ├── QueryValidator/
│   │   └── QueryValidator.ts
│   ├── RankingBuilder/
│   │   └── RankingBuilder.tsx
│   ├── RuleBuilder/
│   │   ├── ConditionBuilder.tsx
│   │   ├── DataSelector.tsx
│   │   ├── OperationSelector.tsx
│   │   └── RuleBuilder.tsx
│   ├── ScoreMethodBuilder/
│   │   └── ScoreMethodBuilder.tsx
│   └── SelectionBuilder/
│       └── SelectionBuilder.tsx
├── hooks/                     # Custom React hooks
├── store/                     # State management
│   └── queryStore.ts
├── types/                     # TypeScript definitions
│   └── index.ts
├── utils/                     # Utility functions
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

### Component Organization Principles

1. **Feature-Based Structure**: Components grouped by functionality
2. **Co-location**: Related files kept together
3. **Clear Naming**: Descriptive component and file names
4. **Separation**: Logic separated from presentation

## Design Patterns

### 1. Container/Presentation Pattern

```typescript
// Container Component (Logic)
const EligibilityContainer = () => {
  const [eligibility, setEligibility] = useState<Eligibility>();
  const handleRuleChange = (rule: Rule) => {
    // Business logic here
  };
  
  return (
    <EligibilityPresentation
      eligibility={eligibility}
      onRuleChange={handleRuleChange}
    />
  );
};

// Presentation Component (UI)
const EligibilityPresentation = ({ eligibility, onRuleChange }) => {
  return (
    <div>
      {/* UI elements */}
    </div>
  );
};
```

### 2. Custom Hooks Pattern

```typescript
// Custom hook for rule management
const useRuleManager = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  
  const addRule = (rule: Rule) => {
    setRules(prevRules => [...prevRules, rule]);
  };
  
  const removeRule = (index: number) => {
    setRules(prevRules => prevRules.filter((_, i) => i !== index));
  };
  
  return { rules, addRule, removeRule };
};
```

### 3. Builder Pattern

```typescript
// Query Builder Pattern
class QueryBuilder {
  private query: QueryStructure = {};
  
  addRule(rule: Rule): QueryBuilder {
    this.query.rules = [...(this.query.rules || []), rule];
    return this;
  }
  
  setCondition(condition: string): QueryBuilder {
    this.query.condition = condition;
    return this;
  }
  
  build(): QueryStructure {
    return { ...this.query };
  }
}
```

### 4. Observer Pattern

```typescript
// State subscription pattern
const useQuerySubscription = (selector: (state: QueryStore) => any) => {
  const selectedState = useQueryStore(selector);
  
  useEffect(() => {
    // Side effects when selected state changes
  }, [selectedState]);
  
  return selectedState;
};
```

### 5. Strategy Pattern

```typescript
// Validation strategies
interface ValidationStrategy {
  validate(data: any): ValidationResult;
}

class RuleValidationStrategy implements ValidationStrategy {
  validate(rule: Rule): ValidationResult {
    // Rule-specific validation logic
  }
}

class ConfigValidationStrategy implements ValidationStrategy {
  validate(config: Configuration): ValidationResult {
    // Config-specific validation logic
  }
}
```

## Integration Points

### 1. External Data Sources

```typescript
// Configuration import
interface ConfigurationImporter {
  importFromFile(file: File): Promise<Configuration>;
  importFromJSON(json: string): Configuration;
  validate(config: Configuration): ValidationResult;
}
```

### 2. Export Interfaces

```typescript
// Query export
interface QueryExporter {
  exportToJSON(query: QueryStructure): string;
  exportToFile(query: QueryStructure, filename: string): void;
  exportTemplate(query: QueryStructure): Template;
}
```

### 3. Validation Engine

```typescript
// Validation pipeline
interface ValidationEngine {
  validateQuery(query: QueryStructure): ValidationResult;
  validateRule(rule: Rule): ValidationResult;
  validateConfiguration(config: Configuration): ValidationResult;
}
```

### 4. Type System Integration

```typescript
// Type definitions for external systems
interface ExternalAPIQuery {
  eligibility: EligibilityQuery;
  ranking: RankingQuery;
  metadata: QueryMetadata;
}
```

## Architecture Decisions

### ADR-001: State Management Library Choice

**Decision**: Use Zustand for global state management

**Rationale**:
- Lightweight and minimal boilerplate
- Excellent TypeScript support
- Simple API for complex state operations
- No context provider requirements

**Alternatives Considered**:
- Redux Toolkit: Too heavyweight for this use case
- Context API: Performance issues with frequent updates
- Jotai: Less mature ecosystem

### ADR-002: Component Architecture

**Decision**: Adopt functional components with hooks

**Rationale**:
- Modern React best practices
- Better performance characteristics
- Simpler testing and debugging
- Easier state management

**Alternatives Considered**:
- Class components: Legacy approach
- Component composition: Too complex for this scale

### ADR-003: Validation Strategy

**Decision**: Client-side validation with Zod

**Rationale**:
- Runtime type validation
- Excellent TypeScript integration
- Composable validation schemas
- Good error messages

**Alternatives Considered**:
- Joi: Less TypeScript integration
- Yup: Limited runtime validation
- Custom validation: Maintenance overhead

### ADR-004: Styling Approach

**Decision**: Tailwind CSS for styling

**Rationale**:
- Utility-first approach
- Consistent design system
- Excellent developer experience
- Small bundle size

**Alternatives Considered**:
- CSS Modules: More verbose
- Styled Components: Runtime overhead
- Plain CSS: Maintenance challenges

### ADR-005: Build Tool

**Decision**: Vite for development and build

**Rationale**:
- Fast development server with HMR
- Modern ES modules support
- Excellent TypeScript integration
- Optimized production builds
- Simple configuration
- Great developer experience

**Alternatives Considered**:
- Create React App: Slower development, ejection required
- Webpack: More complex configuration
- Parcel: Less ecosystem support

### ADR-006: Branch Strategy

**Decision**: Use `r_and_d` branch for active development

**Rationale**:
- Separates experimental features from stable main
- Allows safe collaboration and testing
- Enables proper code review workflow
- Maintains clean main branch for releases

**Implementation**:
- `main` branch: Stable releases only
- `r_and_d` branch: Active development and features
- Feature branches: Created from `r_and_d` for specific features

## Performance Considerations

### 1. Component Optimization

```typescript
// Memoization for expensive operations
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return processData(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```

### 2. State Updates

```typescript
// Debounced state updates
const useDebounceState = (initialValue: any, delay: number) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return [debouncedValue, setValue];
};
```

### 3. Bundle Optimization

```typescript
// Code splitting
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

## Security Architecture

### 1. Input Sanitization

```typescript
// Sanitize user inputs
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### 2. Validation Security

```typescript
// Secure validation
const validateUserInput = (input: any): ValidationResult => {
  // Whitelist validation
  const allowedFields = ['field1', 'field2'];
  const validatedInput = pick(input, allowedFields);
  
  return validate(validatedInput);
};
```

## Error Handling Architecture

### 1. Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

### 2. Error Handling Patterns

```typescript
// Result pattern for error handling
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

const processQuery = (query: QueryStructure): Result<ProcessedQuery, ValidationError> => {
  try {
    const processed = validate(query);
    return { success: true, data: processed };
  } catch (error) {
    return { success: false, error: error as ValidationError };
  }
};
```

---

## Technology Stack Summary

### Core Technologies
- **React 18**: Modern React with concurrent features
- **TypeScript 5.2**: Type safety and developer experience
- **Vite 4.5**: Fast build tool and dev server
- **Tailwind CSS 3.3**: Utility-first CSS framework

### State Management
- **Zustand 4.4**: Lightweight state management
- **React Hook Form 7.48**: Form state management
- **Zod 3.22**: Runtime validation

### UI & Interaction
- **DND Kit**: Drag and drop functionality
- **Lucide React**: Modern icon library
- **PostCSS**: CSS processing

### Development Tools
- **ESLint**: Code linting and quality
- **TypeScript ESLint**: TypeScript-specific linting
- **Autoprefixer**: CSS vendor prefixes

### Project Structure
```
src/
├── components/          # All React components
│   ├── ConfigInput/     # Tab 1: Configuration input
│   ├── EligibilityBuilder/ # Tab 2: Eligibility criteria
│   ├── RankingBuilder/  # Tab 3: Ranking algorithms
│   ├── RuleBuilder/     # Tab 4: Visual rule builder
│   ├── SelectionBuilder/ # Tab 5: Selection & sorting
│   ├── ScoreMethodBuilder/ # Tab 6: Global scoring
│   ├── JsonPreview/     # Tab 7: JSON output
│   └── QueryValidator/  # Validation logic
├── store/              # Zustand state management
├── types/              # TypeScript definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── App.tsx             # Main application
└── main.tsx            # Entry point
```

---

*Last Updated: January 2025*
*Version: 2.0.0*
*Architecture for Custom Query Builder with React 18 + TypeScript + Vite*