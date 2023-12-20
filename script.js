document.addEventListener("DOMContentLoaded", () => {
  getRandomMeals();
});

const searchBtn = document.getElementById("search-btn");
const randomMealsContainer = document.getElementById("random-meals-container");
const mealList = document.getElementById("dish");
const mealDetailsContent = document.querySelector(".dish-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");

function goToAbout() {
  var aboutSection = document.getElementById("about");
  aboutSection.scrollIntoView({ behavior: "smooth" });
}
// Event listeners
searchBtn.addEventListener("click", searchAndDisplayMeals);
mealList.addEventListener("click", getMealRecipe);
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});

function getRandomMeals() {
  fetchMeals("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((data) => {
      const randomMeals = data.meals.slice(0);
      displayRandomMeals(randomMeals, "random-meals-container");
    })
    .catch((error) => console.error("Error fetching random meals:", error));
}

function displayRandomMeals(meals, containerId) {
  const mealsContainer = document.getElementById(containerId);
  mealsContainer.innerHTML = "";

  meals.forEach((meal) => {
    const mealDiv = document.createElement("div");
    mealDiv.classList.add("meal");
    mealDiv.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strInstructions}</p>
        `;

    mealsContainer.appendChild(mealDiv);
  });
}

function fetchMeals(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching meals:", error);
      throw error;
    });
}

function displaySearchedMeals(meals) {
  let html = "";
  meals.forEach((meal) => {
    html += createMealHTML(meal);
  });

  mealList.innerHTML = html;
  mealList.classList.remove("notFound");
}

function searchAndDisplayMeals() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetchMeals(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
  )
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += createMealHTML(meal);
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, we didn't find any meal!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
      location.href = "#dish";
    })
    .catch((error) => console.error("Error fetching meal list:", error));
}

function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    fetchMeals(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`
    )
      .then((data) => mealRecipeModal(data.meals))
      .catch((error) => console.error("Error fetching meal recipe:", error));
  }
}

// Fetch meals from the API
function fetchMeals(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching meals:", error);
      throw error; // Rethrow the error to be caught by the caller
    });
}

// Create HTML for a meal
function createMealHTML(meal) {
  return `
        <div class="dish-item" data-id="${meal.idMeal}">
          <div class="dish-img">
            <img src="${meal.strMealThumb}" alt="food">
          </div>
          <div class="dish-name">
            <h3>${meal.strMeal}</h3>
            <a href="#" class="recipe-btn first">Get Recipe</a>
          </div>
        </div>
      `;
}

// Create a modal
function mealRecipeModal(meal) {
  console.log(meal);
  meal = meal[0];
  const html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
      `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
