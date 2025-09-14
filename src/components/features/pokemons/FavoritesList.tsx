import { useFavoritesStore } from "../../../store/useFavoritesStore";
import { PokemonCard } from "./PokemonCard";

interface FavoritesListProps {
    onSelectPokemon?: (pokemonUrl: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ onSelectPokemon }) => {
    const { favorites, removeFavorite } = useFavoritesStore();

    if (favorites.length === 0) {
        return <p className="text-gray-400 text-center italic mt-4" data-testid="no-favorites-message">Aún no tienes Pokémon favoritos.</p>;
    }

    const handleCardClick = (pokemonUrl: string) => {
        if (onSelectPokemon) {
            onSelectPokemon(pokemonUrl);
        }
    };

    return (
        <div className="space-y-4">
            {favorites.map(pokemon => (
                <div 
                    key={pokemon.id} 
                    data-testid={`favorite-${pokemon.name}`} 
                    className="relative cursor-pointer"
                    onClick={() => handleCardClick(pokemon.url)}
                >
                    <PokemonCard 
                        id={pokemon.id}
                        name={pokemon.name}
                        imageUrl={pokemon.imageUrl}
                        types={pokemon.types}
                    />
                    <div className="mt-2 text-center">
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Evita que el clic en el botón active el clic en la tarjeta
                                if (window.confirm(`¿Estás seguro que deseas quitar a ${pokemon.name} de tus favoritos?`)) {
                                    removeFavorite(pokemon.name);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                            aria-label={`Quitar ${pokemon.name} de favoritos`}
                        >
                            Quitar de favoritos
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}