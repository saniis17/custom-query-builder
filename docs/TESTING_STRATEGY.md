# React No-Code Query Builder - Testing Strategy

## Table of Contents
1. [Testing Philosophy](#testing-philosophy)
2. [Testing Pyramid](#testing-pyramid)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Performance Testing](#performance-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Testing Tools and Framework](#testing-tools-and-framework)
9. [CI/CD Integration](#cicd-integration)
10. [Best Practices](#best-practices)

## Testing Philosophy

### Core Principles
1. **Test Confidence**: Tests should provide confidence that the application works as expected
2. **Test Maintainability**: Tests should be easy to maintain and update
3. **Test Speed**: Tests should run quickly to enable fast feedback
4. **Test Isolation**: Tests should be independent and not affect each other
5. **Test Readability**: Tests should be clear and easy to understand

### Testing Goals
- **Quality Assurance**: Ensure code quality and prevent regressions
- **Documentation**: Tests serve as living documentation of system behavior
- **Refactoring Safety**: Enable safe refactoring with confidence
- **Bug Prevention**: Catch issues before they reach production
- **User Experience**: Ensure the application works as users expect

### Testing Mindset
- **Write tests first** (Test-Driven Development when possible)
- **Test behavior, not implementation**
- **Focus on user interactions and outcomes**
- **Maintain test coverage without obsessing over 100%**
- **Prioritize critical paths and edge cases**

## Testing Pyramid

### Structure Overview
```
        /\
       /  \
      /E2E \     5% - End-to-End Tests
     /______\
    /        \
   /Integration\ 15% - Integration Tests
  /__________\
 /            \
/   Unit Tests  \ 80% - Unit Tests
/________________\
```

### Test Distribution
- **Unit Tests (80%)**: Fast, isolated tests for individual components and functions
- **Integration Tests (15%)**: Tests for component interactions and data flow
- **End-to-End Tests (5%)**: Full user journey tests in browser environment

## Unit Testing

### Framework Setup
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Component Testing Patterns

#### Basic Component Test
```typescript
// ConfigInput.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfigInput } from '@/components/ConfigInput/ConfigInput';

describe('ConfigInput Component', () => {
  const mockOnConfigLoad = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders configuration input form', () => {
    render(<ConfigInput onConfigLoad={mockOnConfigLoad} />);
    
    expect(screen.getByText('Configuration Input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Paste your configuration JSON here...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /load configuration/i })).toBeInTheDocument();
  });
  
  test('validates JSON input correctly', async () => {
    render(<ConfigInput onConfigLoad={mockOnConfigLoad} />);
    
    const textArea = screen.getByPlaceholderText('Paste your configuration JSON here...');
    const loadButton = screen.getByRole('button', { name: /load configuration/i });
    
    // Test invalid JSON
    fireEvent.change(textArea, { target: { value: 'invalid json' } });
    fireEvent.click(loadButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid json format/i)).toBeInTheDocument();
    });
    
    expect(mockOnConfigLoad).not.toHaveBeenCalled();
  });
  
  test('loads valid configuration successfully', async () => {
    const validConfig = {
      ScholarshipInfo: {
        id: "test_123",
        name: "Test Scholarship"
      }
    };
    
    render(<ConfigInput onConfigLoad={mockOnConfigLoad} />);
    
    const textArea = screen.getByPlaceholderText('Paste your configuration JSON here...');
    const loadButton = screen.getByRole('button', { name: /load configuration/i });
    
    fireEvent.change(textArea, { 
      target: { value: JSON.stringify(validConfig) } 
    });
    fireEvent.click(loadButton);
    
    await waitFor(() => {
      expect(mockOnConfigLoad).toHaveBeenCalledWith(validConfig);
    });
  });
});
```

#### Hook Testing
```typescript
// useQueryBuilder.test.ts
import { renderHook, act } from '@testing-library/react';
import { useQueryBuilder } from '@/hooks/useQueryBuilder';

describe('useQueryBuilder Hook', () => {
  test('initializes with empty query', () => {
    const { result } = renderHook(() => useQueryBuilder());
    
    expect(result.current.query).toEqual({
      rules: [],
      Selection: [],
      scoreMethod: []
    });
  });
  
  test('adds rule successfully', () => {
    const { result } = renderHook(() => useQueryBuilder());
    
    const newRule = {
      Data: [{ if: [], get: [{ field_key: 'test', step_name: 'test' }] }],
      scoreMethod: []
    };
    
    act(() => {
      result.current.addRule(newRule);
    });
    
    expect(result.current.query.rules).toHaveLength(1);
    expect(result.current.query.rules[0]).toEqual(newRule);
  });
  
  test('validates query correctly', () => {
    const { result } = renderHook(() => useQueryBuilder());
    
    act(() => {
      result.current.addRule({
        Data: [],
        scoreMethod: []
      });
    });
    
    const validationResult = result.current.validateQuery();
    
    expect(validationResult.isValid).toBe(false);
    expect(validationResult.errors).toContain('Rule must have at least one data selector');
  });
});
```

#### Utility Function Testing
```typescript
// queryValidator.test.ts
import { QueryValidator } from '@/utils/QueryValidator';

describe('QueryValidator', () => {
  test('validates empty query', () => {
    const query = { rules: [], Selection: [], scoreMethod: [] };
    const result = QueryValidator.validateQuery(query);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Query must have at least one rule');
  });
  
  test('validates rule with missing data', () => {
    const rule = { Data: [], scoreMethod: [] };
    const result = QueryValidator.validateRule(rule);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Rule must have at least one data selector');
  });
  
  test('validates rule with invalid operator', () => {
    const rule = {
      Data: [{
        if: [{
          field_key: 'test',
          step_name: 'test',
          operator: 'invalid_operator',
          value: 'test'
        }],
        get: []
      }],
      scoreMethod: []
    };
    
    const result = QueryValidator.validateRule(rule);
    
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid operator: invalid_operator');
  });
});
```

### Mock Strategies

#### API Mocking
```typescript
// __mocks__/api.ts
export const mockApi = {
  getConfiguration: jest.fn(),
  createQuery: jest.fn(),
  validateQuery: jest.fn(),
  exportQuery: jest.fn()
};

// In test files
jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  ...mockApi
}));
```

#### Component Mocking
```typescript
// Mock complex child components
jest.mock('@/components/JsonPreview/JsonPreview', () => ({
  JsonPreview: ({ query, isValid }: any) => (
    <div data-testid="json-preview">
      <div>Query: {JSON.stringify(query)}</div>
      <div>Valid: {isValid ? 'Yes' : 'No'}</div>
    </div>
  )
}));
```

#### Store Mocking
```typescript
// Mock Zustand store
const mockStore = {
  query: { rules: [], Selection: [], scoreMethod: [] },
  updateRules: jest.fn(),
  resetQuery: jest.fn()
};

jest.mock('@/store/queryStore', () => ({
  useQueryStore: () => mockStore
}));
```

## Integration Testing

### Component Integration Tests
```typescript
// EligibilityBuilder.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EligibilityBuilder } from '@/components/EligibilityBuilder/EligibilityBuilder';

describe('EligibilityBuilder Integration', () => {
  const mockConfig = {
    ScholarshipConfig: {
      steps: [
        {
          step_name: 'personal info step',
          fields: [
            { field_key: 'gender', label: 'Gender', valueType: 'string' },
            { field_key: 'income', label: 'Income', valueType: 'number' }
          ]
        }
      ]
    }
  };
  
  test('creates complete eligibility query', async () => {
    const mockOnChange = jest.fn();
    render(
      <EligibilityBuilder 
        config={mockConfig} 
        onEligibilityChange={mockOnChange} 
      />
    );
    
    // Add first rule
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    
    // Configure first rule
    fireEvent.change(screen.getByDisplayValue('personal info step'), {
      target: { value: 'personal info step' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('e.g., familyIncome'), {
      target: { value: 'gender' }
    });
    
    fireEvent.change(screen.getByDisplayValue('in'), {
      target: { value: 'in' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('value1, value2, ...'), {
      target: { value: 'Female' }
    });
    
    // Add second rule
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    
    // Configure second rule
    const fieldInputs = screen.getAllByPlaceholderText('e.g., familyIncome');
    fireEvent.change(fieldInputs[1], {
      target: { value: 'income' }
    });
    
    const operatorSelects = screen.getAllByDisplayValue('in');
    fireEvent.change(operatorSelects[1], {
      target: { value: 'between' }
    });
    
    const valueInputs = screen.getAllByPlaceholderText('value1, value2, ...');
    fireEvent.change(valueInputs[1], {
      target: { value: '0, 500000' }
    });
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        sign: 'None',
        condition: 'AND',
        rules: [
          {
            step_name: 'personal info step',
            field_key: 'gender',
            operator: 'in',
            value: ['Female']
          },
          {
            step_name: 'personal info step',
            field_key: 'income',
            operator: 'between',
            value: [0, 500000]
          }
        ],
        createNewFields: null
      });
    });
  });
});
```

### Data Flow Testing
```typescript
// AppDataFlow.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '@/App';

describe('App Data Flow Integration', () => {
  test('complete user workflow from config to export', async () => {
    render(<App />);
    
    // Step 1: Load configuration
    expect(screen.getByText('Config Input')).toBeInTheDocument();
    
    const configText = JSON.stringify({
      ScholarshipInfo: { id: '123', name: 'Test Scholarship' },
      ScholarshipConfig: { steps: [] }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Paste your configuration JSON here...'), {
      target: { value: configText }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /load configuration/i }));
    
    // Step 2: Switch to eligibility builder
    fireEvent.click(screen.getByText('Eligibility Builder'));
    
    await waitFor(() => {
      expect(screen.getByText('Eligibility Query Builder')).toBeInTheDocument();
    });
    
    // Step 3: Create eligibility rule
    fireEvent.click(screen.getByRole('button', { name: /add rule/i }));
    
    // Configure rule...
    
    // Step 4: Switch to JSON preview
    fireEvent.click(screen.getByText('JSON Preview'));
    
    await waitFor(() => {
      expect(screen.getByText('JSON Preview')).toBeInTheDocument();
    });
    
    // Step 5: Export query
    fireEvent.click(screen.getByRole('button', { name: /export/i }));
    
    // Verify export functionality
    // This would typically check for download initiation
  });
});
```

## End-to-End Testing

### Cypress Setup
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    }
  }
});
```

### E2E Test Examples
```typescript
// cypress/e2e/query-creation.cy.ts
describe('Query Creation Workflow', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  
  it('should create complete eligibility query', () => {
    // Load configuration
    cy.get('[data-testid="config-input"]').should('be.visible');
    cy.get('textarea[placeholder*="configuration JSON"]').type(
      JSON.stringify({
        ScholarshipInfo: { id: '123', name: 'Test Scholarship' },
        ScholarshipConfig: {
          steps: [
            {
              step_name: 'personal info step',
              fields: [
                { field_key: 'gender', label: 'Gender', valueType: 'string' },
                { field_key: 'income', label: 'Income', valueType: 'number' }
              ]
            }
          ]
        }
      })
    );
    cy.get('button').contains('Load Configuration').click();
    
    // Switch to eligibility builder
    cy.get('[data-testid="tab-eligibility"]').click();
    cy.get('h3').contains('Eligibility Query Builder').should('be.visible');
    
    // Add and configure rule
    cy.get('button').contains('Add Rule').click();
    
    cy.get('select').first().select('personal info step');
    cy.get('input[placeholder*="field key"]').type('gender');
    cy.get('select').eq(1).select('in');
    cy.get('input[placeholder*="value"]').type('Female');
    
    // Add second rule
    cy.get('button').contains('Add Rule').click();
    
    cy.get('input[placeholder*="field key"]').eq(1).type('income');
    cy.get('select').eq(3).select('between');
    cy.get('input[placeholder*="value"]').eq(1).type('0, 500000');
    
    // Switch to JSON preview
    cy.get('[data-testid="tab-preview"]').click();
    cy.get('h3').contains('JSON Preview').should('be.visible');
    
    // Verify generated JSON
    cy.get('[data-testid="json-output"]').should('contain', 'gender');
    cy.get('[data-testid="json-output"]').should('contain', 'income');
    cy.get('[data-testid="json-output"]').should('contain', 'Female');
    cy.get('[data-testid="json-output"]').should('contain', '0');
    cy.get('[data-testid="json-output"]').should('contain', '500000');
    
    // Export query
    cy.get('button').contains('Export').click();
    
    // Verify download (this depends on your download implementation)
    cy.readFile('cypress/downloads/eligibility-query.json').should('exist');
  });
  
  it('should handle validation errors gracefully', () => {
    // Load invalid configuration
    cy.get('textarea[placeholder*="configuration JSON"]').type('invalid json');
    cy.get('button').contains('Load Configuration').click();
    
    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid JSON format');
    
    // Verify configuration not loaded
    cy.get('[data-testid="tab-eligibility"]').click();
    cy.get('button').contains('Add Rule').should('be.disabled');
  });
});
```

### Performance E2E Tests
```typescript
// cypress/e2e/performance.cy.ts
describe('Performance Tests', () => {
  it('should load application within performance budget', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.performance.mark('app-start');
      }
    });
    
    cy.get('[data-testid="app-loaded"]').should('be.visible');
    
    cy.window().then((win) => {
      win.performance.mark('app-loaded');
      win.performance.measure('app-load-time', 'app-start', 'app-loaded');
      
      const measure = win.performance.getEntriesByName('app-load-time')[0];
      expect(measure.duration).to.be.lessThan(3000); // 3 seconds
    });
  });
  
  it('should handle large configurations efficiently', () => {
    const largeConfig = {
      ScholarshipInfo: { id: '123', name: 'Test' },
      ScholarshipConfig: {
        steps: Array.from({ length: 100 }, (_, i) => ({
          step_name: `step_${i}`,
          fields: Array.from({ length: 50 }, (_, j) => ({
            field_key: `field_${i}_${j}`,
            label: `Field ${i}-${j}`,
            valueType: 'string'
          }))
        }))
      }
    };
    
    cy.visit('/');
    
    cy.get('textarea[placeholder*="configuration JSON"]').type(
      JSON.stringify(largeConfig)
    );
    
    cy.get('button').contains('Load Configuration').click();
    
    // Verify it loads within reasonable time
    cy.get('[data-testid="config-loaded"]', { timeout: 5000 }).should('be.visible');
    
    // Switch to eligibility builder
    cy.get('[data-testid="tab-eligibility"]').click();
    
    // Verify UI remains responsive
    cy.get('button').contains('Add Rule').should('be.visible');
    cy.get('select').should('have.length.greaterThan', 0);
  });
});
```

## Performance Testing

### Load Testing Setup
```typescript
// performance/loadTest.ts
import { chromium } from 'playwright';

const runPerformanceTest = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.goto('http://localhost:5173');
  
  // Measure initial load performance
  const performanceMetrics = await page.evaluate(() => {
    return {
      domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
      firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime,
      largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime
    };
  });
  
  console.log('Performance Metrics:', performanceMetrics);
  
  // Test complex operations
  await page.fill('[data-testid="config-input"]', JSON.stringify(largeConfig));
  
  const processingStart = Date.now();
  await page.click('button:has-text("Load Configuration")');
  await page.waitForSelector('[data-testid="config-loaded"]');
  const processingEnd = Date.now();
  
  console.log('Configuration processing time:', processingEnd - processingStart, 'ms');
  
  await browser.close();
};
```

### Memory Usage Testing
```typescript
// performance/memoryTest.ts
const monitorMemoryUsage = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173');
  
  // Monitor memory usage during heavy operations
  const memoryUsage = await page.evaluate(() => {
    return {
      usedJSHeapSize: (performance as any).memory?.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory?.totalJSHeapSize,
      jsHeapSizeLimit: (performance as any).memory?.jsHeapSizeLimit
    };
  });
  
  console.log('Memory Usage:', memoryUsage);
  
  // Perform memory-intensive operations
  for (let i = 0; i < 100; i++) {
    await page.click('button:has-text("Add Rule")');
    await page.waitForTimeout(100);
  }
  
  const memoryAfterOperations = await page.evaluate(() => {
    return {
      usedJSHeapSize: (performance as any).memory?.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory?.totalJSHeapSize
    };
  });
  
  console.log('Memory Usage After Operations:', memoryAfterOperations);
  
  await browser.close();
};
```

## Accessibility Testing

### Automated Accessibility Testing
```typescript
// accessibility/a11y.test.ts
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ConfigInput } from '@/components/ConfigInput/ConfigInput';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('ConfigInput has no accessibility violations', async () => {
    const { container } = render(<ConfigInput onConfigLoad={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('EligibilityBuilder has no accessibility violations', async () => {
    const { container } = render(
      <EligibilityBuilder 
        config={mockConfig} 
        onEligibilityChange={() => {}} 
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Manual Accessibility Testing
```typescript
// cypress/e2e/accessibility.cy.ts
describe('Accessibility', () => {
  it('should be navigable with keyboard only', () => {
    cy.visit('/');
    
    // Tab through all interactive elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'config-tab');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'eligibility-tab');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'ranking-tab');
    
    // Test form navigation
    cy.get('[data-testid="config-tab"]').click();
    cy.get('textarea').focus().type('test content');
    cy.get('textarea').tab();
    cy.focused().should('contain', 'Load Configuration');
  });
  
  it('should have proper ARIA labels', () => {
    cy.visit('/');
    
    cy.get('[role="tablist"]').should('exist');
    cy.get('[role="tab"]').should('have.length', 7);
    cy.get('[role="tabpanel"]').should('exist');
    
    cy.get('input[aria-label]').should('exist');
    cy.get('button[aria-label]').should('exist');
    cy.get('[aria-describedby]').should('exist');
  });
  
  it('should announce changes to screen readers', () => {
    cy.visit('/');
    
    cy.get('[data-testid="config-input"]').type('invalid json');
    cy.get('button').contains('Load Configuration').click();
    
    // Check for aria-live region updates
    cy.get('[aria-live="polite"]').should('contain', 'Invalid JSON format');
  });
});
```

## Testing Tools and Framework

### Core Testing Stack
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.3.1",
    "jest-environment-jsdom": "^29.3.1",
    "cypress": "^12.3.0",
    "jest-axe": "^7.0.0",
    "playwright": "^1.29.0"
  }
}
```

### Test Utilities
```typescript
// src/test-utils/index.ts
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Test Data Factories
```typescript
// src/test-utils/factories.ts
export const createMockConfiguration = (overrides = {}) => ({
  ScholarshipInfo: {
    id: 'test_123',
    name: 'Test Scholarship',
    description: 'Test description',
    ...overrides
  },
  ScholarshipConfig: {
    steps: [
      {
        step_name: 'personal info step',
        fields: [
          {
            field_key: 'gender',
            label: 'Gender',
            valueType: 'string',
            validations: ['required']
          },
          {
            field_key: 'income',
            label: 'Income',
            valueType: 'number',
            validations: ['required', 'numeric']
          }
        ]
      }
    ]
  }
});

export const createMockEligibilityQuery = (overrides = {}) => ({
  sign: 'None',
  condition: 'AND',
  rules: [
    {
      step_name: 'personal info step',
      field_key: 'gender',
      operator: 'in',
      value: ['Female']
    }
  ],
  ...overrides
});
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm test -- --coverage --watchAll=false
        
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run integration tests
        run: npm run test:integration
        
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

### Quality Gates
```typescript
// scripts/quality-gate.js
const fs = require('fs');
const path = require('path');

const checkCoverage = () => {
  const coverageReport = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../coverage/coverage-summary.json'))
  );
  
  const { total } = coverageReport;
  const thresholds = {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  };
  
  let passed = true;
  Object.keys(thresholds).forEach(key => {
    if (total[key].pct < thresholds[key]) {
      console.error(`Coverage for ${key} (${total[key].pct}%) is below threshold (${thresholds[key]}%)`);
      passed = false;
    }
  });
  
  if (!passed) {
    process.exit(1);
  }
  
  console.log('Coverage thresholds met ✅');
};

const checkTestResults = () => {
  // Check for test failures
  const testResults = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../test-results.json'))
  );
  
  if (testResults.numFailedTests > 0) {
    console.error(`${testResults.numFailedTests} tests failed`);
    process.exit(1);
  }
  
  console.log('All tests passed ✅');
};

checkCoverage();
checkTestResults();
```

## Best Practices

### Test Organization
```typescript
// Organize tests by feature/component
src/
├── components/
│   ├── ConfigInput/
│   │   ├── ConfigInput.tsx
│   │   ├── ConfigInput.test.tsx
│   │   └── ConfigInput.stories.tsx
│   └── EligibilityBuilder/
│       ├── EligibilityBuilder.tsx
│       ├── EligibilityBuilder.test.tsx
│       └── EligibilityBuilder.integration.test.tsx
├── hooks/
│   ├── useQueryBuilder.ts
│   └── useQueryBuilder.test.ts
└── utils/
    ├── validation.ts
    └── validation.test.ts
```

### Test Naming Conventions
```typescript
// Good test names
describe('ConfigInput Component', () => {
  test('should render upload button when no config loaded', () => {});
  test('should display error message for invalid JSON', () => {});
  test('should call onConfigLoad when valid config submitted', () => {});
});

// Bad test names
describe('ConfigInput', () => {
  test('test 1', () => {});
  test('should work', () => {});
  test('handles input', () => {});
});
```

### Assertion Patterns
```typescript
// Prefer specific assertions
expect(screen.getByRole('button', { name: /load configuration/i })).toBeInTheDocument();

// Over generic ones
expect(screen.getByText('Load Configuration')).toBeTruthy();

// Test behavior, not implementation
expect(mockOnConfigLoad).toHaveBeenCalledWith(expectedConfig);

// Not internal state
expect(component.state.configText).toBe('...');
```

### Test Data Management
```typescript
// Use factories for test data
const mockConfig = createMockConfiguration({
  name: 'Custom Test Scholarship'
});

// Not inline objects
const mockConfig = {
  ScholarshipInfo: {
    id: 'test_123',
    name: 'Custom Test Scholarship',
    // ... many more properties
  }
};
```

### Async Testing
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Configuration loaded')).toBeInTheDocument();
});

// Use proper async/await
test('should load configuration', async () => {
  render(<ConfigInput onConfigLoad={mockOnConfigLoad} />);
  
  fireEvent.click(screen.getByText('Load Sample'));
  
  await waitFor(() => {
    expect(mockOnConfigLoad).toHaveBeenCalled();
  });
});
```

### Performance Testing Best Practices
```typescript
// Test performance-critical operations
test('should handle large rule sets efficiently', async () => {
  const startTime = Date.now();
  
  render(<EligibilityBuilder config={largeConfig} onEligibilityChange={() => {}} />);
  
  // Add many rules
  for (let i = 0; i < 100; i++) {
    fireEvent.click(screen.getByText('Add Rule'));
  }
  
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(5000); // 5 seconds
});
```

---

*Last Updated: July 2025*
*Version: 1.0.0*