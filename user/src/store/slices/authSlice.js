import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export const checkValidity = createAsyncThunk(
  "auth/checkValidity",
  async ({ tokne }, { dispatch }) => {
    if (!tokne) {
      dispatch(logout());
      return false;
    }
    const decoded = jwtDecode(tokne);
    if (decoded.exp < Date.now() / 1000) {
      dispatch(logout());
      return false;
    }
    return true;
  }
);

const initialState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  detailsSubmitted: localStorage.getItem("detailsSubmitted")
    ? localStorage.getItem("detailsSubmitted")
    : false,
  isValid: false,
  selected: "",
  loading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
    setDetailsSubmitted(state, action) {
      state.detailsSubmitted = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("detailsSubmitted");
      localStorage.removeItem("rzp_checkout_anon_id");
      localStorage.removeItem("rzp_device_id");
      localStorage.removeItem("rzp_stored_checkout_id");
      state.isValid = false;
      state.token = null;
      state.error = null;
      state.detailsSubmitted = false;
      state.selected = null;
    },
    setSelected(state, action) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkValidity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkValidity.fulfilled, (state, action) => {
      state.isValid = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(checkValidity.rejected, (state, action) => {
      state.isValid = false;
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const {
  setToken,
  setLoading,
  setError,
  logout,
  setDetailsSubmitted,
  setSelected,
} = authSlice.actions;
export default authSlice.reducer;
