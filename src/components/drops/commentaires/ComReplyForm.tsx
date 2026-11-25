'use client'

import { useActionState } from "react"
import { createReply } from "@/app/actions/drops"

export function ComReplyForm({ dropId, parentId }: {
    dropId: number
    parentId: number
}){
    const [state, action, pending] = useActionState(
        createReply.bind(null, dropId, parentId),
        {},
    )

    return(
        <form action={action} className="mt-3 grid gap-2">
            <textarea
                className="form-input min-h-20"
                name="content"
                minLength={1}
                maxLength={500}
                placeholder="Votre réponse…"
                required
            />
            {state.error && <p className="form-error mb-0" role="alert">{state.error}</p>}
            {state.success && <p className="text-muted mb-0" role="status">{state.success}</p>}
            <button type="submit" className="cursor-pointer justify-self-start" disabled={pending}>
                {pending ? "Envoi…" : "Envoyer la réponse"}
            </button>
        </form>
    )
}
