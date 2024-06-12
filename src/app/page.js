"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "@/components/ui/pagination";

import useStore from "../store/store";

// Modal Component
const PokemonDetailModal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-end">
          <Button type="button" onClick={onClose}>Close</Button>
        </div>
        <div className="flex flex-col items-center">
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name} 
            style={{ width: '200px', height: '200px' }}
          />
          <h2 className="text-2xl font-bold">{pokemon.name}</h2>
          <p>Type: {pokemon.types.map(type => type.type.name).join(', ')}</p>
          <p>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
          <p>Stats:</p>
          <ul>
            {pokemon.stats.map(stat => (
              <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const MessagePopup = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
      {message}
      <Button type="button" className="ml-4" onClick={onClose}>Close</Button>
    </div>
  );
}

export default function Home() {
  const [pokemonData, setPokemonData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showCaughtPokemons, setShowCaughtPokemons] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [caughtPage, setCaughtPage] = useState(1);
  const [caughtTotalPages, setCaughtTotalPages] = useState(0);
  const [message, setMessage] = useState(null);

  const ITEMS_PER_PAGE = 20;
  const CAUGHT_ITEMS_PER_PAGE = 10;
  const caughtPokemons = useStore((state) => state.caughtPokemons);
  const addCaughtPokemon = useStore((state) => state.addCaughtPokemon);
  const removeCaughtPokemon = useStore((state) => state.removeCaughtPokemon);

  const fetchPokemons = async (page) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`);
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          return await pokemonResponse.json();
        })
      );
      setPokemonData(pokemonDetails);
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon not found!');
      }
      const data = await response.json();
      setPokemonData([{ ...data }]); 
      setTotalPages(1);
      setIsSearching(true); 
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const handleBack = () => {
    setSearchTerm("");
    setIsSearching(false);
    fetchPokemons(page);
  };

  const handleDetail = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };

  const handleCatchPokemon = (pokemon) => {
    addCaughtPokemon(pokemon);
    setMessage(`${pokemon.name} has been caught!`);
  };

  const handleReleasePokemon = (pokemonId) => {
    removeCaughtPokemon(pokemonId);
    const pokemon = caughtPokemons.find(p => p.id === pokemonId);
    setMessage(`${pokemon.name} has been released!`);
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page]);

  useEffect(() => {
    setCaughtTotalPages(Math.ceil(caughtPokemons.length / CAUGHT_ITEMS_PER_PAGE));
  }, [caughtPokemons]);

  const paginatedCaughtPokemons = caughtPokemons.slice(
    (caughtPage - 1) * CAUGHT_ITEMS_PER_PAGE,
    caughtPage * CAUGHT_ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex w-full max-w-xl items-center space-x-2 mt-9">
        <Input
          type="text"
          placeholder="Enter a Pokemon Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="button" onClick={handleSearch}>Search</Button>
        {isSearching && (
          <Button type="button" onClick={handleBack}>Back</Button>
        )}
        <Button type="button" onClick={() => setShowCaughtPokemons(!showCaughtPokemons)}>
          {showCaughtPokemons ? "Go Catch More Pokemon" : "Caught Pokemon"}
        </Button>
      </div>
      {showCaughtPokemons && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {paginatedCaughtPokemons.map((pokemon) => (
              <Card key={pokemon.id} className="w-full max-w-sm">
                <CardHeader>
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={pokemon.name} 
                    style={{ width: '100px', height: '100px' }}
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle>{pokemon.name}</CardTitle>
                  <CardDescription>Type: {pokemon.types.map(type => type.type.name).join(', ')}</CardDescription>
                  <CardDescription>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={() => handleReleasePokemon(pokemon.id)}>Release</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Pagination className="flex justify-center mt-4">
            <PaginationContent>
              <PaginationPrevious onClick={() => setCaughtPage(caughtPage - 1)} disabled={caughtPage === 1} />
              {caughtPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
              {caughtPage > 1 && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCaughtPage(caughtPage - 1)}>{caughtPage - 1}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink isActive>{caughtPage}</PaginationLink>
              </PaginationItem>
              {caughtPage < caughtTotalPages && (
                <PaginationItem>
                  <PaginationLink onClick={() => setCaughtPage(caughtPage + 1)}>{caughtPage + 1}</PaginationLink>
                </PaginationItem>
              )}
              {caughtPage < caughtTotalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
              <PaginationNext onClick={() => setCaughtPage(caughtPage + 1)} disabled={caughtPage === caughtTotalPages} />
            </PaginationContent>
          </Pagination>
        </>
      )}
      {!showCaughtPokemons && (
        <>
          {!isSearching && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pokemonData.map((pokemon) => (
                <Card key={pokemon.id} className="w-full max-w-sm">
                  <CardHeader>
                    <img 
                      src={pokemon.sprites.front_default} 
                      alt={pokemon.name} 
                      style={{ width: '100px', height: '100px' }}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{pokemon.name}</CardTitle>
                    <CardDescription>Type: {pokemon.types.map(type => type.type.name).join(', ')}</CardDescription>
                    <CardDescription>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</CardDescription>
                  </CardContent>
                  <CardFooter className="flex space-x-2">
                    <Button type="button" onClick={() => handleCatchPokemon(pokemon)}>Catch</Button>
                    <Button type="button" onClick={() => handleDetail(pokemon)}>Detail</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {isSearching && (
            <div className="w-full max-w-md">
              {pokemonData.map((pokemon) => (
                <Card key={pokemon.id} className="w-full">
                  <CardHeader className="flex justify-center">
                    <img 
                      src={pokemon.sprites.front_default} 
                      alt={pokemon.name} 
                      style={{ width: '200px', height: '200px' }}
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{pokemon.name}</CardTitle>
                    <CardDescription>Type: {pokemon.types.map(type => type.type.name).join(', ')}</CardDescription>
                    <CardDescription>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</CardDescription>
                    <CardDescription>Stats:</CardDescription>
                    <ul>
                      {pokemon.stats.map(stat => (
                        <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex space-x-2">
                    <Button type="button" onClick={() => handleCatchPokemon(pokemon)}>Catch</Button>
                    <Button type="button" onClick={() => handleDetail(pokemon)}>Detail</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {!isSearching && (
            <Pagination className="flex justify-center mt-4">
              <PaginationContent>
                <PaginationPrevious onClick={() => setPage(page - 1)} disabled={page === 1} />
                {page > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                {page > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setPage(page - 1)}>{page - 1}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
                {page < totalPages && (
                  <PaginationItem>
                    <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
                  </PaginationItem>
                )}
                {page < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                <PaginationNext onClick={() => setPage(page + 1)} disabled={page === totalPages} />
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
      {selectedPokemon && (
        <PokemonDetailModal pokemon={selectedPokemon} onClose={handleCloseDetail} />
      )}
      {message && (
        <MessagePopup message={message} onClose={() => setMessage(null)} />
      )}
    </div>
  );
}
