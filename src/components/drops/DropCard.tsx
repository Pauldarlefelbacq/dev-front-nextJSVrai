import Link from "next/link"
import type { Drop } from "@/lib/api/types"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function DropCard({ dropData }: { dropData: Drop }) {
    return (
        <Card>
            <Link href={`/drops/${dropData.id}`}>
                <img
                    src={dropData.imageUrl ?? "https://placehold.co/600x400"}
                    alt={dropData.imageUrl ? `Illustration de ${dropData.title}` : "Aucune image disponible"}
                    className="aspect-video w-full object-cover"
                />
            </Link>
            <CardHeader>
                <CardTitle>
                    <Link className="hover:underline" href={`/drops/${dropData.id}`}>
                        {dropData.title}
                    </Link>
                </CardTitle>
                <CardAction>
                    <span className="rounded-full border px-2 py-1 text-xs">
                        {dropData.category}
                    </span>
                </CardAction>
                <CardDescription>
                    Par{" "}
                    <Link className="hover:underline" href={`/users/${dropData.author.username}`}>
                        {dropData.author.displayName}
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <p className="mb-3 ">
                    {dropData.content ?? "Aucune description disponible."}
                </p>
                <div className="flex flex-wrap justify-between gap-2">
                    <span><strong>{dropData.likesCount}</strong> j'aime</span>
                    <span>
                        {dropData.location.lat}, {dropData.location.lng}
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                <Link
                    className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    href={`/drops/${dropData.id}`}
                >
                    Voir le drop
                </Link>
            </CardFooter>
        </Card>
    )
}
