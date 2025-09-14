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
        previousPage: goToPreviousPage,
        goToPage
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {data.pokemons.map(pokemon => (
                <div 
                    key={pokemon.id} 
                    data-testid={`pokemon-${pokemon.name}`} 
                    className="relative group cursor-pointer h-[320px]"
                    onClick={() => handleCardClick(pokemon.url)}
                >
                    <PokemonCard 
                        id={pokemon.id}
                        name={pokemon.name}
                        imageUrl={pokemon.imageUrl}
                        types={pokemon.types}
                    />
                    <div className="absolute bottom-[22px] left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
            
            {/* Controles de paginación mejorados */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 mb-4">
                <div className="text-sm text-gray-400">
                    Mostrando página {page} de {totalPages}
                </div>
                
                <div className="flex items-center flex-wrap justify-center gap-2">
                    {/* Botón Anterior */}
                    <button
                        onClick={goToPreviousPage}
                        disabled={!data.previousPage}
                        className={`px-3 py-2 rounded-md flex items-center ${
                            !data.previousPage ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
                        }`}
                        aria-label="Página anterior"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    
                    {/* Primera página */}
                    {page > 3 && (
                        <button
                            onClick={() => goToPage(1)}
                            className="w-9 h-9 rounded-md cursor-pointer bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center"
                        >
                            1
                        </button>
                    )}
                    
                    {/* Ellipsis para muchas páginas */}
                    {page > 4 && (
                        <span className="px-2 text-gray-400">...</span>
                    )}
                    
                    {/* Páginas numeradas dinámicas */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        // Calculamos qué páginas mostrar alrededor de la página actual
                        let pageNum;
                        if (page <= 3) {
                            // Si estamos en las primeras páginas
                            pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                            // Si estamos en las últimas páginas
                            pageNum = totalPages - 4 + i;
                        } else {
                            // Si estamos en páginas intermedias
                            pageNum = page - 2 + i;
                        }
                        
                        // Solo mostramos si el número está dentro del rango válido
                        if (pageNum > 0 && pageNum <= totalPages) {
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                                        page === pageNum 
                                            ? 'bg-teal-600 text-white font-medium' 
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                        return null;
                    })}
                    
                    {/* Ellipsis final */}
                    {page < totalPages - 3 && (
                        <span className="px-2 text-gray-400">...</span>
                    )}
                    
                    {/* Última página */}
                    {page < totalPages - 2 && totalPages > 3 && (
                        <button
                            onClick={() => goToPage(totalPages)}
                            className="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center cursor-pointer"
                        >
                            {totalPages}
                        </button>
                    )}
                    
                    {/* Botón Siguiente */}
                    <button
                        onClick={goToNextPage}
                        disabled={!data.nextPage}
                        className={`px-3 py-2 rounded-md flex items-center ${
                            !data.nextPage ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600 text-white cursor-pointer'
                        }`}
                        aria-label="Página siguiente"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};