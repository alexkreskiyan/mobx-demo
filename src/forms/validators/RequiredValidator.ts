import { ValidationConfiguration } from '.'
import { IValidator } from './IValidator'
import { ValidationResult } from './ValidationResult'
import { ValidationStatus } from './ValidationStatus'

export type RequiredConfiguration = {
    whitespace?: boolean,
    message?: string | React.ReactNode
}

export class RequiredValidator implements IValidator<RequiredConfiguration, string> {
    public type: keyof ValidationConfiguration = 'required'
    public validate(config: RequiredConfiguration, value: string): ValidationResult {
        const isValid = Boolean(config.whitespace ? value.trim() : value)

        return {
            status: isValid ? undefined : ValidationStatus.Error,
            message: isValid ? '' : (config.message || 'Field is required'),
        }
    }
}
