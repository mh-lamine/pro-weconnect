import axios from "axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const { data } = await axios.get("/api/auth/refresh", {
        withCredentials: true,
      });

      setAuth(data);
    } catch (error) {
      console.error("error", error);
    }
  };

  return refresh;
};

export default useRefreshToken;
