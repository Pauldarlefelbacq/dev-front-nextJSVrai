import { apiGet } from "@/lib/api/client";
import type { UserProfile } from "@/lib/api/types";
import { UserInformations } from "@/components/user/userInformations";


export default async function userPage({ params }: { params: { id: string } }){
    const username = await params;
    const user = await apiGet<UserProfile>(`/users/${username}`)

    return(
        <>
        <UserInformations user={user} />
        </>
    )
}