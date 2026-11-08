
"use strict";

const venue = {
  name: "Aurora Theatre",
  sections: [
    {
      name: "VIP",
      price: 80,
      rows: 4,
      seatsPerRow: 10
    },
    {
      name: "Premium",
      price: 50,
      rows: 8,
      seatsPerRow: 10
    },
    {
      name: "Standard",
      price: 25,
      rows: 12,
      seatsPerRow: 10
    }
  ]
};

const STORAGE_KEY = "auroraCart";

let seats = [];
let selectedSeat = null;
let cart = [];

function generateSeatData() {
  seats = [];

  venue.sections.forEach(section => {
    for (let row = 1; row <= section.rows; row++) {
      for (let number = 1; number <= section.seatsPerRow; number++) {
        seats.push({
          id: `${section.name}-${row}-${number}`,
          section: section.name,
          row,
          number,
          price: section.price,
          available: (row + number) % 9 !== 0
        });
      }
    }
  });
}

function saveCart() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(cart.map(seat => seat.id))
    );
  } catch (error) {
    console.warn("Unable to save cart:", error);
  }
}

function loadCart() {
  cart = [];

  try {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(stored)) return;

    const uniqueIds = new Set();

    stored.forEach(item => {
      const id = typeof item === "string" ? item : item?.id;
      const seat = seats.find(s => s.id === id);

      if (seat && seat.available && !uniqueIds.has(id)) {
        cart.push(seat);
        uniqueIds.add(id);
      }
    });
  } catch (error) {
    console.warn("Unable to restore cart:", error);
    cart = [];
  }
}

function renderSeats() {
  const seatMap = document.getElementById("seat-map");
  seatMap.innerHTML = "";

  venue.sections.forEach(section => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "seating-section";

    const title = document.createElement("h3");
    title.textContent =
      `${section.name} SECTION — ${section.price} AZN`;

    sectionDiv.appendChild(title);

    for (let row = 1; row <= section.rows; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      const leftLabel = document.createElement("span");
      leftLabel.className = "row-label";
      leftLabel.textContent = row;
      rowDiv.appendChild(leftLabel);

      const rowSeats = seats.filter(seat =>
        seat.section === section.name && seat.row === row
      );

      rowSeats.forEach(seat => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "seat";
        button.textContent = seat.number;
        button.dataset.id = seat.id;

        button.setAttribute(
          "aria-label",
          `${seat.section}, Row ${seat.row}, Seat ${seat.number}, ${seat.price} AZN`
        );

        if (!seat.available) {
          button.classList.add("unavailable");
          button.disabled = true;
          button.title = "Unavailable seat";
        } else {
          button.addEventListener("click", () => {
            inspectSeat(seat.id);
          });
        }

        rowDiv.appendChild(button);
      });

      const rightLabel = document.createElement("span");
      rightLabel.className = "row-label";
      rightLabel.textContent = row;
      rowDiv.appendChild(rightLabel);

      sectionDiv.appendChild(rowDiv);
    }

    seatMap.appendChild(sectionDiv);
  });

  updateSeatColors();
}

function inspectSeat(seatId) {
  const seat = seats.find(s => s.id === seatId);

  if (!seat || !seat.available) return;

  selectedSeat = seat;

  const info = document.getElementById("seat-info");
  info.innerHTML = "";

  const heading = document.createElement("strong");
  heading.textContent = `${seat.section} Section`;

  const description = document.createElement("p");
  description.textContent =
    `Row ${seat.row} · Seat ${seat.number}`;

  const price = document.createElement("p");
  price.textContent = `Ticket Price: ${seat.price} AZN`;

  info.append(heading, description, price);

  const alreadyInCart = cart.some(item => item.id === seat.id);

  const addButton = document.getElementById("add-to-cart");
  addButton.disabled = alreadyInCart;
  addButton.textContent = alreadyInCart
    ? "ALREADY IN CART"
    : "ADD TO CART";

  updateSeatColors();
}

function updateSeatColors() {
  document.querySelectorAll(".seat").forEach(button => {
    const seatId = button.dataset.id;

    button.classList.remove("selected", "in-cart");

    if (cart.some(item => item.id === seatId)) {
      button.classList.add("in-cart");
    } else if (selectedSeat?.id === seatId) {
      button.classList.add("selected");
    }
  });
}

function addToCart() {
  if (!selectedSeat || !selectedSeat.available) return;

  if (cart.some(item => item.id === selectedSeat.id)) {
    alert("This seat is already in your cart.");
    return;
  }

  cart.push(selectedSeat);

  saveCart();
  renderCart();
  updateSeatColors();

  const button = document.getElementById("add-to-cart");
  button.disabled = true;
  button.textContent = "ALREADY IN CART";
}

function removeFromCart(seatId) {
  cart = cart.filter(seat => seat.id !== seatId);

  saveCart();
  renderCart();
  updateSeatColors();

  if (selectedSeat?.id === seatId) {
    const button = document.getElementById("add-to-cart");
    button.disabled = false;
    button.textContent = "ADD TO CART";
  }
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  const countElement = document.getElementById("cart-count");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty.";
    cartItems.appendChild(empty);
  }

  let total = 0;

  cart.forEach(seat => {
    total += seat.price;

    const item = document.createElement("div");
    item.className = "cart-item";

    const description = document.createElement("div");

    const seatName = document.createElement("span");
    seatName.textContent =
      `${seat.section} · Row ${seat.row} · Seat ${seat.number}`;

    const price = document.createElement("strong");
    price.textContent = `${seat.price} AZN`;

    description.append(seatName, price);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-btn";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
      removeFromCart(seat.id);
    });

    item.append(description, removeButton);
    cartItems.appendChild(item);
  });

  totalElement.textContent = total;
  countElement.textContent =
    `${cart.length} ticket${cart.length === 1 ? "" : "s"}`;
}

let zoom = 1;
let panX = 0;
let panY = 0;

const mapContent = document.getElementById("map-content");
const mapViewport = document.getElementById("map-viewport");

function updateMapTransform() {
  mapContent.style.transform =
    `translate(${panX}px, ${panY}px) scale(${zoom})`;
}

function changeZoom(amount) {
  zoom = Math.max(0.5, Math.min(2, zoom + amount));
  zoom = Math.round(zoom * 100) / 100;
  updateMapTransform();
}

function moveMap(x, y) {
  panX += x;
  panY += y;
  updateMapTransform();
}

function resetMap() {
  zoom = 1;
  panX = 0;
  panY = 0;
  updateMapTransform();
}

document.getElementById("zoom-in")
  .addEventListener("click", () => changeZoom(0.1));

document.getElementById("zoom-out")
  .addEventListener("click", () => changeZoom(-0.1));

document.getElementById("move-up")
  .addEventListener("click", () => moveMap(0, 40));

document.getElementById("move-down")
  .addEventListener("click", () => moveMap(0, -40));

document.getElementById("move-left")
  .addEventListener("click", () => moveMap(40, 0));

document.getElementById("move-right")
  .addEventListener("click", () => moveMap(-40, 0));

document.getElementById("reset-view")
  .addEventListener("click", resetMap);

mapViewport.addEventListener("wheel", event => {
  event.preventDefault();

  const amount = event.deltaY < 0 ? 0.1 : -0.1;
  changeZoom(amount);
}, { passive: false });

let isDragging = false;
let hasDragged = false;
let dragStartX = 0;
let dragStartY = 0;
let pointerStartX = 0;
let pointerStartY = 0;

mapViewport.addEventListener("pointerdown", event => {
  if (event.button !== 0 || !event.isPrimary) return;

  isDragging = true;
  hasDragged = false;

  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
});

mapViewport.addEventListener("pointermove", event => {
  if (!isDragging) return;

  const dx = event.clientX - dragStartX;
  const dy = event.clientY - dragStartY;

  const totalMovement = Math.hypot(
    event.clientX - pointerStartX,
    event.clientY - pointerStartY
  );

  if (totalMovement > 8) {
    hasDragged = true;
    mapViewport.classList.add("dragging");
  }

  if (hasDragged) {
    moveMap(dx, dy);
  }

  dragStartX = event.clientX;
  dragStartY = event.clientY;
});

function stopDragging() {
  isDragging = false;
  mapViewport.classList.remove("dragging");
}

mapViewport.addEventListener("pointerup", stopDragging);
mapViewport.addEventListener("pointercancel", () => {
  stopDragging();
  hasDragged = false;
});

window.addEventListener("pointerup", stopDragging);

mapViewport.addEventListener("click", event => {
  if (hasDragged) {
    event.preventDefault();
    event.stopPropagation();
    hasDragged = false;
  }
}, true);

generateSeatData();
loadCart();
renderSeats();
renderCart();
updateMapTransform();

document.getElementById("add-to-cart")
  .addEventListener("click", addToCart);

console.log(
  `${venue.name}: ${seats.length} seats generated.`
);
