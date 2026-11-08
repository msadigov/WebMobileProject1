
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
