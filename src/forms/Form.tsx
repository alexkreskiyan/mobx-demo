import React, { createContext, ReactNode } from 'react'

import { FormState } from './useForm'

export const context = createContext<FormState<Object>>({
    state: {},
    invalidFields: [],
    untouchedFields: [],
    isValid: true,
    isComplete: true,
})


type Props = {
    state: FormState<Object>
    children?: ReactNode
}

export const Form = ({ state, children }: Props) => (
    <context.Provider value={state}>
        {children}
    </context.Provider>
)
