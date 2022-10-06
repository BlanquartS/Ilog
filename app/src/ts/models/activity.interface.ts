export default interface Activity {
  duration: string;
  kind: string; // TODO: Enum ?,
  label: string;
  link: string;
  teacher: string;
  timeslot?: number; // Index dans le tableau des créneaux
  location: string;
}
