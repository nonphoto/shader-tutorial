document.addEventListener('keyup', (event) => {
    if (event.keyCode === 80) {
        document.body.classList.toggle('is-presentation-mode')
    }
})

const sections = Array.from(document.querySelectorAll('section'))

sections.forEach((section, index) => {
    section.addEventListener('click', (event) => {
        if (event.target.hasAttribute('href')) return

        const nextIndex = (index + 1) % sections.length
        const next = sections[nextIndex]
        const bounds = next.getBoundingClientRect()
        const offset = bounds.top + window.pageYOffset
        window.scrollTo(0, offset)
    })
})