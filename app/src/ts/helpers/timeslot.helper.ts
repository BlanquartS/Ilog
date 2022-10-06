import Activity from '../models/activity.interface';
import Timeslot from '../models/timeslot.interface';
import Parameters from "../models/parameter.interface";
import ActivityHelper from './activity.helper';
import Teacher from '../models/teacher.interface';

export default class TimeslotHelper {
  /**
   * Met à jour l'objet timeslot pour le remplir avec la totalité de l'information
   * @param timeslot le créneau à expliciter
   * @param day la date du jour (1-31)
   * @param month le mois
   * @param year l'année
   * @param startHour l'heure de demarrage du cours
   */
  public static update(timeslot: Timeslot, day: number, month: number, year: number, startHour: string): void {
    timeslot.date = day;
    timeslot.month = month;
    timeslot.year = year;
    timeslot.start = startHour;
    timeslot.fullDate = new Date([month, day, year].join('/'));
  }

  /**
   * Vient reremplir les données manquantes en fonction des données précedantes pour normaliser le format et le rendre compréhensible
   * @param timeslotList le tableau des timeslots à normaliser
   */
  public static correctTimeslots(timeslotList: Timeslot[]): void {
    let day: number = 0; // day = le jour entre 1 et 31 du mois
    let month: number = 0;
    let year: number = 0;
    let startHour: string = '';

    timeslotList.forEach((timeslot: Timeslot, index: number) => {
      timeslot.index = index;
      day = timeslot.date || day;
      month = timeslot.month || month;
      year = timeslot.year || year;
      startHour = timeslot.start || startHour;
      this.update(timeslot, day, month, year, startHour);
    });
  }

  public static toString(timeslot: Timeslot, activities: Activity[]): string {
    const stringSplitted: Array<string | number | undefined> = [
      timeslot.index,
      this.dayNameCapitalized(timeslot),
      [timeslot.date, timeslot.month, timeslot.year].join('/'),
      timeslot.start,
      timeslot.start,
    ];

    const associatedActivity: Activity | undefined = activities.find((act) => act.timeslot === timeslot.index);
    if (associatedActivity) {
      stringSplitted.push(associatedActivity.label);
    }

    return stringSplitted.join('\t | ');
  }

  public static calculTimeSlotEnd(timeSlot: Timeslot, duration: string) :string{
    if(timeSlot.start!=undefined){ 
      //console.log(timeSlot.start);
      var heureDebut:string =timeSlot.start!;
      var totalInMinutes :number = (parseInt(heureDebut.split(":")[0]) * 60) + parseInt(heureDebut.split(":")[1]);
      var grandTotal :number = parseInt(duration) + totalInMinutes;
      var timeslotH :number = Math.floor(grandTotal / 60);
      var timeslotM :number = grandTotal % 60;
      var timeSlotMString :string=timeslotM.toString();
      if(timeslotM==0){
        timeSlotMString="00";
      }
      return timeslotH + ':' + timeSlotMString;
    }
    return "";
  }

  public static toTableRowHTML(timeslot: Timeslot, activities: Activity[], parameters: Parameters, teachers : Teacher[]): string {
    const associatedActivity: Activity | undefined = activities.find((act) => act.timeslot === timeslot.index);
    const teacher : Teacher | undefined  = teachers.find((teacher)=> teacher.initials=== associatedActivity?.teacher)
    return `
    <tr id=${'timeslot-'.concat(timeslot.index!.toString())} class="mdc-data-table__row">
      <th class="mdc-data-table__cell mdc-data-table__cell--numeric timeslot-index" scope="row">${timeslot.index}</th>
      <td class="mdc-data-table__cell">${this.dayNameCapitalized(timeslot)}</td>
      <td class="mdc-data-table__cell">${[
        this.normalizeDayOrMonth(timeslot.date),
        this.normalizeDayOrMonth(timeslot.month),
        timeslot.year,
      ].join('/')}</td>
      <td class="mdc-data-table__cell">${timeslot.start}</td>
      <td class="mdc-data-table__cell">${TimeslotHelper.calculTimeSlotEnd(timeslot,parameters.duration)}</td>
      <td class="mdc-data-table__cell">${associatedActivity ? associatedActivity.kind : ''}</td>
      <td class="mdc-data-table__cell">${associatedActivity ? associatedActivity.label : ''}</td>
      <td class="mdc-data-table__cell">${associatedActivity ? associatedActivity.teacher : ''}</td>
      <td class="mdc-data-table__cell">${ActivityHelper.locationToHTML(associatedActivity,parameters.room,teacher?.link)}</td>
    </tr>
    `;
  }

  private static dayNameCapitalized(timeslot: Timeslot): string {
    const dayName = timeslot.fullDate?.toLocaleDateString('fr-FR', {
      weekday: 'long',
    });
    return `${dayName?.charAt(0).toUpperCase()}${dayName?.slice(1)}`;
  }

  private static normalizeDayOrMonth(rank: number | undefined): string {
    if (rank) {
      return rank < 10 ? `0${rank}` : rank.toString();
    } else return '';
  }

  public static hasAssociatedActivity(timeslot: Timeslot, activities: Activity[]): boolean {
    return activities.findIndex((act) => act.timeslot === timeslot.index) !== -1;
  }

  public static getAssociatedActivity(timeslot: Timeslot, activities: Activity[]): Activity | undefined {
    return activities.find((act) => act.timeslot === timeslot.index);
  }

  public static findFirstFreeTimeslot(timeslots: Timeslot[], activities: Activity[]) : Timeslot | undefined{
    const occupiedTimeslotsIndices: number[] = activities.flatMap(activity => activity.timeslot != undefined ? activity.timeslot : -1);
 
    return timeslots.find(timeslot => {
      if(timeslot.index && !occupiedTimeslotsIndices.includes(timeslot.index)){
        return timeslot;
      }
    });
  }
}
