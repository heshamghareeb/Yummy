export class MealDetailsPage{

    displayMealDetails(MealDetails){
        let recipesList;
        let tagsList;
        if (MealDetails["meals"][0]) {
            MealDetails = MealDetails["meals"][0];
        }
        if (MealDetails["meals"]) {
            MealDetails = MealDetails["meals"];
        }
        if (MealDetails) {
            MealDetails = MealDetails;
        }
        

        for (let index = 0; index < 20; index++) {
            if(MealDetails['strMeasure'+ index.toString()] && MealDetails['strIngredient'+ index.toString()]
            ){
                recipesList+=`<li class="alert alert-info m-2 p-1">
                ${MealDetails['strMeasure'+ index.toString()]}
                ${MealDetails['strIngredient'+index.toString()]}</li>`
            }
            if (index == 0) {
                recipesList = ''
            }
        }

        let tagsObject = MealDetails.strTags;

        if (tagsObject) {
            if (tagsObject.length > 1 ) {
                tagsObject=tagsObject.split(",")
            }
            for (let tag  = 0; tag < tagsObject.length; tag++) {
                if (tag == 0) {
                    tagsList = ''
                }
                if (tagsObject[tag]) {
                    tagsList+=`<li class="alert alert-danger m-2 p-1">${tagsObject[tag]}</li>`
                }
    
            }
        }

        
        let Meal = `
    <div class="col-md-4">
        <img src="${MealDetails.strMealThumb}" class="w-100 rounded-3" alt="image details">
        <h3 class="py-3">${MealDetails.strMeal} </h3>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${MealDetails.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${MealDetails.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${MealDetails.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${recipesList ?? ''}
        </ul>
        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
        ${tagsList ?? ''}
        </ul>
        <a target="_blank" href="${MealDetails.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${MealDetails.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>
        `;


    
    $("#meal-details-content").html(Meal);
    $("#meal-details").removeClass("d-none")
    }

    
}




//                 <a target="_blank" href="https://findingtimeforcooking.com/main-dishes/red-lentil-soup-corba/" class="btn btn-success">Source</a>
//                 <a target="_blank" href="https://www.youtube.com/watch?v=VVnZd8A84z4" class="btn btn-danger">Youtube</a>
//             </div>`