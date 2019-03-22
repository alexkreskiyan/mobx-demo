import { get, isEqual, omit, set } from 'lodash'
import React, {
    Children,
    cloneElement,
    memo,
    ReactElement,
    SyntheticEvent,
    useContext,
    useEffect,
    useState,
} from 'react'

import { context } from './Form'
import { FormState } from './useForm'
import { validate, ValidationConfiguration } from './validators'
import { ValidationResult } from './validators/ValidationResult'
import { ValidationStatus } from './validators/ValidationStatus'


type Props = {
    field: string
    valueProp?: string
    changeProp?: string
    validation?: Partial<ValidationConfiguration>
    errorProp?: string
    helperProp?: string
    children: ReactElement
    parseValue?(value: unknown): unknown
}

export const Field = (props: Props) => {
    const form = useContext<FormState<Object>>(context)

    return <InternalField form={form} value={get(form.state, props.field) as unknown} {...props} />
}

const InternalField = memo(
    ({
        field,
        valueProp = 'value',
        changeProp = 'onChange',
        validation,
        errorProp = 'error',
        helperProp = 'helperText',
        children,
        parseValue = defaultParseValue,
        form,
        value,
    }: Props & { form: FormState<Object>, value: unknown }) => {
        const [validationResult, setValidationResult] = useState<ValidationResult>({ message: '' })
        useEffect(() => { if (form.untouchedFields.indexOf(field) < 0) form.untouchedFields.push(field) }, [])

        const child = Children.only(children)

        const props: { [key: string]: unknown } = {
            [valueProp]: value,
            [changeProp]: handleChange(form, field, parseValue, validation, setValidationResult),
        }

        if (child.type.hasOwnProperty('propTypes')) {
            const { propTypes } = (child.type as unknown as { propTypes: Object })
            if (propTypes.hasOwnProperty(errorProp))
                props[errorProp] = validationResult.status === ValidationStatus.Error
            if (propTypes.hasOwnProperty(helperProp))
                props[helperProp] = validationResult.message
        }

        return cloneElement(child, props)
    },
    (prev, next) => isEqual(omit(next, ['children']), omit(prev, ['children'])),
)

const handleChange = (
    { state, invalidFields, untouchedFields }: FormState<Object>,
    field: string,
    parseValue: (value: unknown) => unknown,
    validation: Props['validation'],
    setValidationResult: (result: ValidationResult) => void,
) => (value: unknown) => {
    const result = parseValue(value)
    set(state, field, result)

    if (untouchedFields.indexOf(field) >= 0)
        untouchedFields.splice(untouchedFields.indexOf(field), 1)

    if (validation)
        validate(validation!, result)
            .then(validationResult => {
                if (validationResult.status === ValidationStatus.Error) {
                    if (invalidFields.indexOf(field) < 0) invalidFields.push(field)
                } else if (invalidFields.indexOf(field) >= 0)
                    invalidFields.splice(invalidFields.indexOf(field), 1)

                return validationResult
            })
            .then(setValidationResult)
}

const defaultParseValue = (event: unknown) => {
    if ((event as SyntheticEvent).nativeEvent instanceof Event) {
        const target = (event as SyntheticEvent).target
        if (target instanceof HTMLInputElement)
            switch (target.type) {
                case 'checkbox':
                    return target.checked
                default:
                    return target.value
            }
    }

    return event
}
