import { EditDropForm } from "@/components/drops/EditDropForm"
import { apiGet } from "@/lib/api/client"
import type { Category, Drop } from "@/lib/api/types"
import { requireSession } from "@/lib/session"
import { notFound } from "next/navigation"

export default async function EditDropPage({ params }: { params: Promise<{ id: string }> }) {
    await requireSession()
    const { id } = await params
    const dropId = Number(id)

    if (!Number.isInteger(dropId)) notFound()

    const drop = await apiGet<Drop>(`/drops/${dropId}`)
    if (!drop.isMine) notFound()

    const categories = await apiGet<Category[]>("/categories")

    return <EditDropForm drop={drop} categories={categories} />
}
