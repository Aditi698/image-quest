let client_id = "8buBn2o3aXvdIAH5ZeJwXyzibz2m62aj1TI8Z2LZeO8";

// Define selectors at the top
const loadMoreButton = document.getElementById("load-more");
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const imageList = document.getElementById("images-container");
const loader = document.getElementById("loader"); // Selector for the loader
const noResultMessage = document.getElementById("no-result"); // Selector for the no-result message

// Sample array of image meta data for pagination and search
let currentPage = 1;
let imageDataArray = [];
let searchQuery = "random"; // Default search query

// Function to fetch image data from the API
async function fetchImageData(page, query) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=20&query=${query}&client_id=${client_id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching image data:", error);
    return { total: 0, total_pages: 0, results: [] };
  }
}

// Function to show the loader
function showLoader() {
  loader.style.display = "block";
}

// Function to hide the loader
function hideLoader() {
  loader.style.display = "none";
}

// Function to show the "No Image found" message
function showNoResultMessage() {
  noResultMessage.style.display = "block";
}

// Function to hide the "No Image found" message
function hideNoResultMessage() {
  noResultMessage.style.display = "none";
}

// Function to show the image preview modal
function showImagePreview(imageData) {
  const previewModal = document.getElementById("image-preview-modal");
  const previewImage = document.getElementById("preview-image");

  // Set the larger version of the image in the preview modal
  previewImage.src =
    imageData?.urls?.regular || imageData?.urls?.full || imageData?.urls?.raw;

  // Show the preview modal
  previewModal.style.display = "block";
}

// Function to hide the image preview modal
function hideImagePreview() {
  const previewModal = document.getElementById("image-preview-modal");
  const previewImage = document.getElementById("preview-image");

  // Reset the preview image source
  previewImage.src = "";

  // Hide the preview modal
  previewModal.style.display = "none";
}

// Add an event listener for the close button to hide the preview modal
document.getElementById("close-btn").addEventListener("click", () => {
  hideImagePreview();
});

// Function to create and append HTML elements for each image data
function createImageCard(imageData) {
  const cardLi = document.createElement("li");
  cardLi.className = "card";
  cardLi.id = imageData.id;

  const img = document.createElement("img");
  img.src =
    imageData?.urls?.small ||
    imageData?.urls?.regular ||
    imageData?.urls?.full ||
    imageData?.urls?.raw;
  img.alt = imageData?.alt_description;

  const imageDetailsDiv = document.createElement("div");
  imageDetailsDiv.className = "image-details";

  const photographerDiv = document.createElement("div");
  photographerDiv.className = "photographer";

  const cameraIconImg = document.createElement("img");
  cameraIconImg.src = "./asset/camera-icon.svg";
  cameraIconImg.alt = "camera-icon";

  const photographerSpan = document.createElement("span");
  photographerSpan.textContent =
    imageData?.user?.name ||
    `${imageData?.user?.first_name} ${imageData?.user?.last_name}` ||
    imageData?.user?.social?.instagram_username ||
    imageData?.user?.social?.twitter_username;

  // Create the download link using an anchor (<a>) tag
  const previewBtn = document.createElement("button");
  previewBtn.addEventListener("click", () => {
    showImagePreview(imageData);
  });

  const previewIconImg = document.createElement("img");
  previewIconImg.src = "./asset/preview-icon.svg";
  previewIconImg.alt = "preview-icon";

  // Append the elements to the respective parents
  photographerDiv.appendChild(cameraIconImg);
  photographerDiv.appendChild(photographerSpan);

  previewBtn.appendChild(previewIconImg);

  imageDetailsDiv.appendChild(photographerDiv);
  imageDetailsDiv.appendChild(previewBtn);

  cardLi.appendChild(img);
  cardLi.appendChild(imageDetailsDiv);

  return cardLi;
}

// Function to render the list of image cards
function renderImageCards(imageDataArray) {
  imageList.innerHTML = ""; // Clear existing data before rendering new data
  imageDataArray.forEach((imageData) => {
    const cardLi = createImageCard(imageData);
    imageList.appendChild(cardLi);
  });
}

// Function to handle "Load More" button click
async function handleLoadMoreClick() {
  currentPage++; // Increment the current page
  showLoader();
  // Fetch more image data for the next page with the current search query
  const nextPageImageData = await fetchImageData(currentPage, searchQuery);
  hideLoader();
  // If there are no results in the nextPageImageData, it means we reached the end of pagination.
  if (nextPageImageData.results.length === 0) {
    loadMoreButton.disabled = true;
    showNoResultMessage(); // Show the "No Image found" message when there are no results
  } else {
    hideNoResultMessage(); // Hide the "No Image found" message when there are results
  }

  imageDataArray = [...imageDataArray, ...nextPageImageData.results];

  // Render the updated list of image cards
  renderImageCards(imageDataArray);
}

// Function to handle form submission (manual search)
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting normally
  showLoader();
  const newSearchQuery = searchInput.value.trim();
  hideLoader();
  if (newSearchQuery !== "") {
    // Reset the current page and the image data array for the new search
    currentPage = 1;
    imageDataArray = [];
    searchQuery = newSearchQuery;

    // Fetch and render the new image data based on the new search query
    const imageData = await fetchImageData(currentPage, searchQuery);

    // If there are no results in the imageData, it means the search query didn't return any results.
    if (imageData.results.length === 0) {
      showNoResultMessage(); // Show the "No Image found" message when there are no results
      loadMoreButton.style.display = "none"; // Hide the "Load More" button
    } else {
      hideNoResultMessage(); // Hide the "No Image found" message when there are results
      loadMoreButton.style.display = "block"; // Show the "Load More" button
    }

    imageDataArray = [...imageDataArray, ...imageData.results];
    renderImageCards(imageDataArray);

    // Enable the "Load More" button for pagination
    loadMoreButton.disabled = false;
  }
}

// Add event listeners to the "Load More" button and the form
loadMoreButton.addEventListener("click", handleLoadMoreClick);
searchForm.addEventListener("submit", handleFormSubmit);

// Initial loading of image data with the default search query
(async () => {
  showLoader();
  const imageData = await fetchImageData(currentPage, searchQuery);
  hideLoader();
  // If there are no results in the imageData, it means the default search query didn't return any results.
  if (imageData.results.length === 0) {
    return;
  }

  imageDataArray = [...imageDataArray, ...imageData.results];
  renderImageCards(imageDataArray);

  // Disable the "Load More" button if no more data is available
  if (currentPage === imageData.total_pages) {
    loadMoreButton.disabled = true;
  }
})();
