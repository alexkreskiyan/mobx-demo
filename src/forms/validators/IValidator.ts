import { ValidationConfiguration } from '.'
import { ValidationResult } from './ValidationResult'

export interface IValidator<TConfig, TValue> extends IValidatorBase {
    validate(config: TConfig, value: TValue): ValidationResult
}

export interface IValidatorBase {
    type: keyof ValidationConfiguration
    validate(config: unknown, value: unknown): ValidationResult
}
