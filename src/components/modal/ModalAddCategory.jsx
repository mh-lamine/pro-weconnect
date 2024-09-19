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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ModalAddCategory = ({ createCategory }) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category?.name) {
      setError("Veuillez renseigner le nom de la catégorie.");
      return;
    }

    setLoading(true);
    try {
      await createCategory(category);
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setCategory();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="py-0">
            Ajouter une catégorie
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
            <DialogDescription>
              Définissez un nom pour ajouter une catégorie.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
              />
            </div>
          </div>
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={() => setCategory()}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
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
        <Button variant="link" className="py-0">
          Ajouter une catégorie
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ajouter une categorie</DrawerTitle>
          <DrawerDescription>
            Définissez un nom pour ajouter une categorie.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col px-4 gap-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input id="name" name="name" type="text" onChange={handleChange} />
          </div>
        </div>
        <DrawerFooter className="pt-2">
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
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

export default ModalAddCategory;
