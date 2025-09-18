import React, { useState, useEffect, useRef } from 'react';
import { SpinnerComponent } from '../../common';
import { useSearchPokemon } from '../../hooks/useSearchPokemon';

interface SearchPokemonProps {
  onSelectPokemon: (pokemonUrl: string) => void;
}

// Función para obtener el color de fondo según el tipo de Pokémon
const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-600',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-800',
    steel: 'bg-gray-400',
    fairy: 'bg-pink-300',
  };

  return typeColors[type] || 'bg-gray-500';
};

export const SearchPokemon: React.FC<SearchPokemonProps> = ({ onSelectPokemon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Usamos el hook de búsqueda global
  const { searchResults, isSearching } = useSearchPokemon(searchTerm);

  // Cerrar el dropdown cuando se hace clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.length > 0);
  };

  const handleSelectPokemon = (pokemonUrl: string) => {
    onSelectPokemon(pokemonUrl);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full md:w-96 mx-auto" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg 
            className="w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full p-4 pl-10 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          placeholder="Buscar Pokémon..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && setIsDropdownOpen(true)}
        />
      </div>

      {/* Dropdown de sugerencias */}
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="flex justify-center p-4">
              <SpinnerComponent />
            </div>
          ) : searchResults.length > 0 ? (
            <ul 
              className="py-1"
              data-testid="search-results-list"
            >
              {searchResults.map((pokemon) => (
                <li 
                  key={pokemon.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                  onClick={() => handleSelectPokemon(pokemon.url)}
                  data-testid={`search-result-${pokemon.name}`}
                >
                  <img 
                    src={pokemon.imageUrl} 
                    alt={pokemon.name} 
                    className="w-10 h-10 mr-3"
                    data-testid={`search-result-image-${pokemon.name}`}
                    onClick={(e) => { e.stopPropagation(); handleSelectPokemon(pokemon.url); }}
                  />
                  <div>
                    <p className="font-medium text-white capitalize" data-testid={`search-result-name-${pokemon.name}`}>{pokemon.name}</p>
                    <div className="flex gap-1 mt-1">
                      {pokemon.types.map((type) => (
                        <span 
                          key={type} 
                          className={`text-xs px-2 py-1 rounded-full text-white ${getTypeColor(type)}`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 ? (
            <div className="p-4 text-center text-gray-400">
              No se encontraron resultados para "{searchTerm}"
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              Escribe al menos 2 caracteres para buscar
            </div>
          )}
        </div>
      )}
    </div>
  );
};
