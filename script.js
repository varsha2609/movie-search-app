const API_KEY = 'a44d372b';

const movieGroups = {
  Malayalam:  [
    'Drishyam',
    'Premam',
    'Kumbalangi Nights',
    'Bangalore Days',
    'Ustad Hotel',
    'Take Off',
    'Charlie',
    'Virus',
    'C U Soon',
    'Trance',
    'Joseph',
    'Android Kunjappan Ver 5.25',
    'Maheshinte Prathikaaram',
    'Nna Thaan Case Kodu',
    'Thondimuthalum Driksakshiyum',
    'Home',
    'The Great Indian Kitchen',
    'Ayyappanum Koshiyum'
  ],
  Hindi:[
    '3 Idiots',
    'Dangal',
    'Zindagi Na Milegi Dobara',
    'PK',
    'Lagaan',
    'Gully Boy',
    'Barfi!',
    'Taare Zameen Par',
    'Kahaani',
    'Queen',
    'Article 15',
    'Andhadhun',
    'Dil Chahta Hai',
    'Piku',
    'Chak De! India',
    'Shershaah',
    'Mimi',
    'Masaan',
    'Uri: The Surgical Strike',
    'Jab We Met'
  ],
  Tamil:[
    'Vikram',
    'Master',
    'Asuran',
    'Kaithi',
    '96',
    'Super Deluxe',
    'Soorarai Pottru',
    'Vada Chennai',
    'Jai Bhim',
    'Pariyerum Perumal',
    'Thuppakki',
    'Petta',
    'Bigil',
    'Thani Oruvan',
    'Vikram Vedha',
    'Mersal',
    'Dasara',
    'Taanakkaran',
    'Kabali',
    'Etharkkum Thunindhavan'
  ],
  English:  [
    'Inception',
    'Interstellar',
    'The Dark Knight',
    'Avatar',
    'Avengers: Endgame',
    'Titanic',
    'Joker',
    'The Shawshank Redemption',
    'The Godfather',
    'The Matrix',
    'Fight Club',
    'Forrest Gump',
    'The Avengers',
    'Iron Man',
    'Black Panther',
    'Spider-Man: No Way Home',
    'Dune',
    'Top Gun: Maverick',
    'Oppenheimer',
    'The Batman'
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  loadDefaultMovies();

  
  const themeToggle = document.getElementById("themeToggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
  });


  document.getElementById("searchBtn").addEventListener("click", searchMovies);
});

function loadDefaultMovies() {
  const moviesContainer = document.getElementById('moviesContainer');
  moviesContainer.innerHTML = '';

  for (const [language, titles] of Object.entries(movieGroups)) {
    const section = document.createElement('div');
    section.classList.add('movies-section');
    section.innerHTML = `<h2>${language} Movies</h2>`;

    const row = document.createElement('div');
    row.classList.add('movies');

    titles.forEach(title => {
      fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`)
        .then(response => response.json())
        .then(movie => {
          if (movie.Response === "True") {
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');

            movieEl.innerHTML = `
              <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/160x240?text=No+Image'}" alt="${movie.Title}">
              <h3>${movie.Title}</h3>
              <p>⭐ ${movie.imdbRating} | ${movie.Year}</p>
            `;

            movieEl.addEventListener('click', () => showModal(movie));
            row.appendChild(movieEl);
          }
        });
    });

    section.appendChild(row);
    moviesContainer.appendChild(section);
  }
}

function searchMovies() {
  const query = document.getElementById('searchInput').value.trim();
  const moviesContainer = document.getElementById('moviesContainer');

  if (!query) return;

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
      moviesContainer.innerHTML = '';

      if (data.Response === "True") {
        const section = document.createElement('div');
        section.classList.add('movies-section');
        section.innerHTML = `<h2>Search Results</h2>`;

        const row = document.createElement('div');
        row.classList.add('movies');

        data.Search.forEach(movie => {
          fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
            .then(response => response.json())
            .then(fullMovie => {
              const movieEl = document.createElement('div');
              movieEl.classList.add('movie');

              movieEl.innerHTML = `
                <img src="${fullMovie.Poster !== "N/A" ? fullMovie.Poster : 'https://via.placeholder.com/160x240?text=No+Image'}" alt="${fullMovie.Title}">
                <h3>${fullMovie.Title}</h3>
                <p>⭐ ${fullMovie.imdbRating} | ${fullMovie.Year}</p>
              `;

              movieEl.addEventListener('click', () => showModal(fullMovie));
              row.appendChild(movieEl);
            });
        });

        section.appendChild(row);
        moviesContainer.appendChild(section);
      } else {
        moviesContainer.innerHTML = `<p>No results found for "${query}".</p>`;
      }
    });
}

function showModal(movie) {
  const modal = document.getElementById('movieModal');
  const modalBody = document.getElementById('modalBody');

  modalBody.innerHTML = `
    <img src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/150'}">
    <div>
      <h2>${movie.Title}</h2>
      <p><strong>Year:</strong> ${movie.Year}</p>
      <p><strong>Rated:</strong> ${movie.Rated}</p>
      <p><strong>Released:</strong> ${movie.Released}</p>
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>IMDb Rating:</strong> ⭐ ${movie.imdbRating}</p>
    </div>
  `;

  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('movieModal').style.display = 'none';
}
