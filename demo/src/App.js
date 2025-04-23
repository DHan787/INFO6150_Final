import logo from './logo.svg';
import './App.css';

let posts = [];
let currentPage = 1;
const postsPerPage = 10;

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("post-list")) {
        loadposts();

        const nextBtn = document.getElementById("next-button");
        const prevBtn = document.getElementById("prev-button");
        const searchInput = document.getElementById("search-input");

        if (nextBtn) nextBtn.addEventListener("click", nextPage);
        if (prevBtn) prevBtn.addEventListener("click", prevPage);
        if (searchInput) searchInput.addEventListener("input", searchPosts);
    }
});

async function loadposts() {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    posts = await res.json();
    displayPosts();
}

function displayPosts() {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const visiblePosts = posts.slice(start, end);

    const postListElement = document.getElementById("post-list");
    postListElement.innerHTML = "";

    if (visiblePosts.length === 0) {
        postListElement.innerHTML = "<li>No posts found.</li>";
        return;
    }

    visiblePosts.forEach(post => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="details.html?id=${post.id}">${post.title}</a>`;
        postListElement.appendChild(li);
    });

    document.getElementById("page-info").textContent = `Page ${currentPage} of ${Math.ceil(posts.length / postsPerPage)}`;
}

function nextPage() {
    if (currentPage * postsPerPage < posts.length) {
        currentPage++;
        displayPosts();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPosts();
    }
}

function searchPosts() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const listItems = document.querySelectorAll("#post-list li");
    listItems.forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? "" : "none";
    });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div class="search-container">
        <input type="text" id="search-input" placeholder="Search posts..." />
        <button class="search-button">Search</button>
      </div>
      <div id="post-details"></div>
      <div class="pagination">
          <button id="prev-button">Previous</button>
          <span id="page-info"></span>
          <button id="next-button">Next</button>
      </div>
    </div>
  );
}

export default App;
