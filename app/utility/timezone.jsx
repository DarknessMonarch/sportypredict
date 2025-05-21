import { DateTime } from "luxon";

export function convertToEATTime(inputValue) {
  if (!inputValue) return '';
  
  try {
    if (inputValue.includes('T')) {
      return DateTime.fromISO(inputValue)
        .setZone("Africa/Nairobi") // EAT timezone
        .toISO();
    }
    
    // Handle "2.00" format (hours.minutes)
    if (inputValue.includes('.')) {
      const [hours, minutes] = inputValue.split('.');
      const time = DateTime.local()
        .set({
          hour: parseInt(hours, 10),
          minute: parseInt(minutes, 10) || 0,
          second: 0,
          millisecond: 0
        })
        .setZone("Africa/Nairobi"); 
      
      return time.toISO();
    }
    
    return DateTime.fromISO(inputValue)
      .setZone("Africa/Nairobi")
      .toISO();
  } catch (e) {
    console.error("Error converting to EAT time:", e);
    return '';
  }
}


export function formatTimeForDisplay(isoString, format = "HH:mm") {
  if (!isoString) return '';
  
  try {
    // Parse the ISO string and convert to user's local timezone
    return DateTime.fromISO(isoString)
      .setZone(DateTime.local().zoneName)
      .toFormat(format);
  } catch (e) {
    console.error("Error formatting time for display:", e);
    return '';
  }
}


export function formatTimeForInput(isoString) {
  if (!isoString) return '';
  
  try {
    return DateTime.fromISO(isoString)
      .setZone(DateTime.local().zoneName)
      .toFormat("yyyy-MM-dd'T'HH:mm");
  } catch (e) {
    console.error("Error formatting time for input:", e);
    return '';
  }
}