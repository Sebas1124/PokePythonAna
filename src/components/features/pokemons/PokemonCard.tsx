import React from 'react';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';


interface PokemonCardProps {
    name: string;
    imageUrl: string;
    types: string[];
    id: number;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ name, imageUrl, types, id }) => {
    const typeColorMap: { [key: string]: { bg: string, light: string, shadow: string } } = {
        grass: { bg: 'from-green-500 to-green-600', light: 'bg-green-200', shadow: 'shadow-green-500/50' },
        poison: { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-200', shadow: 'shadow-purple-500/50' },
        fire: { bg: 'from-red-500 to-red-600', light: 'bg-red-200', shadow: 'shadow-red-500/50' },
        water: { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-200', shadow: 'shadow-blue-500/50' },
        bug: { bg: 'from-lime-500 to-lime-600', light: 'bg-lime-200', shadow: 'shadow-lime-500/50' },
        normal: { bg: 'from-gray-400 to-gray-500', light: 'bg-gray-200', shadow: 'shadow-gray-400/50' },
        electric: { bg: 'from-yellow-400 to-yellow-500', light: 'bg-yellow-100', shadow: 'shadow-yellow-400/50' },
        ground: { bg: 'from-amber-600 to-amber-700', light: 'bg-amber-200', shadow: 'shadow-amber-600/50' },
        fairy: { bg: 'from-pink-400 to-pink-500', light: 'bg-pink-100', shadow: 'shadow-pink-400/50' },
        fighting: { bg: 'from-orange-700 to-orange-800', light: 'bg-orange-200', shadow: 'shadow-orange-700/50' },
        psychic: { bg: 'from-pink-600 to-pink-700', light: 'bg-pink-200', shadow: 'shadow-pink-600/50' },
        rock: { bg: 'from-amber-700 to-amber-800', light: 'bg-amber-200', shadow: 'shadow-amber-700/50' },
        steel: { bg: 'from-gray-500 to-gray-600', light: 'bg-gray-300', shadow: 'shadow-gray-500/50' },
        ice: { bg: 'from-cyan-300 to-cyan-400', light: 'bg-cyan-100', shadow: 'shadow-cyan-300/50' },
        ghost: { bg: 'from-indigo-600 to-indigo-700', light: 'bg-indigo-200', shadow: 'shadow-indigo-600/50' },
        dragon: { bg: 'from-indigo-800 to-indigo-900', light: 'bg-indigo-300', shadow: 'shadow-indigo-800/50' },
    };

    const navigate = useNavigate();

    const mainType = types[0];
    const typeStyle = typeColorMap[mainType] || { bg: 'from-slate-400 to-slate-500', light: 'bg-slate-200', shadow: 'shadow-slate-400/50' };

    return (
        <div className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl m-4 transform hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer ${typeStyle.shadow} max-w-xs`}>
            {/* Card header with ID */}
            <div className={`p-2 bg-gradient-to-r ${typeStyle.bg} flex justify-between items-center`}>
                <h3 className="font-bold text-white capitalize text-lg tracking-wide truncate max-w-[70%]">{name}</h3>
                <span className="text-white/80 font-mono font-semibold">#{id.toString().padStart(3, '0')}</span>
            </div>
            
            {/* Image section with gradient background */}
            <div className={`p-6 ${typeStyle.light} flex justify-center items-center`} onClick={() => navigate(`/pokemon/${id}`)}>
                <div className={`w-40 h-40 rounded-full flex items-center justify-center p-2`}>
                    <LazyLoadImage
                        className="w-36 h-36 object-contain drop-shadow-md transform hover:scale-110 transition-transform duration-300" 
                        alt={name}
                        src={imageUrl}
                    />
                </div>
            </div>
            
            {/* Type badges */}
            <div className="px-4 py-3 bg-white border-t">
                <div className="flex flex-wrap gap-2 justify-center">
                    {types.map((type) => {
                        const style = typeColorMap[type] || { bg: 'from-slate-400 to-slate-500' };
                        return (
                            <span
                                key={type}
                                className={`inline-block bg-gradient-to-r ${style.bg} rounded-full px-4 py-1 text-sm font-semibold text-white capitalize shadow-sm`}
                            >
                                {type}
                            </span>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
