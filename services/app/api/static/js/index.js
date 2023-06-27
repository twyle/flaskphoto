//CREATE POST
const createPostBtn = document.querySelector('.create-post-btn')
const createPostFormDiv = document.querySelector('.create-post')
const createPostForm = document.querySelector('.create-post-form')
const posts = document.querySelector('.feeds')

//EDIT 
const editPostBtn = document.querySelector('.submit-edited-post')
const editPostDiv = document.querySelector('.edit-post')
const updatePostImage = document.querySelector('.post-image-update')
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
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-heart')) {
        const likeButtons = e.target.closest('.like-button')
        const likeButtonSolid = likeButtons.querySelector('.fa-solid')
        const likeButtonRegular = likeButtons.querySelector('.fa-regular')
        likeButtonSolid.classList.toggle('active')
        likeButtonRegular.classList.toggle('active')
        likeButtonSolid.style.color = 'red'
        likeButtonSolid.style.fontSize = '2rem'
        setTimeout(() => {
            likeButtonSolid.style.fontSize = '1.4rem'
        }, 1000)
        const post = e.target.closest('.feed')
        const postId = post.id
        fetch(`http://localhost:5000/post/like?post_id=${postId}`, {
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )
    }
})

//COMMENT
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-comment')) {
        const feed = e.target.closest('.feed')
        const comment = feed.querySelector('.comment-box')
        console.log(feed)
        comment.style.display = 'block'
    }
})

document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('comment-form')) {
        e.preventDefault()

        const formData = new FormData(e.target)
        fetch(e.target.action, {
            method: 'POST',
            body: formData
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )

        e.target.style.display = 'none'
    }
})

//PROFILE
const profileBtns = document.querySelectorAll('.profile-menu')
const viewProfile = document.querySelector('.view-profile')
const closeProfile = document.querySelector('.close-profile')
profileBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const userId = btn.id
        fetch(`http://localhost:5000/auth/get?user_id=${userId}`, {
            method: 'GET',
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
                const heading = viewProfile.querySelector('h1')
                heading.textContent = `${response['user_name']}'s Profile.`
                const profileImg = viewProfile.querySelector('.profile-menu-img')
                profileImg.src = response['image']
                const userName = viewProfile.querySelector('h3')
                userName.textContent = response['user_name']
                const userNametxt = viewProfile.querySelector('#user-name')
                userNametxt.value = response['user_name']
                const emailText = viewProfile.querySelector('#email')
                emailText.value = response['email']
                const handleTxt = viewProfile.querySelector('#handle')
                handleTxt.value = response['handle']
            }
        )
        viewProfile.style.display = 'block'
    })
})

closeProfile.addEventListener('click', () => {
    viewProfile.style.display = 'none'
})

// userProfileBtn.addEventListener('click', () => {
//     profileCtxMenu.style.display = 'none'
//     editProfileDiv.style.display = 'block'
// })

// editProfileDiv.addEventListener('click', (e) => {
//     if (e.target.classList.contains('edit-profile')) {
//         editProfileDiv.style.display = 'none'
//     }
// })

// document.addEventListener('click', (e) => {
//     if (e.target.classList.contains('profile-photo')) {
//         console.log(e.target)
//         const viewProfile = document.querySelector('.view-user-profile')
//         viewProfile.style.display = 'block'
//     }
// })


//CREATE POST
const newPostImageUpload = document.querySelector('.new-post-image')
newPostImageUpload.addEventListener('click', () => {
    const photoHolder = createPostFormDiv.querySelector('.photo-holder')
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = event => {
        const imageFiles = event.target.files
        const imageFilesLength = imageFiles.length
        if (imageFilesLength > 0) {
            image = imageFiles[0]
            const imageSrc = URL.createObjectURL(imageFiles[0])
            photoHolder.classList.add('photo')
            const postPhoto = createPostFormDiv.querySelector('.post-photo')
            postPhoto.src = imageSrc
        }
    }

    input.click();
})

createPostBtn.addEventListener('click', () => {
    createPostFormDiv.style.display = 'grid';
})

createPostFormDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('create-post')) {
        createPostFormDiv.style.display = 'none'
        const formData = new FormData(createPostForm)
        formData.append('file', image)
        fetch(createPostForm.action, {
            method: 'POST',
            body: formData
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
                // createNewPost(createPostForm)
            }
        )

        createPostFormDiv.style.display = 'none'
    }
})

createPostForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(createPostForm)
    formData.append('file', image)
    fetch(createPostForm.action, {
        method: 'POST',
        body: formData
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))
            // createNewPost(createPostForm)
        }
    )

    createPostFormDiv.style.display = 'none'
})

const createNewPost = (form) => {
    const postId = 2
    const formData = new FormData(form)
    const newPostLocation = formData.get('location')
    const newPostText = formData.get('text')
    fetch(`http://localhost:5000/post?post_id=${postId}`, {
        method: 'GET'
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))
            feed = document.createElement('div');
            feed.classList.add('feed')

            head = document.createElement('div');
            head.classList.add('head')

            user = document.createElement('div');
            user.classList.add('user')

            profilePhoto = document.createElement('div');
            profilePhoto.classList.add('profile-photo')

            profileImg = document.createElement('img');
            profileImg.src = response['user_photo']

            profilePhoto.appendChild(profileImg)

            ingo = document.createElement('div');
            ingo.classList.add('ingo')

            h3 = document.createElement('h3');
            h3.innerHTML = response['user_name']
            small = document.createElement('small');
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

            postPhoto = document.createElement('div');
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
    if (e.target.classList.contains('fa-trash-can')) {
        const post = e.target.closest('.feed')
        const postId = post.id
        fetch(`http://localhost:5000/post?post_id=${postId}`, {
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
    if (e.target.classList.contains('fa-pen-to-square')) {
        oldPost = e.target.closest('.feed')
        const postId = oldPost.id
        editPostDiv.id = postId
        const profilePhoto = editPostDiv.querySelector('.profile-menu-img')
        console.log(profilePhoto)
        const userName = editPostDiv.querySelector('h3')
        const locationTime = editPostDiv.querySelector('small')
        const postPhoto = editPostDiv.querySelector('.post-photo')
        const textPhoto = editPostDiv.querySelector('.text-photo-img')
        console.log(profilePhoto)
        fetch(`http://localhost:5000/post?post_id=${postId}`, {
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
                profilePhoto.src = response['author_image']
                userName.textContent = response['author_name']
                locationTime.textContent = `${response['location']}, ${response['publish_time']} Minutes AGO`
                postPhoto.src = response['photo']
                textPhoto.src = response['author_image']
            }
        )
        editPostDiv.style.display = 'grid'
    }
})

editPostDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-post')) {
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
        if (imageFilesLength > 0) {
            image = imageFiles[0]
            const imageSrc = URL.createObjectURL(imageFiles[0])
            console.log(postPhoto)
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
    if (postText.value) {
        formData.append('text', postText.value)
    }
    if (image) {
        formData.append("file", image)
    }
    fetch(`http://localhost:5000/post?post_id=${postId}`, {
        method: 'PUT',
        body: formData
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))

            const oldText = oldPost.querySelector('.post-text')
            const oldImageDiv = oldPost.querySelector('.photo')
            const oldImage = oldImageDiv.querySelector('img')
            console.log(postId)

            fetch(`http://localhost:5000/post?post_id=${postId}`, {
                method: 'GET'
            }).then(
                response => response.json()
            ).then(
                response => {
                    console.log(JSON.stringify(response))
                    oldImage.src = response['photo']
                    oldText.textContent = response['text']
                }
            )

            editPostDiv.style.display = 'none'

        }
    )

})

//PROFILE DROPDOWN
profileDropdwon.addEventListener('click', () => {
    profileCtxMenu.style.display = 'block'
    setTimeout(() => {
        profileCtxMenu.style.display = 'none'
    }, 2000)
})

//EDIT PROFILE
const updateProfileImage = document.querySelector('.profile-image-update')
updateProfileImage.addEventListener('click', () => {
    const profilePhoto = editProfileDiv.querySelector('.profile-menu-img')
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = event => {
        const imageFiles = event.target.files
        const imageFilesLength = imageFiles.length
        if (imageFilesLength > 0) {
            image = imageFiles[0]
            const imageSrc = URL.createObjectURL(imageFiles[0])
            console.log(profilePhoto)
            profilePhoto.src = imageSrc
        }
    }

    input.click();
})
userProfileBtn.addEventListener('click', () => {
    profileCtxMenu.style.display = 'none'
    editProfileDiv.style.display = 'block'
})

const editProfileForm = document.querySelector('.edit-profile-form')
editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const form = new FormData(editProfileForm)
    const userId = form.id
    fetch(`http://localhost:5000/auth/update?user_id=${ userId }`, {
        method: 'PUT',
        body: form
    }).then(
        response => response.json()
    ).then(
        response => {
            console.log(JSON.stringify(response))
            editProfileDiv.style.display = 'none'
        }
    )
})

// editProfileDiv.addEventListener('click', (e) => {
//     if (e.target.classList.contains('edit-profile')) {
//         fetch(`http://localhost:5000/auth/update`, {
//             method: 'PUT'
//         }).then(
//             response => response.json()
//         ).then(
//             response => {
//                 console.log(JSON.stringify(response))
//             }
//         )
//         editProfileDiv.style.display = 'none'
//     }
// })

//USER POST BUTTONS
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('post-menu-btn')) {
        const postMenuDiv = e.target.nextElementSibling
        console.log(postMenuDiv)
        postMenuDiv.style.display = 'block'
        setTimeout(() => {
            postMenuDiv.style.display = 'none'
        }, 3000)
    }
})

//BEFRIEND
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-user-plus')) {
        console.log(e.target.getAttribute('userid'))
        console.log(e.target.getAttribute('friendid'))
        fetch(`http://localhost:5000/befriend`, {
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )
    }
})

//UNFRIEND
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('fa-user-minus')) {
        fetch(`http://localhost:5000/friend_action`, {
            method: 'GET'
        }).then(
            response => response.json()
        ).then(
            response => {
                console.log(JSON.stringify(response))
            }
        )
    }
})

var offSet = 2
const limit = 2

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('intersecting')
            fetch(`http://localhost:5000/post/load_posts?offset=${offSet}&limit=${limit}`, {
                method: 'GET',
            }).then(
                response => response.json()
            ).then(
                response => {
                    offSet = offSet + limit;
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

for (let i = 0; i < loader.length; i++) {
    const elements = loader[i];

    observer.observe(elements);
}

const loadMorePosts = (new_posts) => {
    new_posts.forEach(post => {
        feed = document.createElement('div');
        feed.classList.add('feed')
        feed.id = post['id']

        head = document.createElement('div');
        head.classList.add('head')

        user = document.createElement('div');
        user.classList.add('user')

        profilePhoto = document.createElement('div');
        profilePhoto.classList.add('profile-photo')

        profileImg = document.createElement('img');
        profileImg.src = post['author_image']

        profilePhoto.appendChild(profileImg)

        ingo = document.createElement('div');
        ingo.classList.add('ingo')

        h3 = document.createElement('h3');
        h3.innerHTML = post['author_name']
        small = document.createElement('small');
        small.innerHTML = `${post["location"]}, ${post["publish_time"]} AGO`

        ingo.appendChild(h3)
        ingo.appendChild(small)

        user.appendChild(profilePhoto)
        user.appendChild(ingo)

        span = document.createElement('span')
        span.classList.add('edit')
        span.innerHTML = `
        <i class="uil uil-ellipsis-h post-menu-btn"></i>

        <div class="post-menu">
            <div class="dropdownmenu">
                <div class="card">
                    <div class="befriend ctx-menu">
                        <span>
                            <i class="fa-solid fa-user-plus"></i>
                        </span>
                        <small class="menu-item">Befriend</small>
                    </div>
                    <div class="unfriend ctx-menu">
                        <span>
                            <i class="fa-solid fa-user-minus" ></i>
                        </span>
                        <small class="menu-item">Unfriend</small>
                    </div>
                </div>
            </div>
        </div>
        `
        head.appendChild(user)
        head.appendChild(span)

        postText = document.createElement('div');
        postText.classList.add('post-text')
        postText.classList.add('text-muted')
        postText.innerHTML = post['text']

        postPhoto = document.createElement('div');
        postPhoto.classList.add('photo')

        postImg = document.createElement('img');
        postImg.src = post["photo"]

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

        <div class="bookmark">
            <span>
                <i class="fa-regular fa-pen-to-square active"></i>
            </span>
            <span>
                <i class="fa-regular fa-trash-can active"></i>
            </span>
        </div>
        `

        form = document.createElement('form')
        form.classList.add('comment-box')
        form.classList.add('comment-form')
        form.method = 'post'
        form.action = `http://localhost:5000/post/comment?post_id=${post.id}&user_id=${post.user_id}`

        createText = document.createElement('div')
        createText.classList.add('create-text')

        commentProfile = document.createElement('div')
        commentProfile.classList.add('profile-photo')
        commentProfile.classList.add('profile-menu')
        commentProfile.id = post['user_id']

        commentProfileImg = document.createElement('img')
        commentProfileImg.src = post['author_image']

        commentProfile.appendChild(commentProfileImg)

        create = document.createElement('div')
        create.classList.add('create')

        commentTextBox = document.createElement('input')
        commentTextBox.type = 'text'
        commentTextBox.name = 'comment-text'
        commentTextBox.placeholder = 'Comment on Post..'

        create.appendChild(commentTextBox)

        submitButton = document.createElement('input')
        submitButton.type = 'submit'
        submitButton.classList.add('btn')
        submitButton.classList.add('btn-primary')
        submitButton.classList.add('submit-comment')

        createText.appendChild(commentProfile)
        createText.appendChild(create)
        createText.appendChild(submitButton)

        form.appendChild(createText)

        liked_by = document.createElement('div')
        liked_by.classList.add('liked-by')

        post['liked_by'].forEach(img_src => {
            imgSpan = document.createElement('span')
            img = document.createElement('img')
            img.src = img_src
            imgSpan.appendChild(img)
            liked_by.appendChild(imgSpan)
        })

        top_like = document.createElement('p')
        top_like.innerHTML = `Liked by <b>${post['influencer']}</b> and ${post['likes_count']} others`

        liked_by.appendChild(top_like)

        caption = document.createElement('div')
        caption.classList.add('caption')

        captionParagraph = document.createElement('p')
        captionParagraph.innerHTML = `<b>${post.comment['author']}</b> ${post['comment']['text']}`

        caption.appendChild(captionParagraph)

        viewComments = document.createElement('div')
        viewComments.classList.add('comments')
        viewComments.classList.add('text-muted')
        viewComments.innerHTML = `View all ${post.comments_count} comments`

        feed.appendChild(head)
        feed.appendChild(postText)
        feed.appendChild(postPhoto)
        feed.appendChild(actionButtons)
        feed.appendChild(form)
        feed.appendChild(liked_by)
        feed.appendChild(caption)
        feed.appendChild(viewComments)

        posts.appendChild(feed, posts.firstChild)
    })

}