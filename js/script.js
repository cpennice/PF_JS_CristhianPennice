const addItemButton = document.querySelector("#addItemButton");
const cartBody = document.querySelector("#cartBody");
const totalValueSpan = document.querySelector("#totalValue");

let cartItems = [];

// Intentamos obtener el estado anterior del carrito desde el localStorage
const storedCartItems = localStorage.getItem("cartItems");
if (storedCartItems) {
  cartItems = JSON.parse(storedCartItems);
  renderCartItems();
  updateCartTotal();
}

addItemButton.addEventListener("click", function () {
  Swal.fire({
    title: "Agregar artículo",
    html:
      '<input id="swal-input1" class="swal2-input" placeholder="Nombre del artículo">' +
      '<input id="swal-input2" class="swal2-input" placeholder="Precio del artículo">' +
      '<input id="swal-input3" class="swal2-input" placeholder="Cantidad del artículo">',
    confirmButtonText: "Agregar",
    focusConfirm: false,
    preConfirm: () => {
      const nombreArticulo =
        Swal.getPopup().querySelector("#swal-input1").value;
      const precioArticulo = parseFloat(
        Swal.getPopup().querySelector("#swal-input2").value
      );
      const cantidadArticulo = parseInt(
        Swal.getPopup().querySelector("#swal-input3").value
      );

      if (
        isNaN(precioArticulo) ||
        isNaN(cantidadArticulo) ||
        cantidadArticulo <= 0
      ) {
        Swal.showValidationMessage("Ingrese un precio y cantidad válidos");
      }

      return {
        nombreArticulo: nombreArticulo,
        precioArticulo: precioArticulo,
        cantidadArticulo: cantidadArticulo,
      };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const newCartItem = {
        nombre: result.value.nombreArticulo,
        precio: result.value.precioArticulo,
        cantidad: result.value.cantidadArticulo,
      };
      cartItems.push(newCartItem);
      renderCartItem(newCartItem);
      updateCartTotal();
      saveCartItemsToStorage();

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: "success",
        title: "Agregado!",
        text: "El artículo ha sido agregado al carrito.",
      });
    }
  });
});

cartBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-item")) {
    const itemIndex = Array.from(cartBody.children).indexOf(
      event.target.parentNode.parentNode
    );
    cartItems.splice(itemIndex, 1);
    event.target.parentNode.parentNode.remove();
    updateCartTotal();
    saveCartItemsToStorage();
    // Mostrar mensaje de confirmación
    Swal.fire({
      icon: "success",
      title: "Eliminado!",
      text: "El artículo ha sido eliminado del carrito.",
    });
  }
});

function renderCartItem(item) {
  const newCartItemTotal = item.precio * item.cantidad;
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${item.nombre}</td>
    <td>${item.precio}</td>
    <td>${item.cantidad}</td>
    <td>${newCartItemTotal}</td>
    <td><button class="btn btn-danger delete-item">Eliminar</button></td>
  `;
  cartBody.appendChild(newRow);
}

function renderCartItems() {
  cartItems.forEach(function (item) {
    renderCartItem(item);
  });
}

function updateCartTotal() {
  const cartItemsTotal = cartItems.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );
  totalValueSpan.textContent = cartItemsTotal;
}

function saveCartItemsToStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function fetchWeather() {
  const apiKey = "1ebc5fc1555d129636eda25ed8b5ee36";
  const city = "Buenos Aires";

  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      const kelvin = data.main.temp;
      const celsius = kelvin - 273.15;
      const fahrenheit = (celsius * 9) / 5 + 32;

      return {
        nombre: data.name,
        temperatura: celsius.toFixed(2),
        descripcion: data.weather[0].description,
      };
    })
    .catch((error) => {
      console.error(error);
    });
}

fetchWeather().then((weatherData) => {
  const weatherContainer = document.getElementById("weather-container");

  weatherContainer.innerHTML = `
      <h2>${weatherData.nombre}</h2>
      <p>Current temperature: ${weatherData.temperatura} &deg;C</p>
      <p>Description: ${weatherData.descripcion}</p>
    `;
});
