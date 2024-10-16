// import { getLoggedInUserTimezone } from "./getLoggedInUserTimezone.jsx";

export const convertToLocalTime = (utcDate) => {
  // const timezone = await getLoggedInUserTimezone();
  const timezone = localStorage.getItem("user-timezone");
  // Convert the UTC date to the user's local time
  const date = new Date(utcDate);
  if (timezone || timezone !== null) {
    const localDate = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
    console.log("localDate :", localDate);
    return localDate;
  } else if (timezone === null) {
    return utcDate;
  }
};
