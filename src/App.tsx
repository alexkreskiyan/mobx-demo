import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'

import * as api from './api'
import styles from './App.module.scss'
import { Field, Form, useForm } from './forms'

type Login = {
  name: string
  pass: string
  remember: boolean
}


export const App = observer(() => {
  const form = useForm<Login>({ name: '', pass: '', remember: false })

  useEffect(() => { loadUser() }, [])

  return (
    <div className={styles.app}>
      <h3>{JSON.stringify(toJS(form))}</h3>
      <Form state={form}>
        <Field field="name" validation={{ required: { message: 'yes!' } }}>
          <TextField label="name" placeholder="name" />
        </Field>
        <Field field="pass" validation={{ pattern: { pattern: /[a-z]{8,}/i } }}>
          <TextField label="pass" placeholder="pass" />
        </Field>
        <Field field="remember" valueProp="checked">
          <FormControlLabel label="remember" control={<Checkbox color="primary" />} />
        </Field>
        <Field field="remember" valueProp="checked">
          <FormControlLabel label="remember" control={<Switch />} />
        </Field>
      </Form>
      <Button disabled={!form.isComplete || !form.isValid}>Submit</Button>
    </div >
  )
})

const loadUser = async () => {
  const user = await api.loadUser()
  console.warn(user)
}
