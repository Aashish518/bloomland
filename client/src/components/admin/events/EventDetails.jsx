/* eslint-disable no-unused-vars */

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Mail,
  Users,
  Trash2,
  PenLine,
  ArrowLeft,
  Share2,
  Calendar,
  Download,
  Copy,
  CheckCheck,
  Save,
  X,
  Upload,
  PlusCircle,
  Plus,
  Package,
  DollarSign,
  Building2,
  IndianRupee,
  ImageIcon,
  FileImage,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteEvent, updateEvent } from "@/services/event";
import { useSelector } from "react-redux";
import { Editor } from "primereact/editor";
import * as XLSX from "xlsx";
import FileSaver, { saveAs } from "file-saver";
import LogoImageInput from "@/components/LogoImageInput";

export default function EventDetail({ event, setEvent }) {
  const [copied, setCopied] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [description, setDescription] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [newPreview, setNewPreview] = useState([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [subtitle, setSubtitle] = useState(null);
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [duration, setDuration] = useState(null);
  const [address, setAddress] = useState({});

  // const [startDate, setStartDate] = useState(
  //   event ? new Date(event.start_date) : new Date()
  // );
  // const [endDate, setEndDate] = useState(
  //   event && event.end_date ? new Date(event.end_date) : null
  // );
  const [scheduleDate, setScheduleDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [sponsors, setSponsors] = useState([]);
  const fileInputRef = useRef(null);
  const posterInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: null,
    images: [],
    price: "0",
    eventType: "day0",
    inclusions: [],
    itinerary: [],
    organizerInfo: {
      name: "",
      email: "",
    },
  });

  const { token } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      setFormData({
        title: event.title || "",
        description: event.description || "",
         startDate: eventDate && !isNaN(new Date(eventDate))
        ? format(new Date(eventDate), "yyyy-MM-dd")
        : "", // fallback if invalid
         endDate: endDate && !isNaN(new Date(endDate))
        ? format(new Date(endDate), "yyyy-MM-dd")
        : "", // fallback if invalid
        price: event.price?.toString() || "0",
        location: event.location || "",
        images: event.images ? event.images : [],
        inclusions: event.includes || [],
        eventType: event.category || "day0",
        itinerary: event.itinerary || [],
      });
      setDescription(event.description);
      setState(event.location?.state);
      setCity(event.location?.city);
      setCountry(event.location?.country);
      setAddress(event.address ? event.address : null);
      setDuration(event.duration ? event.duration : null);
      setPosterPreview(event.poster ? event.poster : null);
      setSubtitle(event.subtitle ? event.subtitle : null);
      setSponsors(event.sponsors ? event.sponsors : []);
    }
  }, [event]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const isUpcoming = new Date(event.start_date) > new Date();

  // Handle copy event link
  const copyEventLink = () => {
    const eventLink = `${window.location.origin}/events/${event._id}`;
    navigator.clipboard.writeText(eventLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle download event details
  const downloadEventDetails = () => {
    const eventDetails = `
      ${event.title}
      Date: ${format(new Date(event.start_date), "PPP")}
      Location: ${event.location.city}, ${event.location.state}, ${
      event.location.country
    }
      
      Description: ${event.description}
    `;

    const element = document.createElement("a");
    const file = new Blob([eventDetails], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${event.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-details.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Form handlers for edit dialog
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAddInclusion = () => {
    const newInclusion = {
      id: Date.now(), // or use a UUID generator
      heading: "",
      value: "",
    };

    setFormData((prev) => ({
      ...prev,
      inclusions: [...prev.inclusions, newInclusion],
    }));
  };

  const handleRemoveInclusion = (index) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateInclusion = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      inclusions: prev.inclusions.map((inclusion, i) =>
        i === index ? { ...inclusion, [field]: value } : inclusion
      ),
    }));
  };

  const handleAddDay = () => {
    const newDay = {
      id: Date.now(),
      date: "",
      title: "",
      activities: [
        {
          id: Date.now() + 1,
          time: "",
          location: "",
          description: "",
        },
      ],
    };

    setFormData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay],
    }));
  };

  const handleRemoveDay = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, index) => index !== dayIndex),
    }));
  };

  const handleUpdateDay = (dayIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, [field]: value } : day
      ),
    }));
  };

  const handleAddActivity = (dayIndex) => {
    const newActivity = {
      id: Date.now(),
      time: "",
      location: "",
      description: "",
    };

    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      ),
    }));
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.filter(
                (_, aIndex) => aIndex !== activityIndex
              ),
            }
          : day
      ),
    }));
  };

  const handleUpdateActivity = (dayIndex, activityIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, aIndex) =>
                aIndex === activityIndex
                  ? { ...activity, [field]: value }
                  : activity
              ),
            }
          : day
      ),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const preview = files.map((file) => URL.createObjectURL(file));
    // handleImageFiles(files);
    setNewImages([...newImages, ...files]);
    setNewPreview([...newPreview, ...preview]);
  };

  const handleImageFiles = (files) => {
    const newImages = files.map((file) => file);

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    // Revoke the URL to prevent memory leaks
    if (updatedImages[index].preview) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleRemovePoster = () => {
    setPoster(null);
    // Revoke the URL to prevent memory leaks
    if (posterPreview) {
      URL.revokeObjectURL(posterPreview);
    }
  };

  const handlePosterUpload = (e) => {
    const files = Array.from(e.target.files);
    const preview = URL.createObjectURL(files[0]);

    // handlePosterFile(files);
    setPoster(files[0]);
    setPosterPreview(preview);
  };

  const handlePosterFile = (files) => {
    const newImages = files[0];

    setPoster(newImages);
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handleImageFiles(files);
    }
  };

  const handlePosterDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePosterDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handlePosterDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handlePosterDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      handlePosterFile(files);
    }
  };

  const initializeSponsors = (existingSponsors) => {
    return existingSponsors.map((sponsor) => ({
      ...sponsor,
      logoFile: null, // Initialize with no new file
      originalLogo: sponsor.logo, // Keep track of original logo URL
    }));
  };

  // Update sponsor function
  const updateSponsor = (id, field, value) => {
    setSponsors((prevSponsors) =>
      prevSponsors.map((sponsor) =>
        sponsor.id === id ? { ...sponsor, [field]: value } : sponsor
      )
    );
  };

  // Handle logo change
  const handleLogoChange = (sponsorId, file) => {
    setSponsors((prevSponsors) =>
      prevSponsors.map((sponsor) =>
        sponsor.id === sponsorId
          ? {
              ...sponsor,
              logoFile: file,
              // Optionally create a preview URL for immediate display
              logoPreview: file ? URL.createObjectURL(file) : null,
            }
          : sponsor
      )
    );
  };

  // Add new sponsor
  const addSponsor = () => {
    const newSponsor = {
      id: Date.now(), // or use a proper ID generation method
      name: "",
      logo: "",
      logoFile: null,
      originalLogo: null,
    };
    setSponsors((prev) => [...prev, newSponsor]);
  };

  // Remove sponsor
  const removeSponsor = (id) => {
    setSponsors((prev) => prev.filter((sponsor) => sponsor.id !== id));
  };

  // Prepare data for backend submission
  const prepareSponsorsForSubmission = () => {
    const formData = new FormData();
    const sponsorsData = [];

    sponsors.forEach((sponsor, index) => {
      const sponsorData = {
        id: sponsor.id,
        name: sponsor.name,
      };

      // If there's a new logo file, add it to FormData
      if (sponsor.logoFile) {
        formData.append(`sponsor_logo_${sponsor.id}`, sponsor.logoFile);
        sponsorData.logoChanged = true;
      } else {
        // Keep existing logo URL
        sponsorData.logo = sponsor.originalLogo || sponsor.logo;
        sponsorData.logoChanged = false;
      }

      sponsorsData.push(sponsorData);
    });

    // Add sponsors data as JSON string
    formData.append("sponsors", JSON.stringify(sponsorsData));

    return formData;
  };

  const downloadEventAsExcel = (event) => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();

    // Format dates for better readability
    const formattedEvent = {
      ...event,
      start_date: format(new Date(event.start_date), "MMMM d, yyyy"),
      end_date: format(new Date(event.end_date), "MMMM d, yyyy"),
      scheduledFor:
        format(new Date(event.scheduledFor), "MMMM d, yyyy, h:mm a") + " UTC",
      created_at: format(new Date(event.created_at), "MMMM d, yyyy"),
      updated_at: format(new Date(event.updated_at), "MMMM d, yyyy"),
      description: event.description.replace(/<\/?p>/g, ""),
      location: `${event.location.city}, ${event.location.state}, ${event.location.country}`,
      price: `₹${event.price.toLocaleString()}`,
    };

    // Define style constants for consistency
    const STYLES = {
      header: {
        font: { bold: true, sz: 16, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "E5E7EB" } },
          bottom: { style: "thin", color: { rgb: "E5E7EB" } },
          left: { style: "thin", color: { rgb: "E5E7EB" } },
          right: { style: "thin", color: { rgb: "E5E7EB" } },
        },
      },
      subheader: {
        font: { bold: true, sz: 14 },
        fill: { fgColor: { rgb: "E5E7EB" } },
        border: {
          top: { style: "thin", color: { rgb: "D1D5DB" } },
          bottom: { style: "thin", color: { rgb: "D1D5DB" } },
        },
      },
      evenRow: {
        fill: { fgColor: { rgb: "F9FAFB" } },
      },
      labelCell: {
        font: { bold: true },
        fill: { fgColor: { rgb: "F3F4F6" } },
      },
      tableHeader: {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4F46E5" } },
        border: {
          top: { style: "thin", color: { rgb: "E5E7EB" } },
          bottom: { style: "thin", color: { rgb: "E5E7EB" } },
          left: { style: "thin", color: { rgb: "E5E7EB" } },
          right: { style: "thin", color: { rgb: "E5E7EB" } },
        },
        alignment: { horizontal: "center" },
      },
    };

    // MAIN INFO SHEET with better formatting
    const mainInfoData = [
      ["Event Details - " + event.title, ""],
      ["", ""],
      ["Title", event.title],
      ["Category", event.category],
      ["Description", formattedEvent.description],
      ["Location", formattedEvent.location],
      ["Price", formattedEvent.price],
      ["Visibility", event.visibility],
      ["", ""],
      ["DATES", ""],
      ["Start Date", formattedEvent.start_date],
      ["End Date", formattedEvent.end_date],
      ["Scheduled For", formattedEvent.scheduledFor],
      ["Created At", formattedEvent.created_at],
      ["Updated At", formattedEvent.updated_at],
    ];

    const mainWS = XLSX.utils.aoa_to_sheet(mainInfoData);

    // Apply styles to main sheet
    // eslint-disable-next-line no-unused-vars
    const mainRange = XLSX.utils.decode_range(mainWS["!ref"]);

    // Apply cell styling for the main worksheet
    mainWS["A1"] = { v: "Event Details - " + event.title, s: STYLES.header };
    mainWS["B1"] = { v: "", s: STYLES.header }; // Extend header styling
    mainWS["A9"] = { v: "DATES", s: STYLES.subheader };
    mainWS["B9"] = { v: "", s: STYLES.subheader }; // Extend subheader styling

    // Add styling to label cells (first column)
    for (let r = 3; r <= 8; r++) {
      if (mainWS["A" + r]) {
        mainWS["A" + r].s = STYLES.labelCell;
      }
    }

    for (let r = 11; r <= 15; r++) {
      if (mainWS["A" + r]) {
        mainWS["A" + r].s = STYLES.labelCell;
      }
    }

    // Add alternating row colors
    for (let r = 3; r <= 15; r++) {
      if (r % 2 === 0 && mainWS["B" + r]) {
        mainWS["B" + r].s = STYLES.evenRow;
      }
    }

    // Set column widths
    mainWS["!cols"] = [
      { width: 20 }, // Column A
      { width: 50 }, // Column B
    ];

    // Merge cells for headers
    mainWS["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Merge A1:B1
      { s: { r: 9, c: 0 }, e: { r: 9, c: 1 } }, // Merge A10:B10
    ];

    // INCLUDES SHEET with better formatting
    const includesData = [["Included Items"], [""]];

    // eslint-disable-next-line no-unused-vars
    event.includes.forEach((item, index) => {
      includesData.push([item.replace("\\", "")]);
    });

    const includesWS = XLSX.utils.aoa_to_sheet(includesData);

    // Style the includes sheet
    includesWS["A1"] = { v: "Included Items", s: STYLES.header };

    // Add styling to items
    for (let r = 3; r < includesData.length; r++) {
      if (r % 2 === 0) {
        includesWS["A" + r] = {
          v: includesData[r][0],
          s: STYLES.evenRow,
        };
      }
    }

    includesWS["!cols"] = [{ width: 40 }];

    // REQUESTS SHEET - Create a sheet for requests data
    const requestsHeaders = ["ID", "Email", "Google ID", "Role", "Journey"];
    const requestsData = [requestsHeaders, ["", "", "", "", ""]];

    if (event.requests && event.requests.length > 0) {
      event.requests.forEach((user) => {
        requestsData.push([
          user._id || "N/A",
          user.email || "N/A",
          user.googleId || "N/A",
          user.role || "N/A",
          user.journey && user.journey.length
            ? `${user.journey.length} items`
            : "None",
        ]);
      });
    } else {
      requestsData.push(["No requests available", "", "", "", ""]);
    }

    const requestsWS = XLSX.utils.aoa_to_sheet(requestsData);

    // Style requests sheet
    for (let c = 0; c < requestsHeaders.length; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      requestsWS[cell] = { v: requestsHeaders[c], s: STYLES.tableHeader };
    }

    // Apply alternating row colors
    for (let r = 2; r < requestsData.length; r++) {
      if (r % 2 === 0) {
        for (let c = 0; c < requestsHeaders.length; c++) {
          const cell = XLSX.utils.encode_cell({ r, c });
          if (requestsWS[cell]) {
            requestsWS[cell].s = { ...requestsWS[cell].s, ...STYLES.evenRow };
          }
        }
      }
    }

    requestsWS["!cols"] = [
      { width: 25 }, // ID
      { width: 30 }, // Email
      { width: 25 }, // Google ID
      { width: 15 }, // Role
      { width: 15 }, // Journey
    ];

    // APPROVED SHEET - Create a sheet for approved users
    const approvedHeaders = ["ID", "Email", "Google ID", "Role", "Journey"];
    const approvedData = [approvedHeaders, ["", "", "", "", ""]];

    if (event.approved && event.approved.length > 0) {
      event.approved.forEach((user) => {
        approvedData.push([
          user._id || "N/A",
          user.email || "N/A",
          user.googleId || "N/A",
          user.role || "N/A",
          user.journey && user.journey.length
            ? `${user.journey.length} items`
            : "None",
        ]);
      });
    } else {
      approvedData.push(["No approved users", "", "", "", ""]);
    }

    const approvedWS = XLSX.utils.aoa_to_sheet(approvedData);

    // Style approved sheet
    for (let c = 0; c < approvedHeaders.length; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      approvedWS[cell] = { v: approvedHeaders[c], s: STYLES.tableHeader };
    }

    // Apply alternating row colors
    for (let r = 2; r < approvedData.length; r++) {
      if (r % 2 === 0) {
        for (let c = 0; c < approvedHeaders.length; c++) {
          const cell = XLSX.utils.encode_cell({ r, c });
          if (approvedWS[cell]) {
            approvedWS[cell].s = { ...approvedWS[cell].s, ...STYLES.evenRow };
          }
        }
      }
    }

    approvedWS["!cols"] = [
      { width: 25 }, // ID
      { width: 30 }, // Email
      { width: 25 }, // Google ID
      { width: 15 }, // Role
      { width: 15 }, // Journey
    ];

    // ATTENDEES SHEET - Create a sheet for attendees
    const attendeesHeaders = ["ID", "Email", "Google ID", "Role", "Journey"];
    const attendeesData = [attendeesHeaders, ["", "", "", "", ""]];

    if (event.attendees && event.attendees.length > 0) {
      event.attendees.forEach((user) => {
        attendeesData.push([
          user._id || "N/A",
          user.email || "N/A",
          user.googleId || "N/A",
          user.role || "N/A",
          user.journey && user.journey.length
            ? `${user.journey.length} items`
            : "None",
        ]);
      });
    } else {
      attendeesData.push(["No attendees", "", "", "", ""]);
    }

    const attendeesWS = XLSX.utils.aoa_to_sheet(attendeesData);

    // Style attendees sheet
    for (let c = 0; c < attendeesHeaders.length; c++) {
      const cell = XLSX.utils.encode_cell({ r: 0, c });
      attendeesWS[cell] = { v: attendeesHeaders[c], s: STYLES.tableHeader };
    }

    // Apply alternating row colors
    for (let r = 2; r < attendeesData.length; r++) {
      if (r % 2 === 0) {
        for (let c = 0; c < attendeesHeaders.length; c++) {
          const cell = XLSX.utils.encode_cell({ r, c });
          if (attendeesWS[cell]) {
            attendeesWS[cell].s = { ...attendeesWS[cell].s, ...STYLES.evenRow };
          }
        }
      }
    }

    attendeesWS["!cols"] = [
      { width: 25 }, // ID
      { width: 30 }, // Email
      { width: 25 }, // Google ID
      { width: 15 }, // Role
      { width: 15 }, // Journey
    ];

    // Add all sheets to workbook
    XLSX.utils.book_append_sheet(wb, mainWS, "Event Information");
    XLSX.utils.book_append_sheet(wb, includesWS, "Included Items");
    XLSX.utils.book_append_sheet(wb, requestsWS, "Requests");
    XLSX.utils.book_append_sheet(wb, approvedWS, "Approved Users");
    XLSX.utils.book_append_sheet(wb, attendeesWS, "Attendees");

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert string to ArrayBuffer
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    // Create file and trigger download
    const fileName = `${event.title
      .replace(/\s+/g, "-")
      .toLowerCase()}-details.xlsx`;
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      fileName
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.location.city.trim()) {
      newErrors.city = "City is required";
    }

    if (isNaN(parseFloat(formData.price))) {
      newErrors.price = "Price must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function convertTo24HrFormat(timeString) {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
    if (modifier === "AM" && hours === "12") hours = "00";

    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const formatTimestamp = (date, time) => {
    if (!date || !time) return null;

    const day = date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const fullTime = convertTo24HrFormat(time); // "HH:mm"
    return `${day} ${fullTime}:00`; // "YYYY-MM-DD HH:mm:ss"
  };

  const handleSubmit = async (status) => {
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", description);
    data.append("price", formData.price);
    data.append("type", formData.eventType);
    data.append("visibility", status === "published" ? "public" : "private");
    data.append("subtitle", subtitle);
    data.append(
      "location",
      JSON.stringify({
        city: city,
        state: state,
        country: country,
      })
    );
    if (address) {
      data.append("address", JSON.stringify(address));
    }
    if (duration) {
      data.append("duration", duration);
    }
    data.append("startDate", formData.startDate);
    data.append("endDate", formData.endDate);
    if (formData.inclusions.length > 0) {
      data.append("inclusions", JSON.stringify(formData.inclusions));
    }
    newImages.map((imageObj) => {
      // Append the actual file object, not the preview object
      data.append("newImages", imageObj);
    });
    formData.images.map((image) => {
      data.append("images", image);
    });
    // data.append("startDate", startDate);
    // data.append("endDate", endDate);
    if (status === "scheduled" && scheduleDate && scheduleTime) {
      const scheduledFor = formatTimestamp(scheduleDate, scheduleTime);
      data.append("scheduledFor", scheduledFor);
    }

    if (poster) {
      console.log(poster);
      data.append("poster", poster);
    }

    if (formData.itinerary && formData.itinerary.length > 0) {
      // formData.inclusions.forEach((it) => {
      data.append("itinerary", JSON.stringify(formData.itinerary));
      // });
    }

    const sponsorsData = [];

    sponsors.forEach((sponsor, index) => {
      const sponsorData = {
        id: sponsor.id,
        name: sponsor.name,
      };

      // If there's a new logo file, add it to FormData
      if (sponsor.logoFile) {
        data.append(`sponsor_logo_${sponsor.id}`, sponsor.logoFile);
        sponsorData.logoChanged = true;
      } else {
        // Keep existing logo URL
        sponsorData.logo = sponsor.originalLogo || sponsor.logo;
        sponsorData.logoChanged = false;
      }

      sponsorsData.push(sponsorData);
    });

    // Add sponsors data as JSON string
    data.append("sponsors", JSON.stringify(sponsorsData));

    // Here you would typically submit the form data to your API
    await updateEvent({
      event: data,
      token: token,
      setEvent: setEvent,
      eventId: id,
    });
    // Close the dialog
    setEditDialogOpen(false);
    // navigate(`/admin/events/${id}`);

    // Show success message
    // alert(
    //   `Event ${
    //     status === "draft"
    //       ? "saved as draft"
    //       : status === "published"
    //       ? "published"
    //       : "scheduled"
    //   } successfully!`
    // );
  };

  const openEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    await deleteEvent({ eventId: id, token: token, navigate: navigate });
  };

  // Mock DatePicker and TimePicker components for the example
  const DatePicker = ({ date, setDate, disabled, label }) => {
    return (
      <Input
        type="date"
        value={date ? format(date, "yyyy-MM-dd") : ""}
        onChange={(e) => setDate(new Date(e.target.value))}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
        disabled={typeof disabled === "function" ? false : disabled}
        aria-label={label}
      />
    );
  };

  const TimePicker = ({ selectedTime, setSelectedTime }) => (
    <Input
      type="time"
      value={selectedTime || ""}
      onChange={(e) => setSelectedTime(e.target.value)}
      className="w-full border border-gray-300 rounded-md px-3 py-2"
    />
  );

  const downloadExcel = () => {
    try {
      // Extract attendees array from event object
      const attendees = event?.attendees || [];

      // Map attendees to simplified format for Excel
      const exportData = attendees.map((attendee) => ({
        Name: attendee.name || "",
        Email: attendee.email || "",
        "Date of Birth": format(new Date(attendee.dob), "d MMMM, yyyy") || "",
        Phone: attendee.phone || "",
        Journey: Array.isArray(attendee.journey)
          ? attendee.journey.join(", ")
          : "",
      }));

      if (exportData.length === 0) {
        alert("No attendees data available to download");
        return;
      }

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendees");

      // Generate filename with event title and date
      const eventTitle = event?.title || "Event";
      const fileName = `${eventTitle
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_attendees_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Create excel file and trigger download
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      FileSaver.saveAs(data, fileName);
    } catch (error) {
      console.error("Error downloading attendees:", error);
      alert("Failed to download attendees data");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/events")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <h1 className="text-3xl font-bold flex-1">Event Details</h1>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={openEditDialog}>
                  <PenLine className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Event</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  event "{event.title}" and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                  <CardDescription className="text-lg">
                    <p
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    ></p>
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <Badge
                    variant={isUpcoming ? "default" : "secondary"}
                    className="text-sm font-medium"
                  >
                    {isUpcoming ? "Upcoming" : "Past"}
                  </Badge>
                  <Badge
                    variant={"default"}
                    className="text-sm font-medium capitalize"
                  >
                    {event.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-64 mb-6">
                <img
                  src={event.images[0] || "/api/placeholder/800/400"}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="px-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="attendees">Attendees</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-8">
                    {/* Basic Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Date
                            </p>
                            <p className="font-medium">
                              {event.start_date && !isNaN(new Date(event.start_date)) ? (
  format(new Date(event.start_date), "PPP")
) : (
  "Invalid date"
)}

                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Time
                            </p>
                            <p className="font-medium">
                              {event.start_date && !isNaN(new Date(event.start_date)) ? (
  format(new Date(event.start_date), "PPP")
) : (
  "Invalid date"
)}

                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Location
                            </p>
                            <p className="font-medium">
                              {formData?.location?.city},{" "}
                              {formData?.location?.state},{" "}
                              {formData?.location?.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Attendees
                            </p>
                            <p className="font-medium">
                              {event.attendees?.length > 0
                                ? event.attendees.length
                                : "0 "}
                              registered
                            </p>
                          </div>
                        </div>

                        {/* ADDRESS */}
                        {address && (
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Address
                              </p>
                              <p className="font-medium">
                                {address?.venue}, {address?.landmark},{" "}
                                {address?.area}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* DURATION */}
                        {duration && (
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Duration
                              </p>
                              <p className="font-medium">{duration}</p>
                            </div>
                          </div>
                        )}

                        {/* PRICE */}
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full">
                            <IndianRupee className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Price
                            </p>
                            <p className="font-medium">
                              ₹{event.price?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Inclusions */}
                    {event.includes && event.includes.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          What's Included
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {event.includes.map((inclusion) => (
                            <div
                              key={inclusion.id}
                              className="border rounded-lg p-4 space-y-2"
                            >
                              <h4 className="font-medium text-primary">
                                {inclusion.heading}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {inclusion.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Event Itinerary */}
                    {event.itinerary && event.itinerary.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {/* <Schedule className="h-5 w-5 text-primary" /> */}
                          Event Itinerary
                        </h3>
                        <div className="space-y-6">
                          {event.itinerary.map((day) => (
                            <div key={day.id} className="border rounded-lg p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                  <CalendarIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">{day.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {format(new Date(day.date), "PPP")}
                                  </p>
                                </div>
                              </div>

                              {day.activities && day.activities.length > 0 && (
                                <div className="space-y-3 ml-6">
                                  {day.activities.map((activity) => (
                                    <div
                                      key={activity.id}
                                      className="flex gap-4 p-3 bg-muted/30 rounded-lg"
                                    >
                                      <div className="flex items-center gap-2 min-w-0">
                                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                                        <span className="text-sm font-medium">
                                          {activity.time}
                                        </span>
                                      </div>
                                      <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">
                                          {activity.description}
                                        </p>
                                        {activity.location && (
                                          <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">
                                              {activity.location}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Event Sponsors */}
                    {event.sponsors && event.sponsors.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          Event Sponsors
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {event.sponsors.map((sponsor) => (
                            <div
                              key={sponsor.id}
                              className="border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow"
                            >
                              <div className="w-16 h-16 flex items-center justify-center">
                                <img
                                  src={sponsor.logo}
                                  alt={sponsor.name}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <div className="w-16 h-16 bg-muted rounded-lg items-center justify-center text-xs text-muted-foreground hidden">
                                  {sponsor.name.charAt(0)}
                                </div>
                              </div>
                              <p className="text-sm font-medium text-center">
                                {sponsor.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Gallery */}
                    {event.images && event.images.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <ImageIcon className="h-5 w-5 text-primary" />
                          Event Gallery
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {event.images.map((image, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-lg overflow-hidden border hover:shadow-md transition-shadow cursor-pointer"
                            >
                              <img
                                src={image}
                                alt={`Event image ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Event Poster */}
                    {event.poster && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileImage className="h-5 w-5 text-primary" />
                          Event Poster
                        </h3>
                        <div className="flex justify-center">
                          <div className="max-w-md w-full rounded-lg overflow-hidden border shadow-md">
                            <img
                              src={event.poster}
                              alt="Event poster"
                              className="w-full h-auto object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder-poster.jpg";
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="attendees">
                    <div className="rounded-md border p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Attendee Management</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            Total:{" "}
                            {event.attendees?.length
                              ? event.attendees.length
                              : "0"}
                          </p>
                          <Button
                            onClick={downloadExcel}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export List
                          </Button>
                        </div>
                      </div>
                      {event.attendees?.length > 0 ? (
                        <p className="text-muted-foreground">
                          View and manage attendees here. Full list available
                          for export.
                        </p>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">
                            No attendees have registered yet
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics">
                    <div className="rounded-md border p-4">
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-lg font-medium mb-1">
                          Event Analytics
                        </p>
                        <p className="text-muted-foreground">
                          Analytics data will be available after the event
                          starts
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="flex md:flex-row flex-col items-start justify-end gap-2 pt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadEventDetails}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Details
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download event information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={copyEventLink}>
                      {copied ? (
                        <>
                          <CheckCheck className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy event link to clipboard</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button variant="default" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>Manage event settings and tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                    onClick={openEditDialog}
                  >
                    <PenLine className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">Edit Event</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                  >
                    <Users className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">
                      Manage Attendees
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                  >
                    <Share2 className="h-4 w-4 mr-2 md:mr-0" />
                    <span className="md:hidden lg:inline ml-2">
                      Send Invites
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start overflow-x-clip"
                  >
                    <Download className="h-4 w-4 mr-2 md:mr-0" />
                    <span
                      onClick={() => downloadEventAsExcel(event)}
                      className="md:hidden lg:inline ml-2"
                    >
                      Export Data
                    </span>
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Event Status</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    {isUpcoming ? "Scheduled" : "Completed"}
                  </span>
                  <Badge variant={isUpcoming ? "default" : "secondary"}>
                    {isUpcoming ? "Active" : "Past"}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {new Date(event.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated:</span>
                    <span>
                      {new Date(event.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="text-xs font-mono bg-gray-100 p-1">
                      {event?._id?.slice(0, 4)}...
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="font-medium mb-2">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  These actions cannot be undone
                </p>
                <div className="space-y-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the event "{event.title}" and all associated
                          data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleDelete}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Make changes to your event information below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <Editor
              value={description}
              name="description"
              onTextChange={(e) => setDescription(e.htmlValue)}
              style={{ height: "320px" }}
            />

            <Editor
              value={subtitle}
              name="subtitle"
              onTextChange={(e) => setSubtitle(e.htmlValue)}
              style={{ height: "320px" }}
            />

            {/* Event Type */}
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="day0">Day 0</option>
                <option value="10x">10x</option>
                <option value="100x">100x</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <DatePicker
                  date={formData.startDate}
                  setDate={(date) =>
                    setFormData({ ...formData, startDate: date })
                  }
                  label="Select start date"
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <DatePicker
                  date={formData.endDate}
                  setDate={(date) =>
                    setFormData({ ...formData, endDate: date })
                  }
                  label="Select end date"
                  disabled={(date) =>
                    !formData.startDate || date <= new Date(formData.startDate)
                  }
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price">
                Starting Price <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`pl-7 ${errors.price ? "border-red-500" : ""}`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price}</p>
              )}
            </div>

            {/* DURATION */}
            {formData.eventType === "day0" && (
              <div>
                <Label htmlFor="duration">
                  Duration <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="duration"
                    name="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={`${errors.price ? "border-red-500" : ""}`}
                  />
                </div>
                {/* {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                )} */}
              </div>
            )}

            {/* Location */}
            <div className="space-y-4">
              <h3 className="font-medium">Location</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="location.city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="location.state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="location.country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS */}
            {formData.eventType === "day0" && (
              <div className="space-y-4">
                <h3 className="font-medium">Address</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="venue">
                      Venue <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="venue"
                      name="venue"
                      value={address?.venue}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          venue: e.target.value,
                        }))
                      }
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      value={address?.landmark}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          landmark: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area</Label>
                    <Input
                      id="area"
                      name="area"
                      value={address?.area}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          area: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Organizer Info */}

            {/* Images */}
            <div>
              <Label className="mb-2 block">Uploaded Images</Label>
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.images.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl} // handles both string and object with `preview`
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">
                  No images uploaded yet.
                </p>
              )}
            </div>
            <div>
              <Label>Event Images</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 mt-2 text-center ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300"
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />

                {newPreview.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {newPreview.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={index}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                    <div
                      className="flex items-center justify-center h-24 border border-dashed rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-1">
                      <span className="font-medium">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* POSTER */}
            <div>
              <Label className="mb-2 block">Uploaded Images</Label>
              {posterPreview ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {/* {formData.images.map((imageUrl, index) => ( */}
                  <div className="relative group">
                    <img
                      src={posterPreview ? posterPreview : null} // handles both string and object with `preview`
                      alt={`Image ${Date.now}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePoster}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  {/* ))} */}
                </div>
              ) : (
                <p className="text-muted-foreground mb-4">
                  No Poster uploaded yet.
                </p>
              )}
            </div>
            <div>
              <Label>Event Images</Label>
              <div
                className={`border-2 border-dashed rounded-md p-6 mt-2 text-center ${
                  isDragging ? "border-primary bg-primary/5" : "border-gray-300"
                }`}
                onDragEnter={handlePosterDragEnter}
                onDragOver={handlePosterDragOver}
                onDragLeave={handlePosterDragLeave}
                onDrop={handlePosterDrop}
              >
                <input
                  type="file"
                  ref={posterInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePosterUpload(e)}
                />

                <div
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                  onClick={() => posterInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-1">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* ITINERARY */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">
                Itinerary
              </Label>

              <div className="grid grid-cols-1 gap-8 mt-4">
                {/* Form Section */}
                <div className="space-y-6">
                  <div className="space-y-6">
                    {formData.itinerary.map((day, dayIndex) => (
                      <div
                        key={day.id || dayIndex}
                        className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm w-full"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Day {dayIndex + 1}
                          </h2>
                          {formData.itinerary.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDay(dayIndex)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove Day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Date
                            </label>
                            <Input
                              type="date"
                              value={day?.date ? day.date.split("T")[0] : ""}
                              onChange={(e) =>
                                handleUpdateDay(
                                  dayIndex,
                                  "date",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Day Title
                            </label>
                            <Input
                              type="text"
                              value={day.title || ""}
                              onChange={(e) =>
                                handleUpdateDay(
                                  dayIndex,
                                  "title",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Arrival & Old City Exploration"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Activities
                          </h3>

                          {day.activities &&
                            day.activities.map((activity, activityIndex) => (
                              <div
                                key={activity.id || activityIndex}
                                className="border border-gray-100 rounded-md p-4 bg-gray-50"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Time
                                        </label>
                                        <Input
                                          type="time"
                                          value={activity.time || ""}
                                          onChange={(e) =>
                                            handleUpdateActivity(
                                              dayIndex,
                                              activityIndex,
                                              "time",
                                              e.target.value
                                            )
                                          }
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Location
                                        </label>
                                        <div className="relative">
                                          <MapPin className="absolute left-2 top-1.5 w-3 h-3 text-gray-400" />
                                          <Input
                                            type="text"
                                            value={activity.location || ""}
                                            onChange={(e) =>
                                              handleUpdateActivity(
                                                dayIndex,
                                                activityIndex,
                                                "location",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Location"
                                            className="w-full pl-7 pr-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Activity Description
                                      </label>
                                      <textarea
                                        value={activity.description || ""}
                                        onChange={(e) =>
                                          handleUpdateActivity(
                                            dayIndex,
                                            activityIndex,
                                            "description",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Describe the activity..."
                                        rows="2"
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      />
                                    </div>
                                  </div>
                                  {day.activities.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemoveActivity(
                                          dayIndex,
                                          activityIndex
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700 p-1 mt-4"
                                      title="Remove Activity"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}

                          <Button
                            type="button"
                            onClick={() => handleAddActivity(dayIndex)}
                            variant="ghost"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Plus className="w-4 h-4" />
                            Add Activity
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        onClick={handleAddDay}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Day
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <Label className="text-lg font-semibold text-gray-800">
                Inclusions
              </Label>

              <div className="grid grid-cols-1 gap-8 mt-4">
                {/* Form Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    {formData.inclusions.map((inclusion, index) => (
                      <div
                        key={inclusion.id || index}
                        className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Package className="w-5 h-5 text-green-600" />
                            Inclusion {index + 1}
                          </h3>
                          {formData.inclusions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveInclusion(index)}
                              className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              title="Remove Inclusion"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Heading/Category
                            </label>
                            <Input
                              type="text"
                              value={inclusion.heading || ""}
                              onChange={(e) =>
                                handleUpdateInclusion(
                                  index,
                                  "heading",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., Accommodation, Meals, Transportation"
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description/Details
                            </label>
                            <textarea
                              value={inclusion.value || ""}
                              onChange={(e) =>
                                handleUpdateInclusion(
                                  index,
                                  "value",
                                  e.target.value
                                )
                              }
                              placeholder="e.g., 2 nights in a premium heritage hotel with modern amenities"
                              rows="3"
                              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      onClick={handleAddInclusion}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Inclusion
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* SPONSORS */}
            <div className="grid grid-cols-1 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                <h1 className="text-red-600 text-xl font-medium">Sponsors</h1>
                <div className="space-y-4">
                  {sponsors.map((sponsor, index) => (
                    <div
                      key={sponsor.id}
                      className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          Sponsor {index + 1}
                        </h3>
                        {sponsors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSponsor(sponsor.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                            title="Remove Sponsor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={sponsor.name}
                            onChange={(e) =>
                              updateSponsor(sponsor.id, "name", e.target.value)
                            }
                            placeholder="e.g., Google"
                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Logo
                          </label>

                          {/* Show existing logo if it's a URL */}
                          {sponsor.logo &&
                            typeof sponsor.logo === "string" &&
                            sponsor.logo.startsWith("http") && (
                              <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-2">
                                  Current logo:
                                </p>
                                <img
                                  src={sponsor.logo}
                                  alt={`${sponsor.name} logo`}
                                  className="w-20 h-20 object-contain border border-gray-200 rounded-md"
                                />
                              </div>
                            )}

                          <LogoImageInput
                            value={sponsor.logoFile || null} // Use logoFile for new uploads
                            onChange={handleLogoChange}
                            id={sponsor.id}
                            existingUrl={sponsor.logo} // Pass existing URL for reference
                          />

                          {/* Show upload status */}
                          {sponsor.logoFile && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-md">
                              <p className="text-xs text-blue-600">
                                New logo selected: {sponsor.logoFile.name}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={addSponsor}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Sponsor
                  </button>
                </div>
              </div>
            </div>

            {/* Schedule Options */}
            <div className="space-y-4">
              <h3 className="font-medium">Publishing Options</h3>
              <Tabs defaultValue="publish">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="publish">Publish Now</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="draft">Save as Draft</TabsTrigger>
                </TabsList>
                <TabsContent value="publish">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your event will be published immediately and visible to
                    attendees.
                  </p>
                  <Button
                    type="button"
                    onClick={() => handleSubmit("published")}
                    className="w-full"
                  >
                    Publish Event
                  </Button>
                </TabsContent>
                <TabsContent value="schedule">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduleDate">Date</Label>
                        <DatePicker
                          date={scheduleDate}
                          setDate={setScheduleDate}
                          label="Select date"
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="scheduleTime">Time</Label>
                        <TimePicker
                          selectedTime={scheduleTime}
                          setSelectedTime={setScheduleTime}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleSubmit("scheduled")}
                      className="w-full"
                      disabled={!scheduleDate || !scheduleTime}
                    >
                      Schedule Publication
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="draft">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your event will be saved as a draft and won't be visible to
                    attendees until published.
                  </p>
                  <Button
                    type="button"
                    onClick={() => handleSubmit("draft")}
                    variant="outline"
                    className="w-full"
                  >
                    Save as Draft
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => handleSubmit("published")}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
