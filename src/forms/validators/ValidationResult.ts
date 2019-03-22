import { ReactNode } from 'react'

import { ValidationStatus } from './ValidationStatus'

export type ValidationResult = {
    status?: ValidationStatus
    message: ReactNode | string
}
