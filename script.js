
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

let seats = [];
let selectedSeat = null;
let cart = [];

function generateSeatData() {
  venue.sections.forEach(section => {
    for (let row = 1; row <= section.rows; row++) {
      for (let number = 1; number <= section.seatsPerRow; number++) {
        const seat = {
          id: `${section.name}-${row}-${number}`,
          section: section.name,
          row: row,
          number: number,
          price: section.price,
          available: (row + number) % 9 !== 0
        };

        seats.push(seat);
      }
    }
  });
}

generateSeatData();

console.log("Generated seats:", seats);

function renderSeats() {
  const seatMap = document.getElementById("seat-map");
  seatMap.innerHTML = "";

  venue.sections.forEach(section => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "seating-section";

    const title = document.createElement("h3");
    title.textContent = `${section.name} - ${section.price} AZN`;
    sectionDiv.appendChild(title);

    for (let row = 1; row <= section.rows; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "seat-row";

      seats.filter(seat =>
        seat.section === section.name && seat.row === row
      ).forEach(seat => {
        const button = document.createElement("button");
        button.className = "seat";
        button.textContent = seat.number;
        button.dataset.id = seat.id;
        button.addEventListener("click", () => inspectSeat(seat.id));

        if (!seat.available) {
          button.classList.add("unavailable");
          button.disabled = true;
        }

        rowDiv.appendChild(button);
      });

      sectionDiv.appendChild(rowDiv);
    }

    seatMap.appendChild(sectionDiv);
  });
}

function inspectSeat(seatId) {
  const seat = seats.find(s => s.id === seatId);

  if (!seat || !seat.available) return;

  selectedSeat = seat;

  const info = document.getElementById("seat-info");
  info.textContent =
    `Section: ${seat.section} | Row: ${seat.row} | ` +
    `Seat: ${seat.number} | Price: ${seat.price} AZN`;

  const addButton = document.getElementById("add-to-cart");
  addButton.disabled = cart.some(item => item.id === seat.id);

  updateSeatColors();
}

function updateSeatColors() {
  document.querySelectorAll(".seat").forEach(button => {
    const seatId = button.dataset.id;
    button.classList.remove("selected", "in-cart");

    if (cart.some(item => item.id === seatId)) {
      button.classList.add("in-cart");
    } else if (selectedSeat && selectedSeat.id === seatId) {
      button.classList.add("selected");
    }
  });
}

function addToCart() {
  if (!selectedSeat || !selectedSeat.available) return;

  const alreadyAdded = cart.some(
    item => item.id === selectedSeat.id
  );

  if (alreadyAdded) {
    alert("This seat is already in your cart.");
    return;
  }

  cart.push(selectedSeat);

  renderCart();
  updateSeatColors();

  document.getElementById("add-to-cart").disabled = true;
}


function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.textContent = "Your cart is empty.";
  }

  let total = 0;

  cart.forEach(seat => {
    total += seat.price;

    const item = document.createElement("div");
    item.className = "cart-item";

    const description = document.createElement("span");
    description.textContent =
      `${seat.section} - Row ${seat.row}, ` +
      `Seat ${seat.number}: ${seat.price} AZN`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";

    removeButton.addEventListener("click", () => {
      removeFromCart(seat.id);
    });

    item.appendChild(description);
    item.appendChild(removeButton);
    cartItems.appendChild(item);
  });

  totalElement.textContent = total;
}

function removeFromCart(seatId) {
  cart = cart.filter(seat => seat.id !== seatId);

  renderCart();
  updateSeatColors();

  if (selectedSeat && selectedSeat.id === seatId) {
    document.getElementById("add-to-cart").disabled = false;
  }
}


document.getElementById("add-to-cart")
  .addEventListener("click", addToCart);

renderSeats();
