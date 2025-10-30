import axios from "axios";
import { toast } from "react-toastify";
import { communityEndpoints } from "../apis";

export const joinCommunity = async ({ token, setLoading }) => {
  try {
    setLoading(true);
    await axios.post(
      communityEndpoints.JOIN,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Community joined successfully, Check your mail!");
  } catch (error) {
    toast.error(
      `${
        error.response ? `${error.response.data.message}` : `${error.message}`
      }`
    );
  } finally {
    setLoading(false);
  }
};
