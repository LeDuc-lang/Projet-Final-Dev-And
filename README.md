je fais un globe numérique a la cyber avec une barre de recherche et une animation a ma sauce donc je peux faire un espèce de mini google mais plutot sur des trucs spécifiques donc des infos sur les pays pour commencer.




---


# Projet Final - Journal de Reves

  

Application mobile (Expo + React Native) permettant d'enregistrer, modifier et consulter des entrees de reve.

  

## 1) Lancer l'application

  

### Prerequis

- Node.js 20+

- npm 10+

- Expo Go (Android/iOS) ou emulateur

  

### Installation

```bash

npm install

```

  

### Demarrage

```bash

npm run start

```

  

### Raccourcis utiles

- Android: `npm run android`

- iOS: `npm run ios`

- Web: `npm run web`

  

Si l'interface ne se met pas a jour correctement, vider le cache Expo:

```bash

npx expo start -c

```

  

## 2) Structure du projet et architecture

  

### Structure principale

- `app/`: routes Expo Router (navigation par fichiers)

- `app/(tabs)/Dreams.tsx`: formulaire de creation/modification de reve

- `app/(tabs)/two.tsx`: liste des reves, recherche et actions

- `components/DreamInputs.native.tsx`: composants de saisie reutilisables

- `constants/Colors.ts`: constantes de couleurs pour la navigation

- `assets/`: polices et icones

  

### Architecture (vue simple)

- **Presentation**: ecrans dans `app/` et composants UI dans `components/`

- **Etat local**: `useState`, `useEffect`, `useMemo`, `useFocusEffect`

- **Persistance**: `AsyncStorage` via la cle `@dreams:entries`

- **Navigation**: Expo Router avec onglets + route dynamique d'edition via parametre `editId`

  

## 3) Choix de conception et fonctionnalites implementees

  

### Choix de conception

- Composants de formulaire separes pour faciliter la maintenance (`DateTimeField`, `TagInput`, `ToneSelector`, etc.)

- Stockage local pour un usage hors-ligne simple

- Ecran liste separe de l'ecran saisie pour une meilleure lisibilite

- Theme visuel volontairement contraste (hero sombre + blocs formulaire clairs)

  

### Fonctionnalites implementees

- Creation d'une entree de reve

- Edition d'une entree existante (chargement par `editId`)

- Suppression d'une entree depuis la liste

- Recherche textuelle dans les entrees

- Donnees structurees: date, type, emotions, personnages, lieu, intensite, clarte, tags, qualite du sommeil, signification, tonalite

- Rafraichissement manuel de la liste (pull-to-refresh)

  

## 4) Captures d'ecran

  

Les captures sont a placer dans: `docs/screenshots/`

  

Captures recommandees:

1. `dream-form.png` - page de saisie (Dreams)

2. `dream-list.png` - page liste/recherche (My Dreams List)

3. `dream-edit.png` - mode edition d'une entree

  

Une fois les images ajoutees, decommenter/adapter cette section:

  

- La Dream Liste
![Dream List](docs/screenshots/Screenshot_20260322_211417_Expo%20Go.jpg)


- Le formulaire
![Formulaire](docs/screenshots/Screenshot_20260322_211409_Expo%20Go.jpg)
  

## 5) Nettoyage effectue

  

Les fichiers template Expo non utilises par le projet ont ete retires pour simplifier la base de code.