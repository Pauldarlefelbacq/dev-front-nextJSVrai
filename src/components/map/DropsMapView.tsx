'use client'

import { Drop } from '@/lib/api/types';
import L, { layerGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

const NORMAL = { radius: 8, color: '#2563eb', weight: 2 }
const ACTIVE = { radius: 12, color: '#f97316', weight: 3 };


type DropsMapProps = {
    drops: Drop[];
    activeId: number | null;
    onSelect?: (id: number) => void;
    LocationSelect?: (lat: number, lng: number) => void;
};

export default function DropsMap({ drops, activeId, onSelect, LocationSelect }: DropsMapProps) {
    const container = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layer = useRef<L.LayerGroup | null>(null);
    const markers = useRef(new Map<number, L.CircleMarker>());
    const onSelectRef = useRef(onSelect);
    const onLocationSelectRef = useRef(LocationSelect)

    useEffect(() => {
        onSelectRef.current = onSelect;
        onLocationSelectRef.current = LocationSelect;
    }, []);

    useEffect(()=>{
        const map = L.map(container.current!).setView([47.51, 6.8], 13);
        mapRef.current = map;
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);
        layer.current = L.layerGroup().addTo(map);
        map.on('click', (event) => {
            onLocationSelectRef.current?.(event.latlng.lat, event.latlng.lng);
            const previous = markers.current.get(1)
            if (previous) layer.current?.removeLayer(previous)
                
            const m = L.circleMarker([event.latlng.lat, event.latlng.lng], NORMAL)
            .addTo(layer.current!)
            markers.current.set(1,m);
        })
        return() => {
            map.remove();
            mapRef.current = null;
            layer.current = null;
            onLocationSelectRef.current = undefined;
        };
    }, []);

    useEffect(()=>{
        const map = mapRef.current;
        const group = layer.current;
        if (!map || !group) return;
        group.clearLayers();
        markers.current.clear();

        for (const d of drops) {
            const m = L.circleMarker([d.location.lat, d.location.lng], NORMAL)
            .bindTooltip(d.title)
            .on('click', () => onSelectRef.current?.(d.id))
            .addTo(group);
            markers.current.set(d.id, m);
        }
        if (drops.length === 1) {
            const { lat, lng } = drops[0].location;
            map.setView([lat, lng], 16);
        } else if (drops.length > 1) {
            const pts: L.LatLngTuple[] = drops.map((d) => [d.location.lat, d.location.lng]);
            map.fitBounds(L.latLngBounds(pts), { padding: [32, 32], maxZoom: 16 });
        }
    }, [drops]);

    useEffect(() => {
        if (activeId === null) return;
        const m = markers.current.get(activeId);
        m?.setStyle(ACTIVE).bringToFront();
        return () => { m?.setStyle(NORMAL); };
    }, [activeId, drops]);

    return <div ref={container}
                className="h-full w-full rounded-lg" 
            />;
}