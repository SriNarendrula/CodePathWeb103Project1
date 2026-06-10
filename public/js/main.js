document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('content-area');

  // Function to render the main list of 5+ items
  function renderListView() {
      fetch('/api/items')
          .then(res => res.json())
          .then(items => {
              let html = '<div class="grid">';
              items.forEach(item => {
                  // Creating a clickable card for each item
                  html += `
                      <article>
                          <img src="${item.img}" alt="${item.title}">
                          <h3>${item.title}</h3>
                          <p><strong>Genre:</strong> ${item.genre}</p>
                          <button onclick="navigateToDetail('${item.title.toLowerCase().replace(/\s+/g, '')}')">View Details</button>
                      </article>
                  `;
              });
              html += '</div>';
              contentArea.innerHTML = html;
          });
  }

  // Function to render the deep-dive detail view
  window.navigateToDetail = function(id) {
      fetch(`/api/items/${id}`)
          .then(res => res.json())
          .then(item => {
              contentArea.innerHTML = `
                  <article>
                      <header>
                          <button class="secondary" onclick="location.reload()">← Back to List</button>
                          <h2>${item.title}</h2>
                      </header>
                      <img src="${item.img}" alt="${item.title}" style="max-width: 400px;">
                      <p><strong>Release Year:</strong> ${item.year}</p>
                      <p><strong>Genre:</strong> ${item.genre}</p>
                      <p><strong>Description:</strong> ${item.desc}</p>
                  </article>
              `;
          });
  }

  // Initial Load
  renderListView();
});