import axios from "axios";
import { newsletterEndpoints, ticketEndpoints } from "../apis";
import { toast } from "react-toastify";

export const createTicket = async ({ data }, navigate) => {
  try {
    await axios.post(ticketEndpoints.create, data);
    toast.success("Ticket Submitted !");
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const newslettter = async (email) => {
  try {
    await axios.post(newsletterEndpoints.ADD, { email });
    toast.success("subscribed successfully");
  } catch (error) {
    console.log(error);
    toast.error(error.response ? error.response.data.message : error.message);
  }
};
