import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import type { Pokemon } from './usePokemons';

// Esta función realiza una búsqueda global de Pokémon por nombre
const searchPokemonByName = async (name: string): Promise<Pokemon[]> => {
  if (!name || name.length < 2) return [];
  
  try {
    // La API de Pokémon no tiene búsqueda directa por nombre parcial,
    // así que usamos un endpoint que nos da una lista de posibles coincidencias
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1200`);
    if (!response.ok) throw new Error('Error al buscar Pokémon');
    
    const data = await response.json();
    
    // Filtramos los resultados que coincidan con el nombre buscado
    const matchingResults = data.results.filter((pokemon: any) => 
      pokemon.name.toLowerCase().includes(name.toLowerCase())
    ).slice(0, 10); // Limitamos a 10 resultados
    
    // Para cada resultado, obtenemos los detalles completos
    const detailedResults = await Promise.all(
      matchingResults.map(async (result: any) => {
        const detailResponse = await fetch(result.url);
        if (!detailResponse.ok) throw new Error(`Error al obtener detalles de ${result.name}`);
        
        const detail = await detailResponse.json();
        
        return {
          id: detail.id,
          name: detail.name,
          imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detail.id}.png`,
          types: detail.types.map((t: any) => t.type.name),
          url: result.url
        };
      })
    );
    
    return detailedResults;
  } catch (error) {
    console.error('Error en búsqueda de Pokémon:', error);
    return [];
  }
};

// Hook para buscar Pokémon globalmente
export const useSearchPokemon = (searchTerm: string) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  // Aplicamos debouncing para evitar demasiadas búsquedas durante la escritura
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);
  
  // Ejecutamos la búsqueda solo cuando el término debounced cambia
  const { data, isLoading, error } = useQuery({
    queryKey: ['pokemonSearch', debouncedSearchTerm],
    queryFn: () => searchPokemonByName(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length >= 2, // Solo búsquedas con 2+ caracteres
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
  
  return {
    searchResults: data || [],
    isSearching: isLoading,
    error
  };
};