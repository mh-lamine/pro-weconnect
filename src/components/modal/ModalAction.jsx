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
import { toast } from "sonner";

const ModalAction = ({
  id,
  action,
  actionLabel,
  title,
  description,
  successMessage = null,
  trigger,
  variant = "outline",
  triggerVariant,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await action(id);
      {
        successMessage && toast.success(successMessage);
      }
      setOpen(false);
    } catch (error) {
      toast.error("Une erreur est survenue, veuillez contacter le support.");
    }
    setLoading(false);
  };

  const DesktopContent = () => (
    <>
      <DialogHeader>
        <DialogTitle className={variant == "destructive" && "text-destructive"}>
          {title}
        </DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <DialogFooter className="sm:justify-start">
        <div className="w-full flex items-center justify-between">
          <Button onClick={handleAction} variant={variant} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : actionLabel}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </>
  );

  const MobileContent = () => (
    <>
      <DrawerHeader>
        <DrawerTitle className={variant == "destructive" && "text-destructive"}>
          {title}
        </DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <DrawerFooter className="pt-2">
        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={handleAction}
            variant={variant}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : actionLabel}
          </Button>
          <DrawerClose asChild>
            <Button className="w-full" variant="outline">
              Annuler
            </Button>
          </DrawerClose>
        </div>
      </DrawerFooter>
    </>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={triggerVariant || variant}>{trigger}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DesktopContent />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant={triggerVariant || variant}>{trigger}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <MobileContent />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ModalAction;
