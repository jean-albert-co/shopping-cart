//----------------VARIABLES----------------
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');

const vaciaCarrito = document.querySelector('#vaciar-carrito');
let articulos = [];

// inicia los EventListeners
function initEventListeners() {
    //escucha evento click cuando das clic en "Agregar al carrito
    listaCursos.addEventListener('click', obtenerCursoSeleccionado);
    // elimina curso del carrito
    carrito.addEventListener('click', eliminarArticulos);
    // muestra los cursos del localstorage en el carrito
    document.addEventListener('DOMContentLoaded', () => {
        articulos = JSON.parse(localStorage.getItem('localstorageArticles')) || [];
        mostrarCarritoHTML();
    });
    // vacia el carrito
    carrito.addEventListener('click', vaciarArticulos);
}
initEventListeners();

//----------------FUNCIONES----------------

// obtiene el div que tiene el contenido del curso
function obtenerCursoSeleccionado(event) {
    event.preventDefault();
    // valido que el usuario haya presionado el boton "Agregar al carrito"
    if (event.target.classList.contains('agregar-carrito')) {
        // accedemos a todo el div que tiene el contenido del curso
        const cursoSeleccionado = (event.target.parentElement.parentElement);//traversing del DOM
        leerDatosCurso(cursoSeleccionado);
    }
}

//lee el contenido del HTML al que le dimos clic y extrae la información del curso
function leerDatosCurso(curso) {
    // Creacion de un objeto con el contenido actual
    const informacionCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        autor: curso.querySelector('p').textContent,
        calificacion: curso.querySelector('.info-card img').src,
        precio: curso.querySelector('.lastName span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // console.log(informacionCurso);
    adicionarArticulos(informacionCurso);
}

// adciona elementos al localitiesArray de articulos
function adicionarArticulos(informacionCurso) {
    // valida si ya existe el articulo o curso
    const existe = articulos.some(curso => curso.id === (informacionCurso.id));
    if (existe) {
        // acualiza la cantidad del aticulo o curso
        actualizarCantidad(informacionCurso);
    }
    else {
        // adicionamos el curso al carrito
        articulos = [...articulos, informacionCurso];
    }
    mostrarCarritoHTML();
}

// acualiza la cantidad del aticulo o curso
function actualizarCantidad(informacionCurso) {
    // .map(): crea un nuevo localitiesArray de cursos
    const cursos = articulos.map(curso => {
        if (curso.id === (informacionCurso.id)) {
            console.log('actualizando carrito...');
            curso.cantidad++;
            return curso;//retorna el objetos actualizado
        } else {
            return curso;//retorna  los objetos que no son duplicados
        }

    });
    articulos = [...cursos];
}

// elimina curso del carrito
function eliminarArticulos(event) {
    if (event.target.classList.contains('borrar-curso')) {
        console.log('eliminando carrito...');
        const cursoId = event.target.getAttribute('data-id');
        // elimina del localitiesArray de articulos por el data-id
        articulos = articulos.filter(curso => curso.id !== cursoId);
        mostrarCarritoHTML();//Itera sobre el carrito y lo muestra en el HTML

    }
}

function vaciarArticulos() {
    articulos = [];//reseteamos el localitiesArray
    limpiarCarritoHTML();//eliminamos toodo el HTML
}

// Muestra los articulos del carrito de compras en en HTML
function mostrarCarritoHTML() {
    limpiarCarritoHTML();
    // recorre el carrito y genera el HTML
    articulos.forEach((curso) => {
        const { imagen, titulo, autor, calificacion, precio, cantidad, id } = curso;// destructuring de objetos
        const fila = document.createElement('tr');
        // muestra la información del curso en el </td>
        fila.innerHTML = `
        <td> <img src="${imagen}">  </img></td>
        <td> ${titulo} </td > 
        <td> ${autor} </td > 
        <td> <img src="${calificacion}">  </img></td>
        <td> ${precio} </td > 
        <td> ${cantidad} </td >        
        <td> 
            <a href="#" class="borrar-curso" data-id="${id}"> X </a>
        </td >        
        `;
        // adiciona el HTML del carrito en el <tbody> </tbody>
        contenedorCarrito.appendChild(fila);
    });
    addArticlesToLocalStorage();
}

// Limpia el carrito borrando los curso anterior del </tbody> para que no se repita 
function limpiarCarritoHTML() {
    // contenedorCarrito.innerHTML = ''; // forma lenta
    while (contenedorCarrito.firstChild) {
        // eliminando por referencia: forma optima
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Sincroniza los articulos adicionados al carrito con el localstorage
function addArticlesToLocalStorage() {
    localStorage.setItem('localstorageArticles', JSON.stringify(articulos));
}

