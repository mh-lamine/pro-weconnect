import axiosPrivate from "@/api/axiosPrivate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";



const SalonPhotos = () => {
  const { auth } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);

  const fetchProfilePicture = async () => {
    try {
      const { data } = await axios.get(`/api/users/images/${auth.id}`);
      setProfilePicture(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!validFileTypes.includes(file.type)) {
      return alert("Invalid file type");
    }

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const response = await axiosPrivate.post("/api/users/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button asChild>
        <Label htmlFor="profile">Upload</Label>
      </Button>
      <Input
        className="hidden"
        type="file"
        id="profile"
        onChange={handleUpload}
      />
      <div>
        {profilePicture?.map((url) => (
          <img
            key={url}
            src={url}
            className="w-10 aspect-square rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

export default SalonPhotos;
