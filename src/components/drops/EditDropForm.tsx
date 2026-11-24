"use client"

import { useActionState, useState } from "react"
import { EditDrop } from "@/app/actions/drops"
import type { Category, Drop } from "@/lib/api/types"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { FieldError } from "../forms/FieldError"
import { DropsMap } from "../map/DropsMap"


type Props = {
    drop: Drop
    categories: Category[]
}

export function EditDropForm({ drop, categories }: Props) {
    const [state, action, pending] = useActionState(EditDrop.bind(null, drop.id), {})
    const [location, setLocation] = useState({ lat: "", lng: "" })
    

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
                            aria-invalid={Boolean(state.fields?.title?.length)}
                            aria-describedby={state.fields?.title?.length ? "edit-title-error" : undefined}
                            required
                        />
                        <FieldError id="edit-title-error" messages={state.fields?.title} />
                    </label>
                    <label className="form-field">
                        Contenu
                        <textarea
                            className="form-input min-h-32 resize-y"
                            name="content"
                            maxLength={1000}
                            defaultValue={drop.content ?? ""}
                            aria-invalid={Boolean(state.fields?.content?.length)}
                            aria-describedby={state.fields?.content?.length ? "edit-content-error" : undefined}
                            required
                        />
                        <FieldError id="edit-content-error" messages={state.fields?.content} />
                    </label>
                    <label className="form-field">
                        Catégorie
                        <select className="form-input" name="category" defaultValue={drop.category}
                            aria-invalid={Boolean(state.fields?.category?.length)}
                            aria-describedby={state.fields?.category?.length ? "edit-category-error" : undefined}
                            required
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.label}</option>
                            ))}
                        </select>
                        <FieldError id="edit-category-error" messages={state.fields?.category} />
                    </label>
                    <label className="form-field">
                        URL de l&apos;image
                        <input
                            className="form-input"
                            type="url"
                            name="imageUrl"
                            defaultValue={drop.imageUrl ?? ""}
                            aria-invalid={Boolean(state.fields?.imageUrl?.length)}
                            aria-describedby={state.fields?.imageUrl?.length ? "edit-image-error" : undefined}
                        />
                        <FieldError id="edit-image-error" messages={state.fields?.imageUrl} />
                    </label>
                    <div className="w-fill h-80">
                        <DropsMap
                            drops={[drop]}
                            activeId={null}
                            LocationSelect={(lat, lng) => {
                                setLocation({ lat: String(lat), lng: String(lng) })
                            }}
                        />
                        <span className="hidden">
                            <input type="number" name="lat" value={location.lat} />
                            <input type="number" name="lng" value={location.lng} />
                        </span>

                    </div>
                    {state.error && <p className="form-error" role="alert">{state.error}</p>}
                    <Button type="submit" disabled={pending}>
                        {pending ? <><Spinner />Enregistrement…</> : "Enregistrer"}
                    </Button>
                </form>
            </section>
        </main>
    )
}
