# Pokémon Manager App
Welcome to the Pokémon Manager App! This application allows you to browse, catch, release, and view details of Pokémon using data fetched from the PokeAPI. You can also manage caught Pokémon which are stored locally.

## Features
- Browse and search Pokémon by name.
- Catch and release Pokémon.
- View detailed information and stats of each Pokémon.
- Pagination for browsing Pokémon and caught Pokémon.
- Modal for detailed Pokémon information.
- Success message notifications for catch and release actions.

## Technologies Used
- Next.js: React framework for building server-side rendered applications.
- React: JavaScript library for building user interfaces.
- Zustand: State management library for React.
- Tailwind CSS: Utility-first CSS framework used for styling.
- PokeAPI: RESTful API used for fetching Pokémon data.
- localStorage: HTML5 Web Storage used for storing caught Pokémon locally.

## Getting Started
Prerequisites
Make sure you have Node.js and npm (or yarn) installed on your development machine.

## Installation
1. Clone the repository:
```
Copy code
git clone <repository-url>
cd pokemon-manager-app
```

2. Install dependencies:

```
npm install
# or
yarn install
```

3. Start the development server:

```
npm run dev
# or
yarn dev
```

## Usage
- Enter a Pokémon name in the search bar to search for a specific Pokémon.
- Click on "Catch" to catch a Pokémon. Click on "Release" to release a caught Pokémon.
- Click on "Detail" to view detailed information about a Pokémon.
- Use pagination to navigate through the list of Pokémon and caught Pokémon.

## Local Storage
- Caught Pokémon are stored locally in the browser's localStorage. They persist across sessions.
- Clear browser data or use developer tools to inspect and manage stored data (localStorage).
## Deployment
Deploy the application to your preferred hosting service following Next.js deployment guidelines.