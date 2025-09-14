import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    fetchPokemonById, 
    fetchPokemonSpecies, 
    fetchEvolutionChain,
    fetchTypeWeaknesses,
    prefetchPokemonData,
    type PokemonDetail,
    type PokemonSpecies,
    type EvolutionChain,
    type PokemonTypeRelations
} from '../../core/actions/FetchPokemonDetails';

// Hooks separados para cada consulta para mantener el código limpio
const usePokemonBasic = (pokemonId: string) => {
    return useQuery({
        queryKey: ['pokemon', pokemonId],
        queryFn: () => fetchPokemonById(pokemonId),
        enabled: !!pokemonId
    });
};

const usePokemonSpecies = (pokemonId: string) => {
    return useQuery({
        queryKey: ['species', pokemonId],
        queryFn: () => fetchPokemonSpecies(pokemonId),
        enabled: !!pokemonId
    });
};

const useEvolutionChain = (url: string | undefined) => {
    return useQuery({
        queryKey: ['evolution', url],
        queryFn: () => fetchEvolutionChain(url || ''),
        enabled: !!url
    });
};

const useTypeWeakness = (typeId: string, url: string) => {
    return useQuery({
        queryKey: ['type', typeId],
        queryFn: () => fetchTypeWeaknesses(url),
        enabled: !!url && !!typeId
    });
};

// Hook principal que compone todos los demás
export const usePokemonDetail = (pokemonId: string) => {
    const queryClient = useQueryClient();
    
    // Consulta básica de Pokémon
    const pokemonQuery = usePokemonBasic(pokemonId);
    const pokemon = pokemonQuery.data as PokemonDetail | undefined;
    
    // Consulta de especies
    const speciesQuery = usePokemonSpecies(pokemonId);
    const species = speciesQuery.data as PokemonSpecies | undefined;
    
    // Consulta de cadena evolutiva
    const evolutionUrl = species?.evolution_chain?.url;
    const evolutionQuery = useEvolutionChain(evolutionUrl);
    const evolutionChain = evolutionQuery.data as EvolutionChain | undefined;
    
    // Consultas de debilidades por tipo (máximo 2 tipos)
    const type1 = pokemon?.types?.[0]?.type;
    const type2 = pokemon?.types?.[1]?.type;
    
    const type1Id = type1?.url ? type1.url.split('/').filter(Boolean).pop() || '' : '';
    const type2Id = type2?.url ? type2.url.split('/').filter(Boolean).pop() || '' : '';
    
    const type1Query = useTypeWeakness(type1Id, type1?.url || '');
    const type2Query = useTypeWeakness(type2Id, type2?.url || '');
    
    // Unir resultados de debilidades
    const typeRelations: PokemonTypeRelations[] = [];
    if (type1Query.data) typeRelations.push(type1Query.data as PokemonTypeRelations);
    if (type2Query.data) typeRelations.push(type2Query.data as PokemonTypeRelations);
    
    // Función para prefetch del siguiente Pokémon
    const prefetchNextPokemon = async (nextId: string) => {
        await prefetchPokemonData(queryClient, nextId);
    };
    
    // Estados de carga y error
    const isLoading = 
        pokemonQuery.isLoading || 
        speciesQuery.isLoading || 
        (!!evolutionUrl && evolutionQuery.isLoading) ||
        (!!type1Id && type1Query.isLoading) ||
        (!!type2Id && type2Query.isLoading);
        
    const isError = 
        pokemonQuery.isError || 
        speciesQuery.isError || 
        (!!evolutionUrl && evolutionQuery.isError) ||
        (!!type1Id && type1Query.isError) ||
        (!!type2Id && type2Query.isError);
        
    const error = 
        pokemonQuery.error || 
        speciesQuery.error || 
        (evolutionQuery.error && evolutionQuery.isError ? evolutionQuery.error : undefined) ||
        (type1Query.error && type1Query.isError ? type1Query.error : undefined) ||
        (type2Query.error && type2Query.isError ? type2Query.error : undefined);
    
    return {
        pokemon,
        species,
        evolutionChain,
        typeRelations,
        isLoading,
        isError,
        error,
        prefetchNextPokemon
    };
};