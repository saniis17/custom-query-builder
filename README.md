# Custom Query Builder

A powerful React-based no-code query builder that allows users to visually build complex, multi-layered filters and automatically generate structured JSON queries for scoring, assignment, and selection logic.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ LTS
- npm or yarn package manager

### Installation
```bash
# Clone the r_and_d branch
git clone -b r_and_d https://github.com/saniis17/custom-query-builder.git
cd custom-query-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Access the application at: `http://localhost:5173`

## ✨ Features

### 🎛 Multi-Tab Interface
- **Config Input**: Load JSON configuration files
- **Eligibility Builder**: Create eligibility criteria
- **Ranking Builder**: Build ranking algorithms
- **Rules**: Visual rule builder with drag-and-drop
- **Selection**: Configure selection and sorting
- **Scoring**: Global scoring methods
- **JSON Preview**: Real-time output with validation

### 🔧 Visual Rule Builder
- Drag-and-drop support for rule blocks
- Nested filters with "if" conditions and "get" fields
- Step name mapping for data organization
- Reorder rule blocks

### 📊 Scoring and Assignment Builder
- Multiple operations: `Percentile`, `Multiplication`, `Addition`, `Inverse`, `many2one`
- Score methods, assignment methods, and selection configuration
- Condition-based assignments using options, isEmpty, or ranges

### 🧮 JSON Generator
- Real-time JSON preview pane
- Schema-conformant validation
- Export/import functionality for templates
- Statistics and validation feedback

## Tech Stack

- **React 18+** with **Hooks**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Lucide React** for icons
- **Vite** for build tooling

## 📋 Complete Setup Guide

For detailed installation and deployment instructions, see:
- **[Tab File Mapping](TAB_FILE_MAPPING.md)** - Development workflow and file structure

## 📖 Usage Guide

### Tab-by-Tab Workflow

1. **Config Input** → Load base configuration JSON
2. **Eligibility Builder** → Define eligibility criteria
3. **Ranking Builder** → Create ranking algorithms  
4. **Rules** → Build data processing rules with conditions
5. **Selection** → Configure selection and sorting methods
6. **Scoring** → Set global scoring operations
7. **JSON Preview** → Review, validate, and export final JSON

### Quick Actions

- **Load Sample**: Click "Load Sample" to see example configuration
- **Import/Export**: Use Import/Export buttons for saving/loading templates
- **Reset**: Clear all configurations and start fresh
- **Validation**: Check status bar for real-time validation feedback

### Building Rules

1. **Add Rules**: Click "Add Rule" to create a new data processing rule
2. **Configure Data Blocks**: Each rule can have multiple data blocks
3. **Set Conditions**: Use the "if" conditions to filter data
4. **Select Fields**: Use the "get" fields to specify data to retrieve
5. **Add Scoring**: Enable score methods for mathematical operations
6. **Add Assignments**: Enable assignment methods for value assignments

## JSON Schema

The generated JSON follows this structure:

```json
{
  "rules": [
    {
      "Data": [
        {
          "if": [
            {
              "field_key": "present_class",
              "step_name": "education info step",
              "operator": "in",
              "value": ["Graduation"]
            }
          ],
          "get": [
            {
              "field_key": "familyIncome",
              "step_name": "personal info step"
            }
          ]
        }
      ],
      "scoreMethod": [
        {
          "value": "Inverse",
          "operation": "Percentile"
        }
      ],
      "assignMethod": [
        {
          "value": 15,
          "option": "Orphan"
        }
      ]
    }
  ],
  "Selection": [
    {
      "quantity": {
        "sortOrder": "Ascending"
      },
      "sortMethod": [
        {
          "Data": [
            {
              "if": [],
              "get": [
                {
                  "field_key": "submittedDate",
                  "step_name": "application info step"
                }
              ]
            }
          ],
          "sortOrder": "Ascending"
        }
      ]
    }
  ],
  "scoreMethod": [
    {
      "value": "Addition",
      "operation": "many2one",
      "dropEmptyRow": "all"
    }
  ]
}
```

## Components

### Core Components

- **RuleBuilder**: Main rule configuration interface
- **ConditionBuilder**: Builds "if" conditions for filtering
- **DataSelector**: Selects "get" fields for data retrieval
- **OperationSelector**: Configures scoring operations
- **AssignmentMethodBuilder**: Configures value assignments
- **ScoreMethodBuilder**: Wrapper for score method configuration
- **SelectionBuilder**: Configures selection and sorting criteria
- **JsonPreview**: Real-time JSON preview with validation

### Supporting Components

- **QueryValidator**: Validates JSON schema compliance
- **QueryStore**: Zustand store for state management

## 🛠 Development

### Project Structure

```
src/
├── components/
│   ├── ConfigInput/           # Tab 1: Configuration input
│   ├── EligibilityBuilder/    # Tab 2: Eligibility criteria
│   ├── RankingBuilder/        # Tab 3: Ranking algorithms
│   ├── RuleBuilder/           # Tab 4: Visual rule builder
│   │   ├── ConditionBuilder.tsx
│   │   ├── DataSelector.tsx
│   │   ├── OperationSelector.tsx
│   │   └── RuleBuilder.tsx
│   ├── SelectionBuilder/      # Tab 5: Selection & sorting
│   ├── ScoreMethodBuilder/    # Tab 6: Global scoring
│   ├── JsonPreview/          # Tab 7: JSON output & validation
│   └── QueryValidator/       # Validation logic
├── store/
│   └── queryStore.ts         # Zustand state management
├── types/
│   └── index.ts             # TypeScript definitions
├── App.tsx                  # Main application & tab navigation
└── main.tsx                # Entry point
```

### Available Scripts

- `npm run dev`: Start development server (http://localhost:5173)
- `npm run build`: Build for production (outputs to `dist/`)
- `npm run preview`: Preview production build (http://localhost:4173)
- `npm run lint`: Run ESLint for code quality

### Branch Information

- **Main Branch**: `main` - Stable releases
- **Development Branch**: `r_and_d` - Active development and features
- Clone the `r_and_d` branch for latest features and contributions

## Validation

The application includes comprehensive validation:

- **Schema Validation**: Ensures JSON conforms to required structure
- **Real-time Validation**: Validates as you build
- **Error Reporting**: Detailed error messages for debugging

## 📤 Export/Import

- **Export**: Save query configurations as JSON templates
- **Import**: Load previously saved configurations  
- **Copy/Download**: Get JSON for direct use in applications
- **Sample Data**: Load example configurations to get started

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `r_and_d`: `git checkout -b feature/new-feature r_and_d`
3. Make your changes and commit: `git commit -m "Add new feature"`
4. Push to your branch: `git push origin feature/new-feature`
5. Create a Pull Request to the `r_and_d` branch

## 📝 Documentation

- **[Tab File Mapping](TAB_FILE_MAPPING.md)** - Component structure and development guide


## 🔧 Troubleshooting

### Common Issues

- **Port conflicts**: Use `npm run dev -- --port 3000` to use different port
- **Node.js version**: Ensure Node.js 18+ LTS is installed
- **Dependencies**: Run `npm cache clean --force` and `npm install` if issues persist
- **TypeScript errors**: Run `npm run lint` to check for code issues

### Getting Help

1. Check the documentation files for detailed guides
2. Review the sample configurations in the application
3. Examine component files in the `src/components/` directory

## 📄 License

This project is licensed under the MIT License.

---

**Built with React 18 + TypeScript + Vite for modern web development**