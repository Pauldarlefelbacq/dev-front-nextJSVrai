'use client'

import { useEffect, useState } from "react";
import { useGeolocalisation } from "@/lib/use-geolocalisation";

export function LocationField(){
    const { status, coords, locate } = useGeolocalisation()
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    
    useEffect(()=>{
        if (coords){
            setLat(coords.lat.toFixed(6))
            setLng(coords.lng.toFixed(6))
        }
    }, [coords]);
    

    return(
        <div>
            <input name="lat" value={lat} 
            onChange={(e)=> setLat(e.target.value)} />
            <input name="lng" value={lng} 
            onChange={(e)=> setLng(e.target.value)} />
            <button type="button" onClick={locate}
                disabled={status === "loading"}>
                 {status === "loading" ? "Locating..." : "Utiliser ma localisation"}
            </button>
            {
                status === "denied" && 
                <p>Permission non accordée à la localisation, entrer les coordonnées manuellement</p>
            }
            {
                status === "unavailable" &&
                <p> Geolocalisation non supportée sur l'appareil</p>
            }
            {
                status === "error" &&
                <p>Impossible d'avoir accès à votre position, veuillez réessayer</p>
            }
        </div>
    )
}