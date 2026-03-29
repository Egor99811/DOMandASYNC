const URL = 'https://jsonplaceholder.typicode.com/'

async function getPosts(n) {
    const controller = new AbortController();
    try{
        const response = await fetch(`${URL}posts?_limit=${n}`, {signal: controller.signal});
        if(!response.ok) 
            throw new Error(response.status);
        
        
        const posts = await response.json();
        return {posts, controller};

    } catch (e) {
        console.error(e);
    }
}

getPosts(4).then(posts => console.log(posts));