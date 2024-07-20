// fetch('https://images-api.nasa.gov')

let arrowLeftBtn = document.querySelector('.arrow-left');
let arrowRightBtn = document.querySelector('.arrow-right');
let arrowTopLeftBtn = document.querySelector('.arrow-top-left');
let arrowTopRightBtn = document.querySelector('.arrow-top-right');
let solBtnLeft = document.querySelector('.solbtn-left');
let solBtnRight = document.querySelector('.solbtn-right');
let loadingBtn = document.querySelectorAll('.loading-btn');
let loadingImg = document.querySelectorAll('.loading-img')


let solDate = 1431;

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

async function fetchImages() {
    try {
        // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);


        const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}`);

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
                // const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

                const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}`);


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

            //make highlighted current page buttons stay in middle of scrollbar
            function centerCurrentPageBtn() {

                buttons.forEach(b => {
                    let btnRect = b.getBoundingClientRect();
                    let absolutePosLeft = btnRect.left + b.scrollLeft;
                    let middle = absolutePosLeft - pageBtnContainer.clientWidth;
                    if (b.id == pageNumber) {
                        pos = 128;
                    }
                })
            }
            centerCurrentPageBtn();

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
        }

        solDateInput.setAttribute('placeholder', `${solDate}`);

    } catch (error) {
        console.error(error)
    }
    // console.log('clientWidth:', (pageBtnContainer.clientWidth));
    // console.log('scrollWidth:', (pageBtnContainer.scrollWidth));

}

async function fetchPageCount() {
    try {
        // const responseNoPages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        const responseNoPages = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

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
            }
        });

        //page forward button  top
        arrowTopRightBtn.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            // console.log('pageCount arrowTopRightBtn', pageCount)
            if (pageNumber < pageCount) {
                pageNumber++;
                fetchImages();
                // window.scroll({ top: 0, behavior: 'smooth' });
                // hideToRefreshImages();
                // scrollpageBtns();
            }
            // console.log(pageCount)
        });

        //scroll through page buttons
        pageBtnContainer.addEventListener('wheel', function (e) {
            e.preventDefault();
            // console.log(e.target.scrollx);
            // this.scrollLeft += 30;
            e.stopPropagation();
            pageBtnContainer.scrollBy({
                left: e.deltaY < 0 ? -30 : 30,
            })
        })

        //page back button top
        arrowTopLeftBtn.addEventListener('click', function (e) {
            e.stopImmediatePropagation();
            console.log('pageCount arrowLeftBtn', pageCount)
            if (pageNumber >= 2) {
                pageNumber--;
                fetchImages();
                // window.scroll({ top: 0, behavior: 'smooth' });
                hideToRefreshImages();
            }
        });


        //make buttons go to page number
        buttons.forEach(pagebtn => {
            pagebtn.addEventListener('click', function (e) {
                e.stopImmediatePropagation();
                pageNumber = pagebtn.id;
                fetchImages();
                fetchPageCount();
                hideToRefreshImages();
            })
        })

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
            e.preventDefault;
            e.stopImmediatePropagation();
            pageNumber = 1;
            solDate = solValue;
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
            e.preventDefault;
            solDate++;
            console.log(e.target.value)
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
        })

        solBtnLeft.addEventListener('click', function (e) {
            e.preventDefault;
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

    } catch (error) {
        console.log(error)
    }
    // console.log('clientWidth:', (pageBtnContainer.clientWidth));
    // console.log('scrollWidth:', (pageBtnContainer.scrollWidth))
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

//scroll page buttons if current page is outside of view
// function scrollpageBtns() {
//     //mobile view
//     let media576px = window.matchMedia('(max-width: 576px)')
//     function checkWindowSize(e) {
//         if (e.matches) {
//             // if (pageNumber > 9) {
//             // pageBtnContainer.scrollLeft += 30;
//             // console.log('clientWidth:', (pageBtnContainer.clientWidth));
//             // console.log('scrollWidth:', (pageBtnContainer.scrollWidth))
//             // }
//         }
//     }
//     checkWindowSize(media576px)
// }

// console.log('clientWidth:', (pageBtnContainer.clientWidth));
// console.log('scrollWidth:', (pageBtnContainer.scrollWidth))