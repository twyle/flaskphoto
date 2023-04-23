//CREATE POST
const createPostBtn = document.querySelector('.create-post-btn')
const createPostFormDiv = document.querySelector('.create-post')
const createPostForm = document.querySelector('.create-post-form')
const posts = document.querySelector('.feeds')

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
const userProfileBtn = document.querySelector('.user-profile')
const editProfileDiv = document.querySelector('.edit-profile')

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
const submitCommentButtons = document.querySelectorAll('.submit-comment')
commentButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const feed = btn.closest('.feed')
        const comment = feed.querySelector('.comment-box')
        comment.style.display = 'block'
    })
})

//PROFILE
const profileBtns =  document.querySelectorAll('.profile-menu')
const viewProfile = document.querySelector('.view-user-profile')
const closeProfile = document.querySelector('.close-profile')
profileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewProfile.style.display = 'block'
    })
})

closeProfile.addEventListener('click', () => {
    viewProfile.style.display = 'none'
})

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

    const formData = new FormData(createPostForm)
    fetch(createPostForm.action,{
        method: 'POST',
        body: formData
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))
            createNewPost(createPostForm)
        }
    )

    createPostFormDiv.style.display = 'none'
})

const createNewPost = (form) => {
    const postId = 2
    const formData = new FormData(form)
    const newPostLocation = formData.get('location')
    const newPostText = formData.get('text')
    fetch(`http://localhost:5000/post?post_id=${postId}`,{
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
                feed = document.createElement( 'div' );
                feed.classList.add('feed')

                head = document.createElement( 'div' );
                head.classList.add('head')

                user = document.createElement( 'div' );
                user.classList.add('user')

                profilePhoto = document.createElement( 'div' );
                profilePhoto.classList.add('profile-photo')

                profileImg = document.createElement('img');
                profileImg.src = response['user_photo']

                profilePhoto.appendChild(profileImg)

                ingo = document.createElement( 'div' );
                ingo.classList.add('ingo')

                h3 = document.createElement( 'h3' );
                h3.innerHTML = response['user_name']
                small = document.createElement( 'small' );
                small.innerHTML = `${newPostLocation}, ${response["time"]} AGO`

                ingo.appendChild(h3)
                ingo.appendChild(small)

                user.appendChild(profilePhoto)
                user.appendChild(ingo)

                span = document.createElement('span')
                span.classList.add('edit')
                span.innerHTML = `
                    <i class="uil uil-ellipsis-h" id="context-dropdown"></i>
                                        
                    <div class="context-menu">
                        <div class="dropdownmenu">
                            <div class="card">

                            </div>
                        </div>
                    </div>
                `
                head.appendChild(user)
                head.appendChild(span)

                postText = document.createElement('div');
                postText.classList.add('post-text')
                postText.classList.add('text-muted')
                postText.innerHTML = newPostText

                postPhoto = document.createElement( 'div' );
                postPhoto.classList.add('photo')

                postImg = document.createElement('img');
                postImg.src = response["post_photo"]

                postPhoto.appendChild(postImg)

                actionButtons = document.createElement('div')
                actionButtons.classList.add('action-buttons')

                actionButtons.innerHTML = `
                <div class="interaction-button">
                    <div class="like-button">
                        <span>
                            <i class="fa-solid fa-heart"></i>
                        </span>
                        <span>
                            <i class="fa-regular fa-heart active"></i>
                        </span>
                    </div>
                    <span>
                        <i class="fa-regular fa-comment active"></i>
                    </span>
                </div>
                `

                feed.appendChild(head)
                feed.appendChild(postText)
                feed.appendChild(postPhoto)
                feed.appendChild(actionButtons)

                posts.insertBefore(feed, posts.firstChild)
            }
        )
}

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
        const profilePhoto = editPostDiv.querySelector('.profile-photo')
        const userName = editPostDiv.querySelector('h3')
        const locationTime = editPostDiv.querySelector('small')
        const postPhoto = editPostDiv.querySelector('.post-photo')
        const textPhoto = editPostDiv.querySelector('.text-photo-img')
        console.log(profilePhoto)
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

//USER POST BUTTONS
const postMenuBtns = document.querySelectorAll('.post-menu-btn')
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

//BEFRIEND
const befriendBtns = document.querySelectorAll('.befriend')
befriendBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fetch(`http://localhost:5000/friend_action`,{
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

//UNFRIEND
const unfriendBtns = document.querySelectorAll('.unfriend')
unfriendBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        fetch(`http://localhost:5000/friend_action`,{
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

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            entry.target.classList.add('intersecting')
            fetch('http://localhost:5000/post?post_id=1',{
                method: 'GET',
            }).then(
                response => response.json()
            ).then(
                response => {
                    console.log(JSON.stringify(response))
                    setTimeout(() => {
                        loadMorePosts(response)
                    }, 1000)
                }
            )
        }
    })
},
{
    threshold: 0.2
}
)

const loader = document.querySelectorAll('.loader')

for(let i = 0; i < loader.length; i++){
    const elements = loader[i];

    observer.observe(elements);
}

const loadMorePosts = (response) => {
    feed = document.createElement( 'div' );
    feed.classList.add('feed')

    head = document.createElement( 'div' );
    head.classList.add('head')

    user = document.createElement( 'div' );
    user.classList.add('user')

    profilePhoto = document.createElement( 'div' );
    profilePhoto.classList.add('profile-photo')

    profileImg = document.createElement('img');
    profileImg.src = response['user_photo']

    profilePhoto.appendChild(profileImg)

    ingo = document.createElement( 'div' );
    ingo.classList.add('ingo')

    h3 = document.createElement( 'h3' );
    h3.innerHTML = response['user_name']
    small = document.createElement( 'small' );
    small.innerHTML = `${response["location"]}, ${response["time"]} AGO`

    ingo.appendChild(h3)
    ingo.appendChild(small)

    user.appendChild(profilePhoto)
    user.appendChild(ingo)

    span = document.createElement('span')
    span.classList.add('edit')
    span.innerHTML = `
        <i class="uil uil-ellipsis-h" id="context-dropdown"></i>
                            
        <div class="context-menu">
            <div class="dropdownmenu">
                <div class="card">

                </div>
            </div>
        </div>
    `
    head.appendChild(user)
    head.appendChild(span)

    postText = document.createElement('div');
    postText.classList.add('post-text')
    postText.classList.add('text-muted')
    postText.innerHTML = response['post_text']

    postPhoto = document.createElement( 'div' );
    postPhoto.classList.add('photo')

    postImg = document.createElement('img');
    postImg.src = response["post_photo"]

    postPhoto.appendChild(postImg)

    actionButtons = document.createElement('div')
    actionButtons.classList.add('action-buttons')

    actionButtons.innerHTML = `
    <div class="interaction-button">
        <div class="like-button">
            <span>
                <i class="fa-solid fa-heart"></i>
            </span>
            <span>
                <i class="fa-regular fa-heart active"></i>
            </span>
        </div>
        <span>
            <i class="fa-regular fa-comment active"></i>
        </span>
    </div>
    `

    feed.appendChild(head)
    feed.appendChild(postText)
    feed.appendChild(postPhoto)
    feed.appendChild(actionButtons)

    posts.appendChild(feed, posts.firstChild)
}