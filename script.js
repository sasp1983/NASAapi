// fetch('https://images-api.nasa.gov')

let arrowLeftBtn = document.querySelector('.arrow-left');
let arrowRightBtn = document.querySelector('.arrow-right');
let arrowTopLeftBtn = document.querySelector('.arrow-top-left');
let arrowTopRightBtn = document.querySelector('.arrow-top-right');
let solBtnLeft = document.querySelector('.solbtn-left');
let solBtnRight = document.querySelector('.solbtn-right');
let overflowButton = document.querySelector('.overflow-btn')
let loadingBtn = document.querySelectorAll('.loading-btn')

let i = 0;

let imgArray = []
let pageNumber = 1;
let pictureGrid = document.querySelector('.picture-grid');
let imgContainers = document.querySelectorAll('.img-container');
let images = document.querySelectorAll('.grid-img');
let pageBtnContainer = document.querySelector('.pagebtn-container')
let buttons = document.querySelectorAll('.pagebtn');
let solDateInput = document.getElementById('sol-date');
let solDate = 109;
solDateInput.setAttribute('placeholder', `${solDate}`)
let solDateWarning = document.querySelector('.no-imgs');
let solInputLine = document.querySelector('.sol-input-line');
let loadingSol = document.querySelector('.loading-sol');
let solBtns = document.querySelector('.sol-date-btns')

async function fetchImages() {
    try {
        const response = await fetch(`https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}`);


        // `https://mars-photos.herokuapp.com/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`
        // api.nasa.gov/mars-photos
        // mars-photos.herokuapp.com
        if (!response.ok) {
            throw new Error("ADJAS")
        }
        const data = await response.json();

        let imgArray = data.photos;
        console.log('imgArray length:', imgArray.length);

        // console.log(response)
        // console.log(data)

        //if no images found on sol date
        if (imgArray.length === 0) {
            fetchImages();
            solDateWarning.classList.remove('hidden');
            pictureGrid.classList.add('hidden');
        } else {
            solDateWarning.classList.add('hidden');
            pictureGrid.classList.remove('hidden')
        }

        //main loop to fetch images
        for (i = 0; i < imgArray.length; i++) {
            let images = document.querySelectorAll('.grid-img');
            images[i].src = imgArray[i].img_src;
            let imgLink = document.querySelectorAll('a');
            imgLink[i].src = imgArray[i].img_src;
            imgLink[i].href = imgArray[i].img_src;
            images[i].onload = images[i].style.opacity = '100%';

            function showImages() {
                images.forEach(img => {
                    img.classList.remove('hidden')
                })
            }
            showImages();
            //highlight page buttons
            highlightButtons = () => {
                buttons.forEach(p => {
                    if (p.id == pageNumber) {
                        p.classList.add('current-page')
                    } else {
                        p.classList.remove('current-page')
                    }
                })
            }
            highlightButtons();

            //hide image containers of non-fetched images when at last page 
            function hideImages() {
                imgContainers.forEach(c => {
                    let index = Array.from(pictureGrid.children).indexOf(c);
                    if (index + 1 > imgArray.length) {
                        c.classList.add('hidden');
                    } else {
                        c.classList.remove('hidden');
                    }
                    // console.log(index)
                });
            }
            hideImages();
        }
        solDateInput.setAttribute('placeholder', `${solDate}`);

    } catch (error) {
        console.error(error)
    }
}

async function fetchPageCount() {
    try {
        const responseNoPages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        if (!responseNoPages.ok) {
            throw new Error("ADJAS")
        }

        const dataNoPages = await responseNoPages.json();
        console.log(dataNoPages);
        console.log(responseNoPages);
        // console.log('array length:', dataNoPages.photos.length);
        window.pageCount = Math.ceil(dataNoPages.photos.length / 25);
        console.log('pageCount:', window.pageCount);

        //page forward button 
        arrowRightBtn.addEventListener('click', function (e) {
            console.log('pageNumber', pageNumber);
            e.stopImmediatePropagation();

            if (pageNumber < pageCount) {
                console.log('pageCount arrowRightBtn', pageCount);
                pageNumber++;
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
            console.log('pageCount arrowTopRightBtn', pageCount)
            if (pageNumber < pageCount) {
                pageNumber++;
                fetchImages();
                // window.scroll({ top: 0, behavior: 'smooth' });
                hideToRefreshImages();
            }
            // console.log(pageCount)
        });

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
                }

                //hide 'expand page buttons' button if its number is low enough
                let pb = Array.from(pageBtnContainer.children);
                // console.log(pb[50].classList)
                if (!pb[28].classList.contains('hidden')) {
                    overflowButton.classList.remove('hidden');
                    pageBtnContainer.classList.remove('height-auto')
                } else {
                    overflowButton.classList.add('hidden');
                    pageBtnContainer.classList.add('height-auto')
                }
                // console.log(pb.indexOf(p));
                // console.log(pb[50])
            })
            // console.log('buttons: ', pageBtnContainer.childElementCount, 'pages: ', pageCount)
        }
        hideButtons();

        function hideLoadingBtnAnimation() {
            loadingBtn.forEach(btn => {
                btn.classList.add('hidden')
            })
        }

        hideLoadingBtnAnimation()

        //hide loading animation
        loadingSol.classList.add('hidden')
        //show input after loading
        solInputLine.classList.remove('hidden')
        //buttons after loading
        solBtns.classList.remove('hidden')

        function loadingAfterSolDateInput() {
            buttons.forEach(btn => {
                btn.classList.add('hidden')
            })
            loadingSol.classList.remove('hidden')
            loadingBtn.forEach(btn => {
                btn.classList.remove('hidden')
            })
            solBtns.classList.add('hidden');
            solInputLine.classList.add('hidden');
            hideToRefreshImages();
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
            console.dir(e.target);
            loadingAfterSolDateInput();
            addNavBtnLoadingAnimation()
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
            // pageBtnContainer.classList.add('height-auto');
            pageNumber = 1;
            loadingAfterSolDateInput();
            addNavBtnLoadingAnimation();
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
                loadingAfterSolDateInput();
                addNavBtnLoadingAnimation();
            }
        })

        overflowButton.addEventListener('click', function (e) {
            e.preventDefault;
            pageBtnContainer.classList.toggle('height-auto');
            overflowButton.textContent = overflowButton.textContent === '▼' ? '▲' : '▼';
            console.log('clicked');
            e.stopImmediatePropagation();
        });


    } catch (error) {
        console.log(error)
    }
}

fetchImages();
fetchPageCount();

//make buttons go to page number
// buttons.forEach(pagebtn => {
//     pagebtn.addEventListener('click', function () {
//         pageNumber = pagebtn.id;
//         // fetchImages();
//     })
// })




overflowButton.innerText = '▼'


