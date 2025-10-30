import axios from "axios";
import { adminEndpoints, eventEndpoints } from "./apis";
import {
  setApproved,
  setAttendees,
  setRequests,
} from "@/store/slices/adminSlice";
import { toast } from "react-toastify";

export const getRequests = ({ token }) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(eventEndpoints.getEventRequests, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setRequests(response.data.requests));
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      console.log(error);
    }
  };
};

export const getApproved = ({ token }) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(eventEndpoints.getEventApproved, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setApproved(response.data.approved));
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);

      console.log(error);
    }
  };
};

export const getAttendees = ({ token }) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(eventEndpoints.getEventAttendees, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setAttendees(response.data.attendees));
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);

      console.log(error);
    }
  };
};

export const fetchUserById = async ({ userId, token }) => {
  console.log({ userId, token });
  try {
    const response = await axios.get(`${eventEndpoints.fetchUser}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};

export const approveRequest = async ({ userId, eventId, token }) => {
  try {
    const response = await axios.post(
      `${adminEndpoints.approve}/${eventId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};

export const rejectRequest = async ({ userId, eventId, token }) => {
  try {
    const response = await axios.post(
      `${adminEndpoints.reject}/${eventId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  }
};

export const approveAllReq = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.approveAll,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const deleteApproval = async ({
  approvalId,
  token,
  setEvent,
  setLoading,
}) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${adminEndpoints.deleteApproval}/${approvalId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEvent(response.data.event);
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setLoading(false);
  }
};

export const rejectAllReq = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.rejectAll,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setLoading(false);
  }
};

export const approveAllDay0 = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.approveDay0,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const approveAll10x = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.approve10x,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const approveAll100x = async ({ userId, token, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.approve100x,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.location.reload();
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    console.log(error);
  } finally {
    setLoading(false);
  }
};

export const approveAll = async ({ token, requests, setEvent, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.approveEventAll,
      { requests },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEvent(response.data.event);
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    throw new Error("Error approving all requests", error);
  } finally {
    setLoading(false);
  }
};

export const rejectAll = async ({ token, requests, setEvent, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      adminEndpoints.rejectEventAll,
      { requests },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEvent(response.data.event);
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);

    throw new Error("Error rejecting all requests", error);
  } finally {
    setLoading(false);
  }
};

export const approveOne = async ({ token, request }) => {
  try {
    const response = await axios.post(
      `${adminEndpoints.approveOne}/${request._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response.data.event --> ", response.data);

    // dispatch(getRequests({ token }));

    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    throw new Error("Error approving one request", error);
  }
};

// export const approveOne = ({ token, request }) => {
//   console.log("request -->", request);
//   console.log("token -->", token);
//   return async (dispatch) => {
//     try {
//       const response = await axios.post(
//         `${adminEndpoints.approveOne}/${request._id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("response.data -->", response.data);

//       // ✅ Option 1: Refresh request list after approval
//       dispatch(getRequests({ token }));

//       toast.success(response.data.message);
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       console.error("Error approving one request", error);
//     }
//   };
// };

export const rejectOne = async ({ token, request, setEvent }) => {
  try {
    const response = await axios.post(
      `${adminEndpoints.rejectOne}/${request._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (typeof setEvent === "function") {
      setEvent(response.data.event);
    }

    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
    throw new Error("Error rejecting one request", error);
  }
};

// export const rejectOne = ({ token, request }) => {
//   return async (dispatch) => {
//     try {
//       const response = await axios.post(
//         `${adminEndpoints.rejectOne}/${request._id}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // ✅ Optionally update local event state
//       // if (typeof setEvent === "function") {
//       //   setEvent(response.data.event);
//       // }

//       // ✅ Optionally re-fetch updated requests from server
//       dispatch(getRequests({ token }));

//       toast.success(response.data.message);
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//       console.error("Error rejecting one request:", error);
//     }
//   };
// };

export const enterOne = async ({ token, request, setEvent, setLoading }) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${adminEndpoints.enterOne}/${request._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setEvent(response.data.event);
    toast.success(response.data.message);
  } catch (error) {
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setLoading(false);
  }
};

export const addAttendee = async ({ token, data, setLoading, setEvent }) => {
  try {
    setLoading(true);
    const response = await axios.post(adminEndpoints.addAttendee, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setEvent(response.data.event);
    toast.success("attendee added successfully");
  } catch (error) {
    console.log(error);
    toast.error(error.response ? error.response.data.message : error.message);
  } finally {
    setLoading(false);
  }
};
