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

export function DeleteComButton(comId: number){

    return(
        <Dialog>
            <DialogTrigger render={<Button variant={"delete"}>Supprimer</Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Supprimer le commentaire ?</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce commentaire
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <span className="flex flex-row-reverse px-2 gap-5 *:p-0.5 *:rounded-sm *:cursor-pointer">
                        <Button variant={"delete"} onClick={() => deleteCom(comId)}>Supprimer</Button>
                        <DialogClose render={<button>Annuler</button>} />
                    </span>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
    )
}