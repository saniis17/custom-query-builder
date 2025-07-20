import { QueryBuilderSchema, Rule } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class QueryValidator {
  static validateQuery(query: QueryBuilderSchema): ValidationResult {
    const errors: string[] = [];

    // Validate rules
    if (!Array.isArray(query.rules)) {
      errors.push('Rules must be an array');
    } else {
      query.rules.forEach((rule, index) => {
        const ruleErrors = this.validateRule(rule, index);
        errors.push(...ruleErrors);
      });
    }

    // Validate Selection
    if (!Array.isArray(query.Selection)) {
      errors.push('Selection must be an array');
    } else {
      query.Selection.forEach((selection, index) => {
        const selectionErrors = this.validateSelection(selection, index);
        errors.push(...selectionErrors);
      });
    }

    // Validate scoreMethod
    if (!Array.isArray(query.scoreMethod)) {
      errors.push('scoreMethod must be an array');
    } else {
      query.scoreMethod.forEach((scoreMethod, index) => {
        const scoreMethodErrors = this.validateScoreMethod(scoreMethod, `scoreMethod[${index}]`);
        errors.push(...scoreMethodErrors);
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static validateRule(rule: Rule, ruleIndex: number): string[] {
    const errors: string[] = [];
    const rulePrefix = `Rule[${ruleIndex}]`;

    // Validate Data
    if (!Array.isArray(rule.Data)) {
      errors.push(`${rulePrefix}.Data must be an array`);
    } else {
      rule.Data.forEach((dataBlock, dataIndex) => {
        const dataErrors = this.validateDataBlock(dataBlock, `${rulePrefix}.Data[${dataIndex}]`);
        errors.push(...dataErrors);
      });
    }

    // Validate scoreMethod if present
    if (rule.scoreMethod) {
      if (!Array.isArray(rule.scoreMethod)) {
        errors.push(`${rulePrefix}.scoreMethod must be an array`);
      } else {
        rule.scoreMethod.forEach((scoreMethod, index) => {
          const scoreMethodErrors = this.validateScoreMethod(scoreMethod, `${rulePrefix}.scoreMethod[${index}]`);
          errors.push(...scoreMethodErrors);
        });
      }
    }

    // Validate assignMethod if present
    if (rule.assignMethod) {
      if (!Array.isArray(rule.assignMethod)) {
        errors.push(`${rulePrefix}.assignMethod must be an array`);
      } else {
        rule.assignMethod.forEach((assignMethod, index) => {
          const assignMethodErrors = this.validateAssignMethod(assignMethod, `${rulePrefix}.assignMethod[${index}]`);
          errors.push(...assignMethodErrors);
        });
      }
    }

    return errors;
  }

  private static validateDataBlock(dataBlock: any, prefix: string): string[] {
    const errors: string[] = [];

    // Validate if conditions
    if (!Array.isArray(dataBlock.if)) {
      errors.push(`${prefix}.if must be an array`);
    } else {
      dataBlock.if.forEach((condition: any, index: number) => {
        const conditionErrors = this.validateCondition(condition, `${prefix}.if[${index}]`);
        errors.push(...conditionErrors);
      });
    }

    // Validate get fields
    if (!Array.isArray(dataBlock.get)) {
      errors.push(`${prefix}.get must be an array`);
    } else {
      dataBlock.get.forEach((field: any, index: number) => {
        const fieldErrors = this.validateField(field, `${prefix}.get[${index}]`);
        errors.push(...fieldErrors);
      });
    }

    return errors;
  }

  private static validateCondition(condition: any, prefix: string): string[] {
    const errors: string[] = [];

    if (!condition.field_key || typeof condition.field_key !== 'string') {
      errors.push(`${prefix}.field_key is required and must be a string`);
    }

    if (!condition.step_name || typeof condition.step_name !== 'string') {
      errors.push(`${prefix}.step_name is required and must be a string`);
    }

    if (!condition.operator || !['in', 'equals', 'not equals'].includes(condition.operator)) {
      errors.push(`${prefix}.operator must be one of: in, equals, not equals`);
    }

    if (condition.value === undefined || condition.value === null) {
      errors.push(`${prefix}.value is required`);
    }

    return errors;
  }

  private static validateField(field: any, prefix: string): string[] {
    const errors: string[] = [];

    if (!field.field_key || typeof field.field_key !== 'string') {
      errors.push(`${prefix}.field_key is required and must be a string`);
    }

    if (!field.step_name || typeof field.step_name !== 'string') {
      errors.push(`${prefix}.step_name is required and must be a string`);
    }

    if (field.course && typeof field.course !== 'string') {
      errors.push(`${prefix}.course must be a string if provided`);
    }

    return errors;
  }

  private static validateScoreMethod(scoreMethod: any, prefix: string): string[] {
    const errors: string[] = [];

    if (scoreMethod.value === undefined || scoreMethod.value === null) {
      errors.push(`${prefix}.value is required`);
    }

    if (!scoreMethod.operation || !['Percentile', 'Multiplication', 'Addition', 'many2one', 'Inverse', 'None'].includes(scoreMethod.operation)) {
      errors.push(`${prefix}.operation must be one of: Percentile, Multiplication, Addition, many2one, Inverse, None`);
    }

    if (scoreMethod.dropEmptyRow && !['all', 'none'].includes(scoreMethod.dropEmptyRow)) {
      errors.push(`${prefix}.dropEmptyRow must be either 'all' or 'none' if provided`);
    }

    return errors;
  }

  private static validateAssignMethod(assignMethod: any, prefix: string): string[] {
    const errors: string[] = [];

    if (typeof assignMethod.value !== 'number') {
      errors.push(`${prefix}.value must be a number`);
    }

    if (!assignMethod.option) {
      errors.push(`${prefix}.option is required`);
    } else if (typeof assignMethod.option !== 'string' && !Array.isArray(assignMethod.option)) {
      errors.push(`${prefix}.option must be a string or array of strings`);
    } else if (Array.isArray(assignMethod.option)) {
      assignMethod.option.forEach((opt: any, index: number) => {
        if (typeof opt !== 'string') {
          errors.push(`${prefix}.option[${index}] must be a string`);
        }
      });
    }

    return errors;
  }

  private static validateSelection(selection: any, selectionIndex: number): string[] {
    const errors: string[] = [];
    const selectionPrefix = `Selection[${selectionIndex}]`;

    // Validate quantity
    if (!selection.quantity || typeof selection.quantity !== 'object') {
      errors.push(`${selectionPrefix}.quantity is required and must be an object`);
    } else {
      if (!selection.quantity.sortOrder || !['Ascending', 'Descending'].includes(selection.quantity.sortOrder)) {
        errors.push(`${selectionPrefix}.quantity.sortOrder must be either 'Ascending' or 'Descending'`);
      }
    }

    // Validate sortMethod
    if (!Array.isArray(selection.sortMethod)) {
      errors.push(`${selectionPrefix}.sortMethod must be an array`);
    } else {
      selection.sortMethod.forEach((sortMethod: any, index: number) => {
        const sortMethodErrors = this.validateSortMethod(sortMethod, `${selectionPrefix}.sortMethod[${index}]`);
        errors.push(...sortMethodErrors);
      });
    }

    return errors;
  }

  private static validateSortMethod(sortMethod: any, prefix: string): string[] {
    const errors: string[] = [];

    // Validate Data
    if (!Array.isArray(sortMethod.Data)) {
      errors.push(`${prefix}.Data must be an array`);
    } else {
      sortMethod.Data.forEach((dataBlock: any, dataIndex: number) => {
        const dataErrors = this.validateDataBlock(dataBlock, `${prefix}.Data[${dataIndex}]`);
        errors.push(...dataErrors);
      });
    }

    // Validate sortOrder
    if (!sortMethod.sortOrder || !['Ascending', 'Descending'].includes(sortMethod.sortOrder)) {
      errors.push(`${prefix}.sortOrder must be either 'Ascending' or 'Descending'`);
    }

    return errors;
  }

  static validatePartialQuery(query: Partial<QueryBuilderSchema>): ValidationResult {
    const errors: string[] = [];

    // More lenient validation for partial queries (during construction)
    if (query.rules && Array.isArray(query.rules)) {
      query.rules.forEach((rule, index) => {
        if (rule.Data && Array.isArray(rule.Data)) {
          rule.Data.forEach((dataBlock, dataIndex) => {
            if (dataBlock.get && Array.isArray(dataBlock.get)) {
              dataBlock.get.forEach((field, fieldIndex) => {
                if (!field.field_key || !field.step_name) {
                  errors.push(`Rule[${index}].Data[${dataIndex}].get[${fieldIndex}] is missing required fields`);
                }
              });
            }
          });
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}