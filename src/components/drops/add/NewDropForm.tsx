'use client'

import { useActionState, useState } from "react"
import { createDrop } from "@/app/actions/drops"
import type { Category } from "@/lib/api/types"
import { LocationField } from "@/components/drops/LocationField"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/forms/FieldError"

export function NewDropForm({categories}: {categories: Category[]}){
    const [state, action, pending] = useActionState(createDrop, {})
    const [locationOption, setLocationOption] = useState<"manual" | "geolocation">("manual")
    const hasLocationError = Boolean(state.fields?.location?.length)
    
    return(
        <main className="page-container">
            <section className="card mx-auto w-full max-w-2xl p-6 sm:p-8">
                <h1 className="mb-2">Créer un nouveau drop</h1>
                <p className="text-muted mb-6">
                    Partagez un message avec les personnes autour de vous.
                </p>
                <form action={action} className="grid gap-5">
                    <label className="form-field">
                    Titre
                        <input className="form-input" type="text" name="title" minLength={3} maxLength={80}
                            aria-invalid={Boolean(state.fields?.title?.length)}
                            aria-describedby={state.fields?.title?.length ? "drop-title-error" : undefined}
                            required
                        />
                        <FieldError id="drop-title-error" messages={state.fields?.title} />
                    </label>
                    <label className="form-field">
                    Contenu
                        <textarea className="form-input min-h-32 resize-y" name="content" maxLength={1000}
                            aria-invalid={Boolean(state.fields?.content?.length)}
                            aria-describedby={state.fields?.content?.length ? "drop-content-error" : undefined}
                            required
                        />
                        <FieldError id="drop-content-error" messages={state.fields?.content} />
                    </label>
                    <label className="form-field">
                    Categorie
                        <select className="form-input" name="category"
                            aria-invalid={Boolean(state.fields?.category?.length)}
                            aria-describedby={state.fields?.category?.length ? "drop-category-error" : undefined}
                            required
                        >
                            {categories.map((cat)=>(
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                        <FieldError id="drop-category-error" messages={state.fields?.category} />
                    </label>
                    <label className="form-field">
                    URL de l'image
                        <input className="form-input" type="url" name="imageUrl"
                            aria-invalid={Boolean(state.fields?.imageUrl?.length)}
                            aria-describedby={state.fields?.imageUrl?.length ? "drop-image-error" : undefined}
                        />
                        <FieldError id="drop-image-error" messages={state.fields?.imageUrl} />
                    </label>
                    <fieldset
                        className={`grid gap-4 ${hasLocationError ? "form-fieldset-invalid" : ""}`}
                        aria-invalid={hasLocationError}
                        aria-describedby={hasLocationError ? "drop-location-error" : undefined}
                    >
                        <legend className="mb-2 text-sm font-medium">Position</legend>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="locationOption"
                                value="manual"
                                checked={locationOption === "manual"}
                                onChange={() => setLocationOption("manual")}
                            />
                            Saisir les coordonnées
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="locationOption"
                                value="geolocation"
                                checked={locationOption === "geolocation"}
                                onChange={() => setLocationOption("geolocation")}
                            />
                            Utiliser ma localisation
                        </label>
                        {locationOption === "manual" ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="form-field">
                                    Latitude
                                    <input className="form-input" type="number" name="lat" step="any"
                                        aria-invalid={Boolean(state.fields?.lat?.length || hasLocationError)}
                                        aria-describedby={
                                            state.fields?.lat?.length && hasLocationError
                                                ? "drop-lat-error drop-location-error"
                                                : state.fields?.lat?.length
                                                    ? "drop-lat-error"
                                                    : hasLocationError
                                                        ? "drop-location-error"
                                                        : undefined
                                        }
                                        required
                                    />
                                    <FieldError id="drop-lat-error" messages={state.fields?.lat} />
                                </label>
                                <label className="form-field">
                                    Longitude
                                    <input className="form-input" type="number" name="lng" step="any"
                                        aria-invalid={Boolean(state.fields?.lng?.length || hasLocationError)}
                                        aria-describedby={
                                            state.fields?.lng?.length && hasLocationError
                                                ? "drop-lng-error drop-location-error"
                                                : state.fields?.lng?.length
                                                    ? "drop-lng-error"
                                                    : hasLocationError
                                                        ? "drop-location-error"
                                                        : undefined
                                        }
                                        required
                                    />
                                    <FieldError id="drop-lng-error" messages={state.fields?.lng} />
                                </label>
                            </div>
                        ) : (
                            <LocationField />
                        )}
                        <FieldError id="drop-location-error" messages={state.fields?.location} />
                        <p className="text-muted mb-0 text-sm sm:col-span-2">
                            Le drop doit se trouver à moins de 3 km du département MMI.
                        </p>
                    </fieldset>
                    {state.error && <p className="form-error mb-0" role="alert">{state.error}</p>}
                    <Button type="submit" disabled={pending}>
                        {pending ? <><Spinner /> Création…</> : "Créer le drop"}
                    </Button>
                </form>
            </section>
        </main>
    )
}