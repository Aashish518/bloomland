import axios from "axios";
import { analysisEndpoints } from "./apis";
import { toast } from "react-toastify";

export const getRequestData = async ({
  token,
  setRequestDataDay,
  setRequestDataMonth,
  setRequestDataYear,
}) => {
  try {
    const response = await axios.get(analysisEndpoints.getRequestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRequestDataDay(response.data.requestDataDay);
    setRequestDataMonth(response.data.requestDataMonth);
    setRequestDataYear(response.data.requestDataYear);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  }
};

export const getUserDistribution = async ({ token, setPieData }) => {
  try {
    const response = await axios.get(analysisEndpoints.getUserDistribution, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPieData(response.data.pieData);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  }
};

export const getMoneyData = async ({ token, setMoneyData }) => {
  try {
    const response = await axios.get(analysisEndpoints.getMoneyData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMoneyData(response.data);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  }
};
