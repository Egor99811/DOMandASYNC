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

function initApp() {
    const controller = new AbortController();
    input.addEventListener('input', inputHandler, {signal: controller.signal});
    searchButton.addEventListener('click', () => fillCharacters(input.value), {signal: controller.signal});
    backButton.addEventListener('click', backButtonHandler, {signal: controller.signal});
    nextButton.addEventListener('click', nextButtonHandler, {signal: controller.signal});
    charactersContainer.addEventListener('click', pickCharacter, {signal: controller.signal});
    return controller;
}

const abortApp = initApp();

async function getCharacters(name) {
    const controller = new AbortController();
    try {
        const response = await fetch(`${URL}${name}`, {signal: controller.signal});
        if (response.status === 404)
            charactersContainer.innerText = 'Character not found';
        const result = await response.json();
        return {result, controller};
    } catch (e) {
        console.error(e);
    }
}

async function fillCharacters(name) {
    const response = await getCharacters(name);
    const charactersList = response.result.results;
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

function getDebounce(fn, delay) {
    let timeout;
    return function (args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    }
}

function inputHandler(event) {
    charactersContainer.innerHTML = 'Loading...';
    const debouncedCharacters = getDebounce(fillCharacters, 400);
    debouncedCharacters(event.target.value);
};

function backButtonHandler() {
    if( paginationIndex === 0 ) return;
    paginationIndex--;
    updateUI();
};

function nextButtonHandler() {
    if( paginationIndex === characters.length - 1 ) return;
    paginationIndex++;
    updateUI();
};


function pickCharacter(event) {
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