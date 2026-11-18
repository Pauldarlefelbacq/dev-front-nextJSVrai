'use client'

import { useActionState } from "react"
import { createDrop } from "@/app/actions/drops"
import type { Category } from "@/lib/api/types"

export function newDropForm({categories}: {categories: Category[]}){
    const [state, action, pending] = useActionState(createDrop, {})
    
    return(
        <main>
            <h1>Créer un nouveau drop</h1>
            <form action={action}>
                <label>
                    Titre
                    <input type="text" name="title" minLength={3} maxLength={80} required />
                </label>
                <label>
                    Contenu
                    <input type="text" name="content" maxLength={1000} required />
                </label>
                <label>
                    Categorie
                    <select name="category" required>
                        {categories.map((cat)=>(
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </label>
                <label>
                    URL de l'image
                    <input type="url" name="imageUrl" />
                </label>
                <label>
                    Latitude
                    <input type="number" name="lat"step="any" required />
                </label>
                <label>
                    Longitude
                    <input type="number" name="lng" step="any" required />
                </label>
                <button type="submit" disabled={pending}>Créer le drop</button>
            </form>
        </main>
    )
}