# ilogd21002

## Installation

Nous utilisons des dépendances NPM pour lancer le projet plus facilement en une ligne de commande.

Avec le script start, on lance un build continu sur le SCSS compilé en CSS, le TS compilé en JS et l'HTML pour le hot reload.

```
npm install
npm run start
```

## Sujet :

### Placement d'activités dans un planning

principe général

1. on sélectionne un créneau
2. on sélectionne une activité
   => l'activité est placée dans le créneau

1er cas
sélection d'un créneau libre => sélection automatique de la première activité non placée
=> l'activité apparaît dans le créneau
possibilité de sélectionner à la place une activité autre que celle sélectionnée automatiquement
si cette autre activité était placée dans un autre créneau, l'autre créneau devient libre
l'activité sélectionnée automatiquement redevient non placée

2ème cas
sélection d'un créneau occupé => sélection automatique de l'activité qui l'occupe
possibilité de sélectionner à la place une activité autre que celle qui l'occupe actuellement
si cette autre activité était placée dans un autre créneau (pas de message d'erreur) l'autre créneau devient libre
l'activité placée initialement redevient non placée

intervenant de l'activité

- parmi ceux de la liste des intervenants

salle de l'activité, choix entre :

- "?" signifie salle de TP/COURS par défaut selon le cas
- "" signifie salle virtuelle par défaut de l'intervenant
- sinon salle spécifiée

```
    IHM utilisant tippy.js et clipboard.js ;
    sauvegarde en json ;

1ère fonctionnalité placement interactif d'activités dans les créneaux d'un planning

    zones scrollables à gauche pour les créneaux, à droite pour les activités ;
    en bas dans une zone à onglets :
        fiches intervenants : nom  , prénom, email, initiales, lien zoom par défaut ;
        salles : nom, type d'activité qu'elle peut accueillir ;
        paramètres : durée par défaut des créneaux, salles par défaut par type d'activité ;
    un planning est composé de créneaux :
        vides au départ (pas d'activité) ;
        pouvant intégrer des contraintes de non disponibilités de salles ou d'intervenants ;
        pouvant être verrouillés pour un intervenant ;
    les activités :
        ne sont pas placées au départ ;
        ont des contraintes de précédence (affichage en fonction) ;
        font ou non référence à un intervenant ;
    clic sur un créneau =>
        si créneau vide : focus sur le première activité non encore placée (scrolling éventuel) ;
        sinon focus sur l'activité qu'il contient (scrolling éventuel) ;
    clic sur une activité =>
        si activité non placée : focus sur le premier créneau libre (scrolling éventuel) ;
        sinon focus sur le créneau qui la contient (scrolling éventuel) ;
    validation au cours de la saisie des contraintes

TODO

    Améliorer et étendre l'idée ;
    rédiger des tests unitaires ;
    implémenter.
```

## Questions :

- class parametre: comment elle s'applique selon le type d'activité ?
- Une activité = 1 durée par défaut ? D'ou vient la valeur ?
- sauvegarde bdd ?
- Donnée de créneaux et type d'activité à créer nous même ?
