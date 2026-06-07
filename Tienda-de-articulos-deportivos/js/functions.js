//--------------------Menú del sitio------------------------
/*en esta sección usaremos una función flecha anónima para abrir y cerrar el menu
a traves del icono tipo hamburguesa y el boton X del menú usando toggle para simular
un switch y agregar o quitar una clase de CSS*/
const buttonMenu = document.getElementById("unhiddenMenu");
const visible = document.getElementById("menuUnhidden");

buttonMenu.addEventListener("click", () => {
    visible.classList.toggle("menuUnhidden");
    document.body.classList.add('bodyNoScroll');
});

const buttonClose = document.getElementById("menuHidden");

buttonClose.addEventListener("click", () => {
    visible.classList.toggle("menuUnhidden");
    document.body.classList.remove('bodyNoScroll');
    unhidden.classList.toggle("categoriesUnhidden");
});

const categories = document.getElementById("categories");
const unhidden = document.getElementById("hiddenUnhidden");

categories.addEventListener("click", () => {
    unhidden.classList.toggle("categoriesUnhidden");
});


//--------------------Carrito de compras----------------------
/*esta sección es similar a la de abrir y cerrar el menú pero para abrir y cerar el carrito
de compras*/
const buttonCart = document.getElementById("cartVisible");
const visibleCart = document.getElementById("cartUnhidden");

buttonCart.addEventListener("click", () => {
    visibleCart.classList.toggle("cartUnhidden");
    document.body.classList.add('bodyNoScroll');
});

const closeCart = document.getElementById("cartHidden");

closeCart.addEventListener("click", () => {
    visibleCart.classList.toggle("cartUnhidden");
    document.body.classList.remove('bodyNoScroll');
});


//--------------------LocalStorage: Datos del carrito----------------------
/*la siguiente función la usaremos para leer los datos del carrito guardados en localStorage
si el registro se encuentra vació, nos devuelve un array sin datos y la función saveCart nos
ayuda a guardar los datos contenidos en el carrito en el localStorage*/
let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

function saveCart() {
    localStorage.setItem("cartData", JSON.stringify(cartData));
}


//--------------------Contador del carrito----------------------
/*el siguiente fragmento nos ayuda a saber la cantidad de productos agregados al carrito y coloca
el valor en elemeto cartCount para que el usuario pueda ver el número sin necesidad de abrir el
carrito*/
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    const totalItems = document.querySelectorAll(".cart__item").length;

    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.add("counterVisible");
    } else {
        cartCount.classList.remove("counterVisible");
    }
}


//--------------------Agregar productos----------------------
/*El siguiente código nos ayudara a agregar los productos al carrito de compras a
través de los botones colocados debajo de cada producto de la seccion productos del
sitio. esto lo hace en el carrito y en los datos de array giuardado en localStorage*/
const addButtons = document.querySelectorAll(".products__btn--add");
const totalCart = document.querySelector(".cart__total");

addButtons.forEach(button => {
    button.addEventListener("click", (item) => {
        const product = item.target.closest(".products__item");
        const title = product.querySelector(".products__description").textContent;
        const price = product.querySelector(".products__price").getAttribute("data-price");
        const image = product.querySelector(".products__image").src;
        const formattedPrice = Number(price).toLocaleString("es-MX", {currency: "MXN"});

        addToCart(title, price, formattedPrice, image);
    });
});

function addToCart(title, price, formattedPrice, image) {
    cartData.push({
        title,
        price: Number(price),
        image,
        quantity: 1,
        checked: true
    });

    saveCart();

    const cart = document.querySelector(".cart");
    const item = document.createElement("article");
    item.classList.add("cart__item");

    item.innerHTML = `
        <input class="cart__item--check" type="checkbox" checked>
        <img class="cart__item--image" src="${image}">
        <div class="cart__item--info">
            <header class="cart__item--header">
                <h3 class="cart__item--description">${title}</h3>
                <img class="cart__item--delete" src="img/Eliminar icono.png" alt="Icono Eliminar">
            </header>
            <section class="cart__item--details">
                <select class="cart__item--cant" name="cantProducts">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <p class="cart__item--price" data-price=${price}>${formattedPrice}</p>
            </section>
        </div>
    `;

    cart.insertBefore(item, totalCart);

    updateCartCount();
    updateCartTotal();
}


//--------------------Eliminar productos----------------------
/*con la siguiente sección de cpodigo eliminaremos lo productos del carrito del sitio y del array
alojado en el localStorege para que ambosa datos sean los mismos y podamos recuperarlos aún después de
recagar la página o cerrarla y abrirla*/
document.addEventListener("click", (item) => {
    if (item.target.classList.contains("cart__item--delete")) {

        const product = item.target.closest(".cart__item");
        const title = product.querySelector(".cart__item--description").textContent;

        cartData = cartData.filter(p => p.title !== title);
        saveCart();
        product.remove();
        updateCartCount();
        updateCartTotal();
    }
});


//--------------------Actualizar cantidades y checks----------------------
/*el siguiente bloque nos ayuda a reclcular las cantidades de los subtotales de cada producto del carrito cada vez
que se hace una modificación al agregar o eliminar un producto y al cambiar las cantidades en los select de cada
item del carrito*/
const myCart = document.querySelector(".cart");

myCart.addEventListener("change", (event) => {

    const item = event.target.closest(".cart__item");
    const title = item.querySelector(".cart__item--description").textContent;
    const product = cartData.find(p => p.title === title);

    if (event.target.matches(".cart__item--cant")) {
        product.quantity = Number(event.target.value);
        saveCart();
        updateSubtotal(event.target);
        updateCartTotal();
    }

    if (event.target.matches(".cart__item--check")) {
        product.checked = event.target.checked;
        saveCart();
        updateCartTotal();
    }
});

function updateSubtotal(select) {
    const item = select.closest(".cart__item");
    const priceElement = item.querySelector(".cart__item--price");
    const price = Number(priceElement.getAttribute("data-price"));
    const quantity = Number(select.value);

    const subtotal = price * quantity;
    priceElement.textContent = `$${subtotal.toLocaleString("es-MX")}`;
}


//--------------------Total del carrito----------------------
/*con la función siguiente recalculamos la cantidad tortal de los productos del
carrito cada vez que se genera un cambio*/
function updateCartTotal() {
    const items = document.querySelectorAll(".cart__item");
    let total = 0;

    items.forEach(item => {
        const check = item.querySelector(".cart__item--check");

        if (!check.checked) return;

        const priceElement = item.querySelector(".cart__item--price");
        const price = Number(priceElement.getAttribute("data-price"));
        const select = item.querySelector(".cart__item--cant");
        const quantity = Number(select.value);

        const subtotal = price * quantity;
        total += subtotal;
    });

    const totalElement = document.querySelector(".cart__total--amount");
    totalElement.textContent = `$${total.toLocaleString("es-MX")}`;
}


//--------------------Reconstruir carrito desde localStorage----------------------
/*finalmente con al siguente cloque de instrucciones recreamos los elementos guardados en el localSorage
en el carrrito despues de recargar la página o al cerrar y abrir nuevamente el sitio*/
function rebuildCartFromStorage() {
    const cart = document.querySelector(".cart");
    const totalCart = document.querySelector(".cart__total");

    cartData.forEach(product => {

        const item = document.createElement("article");
        item.classList.add("cart__item");

        item.innerHTML = `
            <input class="cart__item--check" type="checkbox" ${product.checked ? "checked" : ""}>
            <img class="cart__item--image" src="${product.image}">
            <div class="cart__item--info">
                <header class="cart__item--header">
                    <h3 class="cart__item--description">${product.title}</h3>
                    <img class="cart__item--delete" src="img/Eliminar icono.png" alt="Icono Eliminar">
                </header>
                <section class="cart__item--details">
                    <select class="cart__item--cant" name="cantProducts">
                        <option value="1" ${product.quantity === 1 ? "selected" : ""}>1</option>
                        <option value="2" ${product.quantity === 2 ? "selected" : ""}>2</option>
                        <option value="3" ${product.quantity === 3 ? "selected" : ""}>3</option>
                    </select>
                    <p class="cart__item--price" data-price=${product.price}>
                        $${(product.price * product.quantity).toLocaleString("es-MX")}
                    </p>
                </section>
            </div>
        `;

        cart.insertBefore(item, totalCart);
    });

    updateCartCount();
    updateCartTotal();
}


//--------------------Ejecutar reconstrucción del carrito al cargar----------------------
document.addEventListener("DOMContentLoaded", () => {
    rebuildCartFromStorage();
});
