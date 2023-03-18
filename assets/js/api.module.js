export class Api{
    async getMeals(mealType='') {
        const loading = $(".loading-screen");
        
        loading.removeClass("d-none");

        const options = {
            method: 'GET',
            // headers: {
            //     'X-RapidAPI-Key': '8f86b9eaa9msh0e6d5dfedb1eb80p1dba82jsn440848ee6e63',
            //     'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
            // }
        };
        let Url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealType}`
        // console.log(Url);
        const api = await fetch(Url, options);
        
        if (api.ok & api.status == 200) {
            const response =  await api.json();
            loading.addClass("d-none");
            $(".inner-loading-screen").fadeOut(300)
            return response.meals;
        }
        
    }

    async getMealDetails(mealId) {
        $(".loading-screen").fadeOut(500)

        const options = {
            method: 'GET',
            // headers: {
            //     'X-RapidAPI-Key': '8f86b9eaa9msh0e6d5dfedb1eb80p1dba82jsn440848ee6e63',
            //     'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
            // }
        };
    
        const api = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`, options);

        if (api.ok & api.status == 200) {
            const response = await api.json();
            return response;
        }

    }

}