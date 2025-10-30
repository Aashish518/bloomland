import "./App.css";
import { Routes, Route } from "react-router";
import { ToastContainer } from "react-toastify";
import AuthPage from "./pages/AuthPage";
import Landing from "./pages/Landing";
import Details from "./pages/Details";
import EditionsPage from "./pages/EditionsPage";
import EventsPage from "./pages/Events";
import ErrorPage from "./pages/ErrorPage";
import Loader from "./components/Loader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "./store/slices/eventSlice";
import { checkValidity, logout } from "./store/slices/authSlice";
import { fetchUser } from "./store/slices/userSlice";
import Ticket from "./components/Ticket";
import EventDetails from "./pages/EventDetails";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import AboutUs from "./pages/AboutUs";
import Community from "./pages/Community";
import ContactUs from "./pages/ContactUs";
import UserDashboard from "./pages/UserDashboard";
import Bot from "./components/Bot";
import Pricing from "./pages/Pricing";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      return;
    }
    dispatch(fetchUser({ token }));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(checkValidity({ tokne: token }));
  }, [dispatch, token]);

  useEffect(() => {
    dispatch(checkValidity({ tokne: token }));
  }, [dispatch, token]);

  return (
    <div className="custom-cursor">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/details" element={<Details />} />
        <Route path="/editions" element={<EditionsPage />} />
        <Route path="/editions/day0" element={<EventsPage />} />
        <Route path="/editions/10x" element={<EventsPage />} />
        <Route path="/editions/100x" element={<EventsPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/community" element={<Community />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/load" element={<Loader />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer />
      <div className="fixed bottom-6 right-8 z-[100] hidden md:block">
        {/* <Bot /> */}
      </div>
    </div>
  );
}

export default App;
