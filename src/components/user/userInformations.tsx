

import type { UserProfile } from "@/lib/api/types";
import { UserDrops } from "./drops/UserDrops";
import { Suspense } from "react";


export function UserInformations({ user }: { user: UserProfile }){

    return(
        <section className="card grid place-items-center m-5 p-5 *:my-2">
            <span className="grid grid-cols-2 place-items-center">
                {user.avatarUrl ? (
                    <img
                        className="size-30 rounded-full object-cover"
                        src={user.avatarUrl}
                        alt={`Photo de profil de ${user.displayName}`}
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div
                        className="flex size-30 items-center justify-center rounded-full bg-brand-secondary text-2xl font-bold text-brand-main"
                        aria-hidden="true"
                    >
                        {user.displayName.trim().charAt(0).toUpperCase() || "?"}
                    </div>
                )}
                <h1>Profil de {user.displayName}</h1>
            </span>
            <div className="card w-full mx-24 p-5 ">
                <h2 className="text-2xl font-bold">À propos de moi: </h2>
                <p className="bg-gray-500 rounded-sm w-fit p-1 text-black">{user.bio}</p>
            </div>
            <div className="grid grid-cols-3 card w-full p-2 place-content-center mx-24">
                <p>{user.stats.dropsCount} Drops</p>
                <p>{user.stats.commentsCount} Commentaires</p>
                <p>{user.stats.likesReceived} Likes reçues</p>
            </div>
            <div className="card w-full p-5">
                <h2 className="text-2xl font-bold">Drops</h2>
                <Suspense fallback={<h2>Chargement des drops</h2>}>
                    <UserDrops userName={user.username} />
                </Suspense>
            </div>
        </section>
    )
}