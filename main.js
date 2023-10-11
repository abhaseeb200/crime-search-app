//DOM selector
let crimeCategorySelect = document.getElementById("crime-category-select");
let forcesSelect = document.getElementById("forces-select");
let searchData = document.getElementById("search-data");
let searchBtnLoader = document.getElementById("search-btn-loader");
let loadingRow = document.getElementById("loadingRow");
let noDataFound = document.getElementById("noDataFound");
let tableOverflow = document.getElementById("table-overflow");
let tableBody = document.getElementById("tableBody");
let tableRow = document.querySelectorAll(".tableRow");
let bgImage = document.getElementById("bgImage");
let crimeCategoryPlaceholder = document.getElementById("crime-category-placeholder");
let forcePlaceholder = document.getElementById("force-placeholder");
let crimeCategoryValue = ""
let crimeCategoryText = ""
let forcesSelectValue = ""
let forcesSelectText = ""

//set intial placeholder to select fields.
crimeCategoryPlaceholder.innerHTML = "Loading..."
forcePlaceholder.innerHTML = "Loading..."

//Get Crime Category data from fetch API
fetch("https://data.police.uk/api/crime-categories").then((res) => {
    res.json()
        .then((response) => {
            crimeCategoryPlaceholder.innerHTML = "Open this select menu"
            for (let i = 0; i < response.length; i++) {
                let option = document.createElement("option")
                option.value = response[i].url
                option.innerHTML = response[i].name
                crimeCategorySelect.appendChild(option)
            }
        })
}).catch((err) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Crime Category => "+err,
    })
})

//Get Force data from fetch API
fetch("https://data.police.uk/api/forces").then((res) => {
    res.json()
        .then((response) => {
            forcePlaceholder.innerHTML = "Open this select menu"
            for (let i = 0; i < response.length; i++) {
                let option = document.createElement("option")
                option.value = response[i].id
                option.innerHTML = response[i].name
                forcesSelect.appendChild(option)
            }
        })
}).catch((err) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Force Data => "+err,
    })
})

//crime caterogory select
crimeCategorySelect.addEventListener("change", (e) => {
    crimeCategoryValue = e.target.value;
    crimeCategoryText = crimeCategorySelect.options[crimeCategorySelect.selectedIndex].text
    if (crimeCategoryText === "") {
        crimeCategorySelect.classList.add("border-danger")
    } else {
        crimeCategorySelect.classList.remove("border-danger")
    }
})

//Force select
forcesSelect.addEventListener("change", (e) => {
    forcesSelectValue = e.target.value
    forcesSelectText = forcesSelect.options[forcesSelect.selectedIndex].text
    if (forcesSelectText === "") {
        forcesSelect.classList.add("border-danger")
    } else {
        forcesSelect.classList.remove("border-danger")
    }
})


//Get Crime details data 
const crimeDetailsData = async () => {
    let isError = false
    try {
        let getData = await fetch(`https://data.police.uk/api/crimes-no-location?category=${crimeCategoryValue}&force=${forcesSelectValue}`)
        let response = await getData.json();

        if (response && response?.length) {
            tableOverflow.classList.add("custMaxHeight");
            bgImage.classList.add("responsive-height")
            
            //Hide table loader
            tableBody.innerHTML = "";
            for (let i = 0; i < response?.length; i++) {
                let tr = document.createElement("tr")
                let tdID = document.createElement("td")
                let tdCategory = document.createElement("td")
                let tdDate = document.createElement("td")
                tableBody.appendChild(tr)
                tr.appendChild(tdID)
                tr.appendChild(tdCategory)
                tr.appendChild(tdDate)
                tdID.innerHTML = `${response[i].id || "N/A"}`
                tdCategory.innerHTML = `${response[i].outcome_status?.category || "N/A"}`
                tdDate.innerHTML = `${response[i].outcome_status?.date || "N/A"}`
            }
        } else {
            //No Data Found DOM
            tableBody.innerHTML = "";
            tableOverflow.classList.remove("custMaxHeight")
            bgImage.classList.remove("responsive-height")
            let tr = document.createElement("tr")
            let td = document.createElement("td")
            td.setAttribute("colspan", "3")
            td.classList.add("text-center")
            td.innerHTML = "No Data Found"
            tableBody.appendChild(tr)
            tr.appendChild(td)
        }

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Crime Details Data => "+err,
        })
        isError = true
    } finally {
        //Hide button loader
        searchBtnLoader.style.display = "none";
        searchData.style.display = "block";

        if (isError) {
            //No Data Found DOM
            tableBody.innerHTML = "";
            tableOverflow.classList.remove("custMaxHeight")
            bgImage.classList.remove("responsive-height")
            let tr = document.createElement("tr")
            let td = document.createElement("td")
            td.setAttribute("colspan", "3")
            td.classList.add("text-center")
            td.innerHTML = "No Data Found"
            tableBody.appendChild(tr)
            tr.appendChild(td)
        }
    }
}

//search button
searchData.addEventListener("click", () => {
    let isCrimeEmpty = false
    let isForceEmpty = false;
    
    //validation
    if (crimeCategoryText === "") {
        isCrimeEmpty = true;
        crimeCategorySelect.classList.add("border-danger")
    }
    if (forcesSelectText === "") {
        isForceEmpty = true
        forcesSelect.classList.add("border-danger")
    }

    //If validation has passed
    if (!isCrimeEmpty && !isForceEmpty) {
        
        //Button Loader
        searchBtnLoader.style.display = "block";
        searchData.style.display = "none";

        //table loader
        tableBody.innerHTML = ""
        let tr = document.createElement("tr")
        let td = document.createElement("td")
        let div = document.createElement("div")
        td.setAttribute("colspan", "3")
        td.classList.add("text-light", "text-center")
        div.classList.add("spinner-border", "text-light")
        div.setAttribute("role", "status")
        tableBody.appendChild(tr)
        tr.appendChild(td)
        td.appendChild(div)
        
        //call the function here...
        crimeDetailsData();
    }
})

