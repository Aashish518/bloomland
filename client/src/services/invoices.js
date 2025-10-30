import axios from "axios";
import { invoiceEndpoints } from "./apis";
import { toast } from "react-toastify";
export const getAllInvoices = async ({ token }) => {
  try {
    const response = await axios.get(invoiceEndpoints.ALL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.invoices;
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};
