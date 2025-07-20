# React No-Code Query Builder - API Documentation

## Table of Contents
1. [API Overview](#api-overview)
2. [Data Structures](#data-structures)
3. [Configuration API](#configuration-api)
4. [Query Builder API](#query-builder-api)
5. [Validation API](#validation-api)
6. [Export API](#export-api)
7. [Error Handling](#error-handling)
8. [Integration Examples](#integration-examples)

## API Overview

### API Design Principles
- **RESTful**: Follows REST architectural constraints
- **Stateless**: Each request contains all necessary information
- **Consistent**: Uniform response format across all endpoints
- **Versioned**: API versioning for backward compatibility
- **Documented**: Comprehensive documentation with examples

### Base URL
```
https://api.querybuilder.com/v1
```

### Authentication
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully",
  "timestamp": "2025-07-16T10:30:00Z",
  "version": "1.0.0"
}
```

## Data Structures

### Core Data Types

#### Configuration Schema
```typescript
interface ScholarshipConfiguration {
  ScholarshipInfo: {
    id: string;
    name: string;
    description: string;
    program_type: string;
    academic_year: string;
    application_deadline: string;
    max_selections: number;
  };
  ScholarshipConfig: {
    steps: ConfigurationStep[];
    validation_rules: ValidationRule[];
    business_rules: BusinessRule[];
  };
}

interface ConfigurationStep {
  step_name: string;
  step_order: number;
  description: string;
  required: boolean;
  fields: ConfigurationField[];
}

interface ConfigurationField {
  field_key: string;
  label: string;
  description: string;
  field_type: FieldType;
  validations: ValidationRule[];
  data_options?: string[];
  default_value?: any;
  visibility_conditions?: VisibilityCondition[];
  valueType: ValueType;
}

type FieldType = 'text' | 'number' | 'date' | 'select' | 'multi_select' | 'boolean' | 'file';
type ValueType = 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
```

#### Eligibility Query Schema
```typescript
interface EligibilityQuery {
  id?: string;
  name: string;
  description: string;
  sign: LogicalOperator;
  condition: LogicalOperator;
  rules: EligibilityRule[];
  createNewFields?: ComputedField[];
  metadata: QueryMetadata;
}

interface EligibilityRule {
  rule_id: string;
  step_name: string;
  field_key: string;
  operator: ComparisonOperator;
  value: any;
  course?: string[];
  weight?: number;
  description?: string;
}

type LogicalOperator = 'None' | 'AND' | 'OR';
type ComparisonOperator = 'in' | 'not_in' | 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'between' | 'contains' | 'starts_with' | 'ends_with';
```

#### Ranking Query Schema
```typescript
interface RankingQuery {
  id?: string;
  name: string;
  description: string;
  rules: RankingRule[];
  Selection: SelectionCriteria[];
  scoreMethod: GlobalScoreMethod[];
  createNewFields?: ComputedField[];
  metadata: QueryMetadata;
}

interface RankingRule {
  rule_id: string;
  description: string;
  Data: DataSelector[];
  scoreMethod?: ScoreMethod[];
  assignMethod?: AssignmentMethod[];
  weight?: number;
  conditions?: RuleCondition[];
}

interface DataSelector {
  if: RuleCondition[];
  get: FieldSelector[];
}

interface FieldSelector {
  field_key: string;
  step_name: string;
  course?: string;
  aggregation?: AggregationType;
  transformation?: TransformationType;
}

interface ScoreMethod {
  method_id: string;
  value: string | number;
  operation: ScoreOperation;
  parameters?: Record<string, any>;
}

interface AssignmentMethod {
  method_id: string;
  value: number;
  option: string | string[];
  conditions?: AssignmentCondition[];
}

type ScoreOperation = 'Percentile' | 'Inverse' | 'Multiplication' | 'Addition' | 'Subtraction' | 'Division' | 'Normalization' | 'Standardization';
type AggregationType = 'sum' | 'average' | 'min' | 'max' | 'count' | 'median';
type TransformationType = 'normalize' | 'standardize' | 'log' | 'sqrt' | 'inverse';
```

#### Selection Criteria Schema
```typescript
interface SelectionCriteria {
  selection_id: string;
  name: string;
  description: string;
  quantity: QuantityConfig;
  sortMethod: SortMethod[];
  filters?: SelectionFilter[];
  grouping?: GroupingConfig;
}

interface QuantityConfig {
  sortOrder: SortOrder;
  limit?: number;
  offset?: number;
  percentage?: number;
}

interface SortMethod {
  method_id: string;
  Data: DataSelector[];
  sortOrder: SortOrder;
  priority: number;
  nulls_handling: NullsHandling;
}

type SortOrder = 'Ascending' | 'Descending';
type NullsHandling = 'first' | 'last' | 'ignore';
```

#### Computed Field Schema
```typescript
interface ComputedField {
  field_id: string;
  step_name: string;
  new_field_key: string;
  description: string;
  computation_type: ComputationType;
  rqdFieldkeys: RequiredField[];
  formula?: string;
  ReferenceValue?: any;
  validation?: ValidationRule[];
}

interface RequiredField {
  step_name: string;
  field_key: string[];
  required: boolean;
}

type ComputationType = 'age_calculation' | 'date_difference' | 'formula' | 'lookup' | 'aggregation';
```

#### Metadata Schema
```typescript
interface QueryMetadata {
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  version: string;
  tags: string[];
  status: QueryStatus;
  performance_metrics?: PerformanceMetrics;
}

interface PerformanceMetrics {
  execution_time_ms: number;
  memory_usage_mb: number;
  processed_records: number;
  cache_hit_ratio: number;
}

type QueryStatus = 'draft' | 'active' | 'archived' | 'deprecated';
```

## Configuration API

### Get Configuration
```http
GET /api/v1/configurations/{configId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "config_123",
    "ScholarshipInfo": {
      "id": "24525",
      "name": "Legrand Empowering Scholarship Program 2024-25",
      "description": "Supporting education for deserving students",
      "program_type": "merit_based",
      "academic_year": "2024-25",
      "application_deadline": "2024-12-31T23:59:59Z",
      "max_selections": 100
    },
    "ScholarshipConfig": {
      "steps": [
        {
          "step_name": "personal info step",
          "step_order": 1,
          "description": "Personal information collection",
          "required": true,
          "fields": [
            {
              "field_key": "gender",
              "label": "Gender",
              "description": "Gender identity",
              "field_type": "select",
              "validations": [{"type": "required"}],
              "data_options": ["Male", "Female", "Third/Transgender"],
              "valueType": "string"
            },
            {
              "field_key": "familyIncome",
              "label": "Family Income",
              "description": "Annual family income",
              "field_type": "number",
              "validations": [
                {"type": "required"},
                {"type": "min", "value": 0},
                {"type": "max", "value": 10000000}
              ],
              "valueType": "number"
            }
          ]
        }
      ]
    }
  }
}
```

### Create Configuration
```http
POST /api/v1/configurations
```

**Request Body:**
```json
{
  "ScholarshipInfo": {
    "name": "New Scholarship Program",
    "description": "Program description",
    "program_type": "need_based",
    "academic_year": "2024-25",
    "application_deadline": "2024-12-31T23:59:59Z",
    "max_selections": 50
  },
  "ScholarshipConfig": {
    "steps": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "config_124",
    "created_at": "2025-07-16T10:30:00Z",
    "status": "active"
  },
  "message": "Configuration created successfully"
}
```

### Update Configuration
```http
PUT /api/v1/configurations/{configId}
```

### Delete Configuration
```http
DELETE /api/v1/configurations/{configId}
```

### List Configurations
```http
GET /api/v1/configurations?page=1&limit=10&status=active
```

## Query Builder API

### Create Eligibility Query
```http
POST /api/v1/queries/eligibility
```

**Request Body:**
```json
{
  "name": "Female Students with Family Income < 500000",
  "description": "Eligibility criteria for female students from low-income families",
  "sign": "None",
  "condition": "AND",
  "rules": [
    {
      "rule_id": "rule_001",
      "step_name": "personal info step",
      "field_key": "gender",
      "operator": "in",
      "value": ["Female"],
      "description": "Filter for female students"
    },
    {
      "rule_id": "rule_002",
      "step_name": "personal info step",
      "field_key": "familyIncome",
      "operator": "between",
      "value": [0, 500000],
      "description": "Income range filter"
    }
  ],
  "createNewFields": [
    {
      "field_id": "computed_001",
      "step_name": "personal info step",
      "new_field_key": "age",
      "description": "Calculate age from date of birth",
      "computation_type": "age_calculation",
      "rqdFieldkeys": [
        {
          "step_name": "personal info step",
          "field_key": ["dob"],
          "required": true
        }
      ],
      "ReferenceValue": "2024-09-11"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "eligibility_001",
    "name": "Female Students with Family Income < 500000",
    "status": "active",
    "created_at": "2025-07-16T10:30:00Z",
    "validation_result": {
      "is_valid": true,
      "errors": [],
      "warnings": []
    }
  }
}
```

### Create Ranking Query
```http
POST /api/v1/queries/ranking
```

**Request Body:**
```json
{
  "name": "Merit-based Ranking with Income Consideration",
  "description": "Ranking algorithm combining academic merit and financial need",
  "rules": [
    {
      "rule_id": "ranking_001",
      "description": "Income-based scoring",
      "Data": [
        {
          "if": [],
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
          "method_id": "score_001",
          "value": "Inverse",
          "operation": "Percentile"
        },
        {
          "method_id": "score_002",
          "value": 30,
          "operation": "Multiplication"
        }
      ],
      "weight": 0.4
    },
    {
      "rule_id": "ranking_002",
      "description": "Gender-based scoring",
      "Data": [
        {
          "if": [],
          "get": [
            {
              "field_key": "gender",
              "step_name": "personal info step"
            }
          ]
        }
      ],
      "assignMethod": [
        {
          "method_id": "assign_001",
          "value": 0,
          "option": "default"
        },
        {
          "method_id": "assign_002",
          "value": 10,
          "option": "Female"
        },
        {
          "method_id": "assign_003",
          "value": 15,
          "option": "Third/Transgender"
        }
      ],
      "weight": 0.2
    }
  ],
  "Selection": [
    {
      "selection_id": "selection_001",
      "name": "Top candidates selection",
      "description": "Select top candidates based on ranking",
      "quantity": {
        "sortOrder": "Ascending",
        "limit": 100
      },
      "sortMethod": [
        {
          "method_id": "sort_001",
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
          "sortOrder": "Ascending",
          "priority": 1,
          "nulls_handling": "last"
        }
      ]
    }
  ],
  "scoreMethod": [
    {
      "method_id": "global_001",
      "value": "Addition",
      "operation": "many2one",
      "parameters": {
        "dropEmptyRow": "all"
      }
    }
  ]
}
```

### Get Query
```http
GET /api/v1/queries/{queryId}
```

### Update Query
```http
PUT /api/v1/queries/{queryId}
```

### Delete Query
```http
DELETE /api/v1/queries/{queryId}
```

### List Queries
```http
GET /api/v1/queries?type=eligibility&status=active&page=1&limit=10
```

**Query Parameters:**
- `type`: `eligibility` | `ranking` | `all`
- `status`: `active` | `draft` | `archived`
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `search`: Search term
- `tags`: Filter by tags

## Validation API

### Validate Configuration
```http
POST /api/v1/validation/configuration
```

**Request Body:**
```json
{
  "configuration": {
    "ScholarshipInfo": {...},
    "ScholarshipConfig": {...}
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_valid": true,
    "errors": [],
    "warnings": [
      {
        "field": "ScholarshipConfig.steps[0].fields[5].validations",
        "message": "Consider adding email validation for email field",
        "severity": "warning",
        "code": "VALIDATION_SUGGESTION"
      }
    ],
    "performance_analysis": {
      "estimated_query_time": "250ms",
      "memory_usage": "15MB",
      "complexity_score": 3.2
    }
  }
}
```

### Validate Query
```http
POST /api/v1/validation/query
```

**Request Body:**
```json
{
  "query_type": "eligibility",
  "query": {
    "sign": "None",
    "condition": "AND",
    "rules": [...]
  },
  "configuration_id": "config_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_valid": false,
    "errors": [
      {
        "field": "rules[1].field_key",
        "message": "Field 'invalidField' does not exist in configuration",
        "severity": "error",
        "code": "INVALID_FIELD_REFERENCE"
      }
    ],
    "warnings": [],
    "suggestions": [
      {
        "field": "rules[0].operator",
        "message": "Consider using 'between' operator for numeric ranges",
        "code": "OPTIMIZATION_SUGGESTION"
      }
    ]
  }
}
```

### Validate Field Reference
```http
POST /api/v1/validation/field-reference
```

## Export API

### Export Query as JSON
```http
GET /api/v1/export/query/{queryId}?format=json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "query": {
      "id": "eligibility_001",
      "name": "Female Students with Family Income < 500000",
      "sign": "None",
      "condition": "AND",
      "rules": [...]
    },
    "export_metadata": {
      "exported_at": "2025-07-16T10:30:00Z",
      "exported_by": "user_123",
      "format": "json",
      "version": "1.0.0"
    }
  }
}
```

### Export Multiple Queries
```http
POST /api/v1/export/queries
```

**Request Body:**
```json
{
  "query_ids": ["eligibility_001", "ranking_001"],
  "format": "json",
  "include_metadata": true
}
```

### Export Configuration
```http
GET /api/v1/export/configuration/{configId}?format=json
```

### Import Query
```http
POST /api/v1/import/query
```

**Request Body:**
```json
{
  "query_data": {
    "sign": "None",
    "condition": "AND",
    "rules": [...]
  },
  "configuration_id": "config_123",
  "import_options": {
    "validate_before_import": true,
    "overwrite_existing": false,
    "create_backup": true
  }
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Query validation failed",
    "details": {
      "field": "rules[0].field_key",
      "value": "invalidField",
      "expected": "Valid field key from configuration"
    },
    "timestamp": "2025-07-16T10:30:00Z",
    "request_id": "req_123456"
  }
}
```

### Error Codes

#### Validation Errors (400)
- `VALIDATION_ERROR`: General validation failure
- `INVALID_FIELD_REFERENCE`: Field doesn't exist in configuration
- `INVALID_OPERATOR`: Unsupported operator for field type
- `INVALID_VALUE_TYPE`: Value type mismatch
- `MISSING_REQUIRED_FIELD`: Required field not provided
- `INVALID_CONDITION_LOGIC`: Logical condition error

#### Authentication Errors (401)
- `UNAUTHORIZED`: Authentication required
- `INVALID_TOKEN`: Token is invalid or expired
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions

#### Resource Errors (404)
- `CONFIGURATION_NOT_FOUND`: Configuration doesn't exist
- `QUERY_NOT_FOUND`: Query doesn't exist
- `FIELD_NOT_FOUND`: Field reference not found

#### Server Errors (500)
- `INTERNAL_SERVER_ERROR`: Generic server error
- `DATABASE_ERROR`: Database operation failed
- `PROCESSING_ERROR`: Query processing failed
- `EXPORT_ERROR`: Export operation failed

### Error Handling Best Practices

#### Client-Side Error Handling
```typescript
const handleApiError = (error: ApiError) => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      showValidationError(error.details);
      break;
    case 'UNAUTHORIZED':
      redirectToLogin();
      break;
    case 'QUERY_NOT_FOUND':
      showNotFoundMessage();
      break;
    default:
      showGenericError();
  }
};
```

#### Retry Logic
```typescript
const retryableErrors = [
  'INTERNAL_SERVER_ERROR',
  'DATABASE_ERROR',
  'PROCESSING_ERROR'
];

const apiCall = async (url: string, options: RequestOptions) => {
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      }
      
      const error = await response.json();
      if (!retryableErrors.includes(error.code)) {
        throw error;
      }
      
      attempts++;
      await delay(1000 * Math.pow(2, attempts)); // Exponential backoff
    } catch (error) {
      if (attempts === maxAttempts - 1) {
        throw error;
      }
      attempts++;
    }
  }
};
```

## Integration Examples

### Frontend Integration

#### React Hook for API Calls
```typescript
const useQueryApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const createEligibilityQuery = async (query: EligibilityQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/queries/eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(query)
      });
      
      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const validateQuery = async (query: any, configId: string) => {
    const response = await fetch('/api/v1/validation/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        query_type: 'eligibility',
        query,
        configuration_id: configId
      })
    });
    
    return response.json();
  };
  
  return {
    loading,
    error,
    createEligibilityQuery,
    validateQuery
  };
};
```

#### Usage in Component
```typescript
const QueryBuilder = () => {
  const { createEligibilityQuery, validateQuery, loading, error } = useQueryApi();
  const [query, setQuery] = useState<EligibilityQuery>({
    name: '',
    description: '',
    sign: 'None',
    condition: 'AND',
    rules: []
  });
  
  const handleCreateQuery = async () => {
    try {
      // Validate first
      const validationResult = await validateQuery(query, 'config_123');
      if (!validationResult.data.is_valid) {
        showValidationErrors(validationResult.data.errors);
        return;
      }
      
      // Create query
      const result = await createEligibilityQuery(query);
      showSuccessMessage('Query created successfully');
      
    } catch (err) {
      showErrorMessage('Failed to create query');
    }
  };
  
  return (
    <div>
      {/* Query builder UI */}
      <button onClick={handleCreateQuery} disabled={loading}>
        {loading ? 'Creating...' : 'Create Query'}
      </button>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};
```

### Backend Integration

#### Express.js Route Handler
```typescript
app.post('/api/v1/queries/eligibility', async (req, res) => {
  try {
    const { query, configuration_id } = req.body;
    const userId = req.user.id;
    
    // Validate query
    const validationResult = await validateQuery(query, configuration_id);
    if (!validationResult.is_valid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Query validation failed',
          details: validationResult.errors
        }
      });
    }
    
    // Create query
    const createdQuery = await createEligibilityQuery({
      ...query,
      created_by: userId,
      configuration_id
    });
    
    res.json({
      success: true,
      data: createdQuery,
      message: 'Query created successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create query',
        details: error.message
      }
    });
  }
});
```

### Database Integration

#### Query Execution Service
```typescript
class QueryExecutionService {
  async executeEligibilityQuery(query: EligibilityQuery, applicants: Applicant[]) {
    const results = [];
    
    for (const applicant of applicants) {
      const isEligible = await this.evaluateEligibility(query, applicant);
      if (isEligible) {
        results.push({
          applicant_id: applicant.id,
          eligible: true,
          evaluation_details: this.getEvaluationDetails(query, applicant)
        });
      }
    }
    
    return results;
  }
  
  private async evaluateEligibility(query: EligibilityQuery, applicant: Applicant): Promise<boolean> {
    const ruleResults = [];
    
    for (const rule of query.rules) {
      const fieldValue = this.getFieldValue(applicant, rule.step_name, rule.field_key);
      const ruleResult = this.evaluateRule(rule, fieldValue);
      ruleResults.push(ruleResult);
    }
    
    return this.combineResults(ruleResults, query.condition);
  }
  
  private evaluateRule(rule: EligibilityRule, fieldValue: any): boolean {
    switch (rule.operator) {
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(fieldValue);
      case 'between':
        return fieldValue >= rule.value[0] && fieldValue <= rule.value[1];
      case 'equals':
        return fieldValue === rule.value;
      case 'greater_than':
        return fieldValue > rule.value;
      case 'less_than':
        return fieldValue < rule.value;
      default:
        throw new Error(`Unsupported operator: ${rule.operator}`);
    }
  }
}
```

---

*Last Updated: July 2025*
*Version: 1.0.0*