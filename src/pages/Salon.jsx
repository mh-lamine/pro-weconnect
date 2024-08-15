import LeftArrow from "@/components/svg/LeftArrow";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const Salon = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full max-w-screen-md mx-auto p-6 flex flex-1 flex-col space-y-4">
      <Button
        variant="link"
        className="justify-start h-0 p-0"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
      <h1 className="text-3xl font-semibold">Mon salon</h1>
      <Link to="informations" className="flex items-center justify-between ">
        <h2 className="text-xl font-medium">Informations du salon</h2>
        <LeftArrow size={36} />
      </Link>
      <div className="divider"></div>
      <Link to="availabilities" className="flex items-center justify-between ">
        <h2 className="text-xl font-medium">Disponibilités</h2>
        <LeftArrow size={36} />
      </Link>
      <div className="divider"></div>
      <Link to="services" className="flex items-center justify-between ">
        <h2 className="text-xl font-medium">Prestations</h2>
        <LeftArrow size={36} />
      </Link>
    </main>
  );
};

export default Salon;
