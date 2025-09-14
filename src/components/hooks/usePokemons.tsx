import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchPokemons } from "../../core/actions/FetchPokemons";

export interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    url: string; // Original URL from the list
}

export interface PokemonPaginatedResponse {
    pokemons: Pokemon[];
    totalCount: number;
    nextPage: number | null;
    previousPage: number | null;
}

export const usePokemons = (initialPage: number = 1, pageSize: number = 20) => {
    const [page, setPage] = useState<number>(initialPage);
    const queryClient = useQueryClient();

    // Query principal para obtener los datos paginados
    const result = useQuery<PokemonPaginatedResponse, Error>({
        queryKey: ['pokemons', page, pageSize],
        queryFn: () => fetchPokemons(page, pageSize),
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData, // Reemplaza keepPreviousData
    });

    // Función para ir a la página siguiente
    const nextPage = () => {
        if (result.data?.nextPage) {
            setPage(result.data.nextPage);
        }
    };

    // Función para ir a la página anterior
    const previousPage = () => {
        if (result.data?.previousPage) {
            setPage(result.data.previousPage);
        }
    };

    // Función para ir a una página específica
    const goToPage = (pageNumber: number) => {
        setPage(pageNumber);
    };

    // Prefetch de la siguiente página cuando tenemos datos
    // Esto mejorará la experiencia del usuario al cambiar de página
    if (result.data?.nextPage && !result.isFetching) {
        const nextPageToFetch = result.data.nextPage;
        queryClient.prefetchQuery({
            queryKey: ['pokemons', nextPageToFetch, pageSize],
            queryFn: () => fetchPokemons(nextPageToFetch, pageSize),
            staleTime: 1000 * 60 * 5
        });
    }

    return {
        ...result,
        page,
        nextPage,
        previousPage,
        goToPage
    };
};