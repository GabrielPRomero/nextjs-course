import EventList from "../components/events/event-list";
import { getFeaturedEvents } from "../helpers/api-util";
import Head from "next/head";

export default function HomePage({ events }) {
  return (
    <div>
      <Head>
        <title>Events</title>
        <meta name="description" content="Find events" />
      </Head>
      <EventList items={events} />
    </div>
  );
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();
  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  };
}
