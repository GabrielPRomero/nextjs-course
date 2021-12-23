import { useRouter } from "next/router";
import { Fragment } from "react";
import { getEventById, getFeaturedEvents } from "../../helpers/api-util";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import ErrorAlert from "../../components/ui/error-alert";
import Head from "next/head";

export default function EventDetail({ event }) {
  const pageHead = (
    <Head>
      <title>{event.title}</title>
      <meta name="description" content={event.description} />
    </Head>
  );

  if (!event) {
    return (
      <Fragment>
        {pageHead}
        <div className="center">
          <p>Loading...</p>;
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {pageHead}
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const event = await getEventById(id);

  return {
    props: {
      event,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents();
  const paths = events.map((event) => ({ params: { id: event.id } }));

  return {
    paths,
    fallback: true,
  };
}
