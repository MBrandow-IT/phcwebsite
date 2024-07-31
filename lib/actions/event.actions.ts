"use server";

import { request } from "../auth";

export const fetchEventById = async (eventId: string) => {
  try {
    if (eventId) {
      const event = await request(
        "GET",
        `/tables/Events`,
        {
          $select: "Events.Event_Title, Events.Description",
          $filter: `Events.Event_ID=${eventId}`,
        },
        {}
      );
      if (event) {
        const files = await request("GET", `/files/events/${eventId}`, {}, {});
        const file = files.find((f: any) => f.IsDefaultImage === true);
        // console.log("Event", event, "File", file);
        return { Event: event, File: file };
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
