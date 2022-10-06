export default interface Timeslot {
  index?: number;
  date?: number; // Jour
  month?: number;
  year?: number;
  start?: string; // HH:mm
  fullDate?: Date;
}
