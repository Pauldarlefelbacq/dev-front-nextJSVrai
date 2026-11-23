"use client"

import { deleteDrop } from "@/app/actions/drops"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function DeleteDropButton({ dropId }: { dropId: number }) {
    return (
        <Dialog>
            <DialogTrigger render={<button type="button">Supprimer mon drop</button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Supprimer le drop ?</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce drop ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <span className="flex flex-row-reverse gap-5 px-2 *:cursor-pointer *:rounded-sm *:p-0.5">
                        <button
                            className="bg-red-500 font-black text-gray-200 hover:bg-gray-300 hover:text-red-500"
                            type="button"
                            onClick={() => deleteDrop(dropId)}
                        >
                            Supprimer
                        </button>
                        <DialogClose render={<button type="button">Annuler</button>} />
                    </span>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
