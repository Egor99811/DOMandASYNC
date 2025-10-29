async function getFilm(title) {
    try {
        const response = await fetch(`https://swapi.dev/api/films/?search=${title}`);
        if (!response.ok)
            throw new Error(response.status);
        return await response.json();
    } catch (e) {
        console.error(e);
        return e;
    }
}

async function getCharacters(title) {
    try{
        const film = await getFilm(title);
        const charactersURL = film.results[0].characters;
        let characters = [];
        for(let i = 0; i < 10; i++){
            characters.push(fetch(charactersURL[i]).then(response => response.json()));
        }
        return await Promise.all(characters);
    } catch(e){
        console.error(e);
    }
}

async function getPlanet(filmTitle) {
    try {
        const characters = await getCharacters(filmTitle);
        let planetCharacters = new Map();
        characters.forEach(character => {
            if(planetCharacters.has(character.homeworld)) {
                planetCharacters.get(character.homeworld).push(character);
            } else {
                planetCharacters.set(character.homeworld, [character]);
            }
        });
        const uniquePlanetsURL = [...planetCharacters.keys()];
        const planets = await Promise.all(uniquePlanetsURL.map(url => fetch(url).then(response => response.json())));
        planets.forEach(planet => planet.characters = planetCharacters.get(planet.url));
        return planets;
    } catch (e) {
        console.error(e);
    }
}

getPlanet('A New Hope').then(planets => console.log(planets));