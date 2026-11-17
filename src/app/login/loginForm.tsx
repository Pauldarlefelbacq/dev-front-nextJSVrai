'use client'

import { useActionState } from "react"
import { Login, type LoginState } from "../actions/auth"

const initialState: LoginState = {}

export function LoginForm(){
    const [state, action, pending] = useActionState(Login, {})

    return(
        <form action={action}>
            <input type="text" name="login" />
            <input type="password" name="password" />
            <button type="submit">Login</button>
        </form>
    )
}