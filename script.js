let accessKey = "8buBn2o3aXvdIAH5ZeJwXyzibz2m62aj1TI8Z2LZeO8";
// bUk-hVoz_RK5Kc6ETb7igKyhbpKnlZ6EQr-QJrvmHqM

const formEl = document.querySelector("form");
const inputEl = document.getElementById("search-input");
const searchResults = document.querySelector(".search-results");
const showmore = document.getElementById("show-more-button");

let inputData = "";
let page = 1;

async function searchImages() {
  //forresponse and fetch
  inputData = inputEl.value;
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}`;
  const response = await fetch(url);
  const data = await response.json();

  const results = data.results;
  if (page === 1) {
    searchResults.innerHTML = "";
  }
  results.map((result) => {
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add("sarch-result");
    const image = document.getElementById("img");
    image.src = result.urls.small;
    image.alt = result.alt_description;
    const imageLink = document.createElement("a");
    imageLink.href = result.links.innerHTML;
    imageLink.target = "_blank";
    imageLink.textContent = result.alt_description;

    imageWrapper.appendChild(image);
    imageWrapper.appendChild(imageLink);
    searchResults.appendChild(imageWrapper);
  });
  page++;
  if (page > 1) {
    showmore.style.display = "block";
  }
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});
showmore.addEventListener("click", (event) => {
  searchImages();
});
