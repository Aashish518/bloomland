import axios from "axios";
import { newsletterEndpoints } from "./apis";
import { toast } from "react-toastify";

export const newsletter = async ({ token }) => {
  try {
    const response = await axios.get(newsletterEndpoints.ALL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data.newsletterUsers;
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};
