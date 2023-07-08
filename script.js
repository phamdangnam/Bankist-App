'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

let btnScroll = document.querySelector('.btn--scroll-to')
let section1 = document.querySelector('#section--1')
let tabsContainer = document.querySelector('.operations__tab-container')

// Smooth scrolling
btnScroll.addEventListener('click', function(e) {
    section1.scrollIntoView({ behavior: 'smooth' })
})

// Page Navigation
document.querySelector('.nav__links').addEventListener('click', function(e) {
    // In order to stop instant scrolling from HTML
    e.preventDefault()
    if (e.target.classList.contains('nav__link')) {
        // GetAttribute(...) gives you the literal value of href while .href gives the path
        document.querySelector(e.target.getAttribute('href')).scrollIntoView({ behavior: 'smooth' })
    }
})

let tabs = document.querySelectorAll('.operations__tab')
let tabsContent = document.querySelectorAll('.operations__content')

// Tabbed Component
tabsContainer.addEventListener('click', function(e) {
    const clicked = e.target.closest('.operations__tab')
    const tabNum = clicked.dataset.tab

    if (!clicked) return;

    tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
    tabsContent.forEach(tabsContent => tabsContent.classList.remove('operations__content--active'))

    clicked.classList.add('operations__tab--active')
    document.querySelector(`.operations__content--${tabNum}`).classList.add('operations__content--active')
})

// Fading other buttons when mouse is over
const handleHover = function(e) {
    if (e.target.classList.contains('nav__link')) {
        const hovered = e.target
        const childrens = hovered.closest('.nav').querySelectorAll('.nav__link')
        const logo = hovered.closest('.nav').querySelector('img')

        childrens.forEach(c => {
            if (c != hovered) c.style.opacity = this
        })
        logo.style.opacity = this
    }
}

document.querySelector('.nav__links').addEventListener('mouseover', handleHover.bind(0.5))
document.querySelector('.nav__links').addEventListener('mouseout', handleHover.bind(1))

// Revealing header bar when scroll
let nav = document.querySelector('.nav')
let header = document.querySelector('.header')

const stickyNav = function(entries) {
    const [entry] = entries
    if (!entry.isIntersecting) {
        nav.classList.add('sticky')
    } else {
        nav.classList.remove('sticky')
    }
}

const options = {
    root: null,
    threshold: 0,
    rootMargin: `-${nav.getBoundingClientRect().height}px`
}

const observer = new IntersectionObserver(stickyNav, options)
observer.observe(header)

// Revealing elements on scroll
let sections = document.querySelectorAll('.section')

const revealSection = function(entries, observer) {
    const [entry] = entries

    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)
}

const sectionOptions = {
    root: null,
    threshold: 0.15,
}

const sectionObserver = new IntersectionObserver(revealSection, sectionOptions)
sections.forEach(section => [
    sectionObserver.observe(section)
])

// Lazy loading images
const imgs = document.querySelectorAll('img[data-src]')

const loadImg = function(entries, observer) {
    const [entry] = entries
    if (!entry.isIntersecting) return
    entry.target.src = entry.target.dataset.src

    /* Important: we use the load event because in case the user's connection
    is bad, the blur filter will be taken off too fast before the image finish 
    loading (switching from src to dataset.src) which will return in the users
    seeing a very ugly, low resolution image */
    entry.target.addEventListener('load', function() {
        entry.target.classList.remove('lazy-img');
    })
    observer.unobserve(entry.target)
}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '-50px',
})

imgs.forEach(img => imgObserver.observe(img))

// Slider
const slides = document.querySelectorAll('.slide')
const btnRight = document.querySelector('.slider__btn--right')
const btnLeft = document.querySelector('.slider__btn--left')
const dotContainer = document.querySelector('.dots')
let curSlide = 0

const goToSlide = function(current) {
    slides.forEach((s, i) => {
        s.style.transform = `translateX(${(i-current)*100}%)`
    })
    console.log("a")
}

const createDots = function() {
    slides.forEach((_, i) => {
        dotContainer.insertAdjacentHTML(
            'beforeend',
            `<button class="dots__dot" data-slide="${i}"></button>`
        );
    })
}

const activateDot = function(i) {
    document.querySelectorAll('.dots__dot').forEach(d => d.classList.remove('dots__dot--active'))
    document.querySelector(`.dots__dot[data-slide='${i}']`).classList.add('dots__dot--active')
}

const init = function() {
    goToSlide(0)
    createDots()
    activateDot(0)
}
init()

const nextSlide = function() {
    if (curSlide === slides.length - 1) {
        curSlide = 0
    } else {
        curSlide++
    }
    goToSlide(curSlide)
}

const prevSlide = function() {
    if (curSlide === 0) {
        curSlide = slides.length - 1
    } else {
        curSlide--
    }
    goToSlide(curSlide)
}

btnRight.addEventListener('click', nextSlide)
btnLeft.addEventListener('click', prevSlide)

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight') {
        nextSlide()
    } else {
        prevSlide()
    }
})

dotContainer.addEventListener('click', function(e) {
    if (!e.target.classList.contains('dots__dot')) return
    const i = e.target.dataset.slide
    goToSlide(i)
    activateDot(i)
})