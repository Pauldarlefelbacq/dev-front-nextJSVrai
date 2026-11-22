'use client'

import { useActionState } from "react"
import { Signup } from "@/app/actions/auth"

export function RegisterForm(){
    const [state, action, pending] = useActionState(Signup, {})

    return(
        <main>
            <section>
                <h1>Inscription</h1>
                <p>Inscrivez vous pour accéder aux drops</p>

                <form action={action}>
                    <label>
                        Nom d'utilisateur
                        <input type="text" name="username"/>
                    </label>
                    <label>
                        Email
                        <input type="email" name="email"/>
                    </label>
                    <label>
                        Mot de passe
                        <input type="password" name="password"/>
                        </label>
                    <label>
                        Nom affiché
                        <input type="text" name="displayName"/>
                    </label>
                    <label>
                        Bio
                        <input type="text" name="bio"/>
                    </label>
                    {state.error && (
                        <p className="form-error" role="alert">
                            {state.error}
                        </p>
                    )}
                    <button type="submit" disabled={pending}>S'inscrire</button>
                </form>
            </section>
        </main>
    )
}