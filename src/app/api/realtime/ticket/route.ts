import { NextResponse } from "next/server";
import { getToken } from "@/lib/session";

export async function POST(){
    const token = await getToken()
    if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const res = await fetch(process.env.API_URL + '/realtime/ticket', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        cache: 'no-store',
    });
    const data = await res.json();
    if(!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json({ url: data.url });
}