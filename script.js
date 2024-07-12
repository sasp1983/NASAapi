// fetch('https://images-api.nasa.gov')

let arrowLeftBtn = document.querySelector('.arrow-left');
let arrowRightBtn = document.querySelector('.arrow-right');
let i = 0;

let imgArray = []
let pageNumber = 1;
let pictureGrid = document.querySelector('.picture-grid');  
let page = document.querySelector('.page');
let images = document.querySelectorAll('.grid-img');

async function fetchData() {
    try {
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${pageNumber}&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

        if (!response.ok) {
            throw new Error("ADJAS")
        }
        const data = await response.json();
        console.log(response.url);
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

            buttons.forEach(p => {
                if (p.id == pageNumber) {
                 p.classList.add('current-page')
                } else {
                 p.classList.remove('current-page')
                }
             })
            
        }      
    }  catch (error) {
        console.error(error)
    } 
}


fetchData();
    page.innerText = `page: ${pageNumber}`
    
    
arrowRightBtn.addEventListener('click', function () {    
    if (pageNumber < 35) {
    pageNumber++;
    fetchData();
    page.innerText = `page: ${pageNumber}`
    window.scroll({top:0,behavior:'smooth'});
    }
});

arrowLeftBtn.addEventListener('click', function() {
    if (pageNumber >= 2) {
    pageNumber--;
    fetchData();
    page.innerText = `page: ${pageNumber}`
    window.scroll({top:0,behavior:'smooth'});
}
});



// pagebtn.addEventListener('click', function() {
//     pageNumber = 1;
//     fetchData();
//      page.innerText = `page: ${pageNumber}`
//     console.log(pageNumber)
// }) 

let buttons = document.querySelectorAll('.pagebtn');

buttons.forEach(pagebtn => {
    pagebtn.addEventListener('click', function(e) {
    console.log(e.target)
    pageNumber = pagebtn.id;
    page.innerText = `page: ${pageNumber}`  
    fetchData();   
    }) 
})




// async function fetchData() {
//     try {
//         const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=TDRKWxcci6VXt53Z5NocxnQTtTg6N2fsiSZOR8dQ`);

//         if (!response.ok) {
//             throw new Error("ADJAS")
//         }
//         const data = await response.json();
//         console.log(data)
        
      
//         }  catch (error) {
//         console.error(error)
//     } 
// }

// fetchData()