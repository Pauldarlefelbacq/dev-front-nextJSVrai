'use client'

import dynamic from "next/dynamic";

export const DropsMap = dynamic(
    () => import('./DropsMapView'),
    { ssr: false },
)