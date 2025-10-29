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

getCharacters('A New Hope').then(characters => console.log(characters));