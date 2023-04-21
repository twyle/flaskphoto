//CREATE POST
const createPostBtn = document.querySelector('.create-post-btn')
const createPostFormDiv = document.querySelector('.create-post')
const createPostForm = document.querySelector('.create-post-form')


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