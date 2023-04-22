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

//VIEW COMMENTS
const postCommentBtns = document.querySelectorAll('.comments')
const postComments = document.querySelector('.post-comments')

//PROFILE DROPDOWN
const profileDropdwon = document.querySelector('.profile-photo')
const profileCtxMenu = document.querySelector('.profile-ctx')

//PROFILE
const userProfileBtn = document.querySelector('.profile')
const editProfileDiv = document.querySelector('.edit-profile')

//BEFREIEND UNFRIEND
const postMenuBtns = document.querySelectorAll('.post-menu-btn')

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


postCommentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        postComments.style.display = 'block'
    })
})

postComments.addEventListener('click', (e) => {
    if(e.target.classList.contains('post-comments')){
        postComments.style.display = 'none'
    }
})

//PROFILE DROPDOWN
profileDropdwon.addEventListener('click', () => {
    profileCtxMenu.style.display = 'block'
    setTimeout(() => {
        profileCtxMenu.style.display = 'none'
    }, 2000)
})

//EDIT PROFILE
userProfileBtn.addEventListener('click', () => {
    profileCtxMenu.style.display = 'none'
    editProfileDiv.style.display = 'block'
})

editProfileDiv.addEventListener('click', (e) => {
    if(e.target.classList.contains('edit-profile')){
        editProfileDiv.style.display = 'none'
    }
})

//BEFREIEND UNFRIEND
postMenuBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const postMenuDiv = btn.nextElementSibling
        console.log(postMenuDiv)
        postMenuDiv.style.display = 'block'
        setTimeout(() => {
            postMenuDiv.style.display = 'none'
        }, 2000)
    })
})

//LIKE
const likeButtons = document.querySelectorAll('.like-button')
likeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const likeButtonSolid = btn.querySelector('.fa-solid')
        const likeButtonRegular = btn.querySelector('.fa-regular')
        likeButtonSolid.classList.toggle('active')
        likeButtonRegular.classList.toggle('active')
        likeButtonSolid.style.color = 'red'
        likeButtonSolid.style.fontSize = '2rem'
        setTimeout(() => {
            likeButtonSolid.style.fontSize = '1.4rem'
        }, 1000)

        const postId = 2

        fetch(`http://localhost:5000/post/like?post_id=${postId}`,{
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )
    })
})

//COMMENT
const commentButtons = document.querySelectorAll('.fa-comment')
commentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const feed = btn.closest('.feed')
        const comment = feed.querySelector('.comment-box')
        comment.style.display = 'block'
    })
})

const submitCommentButtons = document.querySelectorAll('.submit-comment')
submitCommentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const postId = 2

        fetch(`http://localhost:5000/post/comment?post_id=${postId}`,{
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )
        comment = btn.closest('.comment-box')
        comment.style.display = 'none'
    })
})