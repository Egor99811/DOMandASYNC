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

// getPosts(4).then(posts => console.log(posts));

async function getComments() {
    try{
        const response = await fetch(`${URL}comments`);
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

// getComments().then(comments => console.log(comments));

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
// getPostsWithComments(1).then(posts => console.log(posts));

async function getUsers() {
    try {
        const response = await fetch(`${URL}users/`);
        if(!response.ok)
            throw new Error(response.status);
        const users = await response.json();
        let result = [];
        users.forEach(user => result[user.id] = user);
        return result;
    } catch (error) {
        console.error(error);
    }
}

// getUsers().then(users => console.log(users));

async function getFullPosts(n) {
    try {
        const posts = getPostsWithComments(n);
        const users = await getUsers();
        let result = await posts;
        result.forEach(post => post.user = users[post.userId]);
        return result;
    } catch (error) {
        console.error(error);
    }
}

getFullPosts(1).then(posts => console.log(posts));