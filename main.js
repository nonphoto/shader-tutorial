document.addEventListener('keyup', (event) => {
    if (event.keyCode === 80) {
        document.body.classList.toggle('is-presentation-mode')
    }
})