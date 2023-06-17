const layoutContainer = document.querySelector(".layout-container");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const themeToggle = document.getElementById("themeToggle");

let posts = [];
let visiblePosts = 4;
const postsPerPage = 4;
let darkMode = false;

const fetchPosts = async () => {
  const url = "data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    posts = await response.json();
    renderCard();
  } catch (error) {
    console.error(error);
  }
};

const renderCard = () => {
  layoutContainer.innerHTML = "";

  for (let i = 0; i < visiblePosts; i++) {
    const post = posts[i];

    const card = createCard(post);
    layoutContainer.appendChild(card);
  }

  toggleLoadMoreButton();
};

const createCard = (post) => {
  const card = document.createElement("div");
  card.classList.add("card");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const image = document.createElement("img");
  image.src = post.image;
  image.alt = post.caption;
  image.addEventListener("click", () => openImageLightbox(post.image));

  imageContainer.appendChild(image);
  card.appendChild(imageContainer);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const name = document.createElement("h3");
  name.textContent = post.name;

  const date = document.createElement("p");
  date.textContent = post.date;

  cardBody.appendChild(name);
  cardBody.appendChild(date);
  card.appendChild(cardBody);

  const caption = document.createElement("p");
  caption.classList.add("caption");
  caption.textContent = post.caption;

  card.appendChild(caption);

  return card;
};

const toggleLoadMoreButton = () => {
  loadMoreBtn.style.display = visiblePosts >= posts.length ? "none" : "block";
};

const loadMorePosts = () => {
  visiblePosts += postsPerPage;
  renderCard();
};

const openImageLightbox = (imageUrl) => {
  const modal = createModal(imageUrl);
  document.body.appendChild(modal);

  const closeModal = () => {
    if (document.body.contains(modal)) {
      document.body.removeChild(modal);
    }
    layoutContainer.style.filter = "none";
    layoutContainer.style.pointerEvents = "all";
    loadMoreBtn.style.pointerEvents = "all";
  };

  const closeBtn = modal.querySelector(".close");
  closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  layoutContainer.style.filter = "blur(3px)";
  layoutContainer.style.pointerEvents = "none";
  loadMoreBtn.style.pointerEvents = "none";
};

const createModal = (imageUrl) => {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img src="${imageUrl}" alt="Enlarged Image">
    </div>
  `;
  return modal;
};

const toggleTheme = () => {
  document.body.classList.toggle("dark-mode");
  darkMode = !darkMode;
};

loadMoreBtn.addEventListener("click", loadMorePosts);
themeToggle.addEventListener("change", toggleTheme);

fetchPosts();
