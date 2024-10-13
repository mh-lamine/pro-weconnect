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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const ModalUpdateCategory = ({ category, updateCategory }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [loading, setLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hasChanges = name !== category.name;

    if (!hasChanges) {
      setLoading(false);
      setOpen(false);
      toast("Aucun changement n'a été effectué.");
      return;
    }

    try {
      await updateCategory(category.id, { name });
      setOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier la catégorie</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier le nom de la catégorie</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={category.name}
              onChange={(e) => setName(e.target.value)}
            />
          </DialogDescription>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
                </Button>
                <Button variant="outline" onClick={() => setCategory()}>
                  Annuler
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
        <Button variant="outline">Modifier la catégorie</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> Modifier le nom de la catégorie</DrawerTitle>
        </DrawerHeader>
        <DialogDescription>
          <div className="px-4">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={category.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </DialogDescription>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setCategory()}
              >
                Annuler
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalUpdateCategory;
