renderStorage();

var ingredientItemsList = [];

// Calls recipes from spoonacular API by user ingredient input
function getRecipesbyIngredients(ingredients) {
    // console.log(ingredients);

    var queryURL = "https://api.spoonacular.com/recipes/findByIngredients?ingredients=" +
                    ingredients + "&number=6&apiKey=71f2f23377744d319243a4c76fa7c648";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var recipeId = response[0].id;
        console.log(recipeId);
        console.log(response[0].image);

        for (i = 0; i < response.length; i++) {
            $("#tile" + i).text(response[i].title);
            $("#img" + i).attr("src", response[i].image);
            $("#result"+ i).attr("data-recipeid",response[i].id);
        } // End of for loop

    }); // End of AJAX ingredients query

}

// Acquire recipe image, recipe name, and recipeid from clicked recipe card.
$(".recipe").click(function(event){
    event.preventDefault()
    // console.log(event);
    // console.log($(this));
    // console.log($(this)[0]); //has image inside recipe-image
    // console.log($(this).find(".recipe-image img")); //found <figure>
    // console.log($(this).find(".recipe-image img").attr('src')); //found <figure>
    // console.log($(this).find("figure")[0].innerHTML.trim());

    var selectedRecipe = $(this).data("recipeid");
    // console.log(selectedRecipe);

    // Find image in "this" under "recipe-image" and get it's attribute.
    var image_src = $(".recipe-image img").attr("src");
    // console.log("Image_src: ", image_src);

    // Find recipe-name in "this" and get it's attribute.
    // console.log("Recipe Name: " + $(this)[0].innerText);
    var recipeName = $(this)[0].innerText;

    // console.log($(".test").data("recipeid"));
    $(".modal").removeClass("is-hidden");
    getRecipeInstructions(selectedRecipe, image_src, recipeName);

    // Add recipe-name to modal by updating it's innertext.
    // console.log($(".modal-card-title")[0].innerText);
    console.log(recipeName);
    $(".modal-card-title").html("");
    $(".modal-card-title")[0].append(recipeName);

    // Add image to recipe modal by updating it's src attribute.
    // console.log("#instructions[0]: ", $("#instructions"))
    $("#instructions").attr("src", image_src);

})

// Acquire recipe instructions from spoonacular API to show on the modal
function getRecipeInstructions(recipeId, image_src, recipeName) {

    var queryURL = "https://api.spoonacular.com/recipes/" + recipeId + "/analyzedInstructions?apiKey=71f2f23377744d319243a4c76fa7c648";
    // console.log(recipeId);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response);
        // console.log(response[0].steps[0].number);
        // console.log(response[0].steps[0].step);

        // Add cooking instructions to the recipe modal.
        var stepsInstructions = response[0].steps;
        $(".recipe-step").html("");
        for (i=0; i<stepsInstructions.length; i++) {
            $(".recipe-step").append("<p>" +
            stepsInstructions[i].number + ". " +
            stepsInstructions[i].step + "</p>");
        } // End of AJAX call for recipeId

    });
}

function getNutrition(ingredient1, ingredient2, ingredient3) {

    var secondQueryURL = "https://api.edamam.com/api/nutrition-data?app_id=17b937a5&app_key=02f27b66f18bc4bf93156f026eabe8f8&ingr=" + num1 + "%20" + "medium" + ingredient1 + "%2C" + num2 + "%20" + "medium" + "%20" + ingredient2 + "%2C" + num3 + "%20" + "medium" + "%20" + ingredient3
    $.ajax({
        url: secondQueryURL,
        method: "GET"

    }).then(function (response) {
        console.log(response);
        $("#calories").text("Calories: " + response.totalNutrientsKCal.ENERC_KCAL.quantity + "kcal");
        $("#carbs").text("Carbohydrates: " + response.totalNutrientsKCal.CHOCDF_KCAL.quantity + "g");
        $("#fat").text("Fat: " + response.totalNutrientsKCal.FAT_KCAL.quantity + "g");
        $("#protein").text("Protein: " + response.totalNutrientsKCal.PROCNT_KCAL.quantity + "g");
    });
};

// Click event for revealing the tiles from hidden
$("#find-recipe-btn").click(function () {
    var recipeTile = $(".recipe-tile").removeClass("is-hidden");
});


// Click event for the recipe tile to display the modal
$(".recipe-tile").click(function (event) {

    event.preventDefault();

    var recipeModal = $(".modal").removeClass("is-hidden");

});

// Click even to close the modal
$("#close-button").click(function (event) {

    event.preventDefault();

    var recipeModal = $(".modal").addClass("is-hidden");

});

// Showing ingredients list into an array onto our local storage.
$("#find-recipe-btn").click(function (event) {

    event.preventDefault();

    var ingredient1 = $("#ingredient_1").val().toUpperCase();
    var ingredient2 = $("#ingredient_2").val().toUpperCase();
    var ingredient3 = $("#ingredient_3").val().toUpperCase();

    var ingredients = ingredient1 + ", " + ingredient2 + ", " + ingredient3

    getRecipesbyIngredients(ingredients);

    ingredientItemsList.push(ingredients);

    localStorage.setItem("ingredients", JSON.stringify(ingredientItemsList));

    $("#ingr-save").prepend("<li>" + ingredient1 + ", " + ingredient2 + ", " + ingredient3 + "</li>");

})


function renderStorage() {

    var savedIngredients = JSON.parse(localStorage.getItem("ingredients"));

    if (savedIngredients !== null) {
        ingredientItemsList = savedIngredients;

        for (var i = 0; i < ingredientItemsList.length; i++) {

            var ingredients = ingredientItemsList[i];

            $("#ingr-save").prepend("<li>" + ingredients + "</li>");
        }
    }
}

// Shows recipes when history of saved ingredients are clicked
$("#ingr-save").click(function (event) {
    console.log(event);

    var ingredients = event.target.innerHTML;
    console.log(ingredients);

    $(".recipe-tile").removeClass("is-hidden");

    getRecipesbyIngredients(ingredients);
});
