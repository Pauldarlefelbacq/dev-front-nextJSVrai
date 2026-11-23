'use client'

import { useActionState } from "react"
import { Signup } from "@/app/actions/auth"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { FieldError } from "./FieldError"

export function RegisterForm(){
    const [state, action, pending] = useActionState(Signup, {})

    return(
        <main className="page-container flex flex-1 items-center justify-center">
            <section className="card w-full max-w-md p-6 sm:p-8">
                <h1 className="mb-2">Inscription</h1>
                <p className="text-muted mb-6">Inscrivez vous pour accéder aux drops</p>

                <form action={action} className="grid gap-5">
                    <label className="form-field">
                        Nom d'utilisateur
                        <input className="form-input" type="text" name="username"
                            aria-invalid={Boolean(state.fields?.username?.length)}
                            aria-describedby={state.fields?.username?.length ? "username-error" : undefined}
                        />
                        <FieldError id="username-error" messages={state.fields?.username} />
                    </label>
                    <label className="form-field">
                        Email
                        <input className="form-input" type="email" name="email"
                            aria-invalid={Boolean(state.fields?.email?.length)}
                            aria-describedby={state.fields?.email?.length ? "email-error" : undefined}
                        />
                        <FieldError id="email-error" messages={state.fields?.email} />
                    </label>
                    <label className="form-field">
                        Mot de passe
                        <input className="form-input" type="password" name="password"
                            aria-invalid={Boolean(state.fields?.password?.length)}
                            aria-describedby={state.fields?.password?.length ? "register-password-error" : undefined}
                        />
                        <FieldError id="register-password-error" messages={state.fields?.password} />
                    </label>
                    <label className="form-field">
                        Nom affiché
                        <input className="form-input" type="text" name="displayName"
                            aria-invalid={Boolean(state.fields?.displayName?.length)}
                            aria-describedby={state.fields?.displayName?.length ? "display-name-error" : undefined}
                        />
                        <FieldError id="display-name-error" messages={state.fields?.displayName} />
                    </label>
                    <label className="form-field">
                        Bio
                        <input className="form-input" type="text" name="bio"
                            aria-invalid={Boolean(state.fields?.bio?.length)}
                            aria-describedby={state.fields?.bio?.length ? "bio-error" : undefined}
                        />
                        <FieldError id="bio-error" messages={state.fields?.bio} />
                    </label>
                    {state.error && (
                        <p className="form-error" role="alert">
                            {state.error}
                        </p>
                    )}
                    <Button type="submit" disabled={pending}>{pending ? <><Spinner />Inscription...</> :"S'inscrire"}</Button>
                </form>
            </section>
        </main>
    )
}