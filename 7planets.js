async function getFilm(title) {
    const controller = new AbortController();
    try {
        const response = await fetch(`https://swapi.dev/api/films/?search=${title}`, {signal: controller.signal});
        if (!response.ok)
            throw new Error(response.status);
        const result = await response.json();
        return {result, controller};
    } catch (e) {
        console.error(e);
        return e;
    }
}

async function getCharacters(title) {
    try{
        const filmResponse = await getFilm(title);
        const film = filmResponse.result.results[0];
        const charactersURL = film.characters;
        let characters = [];
        for(let i = 0; i < 10; i++){
            characters.push(fetch(charactersURL[i]).then(response => response.json()));
        }
        const result = await Promise.all(characters);
        return {result, controller: filmResponse.controller};
    } catch(e){
        console.error(e);
    }
}

async function getPlanet(filmTitle) {
    const controller = new AbortController();
    try {
        const charactersResponse = await getCharacters(filmTitle);
        const characters = charactersResponse.result;
        controller.signal.addEventListener('abort', () => charactersResponse.controller.abort());
        let planetCharacters = new Map();
        characters.forEach(character => {
            if(planetCharacters.has(character.homeworld)) {
                planetCharacters.get(character.homeworld).push(character);
            } else {
                planetCharacters.set(character.homeworld, [character]);
            }
        });
        const uniquePlanetsURL = [...planetCharacters.keys()];
        const result = await Promise.all(uniquePlanetsURL.map(url => {
            return fetch(url, {signal: controller.signal})
                    .then(response => response.json())
                    .catch(e => console.error(e));
        }));
        result.forEach(planet => planet.characters = planetCharacters.get(planet.url));
        return {result, controller};
    } catch (e) {
        console.error(e);
    }
}

getPlanet('A New Hope').then(planets => console.log(planets));