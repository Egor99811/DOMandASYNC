const URL = 'https://jsonplaceholder.typicode.com/';

async function getPosts(n) {
    const controller = new AbortController();
    try{
        const response = await fetch(`${URL}posts?_limit=${n}`, {signal: controller.signal});
        if(!response.ok) 
            throw new Error(response.status);
         
        const result = await response.json();
        return {result, controller};

    } catch (e) {
        console.error(e);
    }
}

// getPosts(4).then(posts => console.log(posts));

async function getComments() {
    const controller = new AbortController();
    try{
        const response = await fetch(`${URL}comments`, {signal: controller.signal});
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

// getComments().then(comments => console.log(comments));

async function getPostsWithComments(n) {
    const controller = new AbortController();
    try {
        const postsFetch = getPosts(n, controller);
        const commentsResponse = await getComments(controller);
        const postsResponse = await postsFetch;
        controller.signal.addEventListener('abort', () => {
            commentsResponse.controller.abort();
            postsResponse.controller.abort();
          })
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
// getPostsWithComments(1).then(posts => console.log(posts));

async function getUsers() {
    const controller = new AbortController();
    try {
        const response = await fetch(`${URL}users/`, {signal: controller.signal});
        if(!response.ok)
            throw new Error(response.status);
        const users = await response.json();
        let result = [];
        users.forEach(user => result[user.id] = user);
        return {result, controller};
    } catch (error) {
        console.error(error);
    }
}

// getUsers().then(users => console.log(users));

async function getFullPosts(n) {
    const controller = new AbortController();
    try {
        const postsFetch = getPostsWithComments(n);
        const usersResponse = await getUsers();
        const postsResponse = await postsFetch;
        controller.signal.addEventListener('abort', () => {
            usersResponse.controller.abort();
            postsResponse.controller.abort();
          })
        const users = usersResponse.result;
        let result = postsResponse.result;
        result.forEach(post => post.user = users[post.userId]);
        return {result, controller};
    } catch (error) {
        console.error(error);
    }
}

getFullPosts(1).then(posts => console.log(posts));