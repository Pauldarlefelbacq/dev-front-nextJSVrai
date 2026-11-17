'use client'
import { useState } from "react"

export function TruncatedText({ content }: { content: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            {/* <p>{open ? content : :content.slice(0,80)}</p> */}
        </>
    )
}