const setup = document.querySelector('#setup');
const punchline = document.querySelector('#punchline');
const jokeNumber = document.querySelector('#jokeNumber');
const jokeCount = document.querySelector('#jokeCount');
const nextButton = document.querySelector('#nextButton');
const backButton = document.querySelector('#BackButton');

const URL = 'https://official-joke-api.appspot.com/jokes/random';
let jokes = [];
let index = 0;

async function getJoke() {
    try {
        const response = await fetch(URL);
        if (!response.ok)
            throw new Error(response.status);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

getJoke().then(jokes => {
    console.log(jokes);
});

function updateUI() {
    setup.textContent = jokes[index].setup;
    punchline.textContent = jokes[index].punchline;
    jokeNumber.textContent = index + 1;
    jokeCount.textContent = jokes.length;
}

nextButton.onclick = async function() {
    if(jokes.length === 0) {
        joke = await getJoke();
        jokes.push(joke);
        updateUI();
        return;
    } 
    if(index === jokes.length - 1) {
        joke = await getJoke();
        jokes.push(joke);
        index++;
        updateUI();
        return;
    } 
    index++;
    updateUI();
}

backButton.onclick = function() {
    if(index === 0)
        return;
    index--;
    updateUI();
}