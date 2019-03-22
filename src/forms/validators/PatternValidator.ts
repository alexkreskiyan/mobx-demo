import { ValidationConfiguration } from '.'
import { IValidator } from './IValidator'
import { ValidationResult } from './ValidationResult'
import { ValidationStatus } from './ValidationStatus'

export type PatternConfiguration = {
    pattern: RegExp,
    message?: string | React.ReactNode
}

export class PatternValidator implements IValidator<PatternConfiguration, string> {
    public type: keyof ValidationConfiguration = 'pattern'

    public validate(config: PatternConfiguration, value: string): ValidationResult {
        const isValid = config.pattern.test(value)

        return {
            status: isValid ? undefined : ValidationStatus.Error,
            message: isValid ? '' : (config.message || 'Field doesn\'t match pattern'),
        }
    }
}
