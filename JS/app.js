/// Datos de productos
const productos = [
    { nombre: "Camiseta", precio: 20, descripcion: "Camiseta de algodón." },
    { nombre: "Pantalones", precio: 30, descripcion: "Pantalones Sasteros." },
    { nombre: "Zapatos", precio: 40, descripcion: "Borcegos de cuero." },
    { nombre: "Sombrero", precio: 10, descripcion: "Sombrero." }
];

// Elementos del DOM
const catalogo = document.getElementById("catalogo");
const carritoList = document.getElementById("carrito");
const totalElement = document.getElementById("total");
const finalizarCompraButton = document.getElementById("finalizarCompra");
const limpiarCarritoButton = document.getElementById("limpiarCarrito");

// Carrito de compras
let carrito = [];

// Función para mostrar el catálogo
function mostrarCatalogo() {
    catalogo.innerHTML = "";
    productos.forEach((producto, index) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>${producto.descripcion}</p>
            <select id="producto${index}">
                <option value="0">Seleccionar cantidad</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <button class="agregar-carrito-btn" data-index="${index}">Agregar al Carrito</button>
        `;
        catalogo.appendChild(card);
    });
}

// Manejador de eventos utilizando la propagación de eventos para el botón "Agregar al Carrito"
catalogo.addEventListener("click", (event) => {
    if (event.target.classList.contains("agregar-carrito-btn")) {
        const index = event.target.getAttribute("data-index");
        const selectElement = document.getElementById(`producto${index}`);
        const cantidad = parseInt(selectElement.value);
        if (cantidad > 0) {
            agregarProducto(index, cantidad);
            selectElement.selectedIndex = 0;
        } else {
            mostrarMensaje("Selecciona una cantidad válida.");
        }
    }
});

// Manejador de eventos para el botón "Limpiar Carrito"
limpiarCarritoButton.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
    mostrarMensaje("El carrito ha sido limpiado.");
});

// Manejador de eventos para el botón "Finalizar Compra"
finalizarCompraButton.addEventListener("click", () => {
    const precioTotal = calcularPrecioTotal();
    if (precioTotal > 0) {
        mostrarMensaje(`¡Compra finalizada! Precio total: $${precioTotal.toFixed(2)}`);
        // Aquí puedes agregar lógica adicional, como enviar la orden a un servidor, etc.
        // Después de finalizar la compra, generalmente querrías limpiar el carrito:
        carrito = [];
        actualizarCarrito();
    } else {
        mostrarMensaje("El carrito está vacío. Agrega productos antes de finalizar la compra.");
    }
});

// Función para quitar un producto del carrito
function quitarProducto(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    mostrarMensaje("El producto ha sido quitado del carrito.");
}

// Función para agregar eventos a los botones de quitar
function agregarEventosQuitar() {
    const quitarButtons = document.querySelectorAll(".quitar-producto-btn");
    quitarButtons.forEach((button, index) => {
        button.addEventListener("click", () => quitarProducto(index));
    });
}

// Función para obtener el costo de envío seleccionado
function obtenerCostoEnvio() {
    const envioSelect = document.getElementById("envio");
    return parseInt(envioSelect.value);
}

// Función para calcular el precio total del carrito
function calcularPrecioTotal() {
    const precioProductos = carrito.reduce((total, item) => total + item.producto.precio * item.cantidad, 0);
    const costoEnvio = obtenerCostoEnvio();
    return precioProductos + costoEnvio;
}

// Función para agregar un producto al carrito
function agregarProducto(index, cantidad) {
    const producto = productos[index];
    carrito.push({ producto, cantidad });
    actualizarCarrito();
    mostrarMensaje(`Se han agregado ${cantidad} ${producto.nombre}(s) al carrito.`);
}

// Función para mostrar mensajes de alerta
function mostrarMensaje(mensaje) {
    alert(mensaje);
}

// Función para actualizar el carrito y el precio total
function actualizarCarrito() {
    carritoList.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        const precioTotalPorProducto = item.producto.precio * item.cantidad;
        total += precioTotalPorProducto;

        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        listItem.innerHTML = `
            ${item.cantidad} ${item.producto.nombre}(s) - Precio unitario: $${item.producto.precio} - Precio total: $${precioTotalPorProducto.toFixed(2)}
            <button class="btn btn-danger btn-sm quitar-producto-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
        `;
        carritoList.appendChild(listItem);
    });

    // Agregar el costo de envío al total
    total += obtenerCostoEnvio();

    totalElement.textContent = `Precio total de su compra: $${total.toFixed(2)}`;

    // Agregar eventos a los botones de quitar
    agregarEventosQuitar();
}

// Función para cargar el carrito desde el almacenamiento local
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// Inicialización
mostrarCatalogo();
cargarCarritoDesdeStorage();
agregarEventosQuitar();  // Agregar eventos al inicio
