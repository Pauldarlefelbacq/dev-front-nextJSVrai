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
import { LikesCountWidget } from "../LikesCountWidget"

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
            <CardHeader className="text-foreground">
                <CardTitle>
                    <Link className="transition-colors hover:text-brand-secondary hover:underline" href={`/drops/${dropData.id}`}>
                        {dropData.title}
                    </Link>
                </CardTitle>
                <CardAction>
                    <span className="rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground">
                        {dropData.category}
                    </span>
                </CardAction>
                <CardDescription>
                    Par{" "}
                    <Link className="transition-colors hover:text-brand-secondary hover:underline" href={`/user/${dropData.author.username}`}>
                        {dropData.author.username}
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-3 text-foreground">
                    {dropData.content ?? "Aucune description disponible."}
                </p>
                <div className="flex flex-wrap justify-between gap-2 text-muted-foreground">
                    <LikesCountWidget dropId={dropData.id} dropLikes={dropData.likesCount} />
                    <span>
                        {dropData.location.lat}, {dropData.location.lng}
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                <Link
                    className="text-foreground transition-colors hover:text-brand-secondary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                    href={`/drops/${dropData.id}`}
                >
                    Voir le drop
                </Link>
            </CardFooter>
        </Card>
    )
}
