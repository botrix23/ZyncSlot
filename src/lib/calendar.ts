/**
 * Utilidades para generación de enlaces de calendario (Sincronización externa)
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
}

function formatDate(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
}

export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const start = event.startTime.toISOString();
  const end = event.endTime.toISOString();
  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
}

export function generateICSFile(event: CalendarEvent): string {
  const start = formatDate(event.startTime);
  const end = formatDate(event.endTime);
  
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZyncSlot//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsData)}`;
}
