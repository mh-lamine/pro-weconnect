import { DateTime } from "luxon";

export function convertToMinutes(duration) {
  const [hours, minutes] = duration.split(":").map(Number);
  return hours * 60 + minutes;
}

export function convertToHhMm(minutes) {
  if (minutes < 60) {
    // Si la durée est inférieure à une heure, afficher en minutes.
    return `${minutes}mn`;
  } else {
    // Calculer les heures et les minutes.
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    // Formater les heures et les minutes pour avoir deux chiffres.
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(remainingMinutes).padStart(2, "0");

    // Retourner le format `hh:mm` avec les minutes même si elles sont `00`.
    return `${formattedHours}h${formattedMinutes}`;
  }
}

export function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function formatDate(date) {
  const formattedDate = DateTime.fromJSDate(date)
    .setLocale("fr")
    .toFormat("DDDD");

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
};

export function formatAvailabilitiesByDayOfWeek(data) {
  const groupedData = {};

  data.forEach((item) => {
    const { dayOfWeek, ...rest } = item;
    if (!groupedData[dayOfWeek]) {
      groupedData[dayOfWeek] = {};
    }
    groupedData[dayOfWeek] = { ...groupedData[dayOfWeek], ...rest };
  });

  return groupedData;
}