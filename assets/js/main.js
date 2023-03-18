import { MealDetailsPage } from "./mealDetails.module.js";
import { Api } from "./api.module.js";


let mealDetailsModule = new MealDetailsPage();
let ApiModule = new Api();


let mainPage = $('#mainPage');
let MealDetailsSection = $("#meal-details");


let mainLoading = $(".loading-screen");
let innerLoading = $(".inner-loading-screen");

function overLayLoading(){
    mainLoading.fadeOut(500)
    $("body").css("overflow", "visible")
}
$("#btnClose").click(function (e) { 
    e.preventDefault();
    mainPage.removeClass("d-none")
    MealDetailsSection.addClass("d-none")
});

async function getMeal(mealType=''){
    let response = await ApiModule.getMeals();
    displayMealItems(response);
}

getMeal();

$(document).ready(() => {
    overLayLoading();
    MealDetailsSection.addClass("d-none")
});

function displayMealItems(mealItems){
    let rowMealItems = $('<div></div>').addClass("row");
    mainPage.html(rowMealItems)
    for (const mealItem of mealItems) {
        let meealItemHtml = `
        <div data-id=${mealItem.idMeal} class="meal-item col-md-3 rounded-3 position-relative py-3 ">
        <div data-id=${mealItem.idMeal} class="meal position-relative overflow-hidden rounded-2 cursor-pointer ">
        <img data-id=${mealItem.idMeal} class="w-100" src="${mealItem.strMealThumb}" alt="">
        <div data-id=${mealItem.idMeal} class="meal-layer position-absolute d-flex align-items-center text-black p-2 ">
        <h3>${mealItem.strMeal}</h3>
        </div>
    </div>
    `;

    rowMealItems.append(meealItemHtml);
    
    }

    mainPage.html(rowMealItems)

    for (const iterator of document.querySelectorAll("#mainPage .meal-item")) {
        iterator.addEventListener("click",async(event)=>{
            MealDetailsSection.fadeIn(1)
            let meal = await ApiModule.getMealDetails(event.target.dataset.id);
            mainPage.addClass("d-none")
            mealDetailsModule.displayMealDetails(meal);
            MealDetailsSection.removeClass("d-none");
            MealDetailsSection.css("overflow", "auto")
        })
    }
}

function openSideNav() {
    $("nav").animate({
        left: 0
    }, 500)


    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");


    // for (let i = 0; i < 5; i++) {
    //     $(".links li").eq(i).animate({
    //         top: 0
    //     }, (i + 5) * 100)
    // }
}

function closeSideNav() {
    let navBodyWidth = $(".nav-body").outerWidth()
    $("nav").animate({
        left: -navBodyWidth
    }, 500)

    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");


    // $(".links li").animate({
    //     top: 300
    // }, 500)
}

closeSideNav()

$("nav i.open-close-icon").click(() => {
    if ($("nav").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})


/////////// SEARCH ///////////////////////


$("#search-input").click(() => {
    MealDetailsSection.hide()
    showSearchInputs();
})


function showSearchInputs() {
    $("#search-container").html(`
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input id="search-by-name" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input id="search-by-letter" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
        </div>
    </div>`)

    mainPage.html("")
    closeSideNav()
    $("#search-by-name").keyup(function(event){
        searchByName(this.value)
    })
    $("#search-by-letter").keyup(function(event){
        searchByLetter(this.value)
    })
}



async function searchByName(name) {
    closeSideNav()
    mainPage.html("")
    innerLoading.removeClass("d-none")
    let response = await ApiModule.getMeals(name)
    innerLoading.addClass("d-none")

    response ? displayMealItems(response) : displayMealItems([])


}

async function searchByLetter(letter="") {
    closeSideNav()
    mainPage.html("")
    innerLoading.removeClass("d-none")

    letter == "" ? letter = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    response = await response.json()

    
    innerLoading.addClass("d-none")
    response.meals ? displayMealItems(response.meals) : displayMealItems([])

}



/////////// Categories ///////////////////////

$("#categories-input").click(() => {
    MealDetailsSection.hide()
    getCategories();
    closeSideNav()
})

async function getCategories() {
    mainPage.html("")
    mainLoading.fadeIn(300)
    $("#search-container").html("")

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)
    mainLoading.fadeOut(300)

}

function displayCategories(arr) {
    let cartoona = "";
    let rowMealItems = $('<div></div>').addClass("row");

    for (let i = 0; i < arr.length; i++) {
        cartoona = `
        <div class="col-md-3 py-3">
                <div data-category="${arr[i].strCategory}" class="category meal meal-item position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img data-category="${arr[i].strCategory}" class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div data-category="${arr[i].strCategory}" class="meal-layer position-absolute text-center text-black p-2">
                        <h3 data-category="${arr[i].strCategory}">${arr[i].strCategory}</h3>
                        <p data-category="${arr[i].strCategory}">${arr[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
        rowMealItems.append(cartoona)

    }

    for (const categoryItem of rowMealItems) {
        for (let index = 0; index < categoryItem.children.length; index++) {
            categoryItem.children[index].addEventListener("click",async(event)=>{
                mainLoading.fadeIn(1)
                getCategoryMeals(event.target.dataset.category);
                })
            
        }

}
    mainPage.append(rowMealItems)
    
}

async function getCategoryMeals(category) {
    mainPage.html("")
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()
    
    displayMealItems(response.meals)
}

/////////// Area ///////////////////////
$("#area-input").click(() => {
    MealDetailsSection.hide()
    getArea();
    closeSideNav()
})

async function getArea() {
    mainPage.html("")
    mainLoading.fadeIn(300)

    $("#search-container").html("")

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayArea(respone.meals)
    mainLoading.fadeOut(300)

}


function displayArea(arr) {
    let cartoona = "";

    let rowMealItems = $('<div></div>').addClass("row");

    for (let i = 0; i < arr.length; i++) {
        cartoona = `
        <div class="col-md-3 py-3">
                <div data-area="${arr[i].strArea}" class="rounded-2 text-center cursor-pointer">
                        <i data-area="${arr[i].strArea}" class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3 data-area="${arr[i].strArea}">${arr[i].strArea}</h3>
                </div>
        </div>
        `
        rowMealItems.append(cartoona)
    }

    for (const areaItem of rowMealItems) {
        for (let index = 0; index < areaItem.children.length; index++) {
            areaItem.children[index].addEventListener("click",async(event)=>{
                mainLoading.fadeIn(1)
                getAreaMeals(event.target.dataset.area);
                })
            
        }

    }

    mainPage.append(rowMealItems)
}

async function getAreaMeals(area) {
    mainPage.html("")

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()

    displayMealItems(response.meals)

}


/////////// Ingredients ///////////////////////
$("#ingredients-input").click(() => {
    MealDetailsSection.hide()
    getIngredients();
    closeSideNav()
})

async function getIngredients() {
    mainPage.html("")
    mainLoading.fadeIn(300)

    $("#search-container").html("")

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()

    displayIngredients(respone.meals.slice(0, 20))
    mainLoading.fadeOut(300)

}

function displayIngredients(arr) {
    let cartoona = "";
    let rowMealItems = $('<div></div>').addClass("row");
    
    for (let i = 0; i < arr.length; i++) {
        cartoona = `
        <div class="col-md-3">
                <div data-ingredient="${arr[i].strIngredient}" class="rounded-2 text-center cursor-pointer">
                        <i data-ingredient="${arr[i].strIngredient}" class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3 data-ingredient="${arr[i].strIngredient}">${arr[i].strIngredient}</h3>
                        <p data-ingredient="${arr[i].strIngredient}">${arr[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
        rowMealItems.append(cartoona)
    }

    for (const ingredientsItem of rowMealItems) {
        for (let index = 0; index < ingredientsItem.children.length; index++) {
            ingredientsItem.children[index].addEventListener("click",async(event)=>{
                mainLoading.fadeIn(1)
                getIngredientsMeals(event.target.dataset.ingredient);
                })
            
        }

    }

    mainPage.append(rowMealItems)
}

async function getIngredientsMeals(ingredients) {
    mainPage.html("")

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()
    console.log(response);
    displayMealItems(response.meals)

}

/////////// Contact ///////////////////////
$("#contact").click(() => {
    MealDetailsSection.hide()
    showContacts()
    closeSideNav()
})





function showContacts() {
    mainPage.html(`<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `);

    document.getElementById("nameInput").addEventListener("keyup", () => {
        inputsValidation()
    })
    document.getElementById("emailInput").addEventListener("keyup", () => {
        inputsValidation()
    })
    document.getElementById("phoneInput").addEventListener("keyup", () => {
        inputsValidation()
    })
    document.getElementById("ageInput").addEventListener("keyup", () => {
        inputsValidation()
    })
    document.getElementById("passwordInput").addEventListener("keyup", () => {
        inputsValidation()
    })
    document.getElementById("repasswordInput").addEventListener("keyup", () => {
        inputsValidation()
    })


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}