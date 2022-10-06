// import tippy from 'tippy.js';

// tippy('#salleBtn', {
//   content: "I'm a Tippy tooltip!",
// });

// const intervenantBtn: HTMLButtonElement = document.getElementById('intervenantBtn') as HTMLButtonElement;
// const salleBtn: HTMLButtonElement = document.getElementById('salleBtn') as HTMLButtonElement;
// const paramBtn: HTMLButtonElement = document.getElementById('paramBtn') as HTMLButtonElement;

// let intervenantForm = document.getElementById('intervenantForm');
// let salleForm = document.getElementById('salleForm');
// let paramForm = document.getElementById('paramForm');

// intervenantBtn.addEventListener('click', () => displayForm('intervenant'));
// salleBtn.addEventListener('click', () => displayForm('salle'));
// paramBtn.addEventListener('click', () => displayForm('parametres'));

// function displayForm(form: string): void {
//   intervenantForm?.classList.remove('hidden');
//   salleForm?.classList.remove('hidden');
//   paramForm?.classList.remove('hidden');
//   switch (form) {
//     case 'intervenant':
//       salleForm?.classList.add('hidden');
//       paramForm?.classList.add('hidden');
//       break;
//     case 'salle':
//       intervenantForm?.classList.add('hidden');
//       paramForm?.classList.add('hidden');
//       break;
//     case 'parametres':
//       intervenantForm?.classList.add('hidden');
//       salleForm?.classList.add('hidden');
//       break;
//     default:
//       break;
//   }
// }
