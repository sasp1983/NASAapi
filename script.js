fetch('https://images-api.nasa.gov')

let arrowLeftBtn = document.querySelector('.arrow-left');
let arrowRightBtn = document.querySelector('.arrow-right');
let arrowTopLeftBtn = document.querySelector('.arrow-top-left');
let arrowTopRightBtn = document.querySelector('.arrow-top-right');
let solBtnLeft = document.querySelector('.solbtn-left');
let solBtnRight = document.querySelector('.solbtn-right');
let loadingBtn = document.querySelectorAll('.loading-btn');
let loadingImg = document.querySelectorAll('.loading-img')
let roverChoice = document.querySelector('#rovers')
let loadingRover = document.querySelector('.loading-rover')
let roverContainer = document.querySelector('.rover-container')

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
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        // const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}`);

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
                const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

                // const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${solDate}&page=${pageNumber}`);


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
        }

        //main loop to fetch images
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
        // hideImages();

        solDateInput.setAttribute('placeholder', `${solDate}`);

    } catch (error) {
        console.error(error)
    }
    // console.log('clientWidth:', (pageBtnContainer.clientWidth));
    // console.log('scrollWidth:', (pageBtnContainer.scrollWidth));
}

async function fetchPageCount() {
    try {
        const responseNoPages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        // const responseNoPages = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/${rover}/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

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
                // hideToRefreshImages();
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
                // centerCurrentButton576px();
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
                fetchPageCount();
                // hideToRefreshImages();
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
                fetchPageCount();
                // window.scroll({ top: 0, behavior: 'smooth' });
                // hideToRefreshImages();
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
                        console.log('bPos currentpage btn', bPos)
                    }
                }
            })
        })

        //make buttons go to page number
        buttons.forEach(pagebtn => {
            pagebtn.addEventListener('click', function (e) {
                e.stopImmediatePropagation();
                pageNumber = pagebtn.id;
                fetchImages();
                fetchPageCount();
                // hideToRefreshImages();
            })
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
        function hideButtons() {
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
        hideButtons();

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

        // function hideOverflowButton() {
        //     if (pageBtnContainer.children.classList.includes('pagebtn hidden') > 50) {
        //         overflowButton.classList.remove('hidden');
        //     }
        //     else {
        //         // overflowButton.classList.add('hidden');
        //     }
        // }
        // hideOverflowButton();

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
        // createButtons();

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
            // hideToRefreshImages();
            pageBtnContainer.scrollTo({ left: 0 });
        })

        solBtnRight.addEventListener('click', function (e) {
            e.preventDefault();
            solDate++;
            // console.log(e.target.value)
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
            // hideToRefreshImages();
            pageBtnContainer.scrollTo(0, 0);
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
                // hideToRefreshImages();
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
            rover = roverValue
            fetchImages();
            // console.log(rover)
            console.log(roverValue)
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

function showImages() {
    images.forEach(img => {
        img.classList.remove('hidden')
    })
}

pageNumberText.classList.add('hidden')
arrowTopLeftBtn.classList.add('hidden')
arrowTopRightBtn.classList.add('hidden')

//mediaquery 576px
function centerCurrentButton576px() {
    //mobile view
    let media576px = window.matchMedia('(max-width: 576px)')
    function checkWindowSize(e) {
        if (e.matches) {


        }
    }
    checkWindowSize(media576px)
}


function centerCurrentPageBtn() {
    buttons.forEach(b => {
        let btnWidth = pageBtnContainer.scrollWidth / pageCount;
        let btnPos = btnWidth * pageNumber - btnWidth;
        if (b.classList.contains('current-page')) {
            pageBtnContainer.scrollTo({ left: btnPos, behavior: 'smooth' })
            console.log(btnPos)
        }

        // if (b.id <= 8) {
        //     pageBtnContainer.scrollTo({ left: 0, behavior: 'smooth' });
        // } else if (b.id < 16) {
        //     pageBtnContainer.scrollTo({ left: 250, behavior: 'smooth' });
        // } else if (b.id < 24) {
        //     pageBtnContainer.scrollTo({ left: 500, behavior: 'smooth' });
        // } else if (b.id < 32) {
        //     pageBtnContainer.scrollTo({ left: 750, behavior: 'smooth' });
        // } else if (b.id < 40) {
        //     pageBtnContainer.scrollTo({ left: 960, behavior: 'smooth' });
        // } else if (b.id < 48) {
        //     pageBtnContainer.scrollTo({ left: 1195, behavior: 'smooth' });
        // } else if (b.id < 56) {
        //     pageBtnContainer.scrollTo({ left: 1430, behavior: 'smooth' });
        // } else if (b.id < 64) {
        //     pageBtnContainer.scrollTo({ left: 1665, behavior: 'smooth' });
        // } else if (b.id < 70) {
        //     pageBtnContainer.scrollTo({ left: 1900, behavior: 'smooth' });
        // } else if (b.id < 78) {
        //     pageBtnContainer.scrollTo({ left: 2135, behavior: 'smooth' });
        // } else if (b.id < 86) {
        //     pageBtnContainer.scrollTo({ left: 2370, behavior: 'smooth' });
        // } else if (b.id < 94) {
        //     pageBtnContainer.scrollTo({ left: 2605, behavior: 'smooth' });
        // } else if (b.id < 100) {
        //     pageBtnContainer.scrollTo({ left: 2840, behavior: 'smooth' });
        // } else if (b.id < 108) {
        //     pageBtnContainer.scrollTo({ left: 3075, behavior: 'smooth' });
        // } else if (b.id < 116) {
        //     pageBtnContainer.scrollTo({ left: 3310, behavior: 'smooth' });
        // } else if (b.id < 124) {
        //     pageBtnContainer.scrollTo({ left: 3545, behavior: 'smooth' });
        // } else if (b.id < 132) {
        //     pageBtnContainer.scrollTo({ left: 3780, behavior: 'smooth' });
        // } else if (b.id < 140) {
        //     pageBtnContainer.scrollTo({ left: 4015, behavior: 'smooth' });
        // } else if (b.id < 148) {
        //     pageBtnContainer.scrollTo({ left: 4250, behavior: 'smooth' });
        // } else if (b.id < 156) {
        //     pageBtnContainer.scrollTo({ left: 4485, behavior: 'smooth' });
        // } else if (b.id < 164) {
        //     pageBtnContainer.scrollTo({ left: 4720, behavior: 'smooth' });
        // }
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

function scrollTo(index) {
    let cont = document.querySelector('pagebtn-container');
    let el = document.getElementsByClassName('pagebtn')[index];



    cont.scrollLeft += el.offsetLeft - cont.offsetLeft;
}

