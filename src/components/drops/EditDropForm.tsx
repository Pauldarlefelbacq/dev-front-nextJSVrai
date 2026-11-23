"use client"

import { useActionState } from "react"
import { EditDrop } from "@/app/actions/drops"
import type { Category, Drop } from "@/lib/api/types"

type Props = {
    drop: Drop
    categories: Category[]
}

export function EditDropForm({ drop, categories }: Props) {
    const [state, action, pending] = useActionState(EditDrop.bind(null, drop.id), {})

    return (
        <main className="page-container">
            <section className="card mx-auto w-full max-w-2xl p-6 sm:p-8">
                <h1 className="mb-2">Modifier le drop</h1>
                <form action={action} className="grid gap-5">
                    <label className="form-field">
                        Titre
                        <input
                            className="form-input"
                            type="text"
                            name="title"
                            minLength={3}
                            maxLength={80}
                            defaultValue={drop.title}
                            required
                        />
                    </label>
                    <label className="form-field">
                        Contenu
                        <textarea
                            className="form-input min-h-32 resize-y"
                            name="content"
                            maxLength={1000}
                            defaultValue={drop.content ?? ""}
                            required
                        />
                    </label>
                    <label className="form-field">
                        Catégorie
                        <select className="form-input" name="category" defaultValue={drop.category} required>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="form-field">
                        URL de l&apos;image
                        <input
                            className="form-input"
                            type="url"
                            name="imageUrl"
                            defaultValue={drop.imageUrl ?? ""}
                        />
                    </label>
                    <fieldset className="grid gap-4 sm:grid-cols-2">
                        <legend className="mb-2 text-sm font-medium">Position</legend>
                        <label className="form-field">
                            Latitude
                            <input
                                className="form-input"
                                type="number"
                                name="lat"
                                step="any"
                                defaultValue={drop.location.lat}
                                required
                            />
                        </label>
                        <label className="form-field">
                            Longitude
                            <input
                                className="form-input"
                                type="number"
                                name="lng"
                                step="any"
                                defaultValue={drop.location.lng}
                                required
                            />
                        </label>
                    </fieldset>
                    {state.error && <p className="form-error" role="alert">{state.error}</p>}
                    <button className="button-primary justify-self-start" type="submit" disabled={pending}>
                        {pending ? "Enregistrement…" : "Enregistrer"}
                    </button>
                </form>
            </section>
        </main>
    )
}
