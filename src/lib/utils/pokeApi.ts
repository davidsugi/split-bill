
export async function fetchPokemon(id: number): Promise<string | null> {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.sprites.front_default;
    } catch (error) {
        console.error('Failed to fetch Pokémon data:', error);
        return null;
    }
}
