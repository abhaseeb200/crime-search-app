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
let crimeCategoryValue = ""
let crimeCategoryText = ""
let forcesSelectValue = ""
let forcesSelectText = ""


//Get Force data from fetch API
fetch("https://data.police.uk/api/forces").then((res) => {
    res.json()
        .then((response) => {
            for (let i = 0; i < response.length; i++) {
                let option = document.createElement("option")
                option.value = response[i].id
                option.innerHTML = response[i].name
                forcesSelect.appendChild(option)
            }
        })
})

//Get Crime Category data from fetch API
fetch("https://data.police.uk/api/crime-categories").then((res) => {
    res.json()
        .then((response) => {
            for (let i = 0; i < response.length; i++) {
                let option = document.createElement("option")
                option.value = response[i].url
                option.innerHTML = response[i].name
                crimeCategorySelect.appendChild(option)
            }
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

        fetch(`https://data.police.uk/api/crimes-no-location?category=${crimeCategoryValue}&force=${forcesSelectValue}`)
            .then((res) => {
                res.json()
                    .then((response) => {
                        console.log("current", response)

                        //Hide button loader
                        searchBtnLoader.style.display = "none";
                        searchData.style.display = "block";

                        //Hide table loader
                        tableBody.innerHTML = "";

                        if (response && response?.length) {
                            //Hide button Loader
                            searchBtnLoader.style.display = "none";
                            searchData.style.display = "block";

                            tableOverflow.style.maxHeight = "500px";
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
                            tableOverflow.style.maxHeight = "auto";
                            let tr = document.createElement("tr")
                            let td = document.createElement("td")
                            td.setAttribute("colspan", "3")
                            td.classList.add("text-center")
                            td.innerHTML = "No Data Found"
                            tableBody.appendChild(tr)
                            tr.appendChild(td)
                        }
                    })
            })
    }
})