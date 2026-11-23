'use client'

import { useActionState, useState } from "react"
import { createDrop } from "@/app/actions/drops"
import type { Category } from "@/lib/api/types"
import { LocationField } from "@/components/drops/LocationField"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export function NewDropForm({categories}: {categories: Category[]}){
    const [state, action, pending] = useActionState(createDrop, { fields: undefined })
    const [locationOption, setLocationOption] = useState<"manual" | "geolocation">("manual")
    
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
                        <input className="form-input" type="text" name="title" minLength={3} maxLength={80} required />
                    </label>
                    <label className="form-field">
                    Contenu
                        <textarea className="form-input min-h-32 resize-y" name="content" maxLength={1000} required />
                    </label>
                    <label className="form-field">
                    Categorie
                        <select className="form-input" name="category" required>
                            {categories.map((cat)=>(
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                    </label>
                    <label className="form-field">
                    URL de l'image
                        <input className="form-input" type="url" name="imageUrl" />
                    </label>
                    <fieldset className="grid gap-4">
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
                                    <input className="form-input" type="number" name="lat" step="any" required />
                                </label>
                                <label className="form-field">
                                    Longitude
                                    <input className="form-input" type="number" name="lng" step="any" required />
                                </label>
                            </div>
                        ) : (
                            <LocationField />
                        )}
                        <p className="text-muted mb-0 text-sm sm:col-span-2">
                            Le drop doit se trouver à moins de 3 km du département MMI.
                        </p>
                    </fieldset>
                    <Button type="submit" disabled={pending}>
                        {pending ? <><Spinner /> Création…</> : "Créer le drop"}
                    </Button>
                </form>
            </section>
        </main>
    )
}