import create from 'zustand';

// Function to load caughtPokemons from localStorage
const loadCaughtPokemons = () => {
  if (typeof window !== 'undefined') {
    const savedPokemons = localStorage.getItem('caughtPokemons');
    return savedPokemons ? JSON.parse(savedPokemons) : [];
  }
  return [];
};

const useStore = create((set) => ({
  caughtPokemons: [],
  addCaughtPokemon: (pokemon) =>
    set((state) => {
      const updatedCaughtPokemons = [...state.caughtPokemons, pokemon];
      localStorage.setItem('caughtPokemons', JSON.stringify(updatedCaughtPokemons));
      return { caughtPokemons: updatedCaughtPokemons };
    }),
  removeCaughtPokemon: (pokemonId) =>
    set((state) => {
      const updatedCaughtPokemons = state.caughtPokemons.filter(
        (pokemon) => pokemon.id !== pokemonId
      );
      localStorage.setItem('caughtPokemons', JSON.stringify(updatedCaughtPokemons));
      return { caughtPokemons: updatedCaughtPokemons };
    }),
}));

// Update caughtPokemons after the store is created
if (typeof window !== 'undefined') {
  useStore.setState({ caughtPokemons: loadCaughtPokemons() });
}

export default useStore;
