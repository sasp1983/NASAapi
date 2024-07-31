// fetch('https://images-api.nasa.gov')

let arrowLeftBtn = document.querySelector('.arrow-left');
let arrowRightBtn = document.querySelector('.arrow-right');
let arrowTopLeftBtn = document.querySelector('.arrow-top-left');
let arrowTopRightBtn = document.querySelector('.arrow-top-right');
let solBtnLeft = document.querySelector('.solbtn-left-container');
let solBtnRight = document.querySelector('.solbtn-right-container');
let loadingBtn = document.querySelectorAll('.loading-btn');
let loadingImg = document.querySelectorAll('.loading-img')
let roverChoice = document.querySelector('#rovers')
let loadingRover = document.querySelector('.loading-rover')
let roverContainer = document.querySelector('.rover-container');
let hideMenuBtn = document.querySelector('.hide-container');
let menuContainer = document.querySelector('.menu-container');
let hideText = document.querySelector('.hide-text');
let arrowUp = document.querySelector('.arrow-up')
let h1 = document.querySelector('.h1');

let solDate = 1000;

let i = 0;

let imgArray = []
let pageNumber = 1;
let pictureGrid = document.querySelector('.picture-grid');
let imgContainers = document.querySelectorAll('.img-container');
let images = document.querySelectorAll('.grid-img');
let pageBtnContainer = document.querySelector('.pagebtn-container')
let buttons = document.querySelectorAll('.pagebtn');
let solDateInput = document.getElementById('sol-date');
solDateInput.setAttribute('placeholder', `${solDate}`)
let solDateWarning = document.querySelector('.no-imgs');
let solInputLine = document.querySelector('.sol-input-line');
let loadingSol = document.querySelector('.loading-sol');
let solBtns = document.querySelector('.sol-date-btns');
let pageNumberText = document.querySelector('.page-number-text');
let scrollBtnRight = document.querySelector('.scroll-btn-right')
let scrollBtnLeft = document.querySelector('.scroll-btn-left');
let loadingInput = document.querySelectorAll('.loading-input');
let rover;
rover = 'curiosity';

async function fetchImages() {
    try {
        // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}`);

        if (!response.ok) {
            throw new Error("ADJAS")
        }
        const data = await response.json();
        let imgArray = data.photos;
        // console.log('imgArray length:', imgArray.length);

        // console.log(response)
        // console.log(data)

        //if no images found on sol date


        if (imgArray.length === 0) {
            try {
                // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

                const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}`);


                if (!response.ok) {
                    throw new Error("ADJAS")
                }
                const data = await response.json();

                imgArray = data.photos;
                // console.log('imgArray length:', imgArray.length);
                if (imgArray.length === 0) {
                    solDateWarning.classList.remove('hidden');
                    pictureGrid.classList.add('hidden');
                    solDateWarning.textContent = `No images found on Sol Date ${solDate}`;
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            solDateWarning.classList.add('hidden');
            pictureGrid.classList.remove('hidden');
            showImages();
        }




        //loop to fetch images
        for (i = 0; i < imgArray.length; i++) {
            let images = document.querySelectorAll('.grid-img');
            images[i].src = imgArray[i].img_src;
            let imgLink = document.querySelectorAll('a');
            imgLink[i].src = imgArray[i].img_src;
            imgLink[i].href = imgArray[i].img_src;
            images[i].onload = images[i].style.opacity = '100%';

            // //highlight page buttons
            // highlightButtons = () => {
            //     buttons.forEach(p => {
            //         if (p.id == pageNumber) {
            //             p.classList.add('current-page');
            //         } else {
            //             p.classList.remove('current-page')
            //         }
            //     })
            // }
            // highlightButtons();
        }

        //hide image containers of non-fetched images when at last page 
        function hideImages() {
            imgContainers.forEach(c => {
                let index = Array.from(pictureGrid.children).indexOf(c);
                // console.log(index)
                // console.log(pictureGrid.children)
                if (index + 1 > imgArray.length) {
                    c.classList.add('hidden');
                } else {
                    c.classList.remove('hidden');
                }
                // console.log(index)
            });
        }
        showImages();
        hideImages();

        solDateInput.setAttribute('placeholder', `${solDate}`);

    } catch (error) {
        console.error(error)
    }
    // console.log('clientWidth:', (pageBtnContainer.clientWidth));
    // console.log('scrollWidth:', (pageBtnContainer.scrollWidth));
}

async function fetchPageCount() {
    try {
        // const responseNoPages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        const responseNoPages = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        if (!responseNoPages.ok) {
            throw new Error("ADJAS")
        }

        const dataNoPages = await responseNoPages.json();
        // console.log(dataNoPages);
        // console.log(responseNoPages);
        // console.log('array length:', dataNoPages.photos.length);
        window.pageCount = Math.ceil(dataNoPages.photos.length / 25);
        // console.log('pageCount:', window.pageCount);
        pageNumberText.textContent = pageCount === 1 ? `Page (${pageCount})` : `Pages (${pageCount})`;

        //page forward button 
        arrowRightBtn.addEventListener('click', function (e) {
            // console.log('pageNumber', pageNumber);
            e.stopImmediatePropagation();
            if (pageNumber < pageCount) {
                // console.log('pageCount arrowRightBtn', pageCount);
                pageNumber++;
                // pageBtnContainer.scrollLeft += 30;
                fetchImages();
                // window.scroll({ top: 0, behavior: 'smooth' });
                hideToRefreshImages();
                centerCurrentPageBtn();
                highlightButtons();
                e.stopImmediatePropagation();
            }
        });

        //page back button
        arrowLeftBtn.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            if (pageNumber >= 2) {
                pageNumber--;
                fetchImages();
                // window.scroll({ top: 0, behavior: 'smooth' });
                hideToRefreshImages();
                centerCurrentPageBtn();
                highlightButtons();
            }
        });


        //page forward button top
        arrowTopRightBtn.addEventListener('click', function (e) {

            // console.log('pageCount arrowTopRightBtn', pageCount)
            if (pageNumber < pageCount) {
                pageNumber++;
                fetchImages();
                // fetchPageCount();
                hideToRefreshImages();
                centerCurrentPageBtn();
                // clearInterval(hightlightLoop)
                highlightButtons();
                // scrollTo(20);
            }
            // console.log(pageCount)
            e.stopImmediatePropagation();
        });

        //page back button top
        arrowTopLeftBtn.addEventListener('click', function (e) {
            console.log('pageCount arrowLeftBtn', pageCount)
            if (pageNumber >= 2) {
                pageNumber--;
                fetchImages();
                // fetchPageCount();
                // window.scroll({ top: 0, behavior: 'smooth' });
                hideToRefreshImages();
                centerCurrentPageBtn();
                highlightButtons();
            }
            e.stopImmediatePropagation();
        });

        //scroll through page buttons
        pageBtnContainer.addEventListener('wheel', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            // console.log('scrollWidth', this.scrollWidth)
            // console.log('clientWidth', this.clientWidth)
            console.log('offsetLeft pageBtnContainer', this.offsetLeft)
            // console.log('clientLeft', this.clientLeft)
            console.log()
            e.stopPropagation();
            pageBtnContainer.scrollBy({
                left: e.deltaY < 0 ? -10 : 10,
            })

            buttons.forEach(b => {
                if (!b.classList.contains('hidden')) {
                    // console.log('bPos:', b.id, bPos);
                    // console.log('boffsettLeft', bOffset)
                    if (b.classList.contains('current-page')) {
                        console.log('%c scrollLeft pageBtnContainer:', 'background-color: red;color:white', this.scrollLeft)
                        let bOffset = b.offsetLeft;
                        let bPos = b.getBoundingClientRect().left;
                        // console.log('current', b.id)
                        console.log('offsetLeft currentpage btn', bOffset, b.id)
                        console.log('b.getBoundingClientRect', bPos)
                    }
                }
            })
        })

        //make buttons go to page number
        // buttons.forEach(pagebtn => {
        //     pagebtn.addEventListener('click', function (e) {
        //         e.stopImmediatePropagation();
        //         pageNumber = pagebtn.id;
        //         fetchImages();
        //         fetchPageCount();
        //         centerCurrentPageBtn()
        //         highlightButtons()
        //         hideToRefreshImages();
        //     })
        // })

        //make buttons go to page number (efficient method)
        pageBtnContainer.addEventListener('click', function (e) {
            if (e.target.className === 'pagebtn') {
                pageNumber = e.target.id;
                fetchImages();
                fetchPageCount();
                centerCurrentPageBtn()
                highlightButtons()
                hideToRefreshImages();
            }
        })


        // //highlight page buttons
        // highlightButtons = () => {
        //     buttons.forEach(p => {
        //         if (p.id == pageNumber) {
        //             p.classList.add('current-page');
        //         } else {
        //             p.classList.remove('current-page')
        //         }
        //     })
        //     console.log('sup')
        // }
        // hightlightLoop = setInterval(highlightButtons, 500)

        //hide page buttons to match the page count
        function hideExcessButtons() {
            buttons.forEach(p => {
                if (p.innerText > pageCount) {
                    p.classList.add('hidden');
                } else {
                    p.classList.remove('hidden');
                    pageNumberText.classList.remove('hidden');
                    arrowTopLeftBtn.classList.remove('hidden')
                    arrowTopRightBtn.classList.remove('hidden')
                    // showImages();
                }
            })
        }

        //hide loading buttons to match the page count
        hideExcessButtons();

        // function hideExcessLoadingButtons() {
        //     loadingBtn.forEach(p => {
        //         if (p.innerText > pageCount) {
        //             p.classList.add('hidden');
        //         } else {
        //             p.classList.remove('hidden');
        //             // pageNumberText.classList.remove('hidden');
        //             // arrowTopLeftBtn.classList.remove('hidden')
        //             // arrowTopRightBtn.classList.remove('hidden')
        //             // showImages();
        //         }
        //     })
        // }
        // hideExcessLoadingButtons();

        function hideLoadingBtnAnimation() {
            loadingBtn.forEach(btn => {
                btn.classList.add('hidden')
            })
        }

        hideLoadingBtnAnimation()

        //hide loading animation after load
        loadingSol.classList.add('hidden');
        //show input after loading
        solInputLine.classList.remove('hidden')
        //show buttons after loading
        solBtns.classList.remove('hidden');
        //hide rover loading
        loadingRover.classList.add('hidden');
        roverContainer.classList.remove('hidden')


        function hideLoadingInput() {
            loadingInput.forEach(l => {
                l.classList.add('hidden');
            })
        }
        hideLoadingInput();

        function showLoadingInput() {
            loadingInput.forEach(l => {
                l.classList.remove('hidden');
            })
        }

        function loadingAfterSolDateInput() {
            buttons.forEach(btn => {
                btn.classList.add('hidden')
            })
            // loadingSol.classList.remove('hidden')
            loadingBtn.forEach(btn => {
                btn.classList.remove('hidden')
            })
            solBtns.classList.add('hidden');
            solInputLine.classList.add('hidden');
            hideToRefreshImages();
            pageNumberText.classList.add('hidden');

        }

        function hideToRefreshImages() {
            images.forEach(img => {
                img.classList.add('hidden')
            })
        }

        function removeNavBtnLoadingAnimation() {
            arrowRightBtn.style.animation = 'null';
            arrowLeftBtn.style.animation = 'null';
        }

        removeNavBtnLoadingAnimation()

        function addNavBtnLoadingAnimation() {
            arrowRightBtn.style.animation = '';
            arrowLeftBtn.style.animation = '';
        }


        // function createButtons() {

        //     for (let p = 0; p < pageCount; p++) {
        //         let bu = document.createElement('button');
        //         bu.classList.add('pagebtn');
        //         pageBtnContainer.appendChild(bu);
        //         bu.innerText = `${p + 1}`;
        //         bu.id = p + 1;
        //         console.log(p);
        //     }
        // }

        // input dialog for Sol date
        solDateInput.addEventListener('change', function (e) {
            let solValue = solDateInput.value;
            solDate = solValue;
            e.preventDefault();
            e.stopImmediatePropagation();
            pageNumber = 1;
            e.placeholder = solDateInput.value;
            console.log(e.placeholder);
            console.dir(e.target)
            console.log('sol date:', solDateInput.value);
            // solDateInput.value = '';
            fetchImages();
            fetchPageCount();
            console.log('imgArray:', imgArray.length);
            solDateInput.setAttribute('placeholder', `${solDate}`);
            // loadingAfterSolDateInput();
            // addNavBtnLoadingAnimation();
            // arrowTopLeftBtn.classList.add('hidden');
            // arrowTopRightBtn.classList.add('hidden');
            // showLoadingInput();
            hideToRefreshImages();
            pageBtnContainer.scrollTo({ left: 0 });
        })

        solBtnRight.addEventListener('click', function (e) {
            e.preventDefault();
            solDate++;
            // console.log(e.target.value)
            solDateInput.setAttribute('placeholder'.replace(), `${solDate}`);
            solDateInput.value = ``;

            e.stopImmediatePropagation();
            pageNumber = 1;
            // loadingAfterSolDateInput();
            // loadingSol.classList.remove('hidden')
            // addNavBtnLoadingAnimation();
            // arrowTopLeftBtn.classList.add('hidden')
            // arrowTopRightBtn.classList.add('hidden')
            // showLoadingInput();
            hideToRefreshImages();
            pageBtnContainer.scrollTo(0, 0);
            fetchImages();
            fetchPageCount();
        })

        solBtnLeft.addEventListener('click', function (e) {
            e.preventDefault();
            if (!solDate <= 0) {
                solDate--;
                solDateInput.setAttribute('placeholder'.replace(), `${solDate}`);
                solDateInput.value = ``;
                fetchImages();
                fetchPageCount();
                e.stopImmediatePropagation();
                pageNumber = 1;
                // loadingAfterSolDateInput();
                // addNavBtnLoadingAnimation();
                // arrowTopLeftBtn.classList.add('hidden')
                // arrowTopRightBtn.classList.add('hidden')
                // showLoadingInput();
                hideToRefreshImages();
                pageBtnContainer.scrollTo(0, 0);

                // function earthDateInput() {
                //     console.log()
                // }
            }
        })

        roverChoice.addEventListener('change', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            let roverValue = e.target.value;
            rover = roverValue;
            fetchImages();
            fetchPageCount();
            pageNumber = 1;
            // console.log(rover)
            console.log(roverValue);
            centerCurrentPageBtn();
            solDate = 0;
            solDateInput.placeholder = '';
            hideToRefreshImages();
        })



    } catch (error) {
        console.log(error)
    }
    // console.log('clientWidth:', (pageBtnContainer.clientWidth));
    // console.log('scrollWidth:', (pageBtnContainer.scrollWidth))
    highlightButtons();
}

fetchImages();
fetchPageCount();

// hideMenuBtn.addEventListener('click', function () {
//     if (menuContainer.style.display != 'none') {
//         menuContainer.style.display = 'none';
//         hideText.innerText = 'show Menu';
//         arrowUp.style.transform = 'rotate(-180deg)'

//     } else if (menuContainer.style.display = 'none') {
//         menuContainer.style.display = 'flex';
//         hideText.innerText = 'hide Menu';
//         arrowUp.style.transform = 'rotate(0deg)';
//     }

// })


hideMenuBtn.addEventListener('click', function () {
    if (menuContainer.style.height != '0em') {
        menuContainer.style.height = '0em';
        hideText.innerText = 'show Menu';
        arrowUp.style.transform = 'rotate(-180deg)'
        h1.style.display = 'none';

    } else if (menuContainer.style.height = '0em') {
        menuContainer.style.height = '14em';
        menuContainer.style.minheight = 'fit-content'
        hideText.innerText = 'hide Menu';
        arrowUp.style.transform = 'rotate(0deg)';
        h1.style.display = 'block';

    }
})

function showImages() {
    images.forEach(img => {
        img.classList.remove('hidden')
    })
}

pageNumberText.classList.add('hidden')
arrowTopLeftBtn.classList.add('hidden')
arrowTopRightBtn.classList.add('hidden')


const media576px = window.matchMedia("screen and (max-width: 576px)");
const media900px = window.matchMedia("screen and (min-width: 577px) and (max-width: 900px");
const media901px = window.matchMedia("screen and (min-width: 901px) and (max-width: 1279px)");
const media1280px = window.matchMedia("screen and (min-width: 1280px)")

function mediaQuery901() {
    if (e.matches) {

    }
}


function centerCurrentPageBtn() {
    buttons.forEach(b => {
        let btnWidth = pageBtnContainer.scrollWidth / pageCount;
        let btnWidths = btnWidth - (btnWidth * 6);
        let btnWidths900 = btnWidth - (btnWidth * 8);
        let btnWidths901 = btnWidth - (btnWidth * 9)
        let btnWidths1280 = btnWidth - (btnWidth * 10)
        let btnPos = btnWidth * pageNumber + btnWidths;
        let btnPos900 = btnWidth * pageNumber + btnWidths900;
        let btnPos901 = btnWidth * pageNumber + btnWidths901;
        let btnPos1280 = btnWidth * pageNumber + btnWidths1280;

        if (b.classList.contains('current-page') && media576px.matches) {
            if (b.id >= 5) {
                pageBtnContainer.scrollTo({ left: btnPos, behavior: 'smooth' })
            }
        } else if (b.classList.contains('current-page') && media900px.matches) {
            if (b.id >= 7) {
                pageBtnContainer.scrollTo({ left: btnPos900, behavior: 'smooth' })
                console.log('yes')
            }
        }

        else if (b.classList.contains('current-page') && media901px.matches) {
            if (b.id >= 8) {
                pageBtnContainer.scrollTo({ left: btnPos901, behavior: 'smooth' })
                console.log('yes')
            }
        } else if (b.classList.contains('current-page') && media1280px.matches) {
            if (b.id >= 9) {
                pageBtnContainer.scrollTo({ left: btnPos1280, behavior: 'smooth' })
                console.log('yesyes')
            }
        }
    })
}

//highlight page buttons

highlightButtons = () => {
    buttons.forEach(p => {
        if (p.id == pageNumber) {
            p.classList.add('current-page');
        } else {
            p.classList.remove('current-page')
        }
    })
}
highlightButtons();

// window.addEventListener('resize', function () {
//     console.log('combined', pageBtnContainer.offsetLeft + pageBtnContainer.clientWidth)
//     console.log('offset', pageBtnContainer.offsetLeft)
// })

loadingBtn.forEach(l => {
    l.textContent = '';
})
