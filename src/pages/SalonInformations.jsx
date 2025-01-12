import EditableInput from "@/components/EditableInput";
import Error from "@/components/Error";
import ProviderHeader from "@/components/ProviderHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;

const EMAIL_REGEX =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const validFileTypes = ["image/jpeg", "image/jpg", "image/png"];

export default function SalonInformations() {
  const [prevInfos, setPrevInfos] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const [providerInfos, setProviderInfos] = useState();
  const [contactMethods, setContactMethods] = useState();
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  async function getProvider() {
    try {
      const { data } = await axiosPrivate.get("/api/pro");
      setPrevInfos(data);
      return data;
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  const rmprofile = async () => {
    try {
      await axiosPrivate.delete("/api/users/profile", {
        profilePicture: null,
      });
      await getProvider();
    } catch (error) {
      console.log(error);
    }
  };

  const rmcover = async () => {
    try {
      await axiosPrivate.delete("/api/users/cover", {
        coverImage: null,
      });
      await getProvider();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function getData() {
      const data = await getProvider();
      setContactMethods(data.contactMethods);
    }
    getData();
  }, []);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (name === "contactMethod") {
      setContactMethods((prev) => ({ ...prev, [id]: value }));
      return;
    }
    setProviderInfos({ ...providerInfos, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    if (!providerInfos && !contactMethods) {
      setEditLoading(false);
      toast("Aucune modification n'a été effectuée");
      return;
    }

    if (providerInfos && !contactMethods) {
      const hasChanges = Object.keys(providerInfos).some(
        (key) => providerInfos[key] !== prevInfos[key]
      );

      if (!hasChanges) {
        setProviderInfos();
        setEditLoading(false);
        toast("Aucune modification n'a été effectuée");
        return;
      }
    }
    if (contactMethods && !providerInfos) {
      const hasChanges = Object.keys(contactMethods).some(
        (key) => contactMethods[key] !== prevInfos.contactMethods[key]
      );

      if (!hasChanges) {
        setContactMethods(prevInfos.contactMethods);
        setEditLoading(false);
        toast("Aucune modification n'a été effectuée");
        return;
      }
    }

    if (
      contactMethods.phoneNumber &&
      !PHONE_NUMBER_REGEX.test(contactMethods.phoneNumber)
    ) {
      toast.error("Le numéro de téléphone n'est pas valide");
      setEditLoading(false);
      return;
    }

    if (providerInfos.email && !EMAIL_REGEX.test(providerInfos.email)) {
      toast.error("L'adresse email n'est pas valide");
      setEditLoading(false);
      return;
    }
    try {
      await axiosPrivate.patch("/api/users", {
        ...providerInfos,
        contactMethods,
      });
      await getProvider();
      toast("Modifications enregistrées");
    } catch (error) {
      if (!error.response) {
        toast.error("Une erreur est survenue, veuillez contacter le support");
      } else {
        toast.error(error.response.data.message);
      }
    }
    setProviderInfos();
    setEditLoading(false);
  };

  const handleUpload = async (e) => {
    const { id, files } = e.target;

    if (!validFileTypes.includes(files[0].type)) {
      toast.error("Le format du fichier n'est pas valide");
    }

    const formData = new FormData();
    formData.append(id, files[0]);

    try {
      await axiosPrivate.post(`/api/s3/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      getProvider();
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error) {
      if (error.response.status === 413) {
        toast.error("Le fichier est trop volumineux");
      } else {
        console.error(error.response.data.message);
        toast.error("Une erreur est survenue, veuillez contacter le support");
      }
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
      <ProviderHeader
        name={prevInfos.name}
        address={prevInfos.address}
        profilePicture={prevInfos.profilePicture}
        coverImage={prevInfos.coverImage}
        rmprofile={rmprofile}
        rmcover={rmcover}
      />
      <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
        <Button asChild>
          <Label htmlFor="profile" className=" w-full">
            Changer ma photo de profil
          </Label>
        </Button>
        <Input
          className="hidden"
          type="file"
          id="profile"
          onChange={handleUpload}
        />
        <Button asChild>
          <Label htmlFor="cover" className=" w-full">
            Changer ma photo de couverture
          </Label>
        </Button>
        <Input
          className="hidden"
          type="file"
          id="cover"
          onChange={handleUpload}
        />
      </div>
      <form className="space-y-2">
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4 mb-8">
          <EditableInput
            id="name"
            label="Nom du salon"
            type="text"
            defaultValue={prevInfos.name}
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
          <EditableInput
            id="phoneNumber"
            label="Numéro de téléphone"
            type="tel"
            defaultValue={prevInfos.phoneNumber}
            handleChange={handleChange}
          />
        </div>
        <div className="divider divider-start">
          <p className="text-muted">Moyens de contact</p>
        </div>
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
          <EditableInput
            id="instagram"
            name="contactMethod"
            label="Instagram"
            type="text"
            defaultValue={prevInfos.contactMethods?.instagram}
            placeholder={"@weconnect_off"}
            handleChange={handleChange}
          />
          <EditableInput
            id="snapchat"
            name="contactMethod"
            label="Snapchat"
            type="text"
            defaultValue={prevInfos.contactMethods?.snapchat}
            handleChange={handleChange}
          />
        </div>
        <div className="divider" />
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
        {editError && setTimeout(() => setEditError(null), 10000) && (
          <p className="text-destructive text-sm">{editError}</p>
        )}
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={editLoading && true}>
            {editLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
          <Button
            variant="outline"
            type="reset"
            onClick={() => {
              setProviderInfos();
              setContactMethods(prevInfos.contactMethods);
            }}
          >
            Annuler
          </Button>
        </div>
      </form>
    </main>
  );
}
