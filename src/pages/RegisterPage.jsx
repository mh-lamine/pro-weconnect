import { handleRegister } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export default function RegisterPage() {
  const { setAuth } = useAuth();
  const [userInfos, setUserInfos] = useState({
    lastName: "",
    firstName: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || { pathname: "/" };

  const handleChange = (e) => {
    setUserInfos({ ...userInfos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!userInfos.lastName || !userInfos.firstName) {
      setError("Veuillez renseigner votre nom et prénom");
      setLoading(false);
      return;
    }
    if (!PHONE_NUMBER_REGEX.test(userInfos.phoneNumber)) {
      setError("Le numéro de téléphone n'est pas valide");
      setLoading(false);
      return;
    }
    if (!PASSWORD_REGEX.test(userInfos.password)) {
      setError(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      );
      setLoading(false);
      return;
    }
    try {
      const response = await handleRegister(userInfos);
      setAuth(response.data);
      navigate(from, { replace: true });
    } catch (error) {
      if (error.response.status === 409) {
        setError("Ce numéro de téléphone est déjà utilisé");
      } else {
        setError("Une erreur est survenue, veuillez réessayer plus tard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="text-center flex flex-col gap-4 w-4/5 max-w-[500px]">
      <h1 className="text-3xl font-semibold">Créer un compte</h1>
      <form className="space-y-2 py-2">
        <Input
          name="firstName"
          type="text"
          placeholder="Prénom"
          onChange={handleChange}
          onClick={() => setError("")}
        />
        <Input
          name="lastName"
          type="text"
          placeholder="Nom"
          onChange={handleChange}
          onClick={() => setError("")}
        />
        <Input
          name="phoneNumber"
          type="tel"
          placeholder="Numéro de téléphone"
          onChange={handleChange}
          onClick={() => setError("")}
        />
        <Input
          name="password"
          type="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          onClick={() => setError("")}
        />
      </form>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button onClick={handleSubmit} disabled={loading && true}>
        {loading ? <Loader2 className="animate-spin" /> : "Créer un compte"}
      </Button>
      <p className="text-muted text-xs font-light ">
        En créant un compte, vous acceptez les{" "}
        <Button asChild variant="link" className="py-0 text-xs">
          <Link>termes et conditions d'utilisation</Link>
        </Button>{" "}
        et la{" "}
        <Button asChild variant="link" className="py-0 text-xs">
          <Link>politique de confidentialité</Link>
        </Button>
        .
      </p>
      <div className="divider mb-0">Déjà inscrit ?</div>
      <Button asChild variant="outline">
        <Link to={"/login"}>Se connecter</Link>
      </Button>
    </div>
  );
}
