# Custom Query Builder - Project Overview

## Project Purpose

The Custom Query Builder is a comprehensive React-based web application designed to streamline the creation of complex data queries for scholarship selection and ranking systems. This project eliminates the need for technical expertise by providing an intuitive 7-tab visual interface for building sophisticated query logic with real-time JSON generation and validation.

## Business Objectives

### Primary Goals
- **Democratize Query Creation**: Enable non-technical users to create complex data filtering and ranking queries through 7 intuitive tabs
- **Reduce Development Time**: Eliminate the need for custom code development for each scholarship program
- **Improve Accuracy**: Reduce human error in query creation through real-time visual validation
- **Enhance Scalability**: Support multiple scholarship programs with varying criteria
- **Modern Architecture**: Leverage React 18, TypeScript, and Vite for optimal performance

### Secondary Goals
- **Cost Reduction**: Minimize development resources needed for query modifications
- **Faster Time-to-Market**: Accelerate scholarship program deployment
- **Maintainability**: Provide clear visual representation of business logic
- **Compliance**: Ensure consistent application of selection criteria

## Target Audience

### Primary Users
1. **Scholarship Program Managers**
   - Create and modify eligibility criteria
   - Define ranking algorithms
   - Configure selection processes

2. **Business Analysts**
   - Design complex scoring methodologies
   - Implement business rules
   - Validate query logic

3. **System Administrators**
   - Manage configuration imports
   - Monitor query performance
   - Maintain system integrity

### Secondary Users
1. **Developers** (for maintenance and extensions)
2. **Quality Assurance Teams** (for testing and validation)
3. **Stakeholders** (for review and approval)

## Technology Stack

### Core Technology Stack
- **React 18.2.0** - Modern component-based UI library with concurrent features
- **TypeScript 5.2.2** - Full type safety and enhanced development experience
- **Vite 4.5.0** - Lightning-fast build tool and development server with HMR
- **Tailwind CSS 3.3.5** - Utility-first CSS framework for consistent styling
- **Zustand 4.4.7** - Lightweight state management solution
- **React Hook Form 7.48.2** - Performant form handling with minimal re-renders
- **Zod 3.22.4** - Runtime type validation and schema validation
- **DND Kit** - Modern drag-and-drop functionality for rule reordering
- **Lucide React 0.294.0** - Beautiful and consistent icon library

### Development Environment
- **Node.js 18+ LTS** - JavaScript runtime
- **npm** - Package manager
- **ESLint 8.53.0** - Code linting and quality assurance
- **PostCSS 8.4.32** - CSS processing
- **Autoprefixer 10.4.16** - CSS vendor prefixing

### Build & Deployment
- **Vite Development Server** - Hot module replacement and fast refresh
- **TypeScript Compiler** - Type checking and compilation
- **Production Build** - Optimized bundle for deployment
- **GitHub Integration** - Version control with r_and_d branch strategy

## Key Features and Capabilities

### 7-Tab Workflow Interface

#### Tab 1: Config Input
- **JSON Configuration Import**: Support for complex scholarship configuration files
- **File Upload**: Drag-and-drop or browse file upload
- **Validation System**: Real-time validation of configuration integrity
- **Sample Data Loading**: Pre-built examples for quick start
- **Error Reporting**: Detailed validation error messages

#### Tab 2: Eligibility Builder
- **Visual Rule Creation**: Intuitive interface for creating eligibility rules
- **Multiple Operators**: Support for in, between, equals, greater_than, less_than, not_in
- **Conditional Logic**: AND/OR logic combinations
- **Field Mapping**: Dynamic field selection based on configuration
- **Course-Specific Rules**: Context-aware rule application
- **Export Functionality**: Save eligibility configurations

#### Tab 3: Ranking Builder
- **Scoring Methods**: Multiple scoring algorithms (Percentile, Multiplication, Addition)
- **Assignment Methods**: Value-based assignment with option matching
- **Weighted Scoring**: Configurable weight distribution
- **Inverse Calculations**: Support for inverse percentile calculations
- **Conditional Scoring**: Context-dependent scoring rules
- **Export Functionality**: Save ranking configurations

#### Tab 4: Rules Builder
- **Visual Rule Interface**: Main rule configuration with drag-and-drop
- **Data Blocks**: Multiple data blocks per rule
- **Condition Builder**: "if" conditions for filtering data
- **Data Selector**: "get" fields for data retrieval
- **Score Methods**: Mathematical operations on retrieved data
- **Assignment Methods**: Value assignments based on conditions
- **Rule Reordering**: Drag-and-drop rule organization

#### Tab 5: Selection Builder
- **Selection Criteria**: Configure selection and sorting methods
- **Quantity Sorting**: Ascending/Descending order configuration
- **Sort Methods**: Multiple sorting criteria with data blocks
- **Selection Logic**: Complex selection algorithms

#### Tab 6: Scoring Builder
- **Global Scoring**: System-wide scoring method configuration
- **Operations**: Addition, Multiplication, Percentile, many2one
- **Drop Empty Rows**: Configure handling of empty data
- **Score Aggregation**: Combine multiple scoring methods

#### Tab 7: JSON Preview
- **Real-time Output**: Live JSON generation as you build
- **Syntax Highlighting**: Formatted JSON display
- **Validation Status**: Real-time validation feedback
- **Export Options**: Copy to clipboard or download as file
- **Error Display**: Detailed validation error reporting

### Advanced Query Features
- **Multi-Step Processing**: Support for complex multi-stage queries
- **Field Dependencies**: Dynamic field availability based on selections
- **Real-time Validation**: Continuous validation with Zod schemas
- **State Management**: Centralized state with Zustand
- **Form Handling**: Optimized forms with React Hook Form
- **Drag & Drop**: Modern DND Kit implementation
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized with React 18 concurrent features
- **Data Transformation**: Built-in data normalization and transformation
- **Error Handling**: Comprehensive error detection and reporting

### 5. Export and Integration
- **JSON Export**: Export queries in standardized format
- **Template System**: Reusable query templates
- **API Integration**: Ready for backend integration
- **Batch Processing**: Support for multiple query operations

## Architecture Highlights

### Component Architecture
- **Modular Design**: Loosely coupled, reusable components
- **Single Responsibility**: Each component has a clear, focused purpose
- **Composable Structure**: Components can be combined for complex UIs
- **Type Safety**: Full TypeScript implementation

### State Management
- **Centralized Store**: Zustand-based global state management
- **Reactive Updates**: Real-time UI updates on state changes
- **Persistence**: State preservation across sessions
- **Validation Integration**: Built-in validation with state updates

### Data Flow
- **Unidirectional Flow**: Clear data flow from configuration to output
- **Immutable Updates**: Predictable state changes
- **Validation Pipeline**: Multi-stage validation process
- **Error Boundaries**: Graceful error handling

## Success Metrics and KPIs

### User Experience Metrics
- **Time to First Query**: < 5 minutes for basic queries
- **Learning Curve**: New users productive within 30 minutes
- **Error Rate**: < 5% invalid queries generated
- **User Satisfaction**: > 90% positive feedback

### Performance Metrics
- **Load Time**: < 3 seconds initial load
- **Query Generation**: < 1 second for complex queries
- **Memory Usage**: < 100MB average memory consumption
- **Bundle Size**: < 250KB gzipped

### Business Metrics
- **Query Creation Speed**: 80% faster than manual coding
- **Maintenance Time**: 70% reduction in modification time
- **Error Reduction**: 90% fewer query-related bugs
- **Cost Savings**: 60% reduction in development costs

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ConfigInput/     # Configuration input and validation
│   ├── EligibilityBuilder/ # Eligibility criteria builder
│   ├── RankingBuilder/  # Ranking algorithm builder
│   ├── RuleBuilder/     # Advanced rule creation
│   ├── JsonPreview/     # JSON output visualization
│   └── ...
├── store/              # State management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## Development Philosophy

### Code Quality
- **Type Safety First**: Comprehensive TypeScript usage
- **Component Purity**: Functional components with minimal side effects
- **Code Consistency**: Standardized formatting and naming conventions
- **Documentation**: Comprehensive inline and external documentation

### User Experience
- **Intuitive Design**: Self-explanatory interface elements
- **Progressive Disclosure**: Complex features revealed as needed
- **Responsive Design**: Works across all device sizes
- **Accessibility**: WCAG 2.1 AA compliance

### Maintainability
- **Modular Architecture**: Easy to extend and modify
- **Clear Separation**: Distinct layers for UI, logic, and data
- **Version Control**: Comprehensive Git workflow
- **Testing Strategy**: Automated testing at multiple levels

## Future Roadmap

### Phase 1 (Current)
- Core query building functionality
- Basic configuration management
- JSON export capabilities

### Phase 2 (Planned)
- Advanced validation features
- Query optimization suggestions
- Performance monitoring dashboard

### Phase 3 (Future)
- Machine learning query suggestions
- Advanced analytics and reporting
- Multi-tenant support

## Getting Started

1. **Installation**: `npm install`
2. **Development**: `npm run dev`
3. **Building**: `npm run build`
4. **Testing**: `npm test`

For detailed setup instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## Contributing

This project follows established coding standards and contribution guidelines. See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed information.

## License

This project is proprietary and confidential. All rights reserved.

---

*Last Updated: July 2025*
*Version: 1.0.0*