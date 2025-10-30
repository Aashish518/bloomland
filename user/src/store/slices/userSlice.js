import {
	createSlice,
	createAsyncThunk,
	//   isRejectedWithValue,
} from "@reduxjs/toolkit";
import axios from "axios";
import { authEndpoints } from "../../services/apis";

export const fetchUser = createAsyncThunk(
	"user/fetchUser",
	async ({ token, rejectWithValue }) => {
		if (!token) return;
		try {
			const response = await axios.get(authEndpoints.FETCH_USER, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data.user;
		} catch (error) {
			return rejectWithValue(
				error.response ? error.response.data.message : error.message
			);
		}
	}
);

const initialState = {
	level: 0,
	requests: [],
	approved: [],
	events: [],
	// eventStatus: [], // array to track event statuses
	name: "",
	email: "",
	phone: "",
	dob: "",
	experience: "",
	journey: "",
	reason: "",
	area: "",
	bloom: "",
	ready: "",
	state: "",
	notes: "",
	insta: "",
	linkedin: "",
	isCommunity: false,
	loading: false,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser(state, action) {
			state.level = action.payload.allowed;
			state.requests = action.payload.requests;
			state.events = action.payload.joined;
		},
		setLoading(state, action) {
			state.loading = action.payload;
		},
		setError(state, action) {
			state.error = action.payload;
		},
		// setEventStatus(state, action) {
		//   // action.payload: { eventId, status }
		//   const { eventId, status } = action.payload;
		//   const existing = state.eventStatus?.find(e => e.eventId === eventId);
		//   if (existing) {
		//     existing.status = status;
		//   } else {
		//     state.eventStatus.push({ eventId, status });
		//   }
		// },
	},
	extraReducers: (builder) => {
		builder.addCase(fetchUser.fulfilled, (state, action) => {
			state.level = action.payload.allowed;
			state.requests = action.payload.requests;
			state.events = action.payload.joined;
			state.email = action.payload.email;
			state.name = action.payload.name;
			state.phone = action.payload.phone;
			state.approved = action.payload.approved;
			state.dob = action.payload.dob;
			state.experience = action.payload.experience;
			state.journey = action.payload.journey;
			state.reason = action.payload.reason;
			state.area = action.payload.area;
			state.bloom = action.payload.bloom;
			state.ready = action.payload.ready;
			state.state = action.payload.state;
			state.insta = action.payload.insta;
			state.linkedin = action.payload.linkedin;
			state.notes = action.payload.notes;
			state.isCommunity = action.payload.isCommunity;
			state.loading = false;
		});
		builder.addCase(fetchUser.rejected, (state, action) => {
			state.error = action.payload;
			state.loading = false;
		});
		builder.addCase(fetchUser.pending, (state) => {
			state.loading = true;
		});
	},
});

export const { setUser, setLoading, setError, setEventStatus } =
	userSlice.actions;
export default userSlice.reducer;
