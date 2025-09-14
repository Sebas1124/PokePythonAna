
interface Pokemon {
    id: number;
    name: string;
    imageUrl: string;
    types: string[];
    url: string; // Original URL from the list
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        name: string;
        url: string;
    }[];
}

// Página por defecto: 1, límite por defecto: 20
export const fetchPokemons = async (page: number = 1, limit: number = 20): Promise<{
    pokemons: Pokemon[];
    totalCount: number;
    nextPage: number | null;
    previousPage: number | null;
}> => {
    try {
        const offset = (page - 1) * limit;
        const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        
        if (!listResponse.ok) throw new Error('Network response was not ok');
        const listData: PokemonListResponse = await listResponse.json();

        // Procesar solo un lote de Pokémon a la vez
        const pokemonPromises = listData.results.map(async (p: { name: string, url: string }) => {
            const detailResponse = await fetch(p.url);
    
            if (!detailResponse.ok) throw new Error(`Failed to fetch details for ${p.name}`);
            const detailData = await detailResponse.json();
    
            return {
                id: detailData.id,
                name: detailData.name,
                imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${detailData.id}.png`,
                types: detailData.types.map((typeInfo: any) => typeInfo.type.name),
                url: p.url,
            };
        });
    
        const detailedPokemons = await Promise.all(pokemonPromises);
        
        // Calcular páginas anterior y siguiente
        const nextPage = listData.next ? page + 1 : null;
        const previousPage = listData.previous ? page - 1 : null;
        
        return {
            pokemons: detailedPokemons,
            totalCount: listData.count,
            nextPage,
            previousPage
        };
    } catch (error) {
        throw new Error(`Failed to fetch pokemons: ${(error as Error).message}`);
    }
}