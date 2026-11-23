'use client'

import { useActionState } from "react"
import { Login, type LoginState } from "../../app/actions/auth"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"

const initialState: LoginState = {}

export function LoginForm(){
    const [state, action, pending] = useActionState(Login, {})

    return (
        <main className="page-container flex flex-1 items-center justify-center">
            <section className="card w-full max-w-md p-6 sm:p-8">
                <h1>Connexion</h1>
                <p className="text-muted mb-6">
                    Connectez-vous pour retrouver vos drops.
                </p>
                <form action={action} className="grid gap-5">
                    <label className="form-field">
                        Nom d'utilisateur ou e-mail
                        <input
                            className="form-input"
                            type="text"
                            name="login"
                            autoComplete="username"
                            required
                        />
                    </label>
                    <label className="form-field">
                        Mot de passe
                        <input
                            className="form-input"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    {state.error && (
                        <p className="form-error" role="alert">
                            {state.error}
                        </p>
                    )}
                    <Button disabled={pending} type="submit">
                        {pending ? <><Spinner />Connexion...</> : "Se connecter"}
                    </Button>
                </form>
                <div>
                    <p>Pas encore de compte ?</p>
                    <a href="/register">S'incrire</a>
                </div>
            </section>
        </main>
    )
}