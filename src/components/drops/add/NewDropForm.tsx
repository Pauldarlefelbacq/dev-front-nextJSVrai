'use client'

import { useActionState, useState } from "react"
import { createDrop } from "@/app/actions/drops"
import type { Category, Drop } from "@/lib/api/types"
import { LocationField } from "@/components/drops/LocationField"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/forms/FieldError"
import { DropsMap } from "@/components/map/DropsMap"

const EMPTY_DROPS: Drop[] = [] // contournement du fonctionnement naturel de la map

export function NewDropForm({categories}: {categories: Category[]}){
    const [state, action, pending] = useActionState(createDrop, {})
    const [locationOption, setLocationOption] = useState<"manual" | "geolocation">("manual")
    const [location, setLocation] = useState({ lat: "", lng: "" })
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
                            <div className="w-fill h-80">
                                <DropsMap
                                    drops={EMPTY_DROPS}
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