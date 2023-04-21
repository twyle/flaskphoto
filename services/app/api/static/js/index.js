//CREATE POST
const createPostBtn = document.querySelector('.create-post-btn')
const createPostFormDiv = document.querySelector('.create-post')
const createPostForm = document.querySelector('.create-post-form')

//EDIT 
const editPostBtn = document.querySelector('.submit-edited-post')
const editPostDiv = document.querySelector('.edit-post')
const updatePostImage = document.querySelector('.post-image-upload')
let image;
let oldPost;

//CREATE POST
createPostBtn.addEventListener('click', () => {
    createPostFormDiv.style.display = 'grid';
})

createPostFormDiv.addEventListener('click', (e) => {
    if(e.target.classList.contains('create-post')){
        createPostFormDiv.style.display = 'none'
    }
})

createPostForm.addEventListener('submit', (e) => {
    e.preventDefault()

    formData = new FormData(createPostForm)
    fetch(createPostForm.action,{
        method: 'POST',
        body: formData
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))
        }
    )

    createPostFormDiv.style.display = 'none'
})

//DELETE POST
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('fa-trash-can')){
        const post = e.target.closest('.feed')
        const postId = post.id
        fetch(`http://localhost:5000/post?post_id=${postId}`,{
            method: 'DELETE'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )
        post.remove()
    }
})

//EDIT POST
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('fa-pen-to-square')){
        oldPost = e.target.closest('.feed')
        const postId = oldPost.id
        editPostDiv.id = postId
        const profilePhoto = editPostDiv.querySelector('.profile-photo-img')
        const userName = editPostDiv.querySelector('h3')
        const locationTime = editPostDiv.querySelector('small')
        const postPhoto = editPostDiv.querySelector('.post-photo')
        const textPhoto = editPostDiv.querySelector('.text-photo-img')
        console.log(postPhoto)
        fetch(`http://localhost:5000/post?post_id=${postId}`,{
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
                profilePhoto.src = response['user_photo']
                userName.textContent = response['user_name']
                locationTime.textContent = `${response['location']}, ${response['time']} AGO`
                postPhoto.src = response['post_photo']
                textPhoto.src = response['user_photo']
            }
        )
        editPostDiv.style.display = 'grid'
    }
})

editPostDiv.addEventListener('click', (e) => {
    if(e.target.classList.contains('edit-post')){
        editPostDiv.style.display = 'none'
    }
})

updatePostImage.addEventListener('click', () => {
    const postPhoto = editPostDiv.querySelector('.post-photo')
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = event => { 
        const imageFiles = event.target.files
        const imageFilesLength = imageFiles.length
        if (imageFilesLength > 0){
            image = imageFiles[0]
            const imageSrc = URL.createObjectURL(imageFiles[0])
            console.log(imageSrc)
            postPhoto.src = imageSrc
        }
     }

    input.click();
})

editPostBtn.addEventListener('click', (e) => {
    const post = e.target.closest('.edit-post')
    const postId = post.id
    const postText = post.querySelector('.post-text')
    const formData = new FormData()
    if (postText.value){
        formData.append('text', postText.value)
    }
    if (image){
        formData.append("file", image)
    }
    fetch(`http://localhost:5000/post?post_id=${postId}`,{
        method: 'PUT',
        body: formData
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))
        }
    )

    const oldText = oldPost.querySelector('.post-text')
    const oldImageDiv = oldPost.querySelector('.photo')
    const oldImage = oldImageDiv.querySelector('img')

    fetch(`http://localhost:5000/post?post_id=${postId}`,{
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
                oldImage.src = response['post_photo']
                oldText.textContent = response['post_text']
            }
        )

    editPostDiv.style.display = 'none'
})