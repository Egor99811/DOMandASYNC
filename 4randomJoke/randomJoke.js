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
    const controller = new AbortController();
    try {
        const response = await fetch(URL, {signal: controller.signal});
        if (!response.ok)
            throw new Error(response.status);
        const result = await response.json();
        return {result, controller};
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
        jokes.push(joke.result);
        updateUI();
        return;
    } 
    if(index === jokes.length - 1) {
        joke = await getJoke();
        jokes.push(joke.result);
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