import { MyProfileForm } from "@/components/forms/MyProfileForm"
import { apiGet } from "@/lib/api/client"
import type { PrivateUser } from "@/lib/api/types"
import { requireSession } from "@/lib/session"

export default async function MePage() {
    await requireSession()

    try {
        const user = await apiGet<PrivateUser>("/auth/me")
        return (
            <main className="page-container">
                <div className="mx-auto w-full max-w-2xl">
                    <MyProfileForm user={user} />
                </div>
            </main>
        )
    } catch (error) {
        return (
            <main className="page-container">
                <section className="card mx-auto w-full max-w-2xl p-6" role="alert">
                    {error instanceof Error ? error.message : "Impossible de charger votre profil."}
                </section>
            </main>
        )
    }
}
