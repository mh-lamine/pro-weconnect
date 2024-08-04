import { handleRegister } from "@/actions/authActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const PHONE_NUMBER_REGEX =
  /^(?:(?:\+|00)33\s?[1-9](?:[\s.-]?\d{2}){4}|0[1-9](?:[\s.-]?\d{2}){4})$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export default function RegisterPage() {
  const [credentials, setCredentials] = useState({
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!PHONE_NUMBER_REGEX.test(credentials.phoneNumber)) {
      setError("Le numéro de téléphone n'est pas valide");
    }
    if (!PASSWORD_REGEX.test(credentials.password)) {
      setError(
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      );
    }
    try {
      await handleRegister(credentials, "register");
    } catch (error) {
      if (!error.response) {
        setError("Une erreur est survenue, veuillez réessayer plus tard");
      } else if (error.response.status === 409) {
        setError("Ce numéro de téléphone est déjà utilisé");
      }
    }
    setLoading(false);
  };

  return (
    <div className="text-center space-y-2 w-4/5 max-w-[500px]">
      <h1 className="text-3xl font-semibold">Créer un compte</h1>
      <p>
        Entrez votre numéro de téléphone et créez un mot de passe pour démarrer
      </p>
      <form className="space-y-2 py-2">
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
      <Button onClick={handleSubmit} disabled={loading && "true"}>
        {loading ? <Loader2 className="animate-spin" /> : "Créer un compte"}
      </Button>
      <p className="text-muted text-xs font-light ">
        En créant un compte, vous acceptez les{" "}
        <Button asChild variant="link" className="p-0 text-xs h-min">
          <Link>termes et conditions d'utilisation</Link>
        </Button>{" "}
        et la{" "}
        <Button asChild variant="link" className="p-0 text-xs h-min">
          <Link>politique de confidentialité</Link>
        </Button>
        .
      </p>
      <Button asChild variant="link">
        <Link to={"/login"}>Se connecter</Link>
      </Button>
    </div>
  );
}
