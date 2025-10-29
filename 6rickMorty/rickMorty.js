const input = document.getElementById('input');
const searchButton = document.getElementById('searchButton');
const charactersContainer = document.getElementById('charactersContainer');
const backButton = document.getElementById('backButton');
const nextButton = document.getElementById('nextButton');
const episodeNumber = document.getElementById('episodeNumber');
const episodeCount = document.getElementById('episodeCount');
const infoContainer = document.getElementById('infoContainer');

const URL = 'https://rickandmortyapi.com/api/character/?name=';
let characters = [];
let paginationIndex = 0;

async function getCharacters(name) {
    try {
        const response = await fetch(`${URL}${name}`);
        if (response.status === 404)
            charactersContainer.innerText = 'Character not found';
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

async function fillCharacters(name) {
    const response = await getCharacters(name);
    const charactersList = response.results;
    const paginationCount = Math.ceil(charactersList.length / 10);
    for(let i = 0; i < paginationCount; i++) {
        characters[i] = charactersList.slice(i * 10, i * 10 + 10);
    }
    paginationIndex = 0;
    updateUI();
}

function updateUI() {
    charactersContainer.innerHTML = '';
    characters[paginationIndex].forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.className = 'charactersContainer__item';
        characterDiv.innerHTML = `<img src="${character.image}" id="${character.id}"><p>${character.name}</p>`;
        charactersContainer.appendChild(characterDiv);
    });
    episodeNumber.textContent = paginationIndex + 1;
    episodeCount.textContent = characters.length;
}

function getDebouncedCharacters(name) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => fillCharacters(name), 400);
    }
}

input.oninput = function(event) {
    charactersContainer.innerHTML = 'Loading...';
    getDebouncedCharacters(event.target.value)();
};

backButton.onclick = function() {
    if( paginationIndex === 0 ) return;
    paginationIndex--;
    updateUI();
};

nextButton.onclick = function() {
    if( paginationIndex === characters.length - 1 ) return;
    paginationIndex++;
    updateUI();
};


charactersContainer.onclick = function(event) {
    console.log(event.target.id);
    const id = event.target.id;
    characters.forEach(subList => {
        subList.forEach(character => {
            if(character.id === parseInt(id)) {
                infoContainer.innerText = JSON.stringify(character);
            }
        })
    })
};