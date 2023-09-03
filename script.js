
const global = {
    currentPage: window.location.pathname,
    search: {
      term: '',
      type: '',
      page: 1,
      totalPages: 1,
      totalResults: 0
    }
}
//Highlight active link

function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
        if (link.getAttribute('href') === global.currentPage) {
            link.classList.add('active');
        }
    });
}   

function addCommasToNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Popular Movies
const displayPopularMovies = async() => {
    const {results} = await fetchAPIData('movie/popular');
    console.log(results);
    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        ${
            movie.poster_path ?
            `<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
        />` : 
            `<img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${movie.title}"
        />`
        }
        </a>
        <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
        </div>
        `;
        const popularMovies = document.querySelector('#popular-movies');
        popularMovies.appendChild(div);
    })
}
//Popular TV Shows

const displayPopularShows = async() => {
    const {results} = await fetchAPIData('tv/popular');
    console.log(results);
    results.forEach((show) => {
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
            ${
                show.poster_path ?
                `<img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="${show.name}"
                />` :
                `
                <img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
                />`
            }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">Air Dated: ${show.first_air_date}</small>
                </p>
            </div>
        `;
        const popularShows = document.querySelector('#popular-shows');
        popularShows.appendChild(div);
    });

}

//Display Movie details
const displayMovieDetails = async() => {
    const [first, movieId] = window.location.search.split('=');

    console.log(movieId);
    const movie = await fetchAPIData(`movie/${movieId}`);
    console.log(movie);
    //Overlay for background image
    displayBackgroundImage('movie', movie.backdrop_path);

    const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
    <div>
    ${
        movie.poster_path ?
        `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
        />` :
        `
        <img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
        />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${movie.release_date}</p>
      <p>
        ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
    ${movie.production_companies.map((element) => `<span> ${element.name}</span>`).join('')}
    </div>
  </div>
    `;
    document.querySelector('#movie-details').appendChild(div);
}

//Display TV Show details
const displayShowDetails = async() => {
    const [first, showId] = window.location.search.split('=');
    console.log(showId);
    const show = await fetchAPIData(`tv/${showId}`);
    console.log(show);

    displayBackgroundImage('tv', show.backdrop_path);
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="details-top">
    <div>
    ${
        show.poster_path ?
        `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.title}"
        />` :
        `
        <img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${show.title}"
        />`
    }
    </div>
    <div>
      <h2>${show.name}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${show.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
      <p>
        ${show.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
      </li>
      <li><span class="text-secondary">Status:</span> ${show.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${show.production_companies.map((element) => `<span> ${element.name}</span>`)}</div>
  </div>
    `;
    document.querySelector('#show-details').appendChild(div);
}


//Display Backdrop on Details Pages
const displayBackgroundImage = (type, backgroundPath) => {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.opacity = '0.1';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';

    if(type === 'movie') {
        document.querySelector('#movie-details').appendChild(overlayDiv);
    }else{
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}   

//Display Slider Movie
const displaySlider = async() => {
    const {results} = await fetchAPIData('movie/now_playing');
    console.log(results);

    results.forEach((movie) => {
        const div = document.createElement('div');
        div.classList.add('swiper-slide');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
        </h4>
        `;
        document.querySelector('.swiper-wrapper').appendChild(div);
        initSwiper();
    });
};

function initSwiper(){
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 1
      },
      700: {
        slidesPerView: 2
      },
      1200: {
        slidesPerView: 3
      },
    }
  });
};

//Search Movies-TV Shows
const search = async() => {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get('search-term'));
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if(global.search.term !== '' && global.search.term !== null) {
    const {results, total_pages, page, total_results} = await searchAPIData();
    console.log(results);

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;


    if(results.length === 0){
      showAlert('No results found', 'success');
      return;
    }
    displaySearchResults(results);
  }else{
    showAlert('Please enter a search form', 'error');
  }
}

//Display Search Results
const displaySearchResults = (results) => {
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="${global.search.type}-details.html?id=${result.id}">
        ${
            result.poster_path ?
            `<img
            src="https://image.tmdb.org/t/p/w500${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />` :
            `
            <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="${global.search.type === 'movie' ? result.title : result.name}"
            />`
        }
        </a>
        <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
            <p class="card-text">
            <small class="text-muted">Air Dated: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
            </p>
        </div>
    `;
    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
    `;
    const popularShows = document.querySelector('#search-results');
    popularShows.appendChild(div);
});
}

//Show Alert
function showAlert(message, className) {
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert', className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);

  setTimeout(() => alertEl.remove(), 3000);
} 

//Make request to Search

async function searchAPIData() {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_KEY = 'b4b00a45b60f909e3be0b5b8e37e879f';

  showSpinner();

  const response = await fetch(`${API_URL}/search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}`);
  const data = await response.json();

  hideSpinner();

  return data;
}


//Fetch data from TMDB API
async function fetchAPIData(endpoint) {
    const API_URL = 'https://api.themoviedb.org/3';
    const API_KEY = 'b4b00a45b60f909e3be0b5b8e37e879f';

    showSpinner();

    const response = await fetch(`${API_URL}/${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();

    hideSpinner();

    return data;
}

const showSpinner = () => {
    document.querySelector('.spinner').classList.add('show');
}

const hideSpinner = () => {
    document.querySelector('.spinner').classList.remove('show');
}

//Init

function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html': 
            displaySlider();   
            displayPopularMovies();
            break;
        case '/shows.html':
            displayPopularShows();
            break;    
        case '/movie-details.html':
            displayMovieDetails();
            break;  
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;  
        }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);