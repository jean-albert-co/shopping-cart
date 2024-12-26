//----------------VARIABLES----------------
const shoppingCart = document.querySelector('#carrito');
const courseList = document.querySelector('#lista-cursos');
const cartContainer = document.querySelector('#lista-carrito tbody');
const emptyCartBtn = document.querySelector('#vaciar-carrito');
let cartItems = [];

// inicia los EventListeners
initEventListeners();

function initEventListeners() {
	//escucha evento click cuando das clic en "Agregar al carrito"
	courseList.addEventListener('click', getSelectedCourse);
	// elimina curso del carrito
	shoppingCart.addEventListener('click', removeItemsFromCart);
	// muestra los cursos del localstorage en el carrito
	document.addEventListener('DOMContentLoaded', () => {
		cartItems = JSON.parse(localStorage.getItem('localstorageArticles')) || [];
		renderCart();
	});
	// vacia el carrito
	shoppingCart.addEventListener('click', emptyCart);
}

//----------------FUNCIONES----------------

// obtiene el div que tiene el contenido del curso
function getSelectedCourse(event) {
	event.preventDefault();
	// valida que el usuario haya presionado el boton "Agregar al carrito"
	if (event.target.classList.contains('agregar-carrito')) {
		// accedemos a todo el div que tiene el contenido del curso
		const selectedCourse = (event.target.parentElement.parentElement);//traversing del DOM
		readCourseData(selectedCourse);
	}
}

//lee el contenido del HTML al que le dimos clic y extrae la información del curso
function readCourseData(course) {
	// Creacion de un objeto con el contenido actual
	const courseData = {
		id: course.querySelector('a').getAttribute('data-id'),
		imagen: course.querySelector('img').src,
		titulo: course.querySelector('h4').textContent,
		autor: course.querySelector('p').textContent,
		calificacion: course.querySelector('.info-card img').src,
		precio: course.querySelector('.precio span').textContent,
		cantidad: 1
	};

	addItemToCart(courseData);
}

// adiciona elementos al localitiesArray de cartItems
function addItemToCart(courseData) {
	// valida si ya isExist el articulo o curso
	const courseExists = cartItems.some(item => item.id === (courseData.id));
	if (courseExists) {
		// acualiza la cantidad del aticulo o curso
		updateCourseQuantity(courseData);
	} else {
		// adicionamos el curso al shoppingCart
		cartItems = [...cartItems, courseData];
	}
	renderCart();
}

// acualiza la cantidad del aticulo o curso
function updateCourseQuantity(courseData) {
	// .map(): crea un nuevo localitiesArray de cursos
	let courses = cartItems.map(item => {
		if (item.id === (courseData.id)) {
			item.cantidad++;
			console.log('actualizando shoppingCart...', item);
			return item;//retorna el objetos actualizado
		} else {
			return item;//retorna  los objetos que no son duplicados
		}
	});
	cartItems = [...courses];
}

// elimina curso del shoppingCart
function removeItemsFromCart(event) {
	if (event.target.classList.contains('borrar-curso')) {
		console.log('eliminando shoppingCart...');
		const cursoId = event.target.getAttribute('data-id');
		// elimina del localitiesArray de cartItems por el data-id
		cartItems = cartItems.filter(item => item.id !== cursoId);
		renderCart();//Itera sobre el shoppingCart y lo muestra en el HTML
	}
}

function emptyCart() {
	cartItems = [];//reseteamos el localitiesArray
	clearCartHTML();//eliminamos toodo el HTML
}

// Muestra los cartItems del shoppingCart de compras en en HTML
function renderCart() {
	clearCartHTML();
	// recorre el shoppingCart y genera el HTML
	cartItems.forEach((course) => {
		const { imagen, titulo, autor, calificacion, precio, cantidad, id } = course;// destructuring de objetos
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
		// adiciona el HTML del shoppingCart en el <tbody> </tbody>
		cartContainer?.appendChild(fila);
	});
	addArticlesToLocalStorage();
}

// Limpia el shoppingCart borrando los curso anterior del </tbody> para que no se repita
function clearCartHTML() {
	// cartContainer.innerHTML = ''; // forma lenta
	while (cartContainer.firstChild) {
		// eliminando por referencia: forma optima
		cartContainer.removeChild(cartContainer.firstChild);
	}
}

// Sincroniza los cartItems adicionados al shoppingCart con el localstorage
function addArticlesToLocalStorage() {
	localStorage.setItem('localstorageArticles', JSON.stringify(cartItems));
}

