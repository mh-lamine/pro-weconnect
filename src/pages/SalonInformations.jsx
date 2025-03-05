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
import useAuth from "@/hooks/useAuth";
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
  const { auth } = useAuth();

  const [proInfos, setProInfos] = useState();
  const [formData, setFormData] = useState();
  const [images, setImages] = useState();

  const [error, setError] = useState();

  const [loading, setLoading] = useState({
    SPLASH_SCREEN: true,
    SUBMIT_BUTTON: false,
  });

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  async function getPro() {
    try {
      const { data } = await axiosPrivate.get("/api/pro");
      const { availabilities, providerCategories, ...formattedData } = data; // Exclude these fields
      setProInfos(formattedData);
      setFormData(formattedData);
      setImages({
        profilePicture: data.profilePicture,
        coverImage: data.coverImage,
      });
    } catch (error) {
      setError(error);
      if (error.response?.status === 401) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    } finally {
      setLoading({
        ...loading,
        SPLASH_SCREEN: false,
      });
    }
  }

  const rmprofile = async () => {
    try {
      await axiosPrivate.delete("/api/s3/profile", {
        profilePicture: null,
      });
      setImages({ ...images, profilePicture: null });
    } catch (error) {
      console.log(error);
    }
  };

  const rmcover = async () => {
    try {
      await axiosPrivate.delete("/api/s3/cover", {
        coverImage: null,
      });
      setImages({ ...images, coverImage: null });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    if (name === "contactMethod") {
      const newContactMethods = { ...formData.contactMethods, [id]: value };
      setFormData({ ...formData, contactMethods: newContactMethods });
      return;
    }
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phoneNumber, contactMethods } = proInfos;
    if (!name || !email || !phoneNumber) {
      toast.error("Veuillez renseigner tous les champs obligatoires");
      return;
    }

    const { contactMethods: _, ...formDataWithoutContactMethods } = formData;
    const { contactMethods: __, ...proInfosWithoutContactMethods } = proInfos;

    const hasInfosChanges = Object.keys(formDataWithoutContactMethods).some(
      (key) =>
        formDataWithoutContactMethods[key] !==
        proInfosWithoutContactMethods[key]
    );

    const hasContactMethodsChanges = Object.keys(contactMethods).some(
      (key) => contactMethods[key] !== proInfos.contactMethods[key]
    );

    if (!hasInfosChanges && !hasContactMethodsChanges) {
      toast("Aucune modification effectuée");
      return;
    }

    if (email && !EMAIL_REGEX.test(email)) {
      toast.error("L'adresse email n'est pas valide");
      return;
    }

    if (phoneNumber && !PHONE_NUMBER_REGEX.test(phoneNumber)) {
      toast.error("Le numéro de téléphone n'est pas valide");
      return;
    }

    try {
      setLoading({
        ...loading,
        SUBMIT_BUTTON: true,
      });
      await axiosPrivate.patch("/api/pro", { ...formData });
      toast.success("Modifications enregistrées");
      setProInfos(formData);
    } catch (error) {
      setFormData(proInfos);
      toast.error("Une erreur est survenue, veuillez contacter le support");
    } finally {
      setLoading({
        ...loading,
        SUBMIT_BUTTON: false,
      });
    }
  };

  const handleUpload = async (e) => {
    const { id, files } = e.target;

    if (!validFileTypes.includes(files[0].type)) {
      toast.error("Le format du fichier n'est pas valide");
      return;
    }

    const formData = new FormData();
    formData.append(id, files[0]);

    const imgType = id === "profile" ? "profilePicture" : "coverImage";
    const imgPath = id === "profile" ? "profile-picture" : "cover/cover-image";
    const imgUrl = `https://wcntbucket.s3.eu-west-3.amazonaws.com/user-${auth.id}/${imgPath}`;

    try {
      await axiosPrivate.post(`/api/s3/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImages({
        ...images,
        [imgType]: `${imgUrl}?t=${new Date().getTime()}`,
      });
      toast.success("Photo mise à jour avec succès");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error("Une erreur est survenue, veuillez contacter le support");
    }
  };

  useEffect(() => {
    getPro();
  }, []);

  if (error) {
    console.log(error);
    return <Error errMsg={error} />;
  }

  if (loading.SPLASH_SCREEN) {
    return <div>Loading...</div>;
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
        name={proInfos.name}
        address={proInfos.address}
        profilePicture={images.profilePicture}
        coverImage={images.coverImage}
        rmprofile={rmprofile}
        rmcover={rmcover}
      />
      <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
        <Button asChild>
          <Label htmlFor="profile" className="w-full">
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
          <Label htmlFor="cover" className="w-full">
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
          <div>
            <Label htmlFor={"name"}>Nom du salon</Label>
            <Input
              id="name"
              type="text"
              value={formData?.name}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor={"address"}>Adresse</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor={"phoneNumber"}>Téléphone du salon</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor={"email"}>Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
        </div>
        <div className="divider divider-start">
          <p className="text-muted">Moyens de contact</p>
        </div>
        <div className="space-y-2 md:space-y-0 md:grid grid-cols-2 md:gap-4">
          <div>
            <Label htmlFor={"instagram"}>Instagram</Label>
            <Input
              id="instagram"
              name="contactMethod"
              type="text"
              value={formData.contactMethods?.instagram}
              placeholder={"@weconnect_off"}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
          <div>
            <Label htmlFor={"snapchat"}>Snapchat</Label>
            <Input
              id="snapchat"
              name="contactMethod"
              type="text"
              value={formData.contactMethods?.snapchat}
              onChange={handleChange}
              className="text-lg"
            />
          </div>
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
                checked={formData.autoAcceptAppointments}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
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
                checked={formData?.isInVacancyMode}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
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
            defaultValue={formData.bookingTerms}
            onChange={handleChange}
            className="text-lg whitespace-pre-line"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={loading.SUBMIT_BUTTON}>
            {loading.SUBMIT_BUTTON ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => setFormData(proInfos)}
          >
            Annuler
          </Button>
        </div>
      </form>
    </main>
  );
}
