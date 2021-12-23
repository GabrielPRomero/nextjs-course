import Link from "next/link";
import Button from "../ui/button";
import DateIcon from "../icons/date-icon";
import AddressIcon from "../icons/address-icon";
import ArrowRightIcon from "../icons/arrow-right-icon";
import classes from "./event-item.module.css";
import Image from "next/image";

export default function EventItem(props) {
  const { id, title, location, date, image } = props;
  const humanDate = new Date(date).toLocaleDateString("en-US");
  const formatLocation = location.replace(", ", "\n");

  return (
    <li className={classes.item}>
      <Image src={"/" + image} alt={title} width={250} height={160} />
      <div className={classes.content}>
        <div className={classes.summary}>
          <h2>{title}</h2>
          <div className={classes.date}>
            <DateIcon />
            <time>{humanDate}</time>
          </div>
          <div className={classes.address}>
            <AddressIcon />
            <address>{formatLocation}</address>
          </div>
        </div>
        <div className={classes.actions}>
          <Button link={`/events/${id}`}>
            <span>Explore Event</span>
            <span className={classes.icon}>
              <ArrowRightIcon />
            </span>
          </Button>
        </div>
      </div>
    </li>
  );
}
