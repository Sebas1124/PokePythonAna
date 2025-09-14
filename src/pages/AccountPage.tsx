import { FavoritesList, PokemonList, SearchPokemon } from "../components/features/pokemons";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AccountPage = () => {
    const { user, signOut } = useAuthStore();
    const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
    const navigate = useNavigate();

    const toggleFavorites = () => {
        setIsFavoritesOpen(!isFavoritesOpen);
    };

    const handleSelectPokemon = (pokemonUrl: string) => {
        const pokemonId = pokemonUrl.split('/').filter(Boolean).pop();
        if (pokemonId) {
            navigate(`/pokemon/${pokemonId}`);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 position-relative">

            <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center pointer-events-none z-0">
                <img 
                    alt="Pokeball"
                    className="w-150 h-150 opacity-20 animate-spin-slow"
                    src={"https://pokemon-cards-ochre.vercel.app/assets/pokeball-b6a417de.webp"}
                    style={{
                        animation: "spin 8s linear infinite"
                    }}
                />
            </div>

            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                     <h1 data-testid="welcome-heading" className="text-2xl font-bold text-teal-400">Pokédex</h1>
                     <p className="text-gray-400 text-sm">Sesión iniciada como: {user?.email}</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleFavorites}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center gap-2"
                    >
                        <span>Favoritos</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        data-testid="logout-button"
                        onClick={signOut}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <div className="mb-8">
                <SearchPokemon onSelectPokemon={handleSelectPokemon} />
            </div>

            <main className="relative z-8">
                <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Lista de Pokémon</h2>
                <PokemonList />
            </main>

            {/* Favorites Drawer */}
            <div 
                className={`fixed inset-y-0 right-0 w-80 bg-gray-800 shadow-xl transform ${
                    isFavoritesOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out z-50`}
            >
                <div className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                        <h2 className="text-xl font-semibold">Mis Favoritos</h2>
                        <button 
                            onClick={toggleFavorites}
                            className="text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        <FavoritesList onSelectPokemon={handleSelectPokemon} />
                    </div>
                </div>
            </div>

            {/* Overlay when drawer is open */}
            {isFavoritesOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm z-40"
                    onClick={toggleFavorites}
                ></div>
            )}
        </div>
    );
};