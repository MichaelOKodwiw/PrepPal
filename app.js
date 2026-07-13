// DOM ELEMENT SELECTORS
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const resultsGrid = document.getElementById("results-grid");

// RECIPE RENDERING LOGIC
/**
 * Maps the array of meals received from the API into HTML cards and renders them.
 * @param {Array|null} meals - Array of meal objects or null if no results found.
 */
function displayRecipes(meals) {
    resultsGrid.innerHTML = "";

    // Empty state fallback if no search results are returned
    if (meals === null) {
        resultsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #7A756E;">
                <h3>No recipes found with that keyword!</h3>
                <p>Try searching for popular terms like 'Chicken', 'Cake', 'Pasta', or 'Beef'.</p>
            </div>
        `;
        return;
    }

    // Iterate through meals and dynamically construct cards
    meals.forEach(meal => {
        const ingredientsList = [];
        
        // Extract up to 6 ingredients from the API object data structure
        for (let i = 1; i <= 6; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredientsList.push(ingredient);
            }
        }

        const cardHTML = `
            <article class="recipe-card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:100%; height:180px; object-fit:cover;">
                <div class="recipe-content">
                    <span class="recipe-badge">${meal.strCategory || "Meal"}</span>
                    <h3 class="recipe-title">${meal.strMeal}</h3>
                    <p class="recipe-ingredients">
                        <strong>Ingredients:</strong> ${ingredientsList.join(", ")}...
                    </p>
                    <a href="${meal.strYoutube}" target="_blank" class="view-recipe-btn" style="display:block; text-align:center; text-decoration:none;">Watch Video Tutorial</a>
                </div>
            </article>
        `;

        resultsGrid.innerHTML += cardHTML;
    });
}

// API DATA FETCHING
/**
 * Fetches recipes asynchronously from the external database based on user query.
 */
async function searchRecipes() {
    const searchPassed = searchInput.value.trim();

    if (searchPassed === "") return;

    // Display loading state indicator
    resultsGrid.innerHTML = `<h3 style="grid-column: 1 / -1; text-align:center; color:#7A756E;">Searching database...</h3>`;

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchPassed}`);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error("API Fetch Error:", error);
        resultsGrid.innerHTML = `<h3 style="grid-column: 1 / -1; text-align:center; color:red;">Connection error. Please try again later.</h3>`;
    }
}

// EVENT LISTENERS & INITIALIZATION
searchButton.addEventListener("click", searchRecipes);

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchRecipes();
    }
});

/**
 * Initializes the app with a default recipe view on startup.
 */
async function init() {
    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=pasta");
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error("Initialization Error:", error);
    }
}

// Bootstrapping the application
init();

