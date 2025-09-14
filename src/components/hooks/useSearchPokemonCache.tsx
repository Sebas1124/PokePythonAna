import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchPokemons } from "../../core/actions/FetchPokemons";
import type { Pokemon } from "./usePokemons";

// Este hook se encarga de cargar y mantener en caché un conjunto más grande de pokémon 
// para el componente de búsqueda, sin afectar a la paginación principal
export const useSearchPokemonCache = (limit: number = 151) => {
    const queryClient = useQueryClient();
    
    // Clave especial para el caché de búsqueda
    const cacheKey = ['pokemon-search-cache', limit];
    
    // Consulta para obtener todos los pokémon para el buscador
    const { data, isLoading, error } = useQuery({
        queryKey: cacheKey,
        queryFn: async () => {
            // Intentamos obtener datos del caché primero
            const cachedData = queryClient.getQueryData<{pokemons: Pokemon[]}>(['pokemons', 1, limit]);
            
            if (cachedData?.pokemons) {
                return cachedData.pokemons;
            }
            
            // Si no hay datos en caché, hacemos la petición completa
            const result = await fetchPokemons(1, limit);
            return result.pokemons;
        },
        staleTime: 1000 * 60 * 30, // 30 minutos
        refetchOnWindowFocus: false,
        // Optimización: si ya tenemos datos, no hacemos la petición de nuevo
        enabled: !queryClient.getQueryData(cacheKey)
    });
    
    // Cuando se cargan datos paginados, actualizamos nuestra caché
    useEffect(() => {
        const updateCacheFromPaginatedData = async () => {
            // Verificamos si hay datos en la caché principal de paginación
            const pages = queryClient.getQueriesData<{pokemons: Pokemon[]}>({
                queryKey: ['pokemons']
            });
            
            // Recogemos todos los pokémon de todas las páginas cargadas
            const allPokemons: Pokemon[] = [];
            pages.forEach(([, pageData]) => {
                if (pageData?.pokemons) {
                    allPokemons.push(...pageData.pokemons);
                }
            });
            
            // Si tenemos suficientes pokémon, actualizamos la caché
            if (allPokemons.length > 0) {
                queryClient.setQueryData(cacheKey, allPokemons);
            }
        };
        
        updateCacheFromPaginatedData();
    }, [queryClient, cacheKey]);
    
    return {
        cachedPokemons: data || [],
        isLoading,
        error
    };
};