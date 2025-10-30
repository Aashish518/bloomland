"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventDetails from "@/components/admin/events/EventDetails";
import UsersTabs from "@/components/admin/events/UserTabs";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getEventById } from "@/services/event";
import { useState } from "react";
import UserTable from "../users/UserTable";
import UserDataTable from "./UserTable";
import AddAttendee from "./AddAttendee";

export default function EventTabs() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  console.log(event)
  useEffect(() => {
    const fetchEvent = async () => {
      const response = await getEventById(id);
      setEvent(response);
    };
    fetchEvent();
  }, [id]);

  return (
    <Tabs defaultValue="details" className="w-full mt-14 md:mt-0">
      <TabsList className="gap-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <EventDetails event={event} setEvent={setEvent} />
      </TabsContent>
      <TabsContent value="users" className={"relative"}>
        <div className="absolute top-1 right-1">
          <AddAttendee setEvent={setEvent} />
        </div>
        <Tabs defaultValue="requests" className="w-full mt-4">
          <TabsList className="gap-4">
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="entered">entered</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <UserDataTable
              usersData={event?.requests}
              type={"request"}
              setEvent={setEvent}
            />
          </TabsContent>
          <TabsContent value="approved">
            <UserDataTable
              usersData={event?.approved}
              type={"approved"}
              setEvent={setEvent}
            />
          </TabsContent>
          <TabsContent value="attendees">
            <UserDataTable
              usersData={event?.attendees}
              type={"joined"}
              setEvent={setEvent}
            />
          </TabsContent>

          <TabsContent value="entered">
            <UserDataTable
              usersData={event?.attendees.filter(
                (user) => user.status === "entered"
              )}
              type={"entered"}
              setEvent={setEvent}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>
    </Tabs>
  );
}
