import { fetchEventById } from '@/lib/actions/event.actions'
import React from 'react'
import type { Metadata } from "next";

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

export const metadata: Metadata = {
  title: "Home | DevFlow",
};

const page = async ({searchParams}: URLProps) => {
  const eventId = searchParams?.id;

  if (eventId) {
    const eventAndFile = await fetchEventById(eventId)
    // console.log(event)
  } else {
    return (
      <div>
        Hey you forgot the event Id...
      </div>
    )
  }
  return (
    <div>Event Should be in console log.</div>
  )
}

export default page