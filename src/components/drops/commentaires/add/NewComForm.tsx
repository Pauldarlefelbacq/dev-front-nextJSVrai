'use client'

import { useActionState } from "react"
import { createCom } from "@/app/actions/drops"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export function newComForm({ dropId }: { dropId: number }){
    const [state, action, pending] = useActionState(createCom.bind(null, dropId), {})

    return(
        <form action={action} className="card grid gap-3 p-4">
            <label className="form-field">
                Commentaire
                <textarea
                    className="form-input min-h-24"
                    name="content"
                    minLength={1}
                    maxLength={500}
                    required
                />
            </label>
            {state.error && <p className="form-error mb-0" role="alert">{state.error}</p>}
            {state.success && <p className="text-muted mb-0" role="status">{state.success}</p>}
            <Button className=" justify-self-start" type="submit" disabled={pending}>
                {pending ? <><Spinner />Envoi…</> : "Envoyer le commentaire"}
            </Button>
        </form>
    )
}