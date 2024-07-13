// fetch('https://images-api.nasa.gov')

let arrowLeftBtn = document.querySelector('.arrow-left');
let arrowRightBtn = document.querySelector('.arrow-right');
let i = 0;

let imgArray = []
let pageNumber = 1;
let pictureGrid = document.querySelector('.picture-grid');
// let page = document.querySelector('.page');
let images = document.querySelectorAll('.grid-img');
let pageBtnContainer = document.querySelector('.pagenumber-container')
let buttons = document.querySelectorAll('.pagebtn');
let solDateInput = document.getElementById('sol-date');
let solDate = 1000;

async function fetchPageCount() {
    try {
        const responseNoPages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        if (!responseNoPages.ok) {
            throw new Error("ADJAS")
        }

        const dataNoPages = await responseNoPages.json();
        // console.log(dataNoPages);
        console.log('array length:', dataNoPages.photos.length);
        let pageCount = Math.ceil(dataNoPages.photos.length / 25);
        console.log('pageCount:', pageCount);

        arrowRightBtn.addEventListener('click', function () {
            // fetchPageCount();
            if (pageNumber < pageCount) {
                pageNumber += 1;
                fetchImages();
                // page.innerText = `page: ${pageNumber}`
                window.scroll({ top: 0, behavior: 'smooth' });
            }
            console.log(pageCount)
        });

        arrowLeftBtn.addEventListener('click', function () {
            if (pageNumber >= 2) {
                pageNumber--;
                fetchImages();
                // page.innerText = `page: ${pageNumber}`
                window.scroll({ top: 0, behavior: 'smooth' });
            }
        });

        function hideButtons() {
            if (pageBtnContainer.childElementCount > pageCount) {
                buttons.forEach(p => {
                    if (p.innerText > pageCount) {
                        p.classList.add('hidden');
                    } else {
                        p.classList.remove('hidden');
                        // p.style.visibility = 'visible'
                    }
                });
            }
        }
        hideButtons();

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
    } catch (error) {
        console.log(error)
    }
}

async function fetchImages() {
    try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);


        // const responseNoPages = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solDate}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        if (!response.ok) {
            throw new Error("ADJAS")
        }
        const data = await response.json();
        // const dataNoPages = await responseNoPages.json();
        // console.log(dataNoPages);
        // console.log(dataNoPages.photos.length);

        // let pageCount = Math.ceil(dataNoPages.photos.length / 25);
        // console.log(pageCount);

        // console.log(response.url);
        let imgArray = data.photos;
        // console.log(response)
        // console.log(data)

        for (i = 0; i < imgArray.length; i++) {
            let images = document.querySelectorAll('.grid-img');
            images[i].src = imgArray[i].img_src;
            // console.log(i) ;     
            let imgLink = document.querySelectorAll('a');
            imgLink[i].src = imgArray[i].img_src;
            imgLink[i].href = imgArray[i].img_src;
            images[i].onload = images[i].style.opacity = '100%';

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
        }

    } catch (error) {
        console.error(error)
    }
    // fetchPageCount();
}

fetchImages();
fetchPageCount();

// page.innerText = `page: ${pageNumber}`


// arrowRightBtn.addEventListener('click', function () {
//     fetchPageCount();
//     if (pageNumber < pageCount) {
//         pageNumber++;
//         fetchImages();
//         // page.innerText = `page: ${pageNumber}`
//         window.scroll({ top: 0, behavior: 'smooth' });
//     }
// });

// arrowLeftBtn.addEventListener('click', function () {
//     if (pageNumber >= 2) {
//         pageNumber--;
//         fetchImages();
//         // page.innerText = `page: ${pageNumber}`
//         window.scroll({ top: 0, behavior: 'smooth' });
//     }
// });


//make buttons go to page number
buttons.forEach(pagebtn => {
    pagebtn.addEventListener('click', function (e) {
        pageNumber = pagebtn.id;

        // page.innerText = `page: ${pageNumber}`
        fetchImages();
    })


})

solDateInput.addEventListener('change', function (e) {
    e.preventDefault;
    console.log('sol date:', solDateInput.value);
    let solValue = solDateInput.value;
    solDate = solValue;
    fetchImages();
    fetchPageCount();
    pageNumber = 1;

})




