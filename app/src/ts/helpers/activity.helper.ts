import Activity from "../models/activity.interface";
import Timeslot from "../models/timeslot.interface";

export default class ActivityHelper {
  public static correctActivities(listActivities: Activity[]): void {
    let currentTimeslotIndex: number = 0;
    listActivities.forEach((activity: Activity) => {
      // On s'interesse au champs timeslot de l'activité, plusieurs valide possible
      // nombre positif => l'activité est associée au créneau dont l'indice dans le tableau des timeslots est le nombre positif
      // nombre négatif => l'activité est associée au créneau dont l'indice est le dernier indice positif connu plus la valeur absolue du nombre négatif
      // ex:  2 => 2ème élement du tableau
      //      2, -1 => 2ème element du tableau des timeslots, puis le troisième
      if (activity.timeslot) {
        if (activity.timeslot >= 0) {
          currentTimeslotIndex = activity.timeslot;
        } else {
          const timeslotIndexOffset: number = activity.timeslot * -1;
          currentTimeslotIndex += timeslotIndexOffset;
          activity.timeslot = currentTimeslotIndex;
        }
      }
    });
  }

  /**
   * Génère le contenu HTML de la table de planning pour la colonne Lieu
   *  Si on est en télégroupe, un lien se créé,
   *  Sinon, la salle d'affiche
   * @param timeslot
   */
  public static locationToHTML(activity: Activity | undefined, salleDefaut: string | undefined, salleDefautEnseignant: string | undefined) {
    if (activity) {
      if (activity.location) {
        if (activity.location === "?") {
          return salleDefaut;
        } else if (activity.location.includes("imt-lille-douai.zoom.us")) {
          return `<a href=${activity.location}>Zoom</a>`;
        }
        return activity.location;
      } else {
        // salle par défaut de l'enseignant
        return `<a href=${salleDefautEnseignant}>Zoom</a>`;
      }
    }
    return "";
  }

  public static toString(activity: Activity): string {
    return `${activity.label} : ${activity.kind}`;
  }

  public static toListRowHTML(activity: Activity, index: number): string {
    return `
      <li id="${"activity-" + index}" class="mdc-list-item ${
      activity.timeslot != undefined ? "placed-activity" : ""
    }" tabindex="${index}">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">${activity.label} (#${
      activity.timeslot != undefined ? activity.timeslot : "NP"
    })</span>
      </li>`;
  }

  public static getAssociatedActivityIndex(
    activities: Activity[],
    timeslotIndex: number | undefined
  ): number {
    return activities.findIndex((act) => act.timeslot === timeslotIndex);
  }

  public static hasNonPlacedActivity(activities: Activity[]): boolean {
    return activities.find((act) => act.timeslot == undefined) !== undefined;
  }

  public static getFirstNonPlacedActivity(
    activities: Activity[]
  ): Activity | undefined {
    return activities.find((act) => act.timeslot == undefined);
  }

  public static swapActivies(
    timeslots: Timeslot[],
    activities: Activity[],
    selectedTimeslotIndex: number,
    newActivityIndex: number
  ): Activity[] {
    /**
     * on regarde si le timeslot est déjà prit
     * Si oui, on doit échanger avec l'autre
     */
    const activityIndex = ActivityHelper.getAssociatedActivityIndex(
      activities,
      selectedTimeslotIndex
    );
    if (activityIndex !== -1) {
      console.log(
        `Nous avons déjà choisi l'activité ${activities[activityIndex].label} pour le créneau ${selectedTimeslotIndex} et devons placer ${activities[newActivityIndex].label} à la place`
      );
      activities[newActivityIndex].timeslot = selectedTimeslotIndex;
      activities[activityIndex].timeslot = undefined;
    }

    return activities;
  }
}
