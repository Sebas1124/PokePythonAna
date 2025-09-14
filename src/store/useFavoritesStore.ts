import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    url: string; // Original URL from the list
}

interface FavoritesState {
    favorites: Pokemon[];
    addFavorite: (pokemon: Pokemon) => void;
    removeFavorite: (pokemonName: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set) => ({
            favorites: [],
            addFavorite: (pokemon) => set((state) => {
                if (!state.favorites.find(p => p.name === pokemon.name)) {
                    return { favorites: [...state.favorites, pokemon] };
                }
                return state;
            }),
            removeFavorite: (pokemonName) => set((state) => ({
                favorites: state.favorites.filter((p) => p.name !== pokemonName),
            })),
        }),
        {
            name: 'pokemon-favorites-storage', // nombre del item en el almacenamiento local
        }
    )
);