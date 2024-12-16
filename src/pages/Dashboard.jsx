import ProviderAppointment from "@/components/ProviderAppointment";
import ModalAction from "@/components/modal/ModalAction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useLogout from "@/hooks/useLogout";
import { BellDot, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [appointments, setAppointments] = useState();
  const [provider, setProvider] = useState();
  const [apiLoading, setApiLoading] = useState(true);
  const logout = useLogout();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  async function getProvider() {
    setApiLoading(true);
    try {
      const { data } = await axiosPrivate.get("/api/users");
      setProvider(data);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
      setApiLoading(false);
    }
  }

  async function getAppointmentsAsProvider() {
    try {
      const response = await axiosPrivate.get("/api/appointments/provider");
      setAppointments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setApiLoading(false);
    }
  }

  async function acceptAppointment(id) {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "ACCEPTED",
      });
      getAppointmentsAsProvider();
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelAppointment(id) {
    try {
      await axiosPrivate.patch(`/api/appointments/${id}`, {
        status: "CANCELLED",
      });
      getAppointmentsAsProvider();
    } catch (error) {
      console.error(error);
    }
  }

  const filterAndSortAppointments = (appointments, status) => {
    return appointments
      .filter((appointment) => appointment.status === status)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    getProvider();
    getAppointmentsAsProvider();
  }, []);

  const todaysAppointments = appointments?.todaysAppointments || [];
  const futureAppointments = appointments?.futureAppointments || [];

  return (
    <main className="w-full h-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
      <Breadcrumb className="h-0 p-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Tableau de bord</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="today" className="space-y-4">
        <TabsContent value="today">
          <h1 className="text-3xl font-semibold">
            Mes rendez-vous de la journée
          </h1>
        </TabsContent>
        <TabsContent value="incoming">
          <h1 className="text-3xl font-semibold">Mes rendez-vous à venir</h1>
        </TabsContent>
        <div className="flex items-center gap-4">
          <TabsList>
            <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
            <TabsTrigger value="incoming">À venir</TabsTrigger>
          </TabsList>
          <Link to="/salon">
            <Settings size={24} className="text-primary" />
          </Link>
          {!apiLoading && !provider?.email && (
            <div className="ml-auto">
              <ModalAction
                defaultOpen={true}
                title="Nouveauté : connexion par e-mail"
                description={`Chers professionnels,\n\nAprès la prochaine mise à jour, vous devrez vous connecter avec votre adresse e-mail pour accéder à votre espace. Vous pouvez mettre à jour votre adresse e-mail sur la page des informations de votre salon.\n\nMerci de votre compréhension, l'équipe WeConnect 🚀`}
                cancelText="C'est compris !"
                trigger={<BellDot size={24} className="text-primary" />}
                triggerVariant="ghost"
              />
            </div>
          )}
        </div>
        <TabsContent value="today" className="space-y-4">
          {todaysAppointments.length ? (
            <>
              <p className="text-muted">
                Vous avez {todaysAppointments.length} rendez-vous aujourd'hui.
              </p>
              {filterAndSortAppointments(todaysAppointments, "ACCEPTED").map(
                (appointment) => (
                  <ProviderAppointment
                    key={appointment.id}
                    appointment={appointment}
                    cancelAppointment={cancelAppointment}
                    today={true}
                  />
                )
              )}
              <div className="divider divider-start text-muted">
                Mes rendez-vous passés
              </div>
              {filterAndSortAppointments(todaysAppointments, "COMPLETED").map(
                (appointment) => (
                  <ProviderAppointment
                    key={appointment.id}
                    appointment={appointment}
                    past={true}
                    today={true}
                  />
                )
              )}
            </>
          ) : (
            <p className="text-muted">
              {" "}
              Vous n'avez aucun rendez-vous aujourd'hui.
            </p>
          )}
        </TabsContent>
        <TabsContent value="incoming">
          {futureAppointments.length ? (
            <Accordion
              type="single"
              collapsible
              defaultValue={"item-0"}
              className="w-full"
            >
              <AccordionItem value={`item-0`}>
                <AccordionTrigger>
                  <p className="text-muted">
                    Vous avez{" "}
                    {
                      appointments.futureAppointments.filter(
                        (appointment) => appointment.status === "PENDING"
                      ).length
                    }{" "}
                    demande(s) en attente.
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  {filterAndSortAppointments(futureAppointments, "PENDING").map(
                    (appointment) => (
                      <ProviderAppointment
                        key={appointment.id}
                        appointment={appointment}
                        acceptAppointment={acceptAppointment}
                        cancelAppointment={cancelAppointment}
                      />
                    )
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value={`item-1`}>
                <AccordionTrigger>
                  <p className="text-muted">
                    Vous avez{" "}
                    {
                      appointments.futureAppointments.filter(
                        (appointment) => appointment.status === "ACCEPTED"
                      ).length
                    }{" "}
                    rendez-vous à venir.
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  {filterAndSortAppointments(
                    futureAppointments,
                    "ACCEPTED"
                  ).map((appointment) => (
                    <ProviderAppointment
                      key={appointment.id}
                      appointment={appointment}
                      acceptAppointment={acceptAppointment}
                      cancelAppointment={cancelAppointment}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <p className="text-muted">Vous n'avez aucun rendez-vous à venir.</p>
          )}
        </TabsContent>
      </Tabs>
      <Button
        variant="destructive"
        onClick={handleLogout}
        className="w-fit mt-auto"
      >
        Se déconnecter
      </Button>
    </main>
  );
}
