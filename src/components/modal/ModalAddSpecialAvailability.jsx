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
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { formatDate } from "@/utils/formatting";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { DateTime } from "luxon";

const ModalAddSpecialAvailability = ({ createSpecialAvailability }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [availability, setAvailability] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !availability?.startTime || !availability?.endTime) {
      setError(
        "Veuillez renseigner une date, une heure de début et une heure de fin."
      );
      return;
    }

    if (availability.startTime >= availability.endTime) {
      setError("L'heure de début doit être avant l'heure de début.");
      return;
    }

    setLoading(true);
    try {
      await createSpecialAvailability({
        date: DateTime.fromJSDate(date).toISODate(),
        ...availability,
      });
      setOpen(false);
    } catch (error) {
      setError("Une disponibilité se chevauche déjà avec cet intervalle.");
    } finally {
      setLoading(false);
    }
  };

  const isDayOff = (date) => {
    const formattedDate = DateTime.fromJSDate(date).toISODate();
    const today = DateTime.now().toISODate(); 
    return formattedDate < today;
  };


  useEffect(() => {
    if (!open) {
      setAvailability();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="link" className="py-0">
            Ajouter une disponibilité
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un créneau</DialogTitle>
            <DialogDescription>
              Selectionnez une date, une heure de début et une heure de fin pour
              créer un créneau de disponibilité.
            </DialogDescription>
          </DialogHeader>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {date ? (
                  <span>{formatDate(date)}</span>
                ) : (
                  <span>Choisir une date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDayOff}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center justify-center gap-4">
            De
            <Input
              className="w-fit"
              name="startTime"
              type="time"
              onChange={handleChange}
            />
            à
            <Input
              className="w-fit"
              name="endTime"
              type="time"
              onChange={handleChange}
            />
          </div>
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={() => setAvailability()}>
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
          Ajouter une disponibilité
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ajouter un créneau</DrawerTitle>
          <DrawerDescription>
            Selectionnez une date, une heure de début et une heure de fin pour
            créer un créneau de disponibilité.
          </DrawerDescription>
        </DrawerHeader>
        <Popover>
          <div className="px-4 pb-2">
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {date ? (
                  <span>{formatDate(date)}</span>
                ) : (
                  <span>Choisir une date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={isDayOff}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </div>
        </Popover>
        <div className="flex items-center justify-center gap-4 px-4">
          De
          <Input
            className="w-fit"
            name="startTime"
            type="time"
            onChange={handleChange}
          />
          à
          <Input
            className="w-fit"
            name="endTime"
            type="time"
            onChange={handleChange}
          />
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
                onClick={() => setAvailability()}
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

export default ModalAddSpecialAvailability;
