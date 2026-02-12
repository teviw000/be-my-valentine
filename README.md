# Will You Be My Valentine?

A playful interactive web app built with React and Vite to ask one very
important question:

> **Will you be my valentines?**

------------------------------------------------------------------------

## Features

### Interactive Question Card

-   Displays a GIF
-   Asks the big question
-   The **"No"** button teleports away when hovered or approached

### After Clicking "Yes"

-   Background music starts automatically
-   A photo gallery appears
-   Image navigation controls unlock
-   A reset button restarts the experience

### Mobile-Friendly Audio

-   Uses the **Web Audio API**
-   Implements `AudioContext` + `GainNode`
-   Volume slider works on mobile (including iOS)

### Fully Responsive

-   Prevents horizontal overflow on mobile
-   Uses `aspect-ratio` + `object-fit` to prevent layout shifts
-   Media queries adjust spacing and typography
-   Optimized for small screens

------------------------------------------------------------------------

## Tech Stack

-   React
-   Vite
-   Web Audio API
-   GitHub Actions
-   GitHub Pages

------------------------------------------------------------------------

## Deployment

This project automatically deploys to GitHub Pages on every push to
`main` using GitHub Actions.

Live site:

    https://teviw000.github.io/be-my-valentine/

------------------------------------------------------------------------

## Local Development

Clone the repository:

``` bash
git clone https://github.com/teviw000/be-my-valentine.git
cd YOUR_REPO_NAME
npm install
npm run dev
```

Build for production:

``` bash
npm run build
```

Preview production build:

``` bash
npm run preview
``
