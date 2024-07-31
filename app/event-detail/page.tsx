import { fetchEventById } from "@/lib/actions/event.actions";
import React from "react";
import { Metadata } from "next";

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

// Function to generate metadata dynamically
export const generateMetadata = async ({
  searchParams,
}: URLProps): Promise<Metadata> => {
  const eventId = searchParams?.id;
  if (!eventId) {
    return {
      title: "Event",
    };
  }
  const eventAndFile = await fetchEventById(eventId);

  const event = eventAndFile?.Event?.[0];
  const file = eventAndFile?.File;

  if (!event) {
    return {
      title: "No Event Found",
    };
  }

  return {
    title: event.Event_Title,
    description: event.Description,
    openGraph: {
      title: event.Event_Title,
      description: event.Description,
      siteName: "Pure Heart Church",
      images: [
        {
          url: `https://my.pureheart.org/ministryplatformapi/files/${file.UniqueFileId}`,
          width: 800,
          height: 450,
          alt: event.Event_Title,
        },
      ],
    },
    icons: {
      icon: `https://my.pureheart.org/ministryplatformapi/files/${file.UniqueFileId}`,
    },
  };
};

const Page = async ({ searchParams }: URLProps) => {
  const eventId = searchParams?.id;

  if (eventId) {
    const eventAndFile = await fetchEventById(eventId);
    // console.log(eventAndFile);

    const url = `https://my.pureheart.org/ministryplatformapi/files/${eventAndFile?.File?.UniqueFileId}`;
    console.log(url);

    return (
      <>
        <div>Event Should linked to metadata.</div>
      </>
    );
  } else {
    return <div>Hey you forgot the event Id...</div>;
  }
};

export default Page;
