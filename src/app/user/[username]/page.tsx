import { apiGet } from "@/lib/api/client";
import { UserProfile } from "@/lib/api/types";


export default async function userPage({ params }: { params: { id: string } }){
    const username = await params;
    const user = await apiGet<UserProfile>(`/users/${username}`)

    return(

    )
}