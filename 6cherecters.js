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

getCharacters('A New Hope').then(characters => console.log(characters));