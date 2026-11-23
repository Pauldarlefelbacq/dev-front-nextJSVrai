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
            <DialogTrigger render={<Button>Supprimer</Button>} />
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Supprimer le commentaire ?</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer ce commentaire
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <span className="flex flex-row-reverse px-2 gap-5 *:p-0.5 *:rounded-sm *:cursor-pointer">
                        <button className="bg-red-500 text-gray-200 font-black hover:bg-gray-300 hover:text-red-500" onClick={() => deleteCom(comId)}>Supprimer</button>
                        <DialogClose render={<button>Annuler</button>} />
                    </span>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
    )
}