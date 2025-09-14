import { QueryClient } from "@tanstack/react-query";

export interface PokemonDetail {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: {
        type: {
            name: string;
            url: string;
        }
    }[];
    stats: {
        base_stat: number;
        stat: {
            name: string;
        }
    }[];
    abilities: {
        ability: {
            name: string;
        }
        is_hidden: boolean;
    }[];
    sprites: {
        other: {
            'official-artwork': {
                front_default: string;
            }
            'dream_world': {
                front_default: string;
            }
            'home': {
                front_default: string;
            }
        }
        front_default: string;
        back_default: string;
    };
    moves: {
        move: {
            name: string;
            url: string;
        }
    }[];
}

export interface PokemonSpecies {
    flavor_text_entries: {
        flavor_text: string;
        language: {
            name: string;
        }
    }[];
    habitat: {
        name: string;
    } | null;
    evolution_chain: {
        url: string;
    };
    genera: {
        genus: string;
        language: {
            name: string;
        }
    }[];
}

export interface EvolutionChain {
    chain: {
        species: {
            name: string;
            url: string;
        };
        evolves_to: {
            species: {
                name: string;
                url: string;
            };
            evolution_details: {
                min_level: number;
                item: {
                    name: string;
                } | null;
            }[];
            evolves_to: {
                species: {
                    name: string;
                    url: string;
                };
                evolution_details: {
                    min_level: number;
                    item: {
                        name: string;
                    } | null;
                }[];
            }[];
        }[];
    };
}

export interface PokemonTypeRelations {
    damage_relations: {
        double_damage_from: { name: string }[];
        half_damage_from: { name: string }[];
        no_damage_from: { name: string }[];
        double_damage_to: { name: string }[];
        half_damage_to: { name: string }[];
        no_damage_to: { name: string }[];
    };
}

export const fetchPokemonById = async (id: string): Promise<PokemonDetail> => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) throw new Error('Failed to fetch Pokemon details');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching Pokemon details: ${(error as Error).message}`);
    }
};

export const fetchPokemonSpecies = async (id: string): Promise<PokemonSpecies> => {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
        if (!response.ok) throw new Error('Failed to fetch Pokemon species');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching Pokemon species: ${(error as Error).message}`);
    }
};

export const fetchEvolutionChain = async (url: string): Promise<EvolutionChain> => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch evolution chain');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching evolution chain: ${(error as Error).message}`);
    }
};

export const fetchTypeWeaknesses = async (typeUrl: string): Promise<PokemonTypeRelations> => {
    try {
        const response = await fetch(typeUrl);
        if (!response.ok) throw new Error('Failed to fetch type relations');
        return await response.json();
    } catch (error) {
        throw new Error(`Error fetching type relations: ${(error as Error).message}`);
    }
};

// Función para prefetching de datos
export const prefetchPokemonData = async (
    queryClient: QueryClient,
    pokemonId: string
): Promise<void> => {
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: ['pokemon', pokemonId],
            queryFn: () => fetchPokemonById(pokemonId)
        }),
        queryClient.prefetchQuery({
            queryKey: ['species', pokemonId],
            queryFn: () => fetchPokemonSpecies(pokemonId)
        })
    ]);
};