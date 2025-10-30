/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Filter,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Check,
  Cross,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router";
import {
  approveAll,
  approveOne,
  deleteApproval,
  enterOne,
  rejectAll,
  rejectOne,
} from "@/services/admin";
import { ClipLoader } from "react-spinners";
import { getApproved, getAttendees, getRequests } from "@/services/admin";
import { useDispatch, useSelector } from "react-redux";

const UserDataTable = ({
  usersData,
  setRefreshEvents,
  type,
  setEvent,
  page = "event",
}) => {
  // State variables
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredReq, setFilteredReq] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({
    fieldOfWork: "",
    city: "",
    status: "",
  });
  const [appliedFilters, setAppliedFilters] = useState([]);
  const dispatch = useDispatch();

  // Settings
  const usersPerPage = 3;

  // Derived state
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const currentReq = filteredReq.slice(indexOfFirstUser, indexOfLastUser);
  // Get unique values for filter dropdowns
  const [uniqueFields, setUniqueFields] = useState(null);

  const statusOptions = ["Pending", "approved", "rejected"];
  const navigate = useNavigate();

  // Calculate age from date of birth
  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };

  useEffect(() => {
    // By default, only show users with status 'pending'
    const req = usersData
      .filter((i) => i.status === "pending")
      .map((i) => i.userId);
    setUsers(req);
    const uFields = [...new Set(req?.map((user) => user.journey[0]))];
    setUniqueFields(uFields);
  }, [usersData]);

  // Handle search
  useEffect(() => {
    applyFiltersAndSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, appliedFilters, users]);

  const applyFiltersAndSearch = () => {
    let result = users ? [...users] : null;

    // Apply search term
    if (users && searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user._id.toLowerCase().includes(searchTerm.toLowerCase())
        // user.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // user.journey.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    appliedFilters.forEach((filter) => {
      result = result.filter((user) => user[filter.type] === filter.value);
    });

    let reqs = [];
    for (let i in result) {
      const req = usersData.filter((j) => j.userId._id === result[i]._id);
      req.map((r) => reqs.push(r));
    }
    // console.log(result);
    setFilteredReq(reqs);
    setFilteredUsers(result);
    setCurrentPage(1);
  };

  // Handle checkbox selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentReq.map((user) => user._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    const req = usersData.find((u) => u.userId._id === userId);
    if (selectedUsers.includes(req._id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== req._id));
      setSelectAll(false);
    } else {
      setSelectedUsers([...selectedUsers, req._id]);
      if (selectedUsers.length + 1 === currentUsers.length) {
        setSelectAll(true);
      }
    }
  };

  // Handle pagination
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle bulk actions
  const handleApproveAll = async () => {
    //SELECTED USERS ARRAY TO BE APPROVED
    await approveAll({
      token: token,
      requests: selectedUsers,
      setEvent: setEvent,
      setLoading: setLoading,
    });
    setSelectedUsers([]);
    setSelectAll(false);
  };

  const handleRejectAll = async () => {
    //SELECTED USERS ARRAY TO BE REJECTED
    await rejectAll({
      token: token,
      requests: selectedUsers,
      setEvent: setEvent,
      setLoading: setLoading,
    });
    setSelectedUsers([]);
    setSelectAll(false);
  };

  // Handle individual actions
  // const handleApproveUser = (userId) => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === userId ? { ...user, status: "Approved" } : user
  //     )
  //   );
  // };

  // const handleRejectUser = (userId) => {
  //   setUsers(
  //     users.map((user) =>
  //       user.id === userId ? { ...user, status: "Rejected" } : user
  //     )
  //   );
  // };

  // Handle filter actions
  const applyFilter = () => {
    const newFilters = [];

    if (filters.fieldOfWork) {
      newFilters.push({ type: "journey", value: filters.fieldOfWork });
    }

    if (filters.city) {
      newFilters.push({ type: "location.city", value: filters.city });
    }

    if (filters.status) {
      newFilters.push({ type: "allowed", value: filters.status });
    }

    setAppliedFilters(newFilters);
    setShowFilterPanel(false);
  };

  const removeFilter = (filter) => {
    setAppliedFilters(
      appliedFilters.filter(
        (f) => !(f.type === filter.type && f.value === filter.value)
      )
    );
  };

  const clearAllFilters = () => {
    setAppliedFilters([]);
    setFilters({
      fieldOfWork: "",
      city: "",
      status: "",
    });
  };

  const getUserStatus = (level) => {
    if (level === 0) {
      return "Not Approved";
    } else if (level === 1) {
      return "Day 0";
    } else if (level === 2) {
      return "10x";
    } else if (level === 3) {
      return "100x";
    }
  };

  const getUserReady = (state) => {
    if (state === "100") {
      return "Fully ready";
    } else if (state === "mostly") {
      return "Mostly ready";
    } else if (state === "reset") {
      return "Still opening to it";
    }
  };

  const enterUser = async (request) => {
    await enterOne({
      token: token,
      request: request,
      setEvent: setEvent,
      setLoading: setLoading,
    });
  };

  const deleteEventApproval = async (id) => {
    await deleteApproval({
      approvalId: usersData.find((i) => i.userId._id === id)._id,
      token: token,
      setEvent: setEvent,
      setLoading: setLoading,
    });
  };

  console.log(usersData);

  const handleApproveClick = async (userSelected) => {
    try {
      await approveOne({
        token: token,
        request: userSelected,
        setEvent: setEvent,
      });

      setRefreshEvents((prev) => prev + 1);
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const handleRejectClick = async (userSelected) => {
    try {
      await rejectOne({
        token: token,
        request: userSelected,
        setEvent: setEvent,
      });

      setRefreshEvents((prev) => prev + 1);
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  return (
		<div className="space-y-4">
			<div className="text-2xl font-bold">User Management</div>
			{users && users.length > 0 ? (
				<>
					<p className="text-gray-500">
						Review and manage user profiles and information
					</p>

					<div className="flex justify-between items-center">
						<div className="relative w-full max-w-md">
							<Input
								placeholder="Search users..."
								className="pl-3 pr-10 py-2"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="flex items-center gap-2"
								onClick={() => setShowFilterPanel(!showFilterPanel)}>
								<Filter className="h-4 w-4" />
								Filters
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center gap-2"
										disabled={selectedUsers.length === 0}>
										Bulk Actions
										<ChevronDown className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								{type === "request" && (
									<DropdownMenuContent>
										<DropdownMenuItem onClick={handleApproveAll}>
											Approve All
										</DropdownMenuItem>
										<DropdownMenuItem onClick={handleRejectAll}>
											Reject All
										</DropdownMenuItem>
									</DropdownMenuContent>
								)}

								{type === "approved" && (
									<DropdownMenuContent>
										<DropdownMenuItem onClick={handleApproveAll}>
											Delete All
										</DropdownMenuItem>
									</DropdownMenuContent>
								)}
							</DropdownMenu>
						</div>
					</div>

					{/* Filter Panel */}
					{showFilterPanel && (
						<div className="border rounded-md p-4 bg-gray-50">
							<div className="flex justify-between items-center mb-3">
								<h3 className="font-medium">Filter Users</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowFilterPanel(false)}>
									<X className="h-4 w-4" />
								</Button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="block text-sm font-medium mb-1">
										Field of Work
									</label>
									<select
										className="w-full p-2 border rounded-md"
										value={filters.fieldOfWork}
										onChange={(e) =>
											setFilters({ ...filters, fieldOfWork: e.target.value })
										}>
										<option value="">All Fields</option>
										{uniqueFields.map((field) => (
											<option key={field} value={field}>
												{field}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium mb-1">
										Status
									</label>
									<select
										className="w-full p-2 border rounded-md"
										value={filters.status}
										onChange={(e) =>
											setFilters({ ...filters, status: e.target.value })
										}>
										<option value="">All Statuses</option>
										{statusOptions.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className="flex justify-end gap-2 mt-4">
								<Button variant="outline" size="sm" onClick={clearAllFilters}>
									Clear All
								</Button>
								<Button size="sm" onClick={applyFilter}>
									Apply Filters
								</Button>
							</div>
						</div>
					)}

					{/* Applied Filters */}
					{appliedFilters.length > 0 && (
						<div className="flex flex-wrap gap-2 items-center">
							<span className="text-sm font-medium">Active filters:</span>
							{appliedFilters.map((filter, index) => (
								<div
									key={index}
									className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
									<span className="mr-1 font-medium">{filter.type}:</span>
									{filter.value}
									<button
										className="ml-2 text-gray-500 hover:text-gray-700"
										onClick={() => removeFilter(filter)}>
										<X className="h-3 w-3" />
									</button>
								</div>
							))}
							<button
								className="text-sm text-blue-600 hover:text-blue-800"
								onClick={clearAllFilters}>
								Clear all
							</button>
						</div>
					)}

					<div className="border rounded-md">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12">
										<input
											type="checkbox"
											className="rounded border-gray-300"
											checked={selectAll}
											onChange={(e) => {
												e.stopPropagation();
												handleSelectAll();
											}}
										/>
									</TableHead>
									<TableHead className="w-28">ID</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Field of Work</TableHead>
									{page === "event" && <TableHead>Readiness</TableHead>}
									{page === "user" && <TableHead>Event</TableHead>}
									{/* <TableHead>City</TableHead> */}
									<TableHead>Status</TableHead>
									<TableHead className="">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{/* {console.log(currentUsers)} */}
								{usersData &&
									usersData.length > 0 &&
									usersData.map((user) => (
										<TableRow
											// onClick={(e) => {
											//   e.stopPropagation();
											//   navigate(`/admin/users/${user._id}`);
											// }}
											key={user?._id}
											className={
												usersData.status === "approved"
													? "bg-green-50"
													: usersData.status === "rejected"
													? "bg-red-50"
													: ""
											}>
											<TableCell>
												<input
													type="checkbox"
													className="rounded border-gray-300"
													checked={selectedUsers.includes(
														usersData?.find((u) => u.userId._id === user._id)
															?._id
													)}
													onChange={(e) => {
														e.stopPropagation();
														handleSelectUser(user._id);
													}}
												/>
											</TableCell>
											<TableCell className="font-medium">
												<div className=" text-sm bg-gray-100 w-fit px-2 py-1">
													{user?._id?.slice(0, 4)}...
												</div>
											</TableCell>
											<TableCell>
												<div className="font-medium">{user.userId.name}</div>
												<div className="text-sm text-gray-500">
													{calculateAge(user.userId.dob)} years old
												</div>
											</TableCell>
											<TableCell>
												<div>{user.userId.journey}</div>
												<div className="text-sm text-gray-500">
													{/* {user.eventId.category} */}
												</div>
											</TableCell>
											{page === "event" && (
												<TableCell>
													<div>{getUserReady(user.ready)}</div>
													<div className="text-sm text-gray-500">
														{user.revenue}
														{/* {user.eventId.title} */}
													</div>
												</TableCell>
											)}
											{page === "user" && (
												<TableCell>
													<div>
														{user.eventId?.title}
														{
															usersData.find((i) => i.userId._id === user._id)
																?.eventId.title
														}
													</div>
												</TableCell>
											)}
											{/* <TableCell>
                      <div>{user.city}</div>
                    </TableCell> */}
											<TableCell>
												<div
													className={`rounded-full px-2 py-1 text-xs font-medium w-fit ${
														user.status === "accepted"
															? "bg-green-100 text-green-800"
															: user.status === "rejected"
															? "bg-red-100 text-red-800"
															: "bg-yellow-100 text-yellow-800"
													}`}>
													{user.status}
													{getUserStatus(user.allowed)}
												</div>
											</TableCell>
											{/* {title === "Requests" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApproveUser(user._id);
                              }}
                              disabled={user.status === "Approved"}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();  
                                handleRejectUser(user._id);
                              }}
                              disabled={user.status === "Rejected"}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      )} */}

											<TableCell className={"flex items-center"}>
												{loading ? (
													<div className="">
														<ClipLoader size={20} />
													</div>
												) : (
													<>
														<div
															onClick={() =>
																navigate(`/admin/users/${user.userId._id}`)
															}
															className="p-1 bg-gray-100 hover:bg-gray-200 w-fit">
															<Eye />
														</div>
														{type === "request" && (
															<>
																<div
																	// onClick={() =>
																	//   approveOne({
																	//     token: token,
																	//     request: user,
																	//     setEvent: setEvent,
																	//   }).then(() => {
																	//     // window.location.reload();
																	//     // dispatch(getRequests({ token }));
																	//     setRefreshEvents((prev) => prev + 1);
																	//   })
																	// }
																	onClick={() => handleApproveClick(user)}
																	className="p-1 bg-gray-100 hover:bg-gray-200 w-fit">
																	<Check />
																</div>
																<div
																	// onClick={() =>
																	//   rejectOne({
																	//     token: token,
																	//     request: user,
																	//     setEvent: setEvent,
																	//   }).then(() => {
																	//     setRefreshEvents((prev) => prev + 1);
																	//   })
																	// }
																	onClick={() => handleRejectClick(user)}
																	className="p-1 bg-gray-100 hover:bg-gray-200 w-fit">
																	<X />
																</div>
															</>
														)}
														{type === "approved" && (
															<div
																onClick={() => deleteEventApproval(user._id)}
																className="p-1 bg-gray-100 hover:bg-gray-200 w-fit">
																<Trash />
															</div>
														)}
														{type === "joined" && (
															<div
																onClick={() =>
																	enterUser(
																		usersData.find(
																			(p) =>
																				p.userId._id === user._id &&
																				p.status === "pending"
																		)
																	)
																}
																className="p-1 bg-gray-100 hover:bg-gray-200 w-fit mx-2 cursor-pointer font-medium">
																Enter
															</div>
														)}{" "}
													</>
												)}
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</div>

					<div className="flex items-center justify-between">
						<div className="text-sm text-gray-500">
							Showing {indexOfFirstUser + 1}-
							{Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
							{filteredUsers.length} users
						</div>
						<div className="flex gap-1">
							<Button
								variant="outline"
								size="icon"
								onClick={goToFirstPage}
								disabled={currentPage === 1}>
								<ChevronFirst className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={goToPreviousPage}
								disabled={currentPage === 1}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="flex items-center px-3 text-sm">
								{currentPage} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={goToNextPage}
								disabled={currentPage === totalPages}>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={goToLastPage}
								disabled={currentPage === totalPages}>
								<ChevronLast className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</>
			) : (
				<div>No users to display</div>
			)}
		</div>
	);
};

export default UserDataTable;
