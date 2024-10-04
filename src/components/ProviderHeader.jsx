import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function ProviderHeader({
  name,
  address,
  profilePicture,
  coverImage,
  rmprofile,
  rmcover,
}) {
  const handleRemove = async (type) => {
    try {
      if (type === "profile") {
        await rmprofile();
      }
      if (type === "cover") {
        await rmcover();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className="hero w-full aspect-video relative max-h-[40vh] sm:max-h-[20vh] rounded-md overflow-hidden"
      style={{
        backgroundImage: `url(${coverImage && coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay bg-opacity-40"></div>
      <div className="hero-content text-neutral-content mt-auto mr-auto">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profilePicture} />
            <AvatarFallback className="text-2xl">
              {name && getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <h1 className="text-2xl font-semibold bg-muted px-2 py-1 rounded-sm w-fit">
              {name}
            </h1>
            <p className="bg-muted px-2 py-1 rounded-sm w-fit">{address}</p>
          </div>
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive">
              <Trash2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-fit flex flex-col gap-2">
            <Button variant="outline" onClick={() => handleRemove("profile")}>
              Supprimer la photo de profil
            </Button>
            <Button variant="outline" onClick={() => handleRemove("cover")}>
              Supprimer la photo de couverture
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
