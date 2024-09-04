import ModalAction from "@/components/modal/ModalAction";
import ModalAddAvailability from "@/components/modal/ModalAddAvailability";
import ModalAddSpecialAvailability from "@/components/modal/ModalAddSpecialAvailability";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2, MinusCircle } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const SalonAvailabilities = () => {
  const daysOfWeek = {
    Lundi: "MONDAY",
    Mardi: "TUESDAY",
    Mercredi: "WEDNESDAY",
    Jeudi: "THURSDAY",
    Vendredi: "FRIDAY",
    Samedi: "SATURDAY",
    Dimanche: "SUNDAY",
  };

  const [availabilities, setAvailabilities] = useState();
  const [specialAvailabilities, setSpecialAvailabilities] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getAvailabilities();
  }, []);

  async function getAvailabilities() {
    try {
      const response = await axiosPrivate.get("/api/availabilities");
      setAvailabilities(formatAvailabilities(response.data.availabilities));
      setSpecialAvailabilities(response.data.specialAvailabilities);
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
  }

  async function createAvailability(availability) {
    await axiosPrivate.post("/api/availabilities", availability);
    getAvailabilities();
  }

  async function createSpecialAvailability(availability) {
    const res = await axiosPrivate.post(
      "/api/availabilities/special",
      availability
    );
    getAvailabilities();
  }

  async function removeAvailability(id) {
    await axiosPrivate.delete(`/api/availabilities/${id}`);
    getAvailabilities();
  }

  async function removeSpecialAvailability(id) {
    await axiosPrivate.delete(`/api/availabilities/special/${id}`);
    getAvailabilities();
  }

  function formatAvailabilities(availabilities) {
    const formatted = {};

    availabilities?.forEach(({ id, dayOfWeek, startTime, endTime }) => {
      if (!formatted[dayOfWeek]) {
        formatted[dayOfWeek] = [];
      }

      formatted[dayOfWeek].push({
        id,
        start: startTime,
        end: endTime,
      });
    });

    return formatted;
  }

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/salon">Salon</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/salon/availabilities">Disponibilités</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">Mes disponibilités</h1>
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weekly">Par semaine</TabsTrigger>
          <TabsTrigger value="daily">Par jour</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly">
          <p className="text-muted pb-4">
            Gérez vos horaires de travail hebdomadaires.
          </p>
          {Object.entries(daysOfWeek).map(([dayFR, dayEN], i) => (
            <div key={i}>
              <DailyAvailability
                dayFR={dayFR}
                dayEN={dayEN}
                availabilities={availabilities && availabilities[dayEN]}
                createAvailability={createAvailability}
                removeAvailability={removeAvailability}
              />
              {i !== Object.entries(daysOfWeek).length - 1 && (
                <div className="divider w-1/2 mx-auto" />
              )}
            </div>
          ))}
        </TabsContent>
        <TabsContent value="daily">
          <p className="text-muted pb-4">
            Définissez des horaires spéciales pour des jours précis.
          </p>
          <ModalAddSpecialAvailability
            createSpecialAvailability={createSpecialAvailability}
          />
          {specialAvailabilities?.length ? (
            specialAvailabilities.map(({ id, date, startTime, endTime }) => (
              <div
                key={id}
                className="flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <span className="flex-1 text-2xl font-medium">
                  {DateTime.fromISO(date).toFormat("DDDD")}
                </span>
                <div className="flex flex-1 gap-2">
                  <div className="flex items-center justify-center">
                    <Input
                      disabled
                      type="time"
                      defaultValue={startTime}
                      className="!opacity-100 w-min"
                    />
                    <div className="divider divider-horizontal m-0"></div>
                    <Input
                      disabled
                      type="time"
                      defaultValue={endTime}
                      className="!opacity-100 w-min"
                    />
                  </div>
                  <ModalAction
                    id={id}
                    action={removeSpecialAvailability}
                    actionLabel="Supprimer"
                    variant="destructive"
                    title="Supprimer une disponibilité spéciale"
                    description="Êtes-vous sûr de vouloir supprimer cette disponibilité spéciale ?"
                    trigger={<MinusCircle className="text-destructive" />}
                    triggerVariant="ghost"
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Aucune disponibilité spéciale</p>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default SalonAvailabilities;

const DailyAvailability = ({
  dayFR,
  dayEN,
  availabilities,
  createAvailability,
  removeAvailability,
}) => {
  return (
    <section
      className={`flex flex-col sm:flex-row gap-4 ${
        !availabilities?.length && "text-muted sm:items-center"
      }`}
    >
      <span className="text-xl font-medium sm:flex-1">{dayFR}</span>
      {availabilities?.length ? (
        <div className="space-y-2 sm:flex-2">
          {availabilities?.map(({ id, start, end }, i) => {
            return (
              <div key={id} className="flex gap-4">
                <Input
                  disabled
                  type="time"
                  defaultValue={start}
                  className="!opacity-100 w-min"
                />
                <div className="divider divider-horizontal m-0"></div>
                <Input
                  disabled
                  type="time"
                  defaultValue={end}
                  className="!opacity-100 w-min"
                />
                <ModalAction
                  id={id}
                  action={removeAvailability}
                  actionLabel="Supprimer"
                  variant="destructive"
                  title="Supprimer un créneau"
                  description="Êtes-vous sûr de vouloir supprimer ce créneau de disponibilité ?"
                  trigger={<MinusCircle className="text-destructive" />}
                  triggerVariant="ghost"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sm:flex-2">Fermé</div>
      )}
      <div className="flex sm:flex-1 justify-end">
        <ModalAddAvailability
          dayOfWeek={dayEN}
          createAvailability={createAvailability}
        />
      </div>
    </section>
  );
};
