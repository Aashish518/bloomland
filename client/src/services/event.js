import axios from "axios";
import { eventEndpoints } from "./apis";
import { getEvents } from "@/store/slices/adminSlice";
import { toast } from "react-toastify";

export const addEvent = ({ event, token }) => {
	console.log("event -->> ",event)
	return async (dispatch) => {
		try {
			const response = await axios.post(eventEndpoints.addEvent, event, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});
			dispatch(getEvents());
			toast.success(response.data.message);
		} catch (error) {
			toast.error(error.response ? error.response.data.message : error.message);

			console.log(error);
		}
	};
};

export const getEventById = async (id) => {
	try {
		const response = await axios.get(eventEndpoints.getEventById + id);
		return response.data.event;
	} catch (error) {
		toast.error(error.response ? error.response.data.message : error.message);

		console.log(error);
	}
};

export const updateEvent = async ({ event, token, setEvent, eventId }) => {
	try {
		const response = await axios.put(
			eventEndpoints.updateEvent + eventId,
			event,
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

		console.log(error);
	}
};

export const deleteEvent = async ({ eventId, token, navigate }) => {
	try {
		const response = await axios.delete(
			`${eventEndpoints.deleteEvent}/${eventId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		toast.success(response.data.message);

		navigate("/admin/events");
	} catch (error) {
		toast.error(error.response ? error.response.data.message : error.message);

		console.log(error);
	}
};
