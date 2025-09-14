import { useFavoritesStore } from "../../../store/useFavoritesStore";
import { SpinnerComponent } from "../../common";
import { usePokemons } from "../../hooks/usePokemons";
import { PokemonCard } from "./PokemonCard";

interface PokemonListProps {
    onSelectPokemon?: (pokemonUrl: string) => void;
}

export const PokemonList: React.FC<PokemonListProps> = ({ onSelectPokemon }) => {
    const { 
        data, 
        error, 
        isLoading, 
        page, 
        nextPage: goToNextPage, 
        previousPage: goToPreviousPage 
    } = usePokemons();
    const { favorites, addFavorite } = useFavoritesStore();

    if (isLoading && !data) return <div className="flex justify-center p-10"><SpinnerComponent /></div>;
    if (error) return <div className="text-red-400 text-center p-4">Error: {error.message}</div>;

    const isFavorite = (pokemonName: string) => favorites.some(p => p.name === pokemonName);

    const handleCardClick = (pokemonUrl: string) => {
        if (onSelectPokemon) {
            onSelectPokemon(pokemonUrl);
        }
    };

    // Si no tenemos datos, mostramos un mensaje
    if (!data || !data.pokemons || data.pokemons.length === 0) {
        return <div className="text-center p-4">No se encontraron Pokémon</div>;
    }

    // Calcular el número total de páginas
    const totalPages = Math.ceil(data.totalCount / 20); // Asumiendo 20 por página

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {data.pokemons.map(pokemon => (
                <div 
                    key={pokemon.id} 
                    data-testid={`pokemon-${pokemon.name}`} 
                    className="relative group cursor-pointer"
                    onClick={() => handleCardClick(pokemon.url)}
                >
                    <PokemonCard 
                        id={pokemon.id}
                        name={pokemon.name}
                        imageUrl={pokemon.imageUrl}
                        types={pokemon.types}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Evita que el clic en el botón active el clic en la tarjeta
                            addFavorite(pokemon);
                        }}
                        disabled={isFavorite(pokemon.name)}
                        className="w-full text-sm bg-teal-600/90 backdrop-blur-sm hover:bg-teal-700/90 disabled:bg-gray-500/80 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        {isFavorite(pokemon.name) ? 'Añadido a Favoritos' : 'Añadir a Favoritos'}
                    </button>
                    </div>
                </div>
                ))}
            </div>
            
            {/* Controles de paginación */}
            <div className="flex justify-between items-center mt-8 mb-4">
                <div className="text-sm text-gray-400">
                    Mostrando página {page} de {totalPages}
                </div>
                
                <div className="flex space-x-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={!data.previousPage}
                        className={`px-4 py-2 rounded-md ${
                            !data.previousPage ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                    >
                        Anterior
                    </button>
                    
                    <button
                        onClick={goToNextPage}
                        disabled={!data.nextPage}
                        className={`px-4 py-2 rounded-md ${
                            !data.nextPage ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};