import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogEndpoints, eventEndpoints } from "../../services/apis";
import axios from "axios";

export const fetchEvents = createAsyncThunk(
	"event/fetcHEvents",
	async (_, rejectWithValue) => {
		try {
			const response = await axios.get(`${eventEndpoints.FETCH_EVENTS}`);
			return response.data.events;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const fetchBlogs = createAsyncThunk(
	"event/fetchBlogs",
	async (_, rejectWithValue) => {
		try {
			const response = await axios.get(`${blogEndpoints.FETCH_ALL}`);
			console.log(response.data);
			return response.data.blogs;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

const initialState = {
	events: [],
	blogs: [],
	loading: false,
	error: null,
};

const eventSlice = createSlice({
	name: "event",
	initialState,
	reducers: {
		setEvents(state, action) {
			state.events = action.payload;
		},
		setLoading(state, action) {
			state.loading = action.payload;
		},
		setError(state, action) {
			state.error = action.payload;
		},
		setBlogs(state, action) {
			state.blogs = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchEvents.fulfilled, (state, action) => {
			state.events = action.payload;
			state.loading = false;
		}),
			builder.addCase(fetchEvents.pending, (state) => {
				state.loading = true;
			}),
			builder.addCase(fetchEvents.rejected, (state, action) => {
				state.error = action.payload;
				state.loading = false;
			});

		builder.addCase(fetchBlogs.fulfilled, (state, action) => {
			state.blogs = action.payload;
			state.loading = false;
		}),
			builder.addCase(fetchBlogs.pending, (state) => {
				state.loading = true;
			}),
			builder.addCase(fetchBlogs.rejected, (state, action) => {
				state.error = action.payload;
				state.loading = false;
			});
	},
});

export const { setEvents, setLoading, setError } = eventSlice.actions;
export default eventSlice.reducer;
