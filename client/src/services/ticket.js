import axios from "axios";
import { ticketEndpoints } from "./apis";
import { toast } from "react-toastify";

export const fetchTicketByID = async ({ token, ticketId }) => {
  try {
    const response = await axios.get(
      `${ticketEndpoints.fetchOne}/${ticketId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.ticket;
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};

export const reply = async ({ token, ticketId, reply }) => {
  try {
    const response = await axios.post(
      `${ticketEndpoints.reply}/${ticketId}`,
      { reply },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};

export const close = async ({ token, ticketId }, navigate) => {
  try {
    const response = await axios.put(
      `${ticketEndpoints.close}/${ticketId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success(response.data.message);
    navigate("/admin/tickets");
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};
