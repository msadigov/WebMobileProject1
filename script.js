
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

renderSeats();
