import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ModalDisableService = ({ id, providerCategoryId, disableService }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await disableService(id, providerCategoryId);
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">Retirer la prestation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Retirer la prestation
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir retirer cette prestation ?
            </DialogDescription>
          </DialogHeader>
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline">Annuler</Button>
                <Button
                  onClick={handleSubmit}
                  variant="destructive"
                  disabled={loading && true}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Retirer"}
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">Retirer la prestation</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-destructive">
            Retirer la prestation
          </DrawerTitle>
          <DrawerDescription>
            Êtes-vous sûr de vouloir retirer cette prestation ?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                variant="destructive"
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Retirer"}
              </Button>
              <Button className="w-full" variant="outline">
                Annuler
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalDisableService;
