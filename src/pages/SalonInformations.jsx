import EditableInput from "@/components/EditableInput";
import Error from "@/components/Error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;

const EMAIL_REGEX =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export default function SalonInformations() {
  const [prevInfos, setPrevInfos] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const [providerInfos, setProviderInfos] = useState();
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  async function getProvider() {
    try {
      const response = await axiosPrivate.get("/api/users");
      setPrevInfos(response.data);
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getProvider();
  }, []);

  const handleChange = (e) => {
    setProviderInfos({ ...providerInfos, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const hasChanges = Object.keys(providerInfos).some(
      (key) => providerInfos[key] !== prevInfos[key]
    );

    if (!hasChanges) {
      setProviderInfos();
      setEditLoading(false);
      return;
    }
    if (
      providerInfos.phoneNumber &&
      !PHONE_NUMBER_REGEX.test(providerInfos.phoneNumber)
    ) {
      setEditError("Le numéro de téléphone n'est pas valide");
      setEditLoading(false);
      return;
    }
    if (providerInfos.email && !EMAIL_REGEX.test(providerInfos.email)) {
      setEditError("L'adresse email n'est pas valide");
      setEditLoading(false);
      return;
    }

    try {
      await axiosPrivate.patch("/api/users", providerInfos);
      await getProvider();
    } catch (error) {
      if (!error.response) {
        setEditError("Une erreur est survenue, veuillez réessayer plus tard");
      } else {
        setEditError(error.response.data.message);
      }
    }
    setProviderInfos();
    setEditLoading(false);
  };

  const formRef = useRef(null);

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
      setProviderInfos();
    }
  };

  if (loading) {
    return <Loader2 className="w-8 h-8 animate-spin flex-1" />;
  }

  if (error) {
    return <Error errMsg={error} />;
  }

  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col gap-4">
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
              <Link to="/salon/informations">Informations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-semibold">Mes informations</h1>
      <form className="space-y-2" ref={formRef}>
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
          <EditableInput
            id="providerName"
            label="Nom du salon"
            type="text"
            defaultValue={prevInfos.providerName}
            handleChange={handleChange}
          />
          <EditableInput
            id="phoneNumber"
            label="Téléphone"
            type="tel"
            defaultValue={prevInfos.phoneNumber}
            handleChange={handleChange}
          />
          <EditableInput
            id="address"
            label="Adresse"
            type="text"
            defaultValue={prevInfos.address}
            handleChange={handleChange}
          />
          <EditableInput
            id="email"
            label="Email"
            type="email"
            defaultValue={prevInfos.email}
            handleChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="autoAccept">Confirmation automatique</Label>
          <div className="bg-white rounded-md px-3 py-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p>
                Choisissez ou non d'accepter automatiquement les demandes de
                rendez-vous.
              </p>
              <Switch
                id="autoAccept"
                checked={
                  providerInfos?.autoAcceptAppointments ??
                  prevInfos.autoAcceptAppointments
                }
                onCheckedChange={(checked) => {
                  setProviderInfos({
                    ...providerInfos,
                    autoAcceptAppointments: checked,
                  });
                }}
              />
            </div>
            <p className={"text-muted"}>
              Si vous choisissez de ne pas accepter automatiquement les demandes
              de rendez-vous, elles auront le status <b>En attente</b> tant que
              vous ne les aurez pas confirmées ou refusées.
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="vacancyMode" className="text-destructive">
            Mode vacances
          </Label>
          <div className="bg-white rounded-md px-3 py-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p>
                Passez en mode vacances pour ne plus recevoir de demandes de
                rendez-vous.
              </p>
              <Switch
                id="vacancyMode"
                checked={
                  providerInfos?.isInVacancyMode ?? prevInfos.isInVacancyMode
                }
                onCheckedChange={(checked) => {
                  setProviderInfos({
                    ...providerInfos,
                    isInVacancyMode: checked,
                  });
                }}
                className="data-[state=checked]:bg-destructive"
              />
            </div>
            <p className="text-muted">
              En cas de fermerture temporaire de votre salon, vous pouvez
              activer le mode vacances pour ne plus recevoir de demandes de
              rendez-vous pendant un certain temps.
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <Label htmlFor="terms">Conditions de réservation</Label>
          <Textarea
            id="bookingTerms"
            type="text"
            defaultValue={prevInfos.bookingTerms}
            onChange={handleChange}
            className="text-lg whitespace-pre-line"
          />
        </div>
        {editError && setTimeout(() => setEditError(null), 3000) && (
          <p className="text-destructive text-sm">{editError}</p>
        )}
        {providerInfos && (
          <>
            <Button onClick={handleSubmit} disabled={editLoading && true}>
              {editLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
            <Button variant="outline" className="block" onClick={handleReset}>
              Annuler les modifications
            </Button>
          </>
        )}
      </form>
    </main>
  );
}
