window.onunload = () => window.scrollTo(0,0); // Go to top of window when page refreshed

//// DOTTED LINES ////

const drawDottedLines = () => {
    const docHeight = document.querySelector('main').getBoundingClientRect().height;
    const svgElement = document.querySelector('svg'); 
    svgElement.style.height = `${docHeight}px`;

    const targetNodes = document.querySelectorAll('.circle'); 

    const addDottedLine = (circle1, circle2) => {
        const originalLine = document.querySelector('.main-line.original'); 

        const newLine = originalLine.cloneNode(false); 
        newLine.classList.add('temporary'); 
        newLine.classList.remove('original'); 
        originalLine.after(newLine); //Inserts new line element after original

        //Retrieves the x and y values of the center points within both circles
        const x1 = circle1.offsetLeft + (circle1.offsetWidth / 2);
        const y1 = circle1.offsetTop + (circle1.offsetHeight / 2);
        const x2 = circle2.offsetLeft + (circle2.offsetWidth / 2);
        const y2 = circle2.offsetTop + (circle2.offsetHeight / 2);

        //Creates a line element connecting the center points of both circles
        newLine.setAttribute('x1', x1); 
        newLine.setAttribute('y1', y1); 
        newLine.setAttribute('x2', x2); 
        newLine.setAttribute('y2', y2);
    }; 

    document.querySelectorAll('.temporary').forEach(el => el.remove()); //Removes all previously drawn lines

    //Runs the addDottedLine function for each circle element up to the second last one
    targetNodes.forEach((el, i) => { 
        if (i + 1 <= targetNodes.length - 1) addDottedLine(el, targetNodes[i + 1]); 
    }); 
}

(function initializeDottedLines() {
    drawDottedLines(); 
    window.addEventListener('resize', drawDottedLines); 
})(); 

//// ELEMENT TRANSLATE ////

(function translateElements() {
    const initialElements = document.querySelectorAll('.initial-slide');

    const revealElement = (entries, observer) => {
        const [entry] = entries;
        
        entry.target.classList.remove('initial-hidden'); //Removes the inital-hidden class, causing the elements to translate upwards
        observer.unobserve(entry.target);
        drawDottedLines(); //Rerun the drawDottedLines function due to the repositioning of elements
    }; 

    const sectionObserver = new IntersectionObserver(revealElement, { threshold: [0, 0.1] }); 

    initialElements.forEach((element) => {
        sectionObserver.observe(element);
        element.classList.add('initial-hidden');
    });
})(); 


//// PERFORMANCE SLIDER ////

(function initializeSlider() {
    const slides = document.querySelectorAll('.performance');
    const buttonLeft = document.querySelector('.button-left');
    const buttonRight = document.querySelector('.button-right');

    let currentSlide = 0;
    const maxSlide = slides.length;

    const goToSlide = (slide) => {
        slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`)
    }; 

    const handleNextSlide = () => {
        if (currentSlide === maxSlide - 1) currentSlide = 0;
        else currentSlide++;

        goToSlide(currentSlide);
    }; 

    const handlePrevSlide = () => {
        if (currentSlide === 0) currentSlide = maxSlide - 1;
        else currentSlide--;

        goToSlide(currentSlide);
    }; 

    goToSlide(0);

    buttonRight.addEventListener('click', handleNextSlide);
    buttonLeft.addEventListener('click', handlePrevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') handleNextSlide();
        if (e.key === 'ArrowLeft') handlePrevSlide();
    });
})();


//// AUDIO ////

(function initializeAudio() {
    const audioCheckElement = document.querySelector('.audio-check'); 

    const handleAudio = () => {
        const circleElements = document.querySelectorAll('.circle'); 
        const audioElements = Array.from(document.querySelectorAll('.main-audio')); 

        circleElements.forEach((el, i) => {
            el.addEventListener('mouseenter', () => {
                audioElements[i].play(); 
            }); 

            el.addEventListener('mouseleave', () => {
                audioElements[i].pause(); 
                audioElements[i].currentTime = 0; 
            }); 
        }); 
    }; 

    audioCheckElement.style.transform = 'translateX(0px)'; //Shows the audioCheckElement

    audioCheckElement.addEventListener('click', (e) => {
        e.preventDefault(); 
        audioCheckElement.style.transform = 'translateX(-500px)'; //Hides the audioCheckElement
        handleAudio(); 
    }); 
})(); 