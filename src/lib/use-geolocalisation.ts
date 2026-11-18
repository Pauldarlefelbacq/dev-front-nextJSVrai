'use client';
import { useCallback, useState } from "react";
type Status = "idle" | "loading" | "success" | "denied" | "unavailable" | "error";
type Coords = { lat: number, lng: number };

export function useGeoloalisation(){
    const [status, setStatus] = useState<Status>("idle");
    const [coords, setCoords] = useState<Coords | null>(null);
    const locate = useCallback(()=>{
        if (!("geolocation" in navigator)) {
            setStatus("unavailable");
            return;
        }
        setStatus("loading");
        navigator.geolocation.getCurrentPosition(
            ({ coords: c })=>{
                setCoords({ lat: c.latitude, lng: c.longitude });
                setStatus("success");
            },
            (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        )
    }, []);
    return { status, coords, locate };
}