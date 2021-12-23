import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import useSWR from "swr";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import { getFilteredEvents } from "../../helpers/api-util";

export default function FilteredEvents(props) {
  const [events, setEvents] = useState();
  const router = useRouter();

  const filterData = router.query.slug;

  const { data, error } = useSWR(
    "https://next-project-dee63-default-rtdb.firebaseio.com/events.json",
    (url) =>
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          const transformedData = Object.keys(data).map((key) => {
            return {
              id: key,
              ...data[key],
            };
          });
          setEvents(transformedData);
          return data;
        })
  );

  const filteredYear = +filterData[0];
  const filteredMonth = +filterData[1];
  const date = new Date(filteredYear, filteredMonth - 1);

  const pageHead = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`All  events for ${date}`} />
    </Head>
  );

  if (!events || !data) {
    return (
      <Fragment>
        {pageHead}
        <p className="center">Loading...</p>
      </Fragment>
    );
  }

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2021 ||
    filteredMonth < 1 ||
    filteredMonth > 12 ||
    error
  ) {
    return (
      <Fragment>
        {pageHead}
        <ErrorAlert>
          <p className="center">Invalid Filter</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  let filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === filteredYear &&
      eventDate.getMonth() === filteredMonth - 1
    );
  });

  if (!filteredEvents || !filteredEvents.length) {
    return (
      <Fragment>
        {pageHead}
        <ErrorAlert>
          <p className="center">No events found</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      {pageHead}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const filteredYear = +filterData[0];
//   const filteredMonth = +filterData[1];

//   if (
//     isNaN(filteredYear) ||
//     isNaN(filteredMonth) ||
//     filteredYear > 2030 ||
//     filteredYear < 2021 ||
//     filteredMonth < 1 ||
//     filteredMonth > 12
//   ) {
//     return {
//       props: { hasError: true },
//       // notFound: true,
//       // could redirect to error page
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: filteredYear,
//     month: filteredMonth,
//   });

//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: filteredYear,
//         month: filteredMonth,
//       },
//     },
//   };
// }
