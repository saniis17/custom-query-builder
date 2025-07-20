# Tab-to-File Mapping and Development Guide

## Tab-to-File Mapping

### 1. Config Input
**File:** `/src/components/ConfigInput/ConfigInput.tsx`
- **Purpose:** Handles JSON configuration input and loading
- **Functionality:** Input field for configuration JSON, validation, and loading into state

### 2. Eligibility Builder
**File:** `/src/components/EligibilityBuilder/EligibilityBuilder.tsx`
- **Purpose:** Builds eligibility criteria logic
- **Functionality:** Visual builder for creating eligibility rules and conditions

### 3. Ranking Builder
**File:** `/src/components/RankingBuilder/RankingBuilder.tsx`
- **Purpose:** Constructs ranking/scoring criteria
- **Functionality:** Interface for building ranking algorithms and scoring methods

### 4. Rules
**Primary File:** `/src/components/RuleBuilder/RuleBuilder.tsx`
- **Purpose:** Main rules configuration interface
- **Supporting Files:**
  - `ConditionBuilder.tsx` - Creates "if" conditions for filtering
  - `DataSelector.tsx` - Selects "get" fields for data retrieval
  - `OperationSelector.tsx` - Configures scoring operations

### 5. Selection
**File:** `/src/components/SelectionBuilder/SelectionBuilder.tsx`
- **Purpose:** Configures selection criteria and sorting methods
- **Functionality:** Sets up quantity sorting, sort methods, and selection logic

### 6. Scoring
**File:** `/src/components/ScoreMethodBuilder/ScoreMethodBuilder.tsx`
- **Purpose:** Global scoring method configuration
- **Functionality:** Manages global score methods that apply to entire query results

### 7. JSON Preview
**File:** `/src/components/JsonPreview/JsonPreview.tsx`
- **Purpose:** Real-time JSON output and validation display
- **Functionality:** Shows generated JSON, validation status, and export options

## Key Supporting Files

- **State Management:** `/src/store/queryStore.ts` - Zustand store for all tab states
- **Validation:** `/src/components/QueryValidator/QueryValidator.ts` - JSON schema validation
- **Types:** `/src/types/index.ts` - TypeScript type definitions
- **Main App:** `/src/App.tsx` - Tab navigation and coordination

## Development Workflow

### How to Modify a File

1. **Locate the target file** using the mapping above
2. **Read the file** to understand current implementation:
   ```bash
   # Using Claude Code tools
   Read tool: /path/to/target/file.tsx
   ```
3. **Make changes** using appropriate editing tools:
   ```bash
   # For single edits
   Edit tool: old_string -> new_string
   
   # For multiple edits
   MultiEdit tool: multiple find/replace operations
   ```

### Compile and Build

#### Development Server (Hot Reload)
```bash
npm run dev
# Starts Vite dev server with hot module replacement
# Access at: http://localhost:5173
```

#### Production Build
```bash
npm run build
# Compiles TypeScript and builds optimized production bundle
# Output: dist/ directory
```

#### Preview Production Build
```bash
npm run preview
# Serves the production build locally for testing
```

### Debug and Testing

#### Linting
```bash
npm run lint
# Runs ESLint to check code quality and style
# Fix issues before committing changes
```

#### TypeScript Checking
```bash
npx tsc --noEmit
# Type-checks without emitting files
# Verifies TypeScript compilation
```

#### Browser Developer Tools
- **Console:** Check for runtime errors and logs
- **React DevTools:** Inspect component state and props
- **Network Tab:** Monitor API calls and resource loading

### Individual File Development

#### Working on a Specific Tab Component

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to specific tab** in browser to focus testing

3. **Common debugging patterns:**
   ```typescript
   // Add console.logs for debugging
   console.log('Component state:', state);
   console.log('Props received:', props);
   
   // Use React DevTools to inspect:
   // - Component state
   // - Props flow
   // - Store state (Zustand)
   ```

4. **Hot reload testing:**
   - Save file changes
   - Browser automatically refreshes
   - Check console for errors
   - Test functionality in UI

#### Component-Specific Testing

- **State Changes:** Verify store updates using browser dev tools
- **Props Flow:** Check parent-child communication
- **Event Handling:** Test user interactions (clicks, inputs)
- **Validation:** Ensure proper error handling and validation

### File Structure Context

```
src/
├── components/
│   ├── ConfigInput/           # Tab 1
│   ├── EligibilityBuilder/    # Tab 2  
│   ├── RankingBuilder/        # Tab 3
│   ├── RuleBuilder/           # Tab 4 (+ supporting files)
│   ├── SelectionBuilder/      # Tab 5
│   ├── ScoreMethodBuilder/    # Tab 6
│   ├── JsonPreview/           # Tab 7
│   └── QueryValidator/        # Validation logic
├── store/                     # State management
├── types/                     # TypeScript definitions
├── App.tsx                    # Main navigation
└── main.tsx                   # Entry point
```

### Best Practices

1. **Always run linter** before committing changes
2. **Test in development mode** with hot reload
3. **Check browser console** for errors after changes
4. **Verify TypeScript compilation** with no errors
5. **Test cross-tab functionality** if modifying shared state
6. **Use React DevTools** for component debugging
7. **Check network requests** if modifying data flow

### Common Commands Summary

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview build
npm run lint            # Code linting

# TypeScript
npx tsc --noEmit        # Type checking only

# File operations (using Claude Code)
Read /path/to/file      # View file contents
Edit old -> new         # Single replacement
MultiEdit              # Multiple replacements
```