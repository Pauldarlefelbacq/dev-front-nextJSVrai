'use client'

import { useState } from "react"
import { deleteCom } from "@/app/actions/drops"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"

export function DeleteComButton({ comId, dropId, onDeleted }: { comId: number, dropId: number, onDeleted?: () => void }){
    const [open, setOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState("")

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant={"delete"}>Supprimer</Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Supprimer le commentaire ?</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce commentaire
                    </DialogDescription>
                </DialogHeader>
                {error && <p className="form-error mb-0" role="alert">{error}</p>}
                <DialogFooter>
                    <span className="flex flex-row-reverse px-2 gap-5 *:p-0.5 *:rounded-sm *:cursor-pointer">
                        <Button
                            variant={"delete"}
                            disabled={deleting}
                            onClick={async () => {
                                setDeleting(true)
                                setError("")
                                const result = await deleteCom(comId, dropId)
                                setDeleting(false)
                                if (result.error) {
                                    setError(result.error)
                                    return
                                }
                                onDeleted?.()
                                setOpen(false)
                            }}
                        >
                            {deleting ? "Suppression…" : "Supprimer"}
                        </Button>
                        <DialogClose render={<button>Annuler</button>} />
                    </span>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
    )
}