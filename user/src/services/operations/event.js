import axios from "axios";
import { blogEndpoints, eventEndpoints } from "../apis";
import { fetchUser } from "../../store/slices/userSlice";
import { toast } from "react-toastify";

const token = localStorage.getItem("token");

export const sendRequest = ({ token, eventId }) => {
	return async (dispatch) => {
		try {
			const response = await axios.post(
				`${eventEndpoints.SEND_REQUEST}`,
				{ eventId: eventId },
				{
					"Content-Type": "application/json",
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Request Sent!");
			dispatch(fetchUser({ token }));
			// Return the response data (including status)
			return response.data;
		} catch (error) {
			// If error response has data, return it for status handling
			if (error.response && error.response.data) {
				toast.error(error.response.data.message || error.message);
				return error.response.data;
			}
			toast.error(error.message);
			return { message: error.message };
		}
	};
};

export const joinEvent = ({ token, eventId, navigate }) => {
	return async (dispatch) => {
		try {
			await axios.post(
				`${eventEndpoints.JOIN_EVENT}`,
				{ eventId },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Event Joined! Check Dashboard for Payment");
			navigate("/dashboard");
			dispatch(fetchUser({ token }));
		} catch (error) {
			toast.error(error.response ? error.response.message : error.message);
		}
	};
};

export const withdrawRequest = ({ token, req, setLoading }) => {
	return async (dispatch) => {
		try {
			setLoading({
				element: "withdraw",
				value: true,
			});
			await axios.post(
				eventEndpoints.WITHDRAW,
				{ reqId: req },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success("Withdrew successfully");
			dispatch(fetchUser({ token }));
		} catch (error) {
			console.log(error);
			toast.error("Error while withdrawing");
		} finally {
			setLoading({
				element: null,
				value: false,
			});
		}
	};
};

export const fetchBlogById = async ({ blogId }) => {
	try {
		const response = await axios.get(blogEndpoints.FETCH_ONE + "/" + blogId);

		return response.data.blog;
	} catch (error) {
		toast.error(error.response ? error.response.message : error.message);
	}
};

export const fetchEventById = ({ eventId, token }) => {
	return async (dispatch) => {
		try {
			const response = await axios.get(
				eventEndpoints.GET_SINGLE_EVENT + eventId,
				{
					headers: token ? { Authorization: `Bearer ${token}` } : {},
				}
			);
			// toast.success("Event fetched successfully!");
			// You can dispatch an action here if needed, e.g.:
			// dispatch({ type: "event/setEvent", payload: response.data.event });
			return response.data.event;
		} catch (error) {
			toast.error(error.response?.data?.message || error.message);
			return null;
		}
	};
};


export const findUserJoinOrNot = async ({ userId, eventId, token }) => {
	try {
		const response = await axios.post(
			eventEndpoints.CHECK_USER_JOIN_STATUS,
			{ 
				userId: userId,
				eventId: eventId 
			},
			{
				headers: token ? { Authorization: `Bearer ${token}` } : {},
			}
		);
		
		// Return the join status data
		return {
			success: true,
			isJoined: response.data.isJoined,
			status: response.data.status, // Could be 'joined', 'pending', 'not_joined', etc.
			data: response.data
		};
	} catch (error) {
		console.error("Error checking user join status:", error);
		toast.error(error.response?.data?.message || "Error checking join status");
		return {
			success: false,
			isJoined: false,
			status: 'error',
			message: error.response?.data?.message || error.message
		};
	}
};