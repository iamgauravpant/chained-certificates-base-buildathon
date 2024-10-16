export const getLoggedInUserTimezone = async () => {
  try {
    const response = await fetch(
      `https://ipinfo.io?token=${import.meta.env.VITE_IP_INFO_ACCESS_TOKEN}`
    );
    const data = await response.json();
    console.log(data);
    localStorage.setItem("user-timezone", data.timezone);
    return data.timezone;
  } catch (error) {
    console.error("Error fetching user country:", error);
    localStorage.setItem("user-timezone", null);
    return null; // Return null in case of error
  }
};
