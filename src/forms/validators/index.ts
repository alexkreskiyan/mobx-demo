import { IValidatorBase } from './IValidator'
import { PatternConfiguration, PatternValidator } from './PatternValidator'
import { RequiredConfiguration, RequiredValidator } from './RequiredValidator'
import { ValidationResult } from './ValidationResult'
import { ValidationStatus } from './ValidationStatus'

export type ValidationConfiguration = {
    required: RequiredConfiguration
    pattern: PatternConfiguration
}

const syncValidators: IValidatorBase[] = [
    new PatternValidator(),
    new RequiredValidator(),
]

export const validate = (config: Partial<ValidationConfiguration>, value: unknown): Promise<ValidationResult> => {
    const syncResults = syncValidators
        .filter(v => v.type in config)
        .map<ValidationResult>(v => v.validate(config[v.type], value))

    const status = getValidationStatus(syncResults)
    const message = getValidationMessage(syncResults)

    return Promise.resolve({ status, message })
}

const getValidationStatus = (results: ValidationResult[]): ValidationStatus => {
    if (results.some(result => result.status === ValidationStatus.Error)) return ValidationStatus.Error

    if (results.some(result => result.status === ValidationStatus.Success)) return ValidationStatus.Success

    return ValidationStatus.None
}

const getValidationMessage = (results: ValidationResult[]): string =>
    results.filter(e => e.message).map(result => result.message).join(', ')
