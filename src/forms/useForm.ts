import { useObservable } from 'mobx-react-lite'


export const useForm = <T>(state: T) => useObservable<FormState<T>>({
    state,
    invalidFields: [],
    untouchedFields: [],
    get isValid() {
        return (this as FormState<T>).invalidFields.length === 0
    },
    get isComplete() {
        return (this as FormState<T>).untouchedFields.length === 0
    },
})

export type FormState<T> = {
    state: T
    invalidFields: string[]
    untouchedFields: string[]
    isValid: boolean
    isComplete: boolean
}
