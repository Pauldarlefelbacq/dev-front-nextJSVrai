"use client"

import { useActionState } from "react"
import { updateMyProfile } from "@/app/actions/auth"
import type { PrivateUser } from "@/lib/api/types"
import { FieldError } from "@/components/forms/FieldError"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function MyProfileForm({ user }: { user: PrivateUser }) {
    const [state, action, pending] = useActionState(updateMyProfile, {})

    return (
        <section className="card grid gap-5 p-6 sm:p-8">
            <div className="flex items-center gap-4">
                {user.avatarUrl ? (
                    <img
                        className="size-20 rounded-full object-cover"
                        src={user.avatarUrl}
                        alt={`Photo de profil de ${user.displayName}`}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div
                        className="flex size-20 items-center justify-center rounded-full bg-brand-secondary text-2xl font-bold text-brand-main"
                        aria-hidden="true"
                    >
                        {user.displayName.trim().charAt(0).toUpperCase() || "?"}
                    </div>
                )}
                <div>
                    <h1 className="mb-1">Mon profil</h1>
                    <p className="text-muted mb-0">@{user.username}</p>
                </div>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                    <dt className="text-sm text-muted">Nom d&apos;utilisateur</dt>
                    <dd className="mb-0 font-medium">{user.username}</dd>
                </div>
                <div>
                    <dt className="text-sm text-muted">E-mail</dt>
                    <dd className="mb-0 font-medium">{user.email}</dd>
                </div>
            </dl>

            <form action={action} className="grid gap-5">
                <label className="form-field">
                    Nom affiché
                    <input
                        className="form-input"
                        type="text"
                        name="displayName"
                        minLength={1}
                        maxLength={40}
                        defaultValue={user.displayName}
                        aria-invalid={Boolean(state.fields?.displayName?.length)}
                        aria-describedby={state.fields?.displayName?.length ? "profile-name-error" : undefined}
                        required
                    />
                    <FieldError id="profile-name-error" messages={state.fields?.displayName} />
                </label>

                <label className="form-field">
                    Biographie
                    <textarea
                        className="form-input min-h-24 resize-y"
                        name="bio"
                        maxLength={280}
                        defaultValue={user.bio ?? ""}
                        aria-invalid={Boolean(state.fields?.bio?.length)}
                        aria-describedby={state.fields?.bio?.length ? "profile-bio-error" : undefined}
                    />
                    <FieldError id="profile-bio-error" messages={state.fields?.bio} />
                </label>

                <label className="form-field">
                    URL de la photo de profil
                    <input
                        className="form-input"
                        type="url"
                        name="avatarUrl"
                        maxLength={500}
                        defaultValue={user.avatarUrl ?? ""}
                        aria-invalid={Boolean(state.fields?.avatarUrl?.length)}
                        aria-describedby={state.fields?.avatarUrl?.length ? "profile-avatar-error" : undefined}
                    />
                    <FieldError id="profile-avatar-error" messages={state.fields?.avatarUrl} />
                </label>

                {state.error && <p className="form-error mb-0" role="alert">{state.error}</p>}
                {state.success && <p className="text-muted mb-0" role="status">{state.success}</p>}

                <Button type="submit" disabled={pending}>
                    {pending ? <><Spinner />Enregistrement…</> : "Enregistrer"}
                </Button>
            </form>

            <p className="text-muted mb-0 text-sm">
                Membre depuis {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(user.createdAt))}
            </p>
        </section>
    )
}
