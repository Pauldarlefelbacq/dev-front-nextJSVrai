import { apiGet } from "@/lib/api/client";
import type { UserProfile } from "@/lib/api/types";
import { UserInformations } from "@/components/user/userInformations";
import { Suspense } from "react";


export default async function userPage({ params }: { params: Promise<{username: string}> } ){
    const { username } = await params;
    const user = await apiGet<UserProfile>(`/users/${username}`)

    return(
        <Suspense fallback={<h1>Chargement...</h1>}>
            <UserInformations user={user} />
        </Suspense>
    )
}