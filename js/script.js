let movieData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      movieData = data;
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });

  // Añadir el evento al botón después de que se haya cargado el DOM
  document.getElementById('btnBuscar').addEventListener('click', () => {
    const searchText = document.getElementById('inputBuscar').value.toLowerCase();
    if (searchText.trim() !== '') {
      const filteredMovies = movieData.filter(movie =>
        movie.title.toLowerCase().includes(searchText) ||
        movie.genres.some(genre => genre.name.toLowerCase().includes(searchText)) ||
        (movie.tagline && movie.tagline.toLowerCase().includes(searchText)) ||
        (movie.overview && movie.overview.toLowerCase().includes(searchText))
      );

      mostrarPeliculas(filteredMovies);
    } else {
      mostrarPeliculas([]); 
    }
  });
});

function mostrarPeliculas(movies) {
  const lista = document.getElementById('lista');
  lista.innerHTML = ''; 

  if (movies.length === 0) {
    lista.innerHTML = '<li class="list-group-item">No se encontraron resultados :(</li>'; 
    return; 
  }

  movies.forEach(movie => {
    const li = document.createElement('li');
    li.className = 'list-group-item bg-dark-custom text-light mb-2'; 
    li.innerHTML = `
    <h5>${movie.title}</h5>
    <p>${movie.tagline || ''}</p>
    <div>${mostrarEstrellas(movie.vote_average)}</div>
    <button class="btn btn-info mt-2 btnDetalles">Mostrar detalles</button>
    <div class="detalles" style="display:none;">
        <p><span class="texto-detalle">Descripción:</span> ${movie.overview}</p>
        <p><span class="texto-detalle">Géneros:</span> ${movie.genres.map(genre => genre.name).join(', ')}</p>
        <p><span class="texto-detalle">Año:</span> ${new Date(movie.release_date).getFullYear()}</p>
        <p><span class="texto-detalle">Duración:</span> ${movie.runtime} mins</p>
        <p><span class="texto-detalle">Presupuesto:</span> $${movie.budget.toLocaleString()}</p>
        <p><span class="texto-detalle">Recaudación:</span> $${movie.revenue.toLocaleString()}</p>
    </div>
`;


    li.querySelector('.btnDetalles').addEventListener('click', () => {
      const detallesDiv = li.querySelector('.detalles');
      detallesDiv.style.display = detallesDiv.style.display === 'none' ? 'block' : 'none'; // Alternar visibilidad
    });

    lista.appendChild(li);
  });
}

function mostrarEstrellas(vote) {
    const rating = Math.round(vote / 2);
    let estrellas = '';
  
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        estrellas += '<span style="color: #f7f77e;">★</span>'; // Estrella llena en amarillo
      } else {
        estrellas += '<span>☆</span>'; 
      }
    }
  
    return estrellas; 
  }
  