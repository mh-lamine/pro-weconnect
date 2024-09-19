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
import { Textarea } from "../ui/textarea";

const ModalUpdateService = ({ prevService, updateService }) => {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = (e) => {
    const { name, value } = e.target;

    const parsedValue =
      name === "price"
        ? parseFloat(value)
        : name === "duration"
        ? parseFloat(convertToMinutes(value))
        : value;

    setService({ ...service, [name]: parsedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hasChanges = Object.keys(service).some(
      (key) => service[key] !== prevService[key]
    );

    if (!hasChanges) {
      setLoading(false);
      setOpen(false);
      return;
    }

    try {
      await updateService(prevService.id, service);
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setService();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Modifier</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la prestation</DialogTitle>
            <DialogDescription>
              Modifiez les détails de la prestation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={prevService.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="price">Prix (sans €)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={prevService.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="duration">Durée (en minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="time"
                defaultValue={prevService.duration}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                className="resize-none"
                defaultValue={prevService.description}
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
                <Button variant="outline" onClick={() => setService()}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
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
        <Button variant="outline">Modifier</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle> Modifier la prestation</DrawerTitle>
          <DrawerDescription>
            Modifiez les détails de la prestation.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col px-4 gap-2">
          <div>
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={prevService.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="price">Prix (en €)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              defaultValue={prevService.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="duration">Durée (en minutes)</Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              defaultValue={prevService.duration}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="resize-none"
              defaultValue={prevService.description}
              onChange={handleChange}
            />
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
                {loading ? <Loader2 className="animate-spin" /> : "Modifier"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setService()}
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

export default ModalUpdateService;
