const input = document.getElementById('input');
const searchButton = document.getElementById('searchButton');
const pokemonContainer = document.getElementById('pokemonContainer');

const URL = 'https://pokeapi.co/api/v2/pokemon/';

async function getPokemon(name) {
    try {
        const response = await fetch(`${URL}${name}`);
        if (response.status === 404)
            pokemonContainer.innerText = 'Pokemon not found';
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

function fillPokemon(pokemon) {
    const pokemonName = document.createElement('div');
    pokemonName.innerText = pokemon.name;
    const image = document.createElement('img');
    image.src = pokemon.sprites.front_default;
    const height = document.createElement('div');
    height.innerText = `height: ${pokemon.height}`;
    const weight = document.createElement('div');
    weight.innerText = `weight: ${pokemon.weight}`;
    const type = document.createElement('div');
    type.innerText = `type: ${pokemon.types.map(type => type.type.name).join(', ')}`;
    pokemonContainer.append(pokemonName, image, height, weight, type);
}

searchButton.onclick = async function() {
    const pokemon = await getPokemon(input.value);
    fillPokemon(pokemon);
}