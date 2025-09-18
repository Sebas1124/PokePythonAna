import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../components/hooks/usePokemonDetail';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { SpinnerComponent } from '../components/common';

// Extraer evoluciones
interface EvolutionInfo {
    name: string;
    url: string;
    level?: number;
    item?: string;
}

export const PokemonDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { pokemon, species, evolutionChain, typeRelations, isLoading, prefetchNextPokemon } = usePokemonDetail(id || '');
    const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

    // Estado para verificar si el Pokémon está en favoritos
    const isFavorite = favorites.some(p => p.id === Number(id));

    // Prefetch del siguiente Pokémon para navegación más rápida
    useEffect(() => {
        if (pokemon) {
            const nextId = String(pokemon.id + 1);
            prefetchNextPokemon(nextId);
        }
    }, [pokemon, prefetchNextPokemon]);

    // Manejar la adición/eliminación de favoritos
    const handleFavoriteToggle = () => {
        if (!pokemon) return;
        
        if (isFavorite) {
            if (window.confirm(`¿Estás seguro que deseas quitar a ${pokemon.name} de tus favoritos?`)) {
                removeFavorite(pokemon.name);
            }
        } else {
            addFavorite({
                id: pokemon.id,
                name: pokemon.name,
                imageUrl: pokemon.sprites.other['official-artwork'].front_default,
                types: pokemon.types.map(t => t.type.name),
                url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <SpinnerComponent />
            </div>
        );
    }

    if (!pokemon || !species) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center text-red-500">
                    <h2 className="text-2xl font-bold mb-4">¡Pokémon no encontrado!</h2>
                    <button 
                        onClick={() => navigate('/account')}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                    >
                        Volver a la Pokédex
                    </button>
                </div>
            </div>
        );
    }

    // Obtener la descripción en español
    const description = species.flavor_text_entries.find(entry => 
        entry.language.name === 'es'
    )?.flavor_text.replace(/\\f|\\n|\\r/g, ' ') || 
    species.flavor_text_entries[0]?.flavor_text.replace(/\\f|\\n|\\r/g, ' ') || 
    'No hay descripción disponible';

    // Calcular evoluciones de manera consistente
    const evolutions: EvolutionInfo[] = [];
    
    // Procesar evoluciones solo si tenemos datos
    if (evolutionChain?.chain) {
        const chain = evolutionChain.chain;
        // Primera forma
        evolutions.push({
            name: chain.species.name,
            url: chain.species.url
        });
        
        // Segunda forma (si existe)
        if (chain.evolves_to.length > 0) {
            chain.evolves_to.forEach(evo => {
                evolutions.push({
                    name: evo.species.name,
                    url: evo.species.url,
                    level: evo.evolution_details[0]?.min_level,
                    item: evo.evolution_details[0]?.item?.name
                });
                
                // Tercera forma (si existe)
                if (evo.evolves_to.length > 0) {
                    evo.evolves_to.forEach(finalEvo => {
                        evolutions.push({
                            name: finalEvo.species.name,
                            url: finalEvo.species.url,
                            level: finalEvo.evolution_details[0]?.min_level,
                            item: finalEvo.evolution_details[0]?.item?.name
                        });
                    });
                }
            });
        }
    }

    // Extraer las debilidades (tipos que hacen doble daño)
    const weaknesses = new Set<string>();
    typeRelations.forEach(relation => {
        relation.damage_relations.double_damage_from.forEach(type => {
            weaknesses.add(type.name);
        });
    });

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <button 
                    onClick={() => navigate('/account')}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center gap-2 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver a la Pokédex
                </button>
                
                <div className="flex gap-4">
                    {pokemon.id > 1 && (
                        <button 
                            onClick={() => navigate(`/pokemon/${pokemon.id - 1}`)}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 cursor-pointer"
                        >
                            ← Anterior
                        </button>
                    )}
                    <button 
                        onClick={() => navigate(`/pokemon/${pokemon.id + 1}`)}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 cursor-pointer"
                    >
                        Siguiente →
                    </button>
                </div>
            </div>

            {/* Cabecera del Pokémon */}
            <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl mb-8">
                <div className={`p-6 bg-gradient-to-r ${getTypeGradient(pokemon.types[0].type.name)}`}>
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
                        <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-4xl font-bold text-white capitalize" data-testid="pokemon-name">{pokemon.name}</h1>
                                <span className="text-xl text-white/70 font-mono">#{pokemon.id.toString().padStart(3, '0')}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {pokemon.types.map(typeInfo => (
                                    <span
                                        key={typeInfo.type.name}
                                        className={`inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 text-sm font-semibold text-white capitalize shadow-sm`}
                                    >
                                        {typeInfo.type.name}
                                    </span>
                                ))}
                            </div>
                            <p className="text-white/90 text-lg italic max-w-2xl mb-4">{description}</p>
                            <div className="flex gap-4 mt-2">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                    <p className="text-white/70 text-sm">Altura</p>
                                    <p className="text-white font-bold">{pokemon.height / 10} m</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                    <p className="text-white/70 text-sm">Peso</p>
                                    <p className="text-white font-bold">{pokemon.weight / 10} kg</p>
                                </div>
                                {species.habitat && (
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                                        <p className="text-white/70 text-sm">Hábitat</p>
                                        <p className="text-white font-bold capitalize">{species.habitat.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <img 
                                src={pokemon.sprites.other['official-artwork'].front_default} 
                                alt={pokemon.name}
                                className="w-64 h-64 object-contain drop-shadow-lg"
                            />
                            <button
                                onClick={handleFavoriteToggle}
                                className={`absolute top-0 right-0 p-2 rounded-full cursor-pointer ${
                                    isFavorite ? 'bg-red-600 text-white' : 'bg-white/20 text-white'
                                }`}
                                aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Estadísticas */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Estadísticas</h2>
                    <div className="space-y-4">
                        {pokemon.stats.map(stat => (
                            <div key={stat.stat.name} className="mb-2">
                                <div className="flex justify-between mb-1">
                                    <span className="text-white capitalize">
                                        {translateStatName(stat.stat.name)}
                                    </span>
                                    <span className="text-white">{stat.base_stat}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${getStatColor(stat.stat.name)}`} 
                                        style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Habilidades */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Habilidades</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {pokemon.abilities.map(ability => (
                            <div key={ability.ability.name} className="p-4 bg-gray-700 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-white font-semibold capitalize">{ability.ability.name.replace('-', ' ')}</h3>
                                    {ability.is_hidden && (
                                        <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">Oculta</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Debilidades */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Debilidades</h2>
                    <div className="flex flex-wrap gap-2">
                        {Array.from(weaknesses).map(type => (
                            <span
                                key={type}
                                className={`inline-block rounded-full px-4 py-2 text-sm font-semibold text-white capitalize shadow-sm`}
                                style={{ backgroundColor: getTypeColor(type) }}
                            >
                                {type}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Sprites adicionales */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Sprites</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {pokemon.sprites.front_default && (
                            <div className="bg-gray-700 rounded-lg p-2 flex flex-col items-center">
                                <img src={pokemon.sprites.front_default} alt={`${pokemon.name} front`} className="w-20 h-20" />
                                <span className="text-xs text-gray-400 mt-1">Frontal</span>
                            </div>
                        )}
                        {pokemon.sprites.back_default && (
                            <div className="bg-gray-700 rounded-lg p-2 flex flex-col items-center">
                                <img src={pokemon.sprites.back_default} alt={`${pokemon.name} back`} className="w-20 h-20" />
                                <span className="text-xs text-gray-400 mt-1">Trasero</span>
                            </div>
                        )}
                        {pokemon.sprites.other.dream_world.front_default && (
                            <div className="bg-gray-700 rounded-lg p-2 flex flex-col items-center">
                                <img src={pokemon.sprites.other.dream_world.front_default} alt={`${pokemon.name} dream world`} className="w-20 h-20" />
                                <span className="text-xs text-gray-400 mt-1">Dream World</span>
                            </div>
                        )}
                        {pokemon.sprites.other.home.front_default && (
                            <div className="bg-gray-700 rounded-lg p-2 flex flex-col items-center">
                                <img src={pokemon.sprites.other.home.front_default} alt={`${pokemon.name} home`} className="w-20 h-20" />
                                <span className="text-xs text-gray-400 mt-1">Home</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cadena de evolución */}
            {evolutions.length > 1 && (
                <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Cadena de evolución</h2>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4">
                        {evolutions.map((evo, index) => (
                            <React.Fragment key={evo.name}>
                                <div 
                                    className={`flex flex-col items-center p-4 rounded-lg ${
                                        pokemon.name === evo.name ? 'bg-teal-700/30 ring-2 ring-teal-500' : 'bg-gray-700/50'
                                    }`}
                                    onClick={() => {
                                        const pokemonId = evo.url.split('/').filter(Boolean).pop();
                                        if (pokemonId) navigate(`/pokemon/${pokemonId}`);
                                    }}
                                >
                                    <img 
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.url.split('/').filter(Boolean).pop()}.png`} 
                                        alt={evo.name}
                                        className="w-24 h-24 object-contain cursor-pointer" 
                                    />
                                    <p className="text-white capitalize mt-2">{evo.name}</p>
                                </div>
                                {index < evolutions.length - 1 && (
                                    <div className="flex flex-col items-center px-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 transform rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                        <span className="text-xs text-gray-400 mt-1">
                                            {evolutions[index + 1].level ? `Nivel ${evolutions[index + 1].level}` : 
                                             evolutions[index + 1].item ? `${evolutions[index + 1].item}` : 'Evolución'}
                                        </span>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            )}

            {/* Movimientos */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Movimientos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {pokemon.moves.slice(0, 20).map(moveInfo => (
                        <div key={moveInfo.move.name} className="p-2 bg-gray-700 rounded-lg">
                            <p className="text-white capitalize text-sm">{moveInfo.move.name.replace('-', ' ')}</p>
                        </div>
                    ))}
                    {pokemon.moves.length > 20 && (
                        <div className="p-2 bg-gray-700 rounded-lg">
                            <p className="text-white text-sm">+{pokemon.moves.length - 20} más</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Función para obtener el color de un tipo de Pokémon
function getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    return typeColors[type] || '#777777';
}

// Función para obtener gradiente según el tipo
function getTypeGradient(type: string): string {
    const typeGradients: Record<string, string> = {
        normal: 'from-gray-400 to-gray-500',
        fire: 'from-red-500 to-red-600',
        water: 'from-blue-500 to-blue-600',
        electric: 'from-yellow-400 to-yellow-500',
        grass: 'from-green-500 to-green-600',
        ice: 'from-cyan-300 to-cyan-400',
        fighting: 'from-orange-700 to-orange-800',
        poison: 'from-purple-500 to-purple-600',
        ground: 'from-amber-600 to-amber-700',
        flying: 'from-indigo-300 to-indigo-400',
        psychic: 'from-pink-600 to-pink-700',
        bug: 'from-lime-500 to-lime-600',
        rock: 'from-amber-700 to-amber-800',
        ghost: 'from-indigo-600 to-indigo-700',
        dragon: 'from-indigo-800 to-indigo-900',
        dark: 'from-gray-800 to-gray-900',
        steel: 'from-gray-500 to-gray-600',
        fairy: 'from-pink-400 to-pink-500',
    };

    return typeGradients[type] || 'from-slate-400 to-slate-500';
}

// Función para obtener color de barra según estadística
function getStatColor(statName: string): string {
    const statColors: Record<string, string> = {
        hp: 'bg-red-500',
        attack: 'bg-orange-500',
        defense: 'bg-yellow-500',
        'special-attack': 'bg-blue-500',
        'special-defense': 'bg-green-500',
        speed: 'bg-pink-500'
    };

    return statColors[statName] || 'bg-gray-500';
}

// Función para traducir nombres de estadísticas
function translateStatName(statName: string): string {
    const translations: Record<string, string> = {
        hp: 'PS',
        attack: 'Ataque',
        defense: 'Defensa',
        'special-attack': 'Ataque Especial',
        'special-defense': 'Defensa Especial',
        speed: 'Velocidad'
    };

    return translations[statName] || statName;
}