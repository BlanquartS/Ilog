import { MDCDataTable } from "@material/data-table";
import { MDCList } from "@material/list";
import { MDCRipple } from "@material/ripple";
import { MDCTabBar } from "@material/tab-bar";
import Teacher from "../../models/teacher.interface";
import ActivityHelper from "../../helpers/activity.helper";
import TimeslotHelper from "../../helpers/timeslot.helper";
import Activity from "../../models/activity.interface";
import Timeslot from "../../models/timeslot.interface";
import Parameters from "../../models/parameter.interface";
import { MDCSelect } from "@material/select";
import { MDCTextField } from "@material/textfield";
import { MDCRadio } from "@material/radio";

let referenceActivities: Activity[] = [];
let referenceTimeslots: Timeslot[] = [];
let referenceTeachers: Teacher[] = [];
let referenceParameters: Parameters = { room: "", labRoom: "", duration: "" };
let displayedActivities: Activity[] = [];
let displayedTimeslots: Timeslot[] = [];
let displayedTeachers: Teacher[] = [];
let displayedParameter: Parameters;

let selectedTimeslot: Timeslot;
let selectedActivity: Activity;
let selectedTeacher: Teacher;
let associatedActivity: Activity;

const timeslotSection = document.getElementById("timeslots-list")!;
const activtySection = document.getElementById("activity-list")!;
const teacherSelectSection = document.getElementById("teacher-select-options")!;

let resetButtonMDC: MDCRipple;
let activitiesMDC: MDCList;
let timeslotsMDC: MDCDataTable;
let tabBarMDC: MDCTabBar;
let selectorIntervenantMDC: MDCSelect;
let teacherInitialsMDC: MDCTextField;
let teacherNameMDC: MDCTextField;
let teacherFirstnameMDC: MDCTextField;
let teacherEmailMDC: MDCTextField;
let teacherLinkMDC: MDCTextField;
let sendAllButtonMDC: MDCRipple;
let radioSalleTPMDC: MDCRadio;
let radioSalleVirtuelleMDC: MDCRadio;
let autreSalleMDC: MDCTextField;
let laboSalleDefaut: MDCTextField;
let salleDefaut: MDCTextField;
let dureeDefaut: MDCTextField;

let contentEls = document.querySelectorAll(".content");

initMDComponents();
fetchData().then(() => {
  explicateData();
  populateDatatables();
  bindOnClickEvents();
});

/**
 * Chaque composant MDC a besoin d'être initialisé via un constructeur pour assurer son bon fonctionnement.
 * Le faire ici
 */
function initMDComponents(): void {
  resetButtonMDC = new MDCRipple(document.querySelector(".mdc-button")!);
  timeslotsMDC = new MDCDataTable(document.querySelector(".mdc-data-table")!);
  activitiesMDC = new MDCList(document.querySelector(".mdc-list")!);
  activitiesMDC.singleSelection = true;
  tabBarMDC = new MDCTabBar(document.querySelector(".mdc-tab-bar")!);
  tabBarMDC.listen("MDCTabBar:activated", function (event: any) {
    document
      .querySelector(".content--active")!
      .classList.remove("content--active");
    contentEls[event.detail.index].classList.add("content--active");
  });
  initTeacherComponents();
  initRoomComponents();
  initParameterComponents();
  sendAllButtonMDC = new MDCRipple(document.getElementById("send-all")!);
}

/**
 * TODO: Faire les appels REST ici.
 */
async function fetchData(): Promise<void> {
  return fetch("http://localhost:8081/getAll")
    .then((res) => res.json())
    .then((result) => {
      referenceActivities = result.activities;
      referenceTimeslots = result.timeslots;
      referenceParameters.labRoom = result.DEFAULT_LAB_ROOM;
      referenceParameters.room = result.DEFAULT_ROOM;
      referenceParameters.duration = result.DEFAULT_DURATION;
      Object.entries(result.teachers).forEach((teacher: any) =>
        referenceTeachers.push(teacher[1])
      );
      displayedActivities = [...referenceActivities];
      displayedTimeslots = [...referenceTimeslots];
      displayedTeachers = [...referenceTeachers];
      displayedParameter = referenceParameters;
    });
}

function explicateData(): void {
  ActivityHelper.correctActivities(displayedActivities);
  TimeslotHelper.correctTimeslots(displayedTimeslots);
}

function populateDatatables(): void {
  timeslotSection.innerHTML = displayedTimeslots
    .map((timeslot: Timeslot, index: number) => {
      return `${TimeslotHelper.toTableRowHTML(
        timeslot,
        displayedActivities,
        referenceParameters,
        referenceTeachers
      )}`;
    })
    .join("")
    .toString();

  activtySection.innerHTML = displayedActivities
    .map((activity: Activity, index: number) => {
      return `${ActivityHelper.toListRowHTML(activity, index)}`;
    })
    .join("")
    .toString();

  teacherSelectSection.innerHTML = displayedTeachers
    .map((teacher: Teacher) => {
      return `
      <li class="mdc-list-item" aria-selected="false" data-value="${teacher.initials}" role="option">
          <span class="mdc-list-item__ripple"></span>
          <span class="mdc-list-item__text"> ${teacher.name} ${teacher.firstName} </span>
      </li>`;
    })
    .join("")
    .toString();
  selectorIntervenantMDC = new MDCSelect(
    document.querySelector(".mdc-select")!
  );
  selectorIntervenantMDC.listen("MDCSelect:change", () => {
    selectedTeacher = displayedTeachers[selectorIntervenantMDC.selectedIndex];
    fillTeacherInfo();
  });
  fillParametersInfo();
}

function bindOnClickEvents(): void {
  resetButtonMDC.listen("click", () => {
    window.location.reload();
  });

  const listTimeslotRows: NodeListOf<Element> = document.querySelectorAll(
    ".mdc-data-table__row"
  );
  listTimeslotRows.forEach((timeslotRow: Element, timeslotIndex: number) =>
    onTimeslotRowClick(timeslotRow, timeslotIndex)
  );

  activitiesMDC.listElements.forEach(
    (activityRow: Element, activityIndex: number) => {
      onActivyRowClick(activityRow, activityIndex);
    }
  );

  sendAllButtonMDC.listen("click", () => {
    fetch("http://localhost:8081/setAll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
      body: JSON.stringify({
        DEFAULT_LAB_ROOM: displayedParameter.labRoom,
        DEFAULT_ROOM: displayedParameter.room,
        DEFAULT_DURATION: displayedParameter.duration,
        teachers: displayedTeachers,
        activities: displayedActivities,
        timeslots: displayedTimeslots,
      }),
    }).then(function (response) {
      // Get all elements with class="closebtn"
      var close = document.getElementsByClassName("msgAlert");
      close[0].parentElement!.classList.remove("inactive");
      close[0].parentElement!.classList.remove("active");
      close[0].parentElement!.classList.toggle("active");
      setTimeout(function () {
        close[0].parentElement!.classList.toggle("inactive");
      }, 1200);
    });
  });
}

function onTimeslotRowClick(timeslotRow: Element, timeslotIndex: number): void {
  timeslotRow.addEventListener("click", (event) => {
    // Enlever le surlignage pour passer au suivant
    if (selectedTimeslot !== undefined) {
      document
        .querySelector(".mdc-data-table__row--selected")
        ?.classList.remove("mdc-data-table__row--selected");
    }
    timeslotRow.classList.add("mdc-data-table__row--selected");

    // Selection du timeslot
    selectedTimeslot = displayedTimeslots[timeslotIndex];
    if (
      TimeslotHelper.hasAssociatedActivity(
        selectedTimeslot,
        displayedActivities
      )
    ) {
      // Il y a une activité associée
      associatedActivity = TimeslotHelper.getAssociatedActivity(
        selectedTimeslot,
        displayedActivities
      )!;
      selectedActivity = associatedActivity;
      activitiesMDC.selectedIndex = displayedActivities.findIndex(
        (act) => act === selectedActivity
      );
    } else {
      // pas d'activité associée, on selectionne la première libre
      if (ActivityHelper.hasNonPlacedActivity(displayedActivities)) {
        selectedActivity =
          ActivityHelper.getFirstNonPlacedActivity(displayedActivities)!;
        selectedActivity.timeslot = timeslotIndex;
        associatedActivity = selectedActivity;
        populateDatatables();
        bindOnClickEvents();
        fillTeacherInfo();
        document.getElementById(`timeslot-${timeslotIndex}`)?.click();
      }
    }
    fillRoomInfo();
  });
}

function onActivyRowClick(activityRow: Element, activityIndex: number) {
  activityRow.addEventListener("click", (event) => {
    selectedActivity = displayedActivities[activityIndex];
    if (associatedActivity) {
      associatedActivity.timeslot = undefined;
      selectedActivity.timeslot = selectedTimeslot.index;
      populateDatatables();
      bindOnClickEvents();
    } else {
      selectedTeacher = displayedTeachers.find(
        (teacher: Teacher) => teacher.initials === selectedActivity.teacher
      )!;
      if (selectedActivity.timeslot == undefined) {
        let freeTimeslot: Timeslot | undefined =
          TimeslotHelper.findFirstFreeTimeslot(
            displayedTimeslots,
            displayedActivities
          );
        if (freeTimeslot) {
          selectedTimeslot = freeTimeslot;
          selectedActivity.timeslot = selectedTimeslot.index;
          populateDatatables();
          bindOnClickEvents();
        }
      }
    }
    selectedTimeslot =
      displayedTimeslots[
        selectedActivity.timeslot != undefined ? selectedActivity.timeslot : -1
      ];
    document.getElementById(`timeslot-${selectedTimeslot.index}`)?.click();
    fillTeacherInfo();
    fillRoomInfo();
  });
}

function fillTeacherInfo() {
  if (
    !selectedTeacher ||
    selectedTeacher !== displayedTeachers[selectorIntervenantMDC.selectedIndex]
  ) {
    selectorIntervenantMDC.selectedIndex = displayedTeachers.findIndex(
      (teacher: Teacher) => teacher.initials === selectedActivity?.teacher
    );
  }
  teacherInitialsMDC.value = selectedTeacher?.initials || "";
  teacherNameMDC.value = selectedTeacher?.name || "";
  teacherFirstnameMDC.value = selectedTeacher?.firstName || "";
  teacherEmailMDC.value = selectedTeacher?.email || "";
  teacherLinkMDC.value = selectedTeacher?.link || "";
}

function initTeacherComponents() {
  teacherInitialsMDC = new MDCTextField(
    document.getElementById("teacher-initials")!
  );
  teacherNameMDC = new MDCTextField(document.getElementById("teacher-name")!);
  teacherFirstnameMDC = new MDCTextField(
    document.getElementById("teacher-firstname")!
  );
  teacherEmailMDC = new MDCTextField(document.getElementById("teacher-email")!);
  teacherLinkMDC = new MDCTextField(document.getElementById("teacher-link")!);

  teacherInitialsMDC.listen(
    "keyup",
    () => (selectedTeacher.initials = teacherInitialsMDC.value)
  );
  teacherNameMDC.listen(
    "keyup",
    () => (selectedTeacher.name = teacherNameMDC.value)
  );
  teacherFirstnameMDC.listen(
    "keyup",
    () => (selectedTeacher.firstName = teacherFirstnameMDC.value)
  );
  teacherEmailMDC.listen(
    "keyup",
    () => (selectedTeacher.email = teacherEmailMDC.value)
  );
  teacherLinkMDC.listen(
    "keyup",
    () => (selectedTeacher.link = teacherLinkMDC.value)
  );
}

function initRoomComponents() {
  radioSalleTPMDC = new MDCRadio(document.getElementById("salle-defaut")!);
  radioSalleTPMDC.listen("click", () => {
    selectedActivity.location = "?";
  });

  radioSalleVirtuelleMDC = new MDCRadio(
    document.getElementById("salle-virtuelle")!
  );
  radioSalleVirtuelleMDC.listen(
    "click",
    () => (selectedActivity.location = "")
  );

  autreSalleMDC = new MDCTextField(document.getElementById("autre-salle")!);
  autreSalleMDC.listen("click", () => {
    radioSalleTPMDC.checked = false;
    radioSalleVirtuelleMDC.checked = false;
  });
  autreSalleMDC.listen(
    "keyup",
    () => (selectedActivity.location = autreSalleMDC.value)
  );
}

function fillRoomInfo() {
  switch (selectedActivity.location) {
    case "?":
      radioSalleTPMDC.checked = true;
      radioSalleVirtuelleMDC.checked = false;
      autreSalleMDC.value = "";
      break;
    case "":
      radioSalleTPMDC.checked = false;
      radioSalleVirtuelleMDC.checked = true;
      autreSalleMDC.value = "";
      break;
    default:
      radioSalleTPMDC.checked = false;
      radioSalleVirtuelleMDC.checked = false;
      autreSalleMDC.value = selectedActivity.location;
      break;
  }
}
function initParameterComponents() {
  salleDefaut = new MDCTextField(
    document.getElementById("salleParameter-defaut")!
  );
  laboSalleDefaut = new MDCTextField(
    document.getElementById("laboParameter-defaut")!
  );
  dureeDefaut = new MDCTextField(
    document.getElementById("dureeParameter-defaut")!
  );

  salleDefaut.listen(
    "keyup",
    () => (displayedParameter.room = salleDefaut.value)
  );
  laboSalleDefaut.listen(
    "keyup",
    () => (displayedParameter.labRoom = laboSalleDefaut.value)
  );
  dureeDefaut.listen(
    "keyup",
    () => (displayedParameter.duration = dureeDefaut.value)
  );
}

function fillParametersInfo() {
  salleDefaut.value = referenceParameters.room;
  laboSalleDefaut.value = referenceParameters.labRoom;
  dureeDefaut.value = referenceParameters.duration;
}

function selectTimeslot(index: number) {
  selectedTimeslot = displayedTimeslots[index];
}
