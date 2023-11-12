
let catalogo = [];
let carrito = [];

function actualizarCarrito(sku, cantidad) {
  carrito.find((producto) => sku === producto.id)
    ? (carrito[carrito.findIndex((producto) => producto.id === sku)].cantidad +=
        cantidad)
    : carrito.push({ id: sku, cantidad: cantidad });
  //Elimina del carrito items con cantidad 0
  carrito = carrito.filter((producto) => producto.cantidad > 0);
  //Guardado del carrito en el Local Storage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function borrarCarrito() {
  carrito = [];
  //Guardado del carrito en el Local Storage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function buscarPrecio(sku) {
  const precioSku =
    catalogo[catalogo.findIndex((producto) => producto.id === sku)].precio;
  return precioSku;
}

function buscarNombre(sku) {
  const nombreSku =
    catalogo[catalogo.findIndex((producto) => producto.id === sku)].nombre;
  return nombreSku;
}

function buscarImgsrc(sku) {
  const imgsrc =
    catalogo[catalogo.findIndex((producto) => producto.id === sku)].img_src;
  return imgsrc;
}

function buscarCantidad(sku) {
 
  if (carrito[carrito.findIndex((producto) => producto.id === sku)]) {
    cantidadSku =
      carrito[carrito.findIndex((producto) => producto.id === sku)].cantidad;
  } else cantidadSku = 0;
  return cantidadSku;
}

function totalCarrito() {
  const total = carrito.reduce(
    (acc, item) => (acc += item.cantidad * buscarPrecio(item.id)),
    0
  );
  return total;
}

function itemsEnCarrito() {
  const total = carrito.reduce((acc, item) => (acc += item.cantidad), 0);
  return total;
}

function ordenarPrecio(array, ordenPrecio) {
  switch (ordenPrecio) {
    case 'ascendente':
      array.sort((a, b) => a.precio - b.precio);
      break;
    case 'descendente':
      array.sort((a, b) => b.precio - a.precio);
    default:
      break;
  }
  return array;
}

const cart_shadow = document.querySelector('.cart_shadow');
const cart_icon = document.querySelector('.navbar_cart_icon');
const cart_close = document.querySelector('.cart_close_icon');
const cart_siderbar = document.querySelector('.cart_sidebar');

function mostrarCarrito() {
  cart_shadow.classList.toggle('cart_shadow_show');
  cart_siderbar.classList.toggle('cart_sidebar_show');
  //Cuando se abre sideBar no permitimos scroll
  document.body.classList.toggle('no_scroll');
}
cart_icon.addEventListener('click', function () {
  mostrarCarrito();
});
cart_close.addEventListener('click', function () {
  mostrarCarrito();
});

const filter_shadow = document.querySelector('.filter_shadow');
const menuIcon = document.querySelector('.navbar_menu');
const filterContainer = document.querySelector('.filtersContainer');
const filter_close = document.querySelector('.filtersContainer_close');

function mostrarMenu() {
  filterContainer.classList.toggle('filtersContainer_show');
  filter_shadow.classList.toggle('filter_shadow_show');
  document.body.classList.toggle('no_scroll');
}

menuIcon.addEventListener('click', function () {
  mostrarMenu();
});

filter_close.addEventListener('click', function () {
  mostrarMenu();
});

async function cargarCatalogo() {
  const response = await fetch('./data/catalogo.json');
  catalogo = await response.json();
}

window.addEventListener('DOMContentLoaded', async () => {
  await cargarCatalogo();
  insertarCatalogo(catalogo);
  carritoStorage();
  crearFiltros();
  rangoPrecios();
});

const products_container = document.querySelector('.products_container');
function insertarCatalogo(arrayProductos) {
  products_container.innerHTML = '';
  if (arrayProductos.length == 0) {
    const errorBusqueda = document.createElement('h3');
    errorBusqueda.classList.add('errorBusqueda');
    errorBusqueda.innerText = 'Su busqueda no arrojó resultados';
    products_container.appendChild(errorBusqueda);
  } else {
    for (const producto of arrayProductos) {
      const indiv_product = document.createElement('div');
      indiv_product.classList.add('indiv_product');
      indiv_product.innerHTML = `<div class="indiv_product_img_container">
            <img
              src="${producto.img_src}"
              class="indiv_product_img"
              alt="Product Image"
            />
          </div>
          <div class="indiv_product_info">
            <h2 class="indiv_product_title">${producto.nombre}</h2>
            <h3 class="indiv_product_price">$${producto.precio.toLocaleString(
              'es-AR'
            )}</h3>
            <div class="indiv_product_buy" data-id="${producto.id}">
              <img
                src="./icons/add_shopping_cart_black_24dp.svg"
                alt="Shopping Cart"
                class="indiv_product_buy_img"
              />
              <span class="indiv_product_buy_text">Comprar</span>
            </div>
          </div>`;

      products_container.appendChild(indiv_product);
    }
  }
}

const cart_products_list = document.querySelector('.cart_products_list');

function insertarCarrito() {
  cart_products_list.innerHTML = '';

  for (const item of carrito) {
    const cart_product = document.createElement('li');
    cart_product.classList.add('cart_product');
    cart_product.innerHTML = `<img
                src="${buscarImgsrc(item.id)}"
                alt=""
                class="cart_product_img"
                data-id="${item.id}"
              />
              <div class="cart_product_info">
                <h2 class="cart_product_name" data-id="${
                  item.id
                }">${buscarNombre(item.id)}</h2>
                <h2 class="cart_product_price" data-id="${
                  item.id
                }">$${buscarPrecio(item.id).toLocaleString('es-AR')}</h2>
              </div>
              <div class="cart_product_inputContainer">
                <img
                  src="./icons/chevron_up_24dp.svg"
                  alt=""
                  class="cart_product_inputUp"
                  data-id="${item.id}"
                />
                <h3 class="cart_product_input" data-id="${item.id}">${
      item.cantidad
    }</h3>
                <img
                  src="./icons/chevron_down_24dp.svg"
                  alt=""
                  class="cart_product_inputDown"
                  data-id="${item.id}"
                />
              </div>`;
    cart_products_list.appendChild(cart_product);
  }
  insertarTotal();
  cartCounter();
}

products_container.addEventListener('click', (e) => {
  if (
    e.target.classList.contains('indiv_product_buy') ||
    e.target.parentNode.classList.contains('indiv_product_buy')
  ) {
    const sku =
      parseInt(e.target.getAttribute('data-id')) ||
      parseInt(e.target.parentNode.getAttribute('data-id'));
    actualizarCarrito(sku, 1);
    insertarCarrito();
    cartToast();
  }
});

cart_products_list.addEventListener('click', function (e) {
  const sku = parseInt(e.target.getAttribute('data-id'));
  if (e.target.classList.contains('cart_product_inputUp')) {
    actualizarCarrito(sku, 1);
    insertarCarrito();
  } else {
    if (e.target.classList.contains('cart_product_inputDown')) {
      actualizarCarrito(sku, -1);
      insertarCarrito();
    }
  }
});

const cart_total = document.querySelector('.cart_total');
function insertarTotal() {
  cart_total.innerHTML = `Total: $ ${totalCarrito().toLocaleString('es-AR')}`;
}

const cart_reset = document.querySelector('.cart_btns_reset');

cart_reset.addEventListener('click', function () {
  borrarCarrito();
  insertarCarrito();
  mostrarCarrito();
});

const checkout = document.querySelector('.cart_btns_buy');
const cart_title = document.querySelector('.cart_title');

checkout.addEventListener('click', function () {
  checkoutToast(totalCarrito());
  setTimeout(function () {
    borrarCarrito();
    insertarCarrito();
    mostrarCarrito();
  }, 2500);
});


const cart_counter = document.querySelector('.navbar_cart_counter');

function cartCounter() {
  if (itemsEnCarrito() > 0) {
    cart_counter.classList.add('navbar_cart_counter_show');
    cart_counter.innerHTML = `<h2 class="navbar_cart_counter_text">${itemsEnCarrito()}</h2>`;
  } else {
    cart_counter.classList.remove('navbar_cart_counter_show');
  }
}


function carritoStorage() {
  const carritoStorage = JSON.parse(localStorage.getItem('carrito'));
  carrito = carritoStorage || [];
  insertarCarrito();
}


function crearFiltros() {
  const filtrosCategorias = [
    'Todas',
    ...new Set(catalogo.map((item) => item.categoria)),
  ];
  insertarFiltros(filtrosCategorias);
}


const filterCategoria = document.querySelector('.filterCategoria');

function insertarFiltros(array) {
  for (const item of array) {
    const filterBtn = document.createElement('button');
    filterBtn.classList.add('filterCategoria_indiv');
    filterBtn.innerText = item;
    filterCategoria.appendChild(filterBtn);
  }
}

const rangoPrecio = document.querySelector('.filterPrice_bar');
const filterPrice_value = document.querySelector('.filterPrice_value');

function rangoPrecios() {
  const precioMax = Math.max(...catalogo.map((item) => item.precio));
  rangoPrecio.setAttribute('max', `${precioMax}`);
  rangoPrecio.setAttribute('value', `${precioMax}`);
  rangoPrecio.value = precioMax;
  filterPrice_value.innerText = `$${precioMax.toLocaleString('es-AR')}`;
  return precioMax;
}

let categoriaSeleccionada;
let precioSeleccionado;
let ordenPrecio;

filterCategoria.addEventListener('click', (e) => {
  if (e.target.classList.contains('filterCategoria_indiv')) {
    categoriaSeleccionada = e.target.innerText;
  }
  filtrarCatalogo(categoriaSeleccionada, precioSeleccionado, ordenPrecio);
});

rangoPrecio.addEventListener('input', (e) => {
  precioSeleccionado = parseInt(e.target.value);
  filterPrice_value.innerText = `$${precioSeleccionado.toLocaleString(
    'es-AR'
  )}`;
  filtrarCatalogo(categoriaSeleccionada, precioSeleccionado, ordenPrecio);
});


const btn_ordenPrecio = document.querySelectorAll(
  '.filterOrdenar_precio_indiv'
);

btn_ordenPrecio.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    if (e.target.classList.contains('ordenarPrecio_a')) {
      ordenPrecio = 'ascendente';
      filtrarCatalogo(categoriaSeleccionada, precioSeleccionado, ordenPrecio);
    }
    if (e.target.classList.contains('ordenarPrecio_d')) {
      ordenPrecio = 'descendente';
      filtrarCatalogo(categoriaSeleccionada, precioSeleccionado, ordenPrecio);
    }
  });
});


const btn_borrarFiltros = document.querySelector('.filterBorrar');

btn_borrarFiltros.addEventListener('click', () => {
  categoriaSeleccionada = 'Todas';
  precioSeleccionado = rangoPrecios();
  ordenPrecio = 'ascendente';
  insertarCatalogo(catalogo);
});

function filtrarCatalogo(categoria, precio, ordenPrecio) {
  categoria = categoria || 'Todas';
  precio = precio || parseInt(rangoPrecio.value);
  ordenPrecio = ordenPrecio || 'ascendente';
  if (categoria != 'Todas') {
    const catalogoFiltrado = catalogo.filter(
      (item) => item.categoria == categoria && item.precio <= precio
    );
    ordenarPrecio(catalogoFiltrado, ordenPrecio);
    insertarCatalogo(catalogoFiltrado);
  } else {
    const catalogoFiltrado = catalogo.filter((item) => item.precio <= precio);
    ordenarPrecio(catalogoFiltrado, ordenPrecio);
    insertarCatalogo(catalogoFiltrado);
  }
}


function cartToast() {
  Toastify({
    text: `Item agregado al carrito`,
    duration: 2000,
    gravity: 'top', 
    position: 'right', 
    stopOnFocus: true, 
    className: 'cartToast',
    onClick: function () {
      mostrarCarrito();
    },
  }).showToast();
}


function checkoutToast(total) {
  Toastify({
    text: `Gracias por su compra! Su total ha sido de $${total.toLocaleString(
      'es-AR'
    )}`,
    duration: 3500,
    gravity: 'top', 
    position: 'right', 
    stopOnFocus: true, 
    className: 'checkoutToast',
  }).showToast();
}
