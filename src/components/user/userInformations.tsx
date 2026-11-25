'use client'

import type { UserProfile } from "@/lib/api/types";


export function UserInformations({ user }: { user: UserProfile }){

    return(
        <section>
            <span>
                {user.avatarUrl ? (
                    <img
                        className="size-20 rounded-full object-cover"
                        src={user.avatarUrl}
                        alt={`Photo de profil de ${user.displayName}`}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div
                        className="flex size-20 items-center justify-center rounded-full bg-brand-secondary text-2xl font-bold text-brand-main"
                        aria-hidden="true"
                    >
                        {user.displayName.trim().charAt(0).toUpperCase() || "?"}
                    </div>
                )}
                <h1>Profil de {user.displayName}</h1>
            </span>
            <div>
                <h2>À propos de moi </h2>
                <p>{user.bio}</p>
            </div>
            <div>
                <p>posts & coms</p>
            </div>
        </section>
    )
}