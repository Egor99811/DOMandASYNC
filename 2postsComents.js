const URL = 'https://jsonplaceholder.typicode.com/';

async function getPosts(n) {
    try{
        const response = await fetch(`${URL}posts?_limit=${n}`);
        if(!response.ok) 
            throw new Error(response.status);
         
        const posts = await response.json();
        return posts;

    } catch (e) {
        console.error(e);
    }
}

async function getComments() {
    try{
        const response = await fetch(`${URL}/comments`);
        if(!response.ok)
            throw new Error(response.status);
        
        const comments = await response.json();

        let result = {};
        comments.forEach(element => {
            if(result.hasOwnProperty(element.postId)) {
                result[element.postId].push(element);
            } else {
                result[element.postId] = [element];
            }
        });
        return result;
    } catch (e) {
        console.error(e);
    }
}

async function getPostsWithComments(n) {
    try {
        const posts = getPosts(n);
        const comments = await getComments();
        let result = await posts;
        result.forEach(element => {
            if(comments[element.id]){
                element.comments = comments[element.id];
            } else {
                element.comments = [];
            }
        })
        return result;
    } catch (error) {
        console.error(error);
    }
}

getPostsWithComments(1).then(posts => console.log(posts));