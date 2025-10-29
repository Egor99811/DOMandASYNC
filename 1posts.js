const URL = 'https://jsonplaceholder.typicode.com/'

async function getPosts(n) {
    try{
        const response = await fetch(`${URL}posts?_limit=${n}`);
        if(!response.ok) 
            throw new Error(response.status);
        
        
        const posts = await response.json();
        console.log(posts);

    } catch (e) {
        console.error(e);
    }
}

getPosts(4);