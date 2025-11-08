const URL = 'https://jsonplaceholder.typicode.com/';

async function getPosts(n) {
    const controller = new AbortController();
    try{
        const response = await fetch(`${URL}posts?_limit=${n}`,{signal: controller.signal});
        if(!response.ok) 
            throw new Error(response.status);
         
        const result = await response.json();
        return {result, controller};

    } catch (e) {
        console.error(e);
    }
}

getPosts(4).then(posts => console.log(posts));

async function getComments() {
    const controller = new AbortController();
    try{
        const response = await fetch(`${URL}/comments`, {signal: controller.signal});
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
        return {result, controller};
    } catch (e) {
        console.error(e);
    }
}

async function getPostsWithComments(n) {
    const controller = new AbortController();
    try {
        const postsFetch = getPosts(n, controller);
        const commentsResponse = await getComments(controller);
        const postsResponse = await postsFetch;
        const comments = commentsResponse.result;
        let result = postsResponse.result;
        result.forEach(element => {
            if(comments[element.id]){
                element.comments = comments[element.id];
            } else {
                element.comments = [];
            }
        })
        return {result, controller};
    } catch (error) {
        console.error(error);
    }
}

getPostsWithComments(1).then(posts => console.log(posts));