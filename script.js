const seatsContainer = document.getElementById("seats");

const TOTAL_ROWS = 11;
const SEATS_PER_SIDE = 4;

function createSeats() {

    seatsContainer.innerHTML = "";

    let number = 1;

    for (let row = 0; row < TOTAL_ROWS; row++) {

        const rowElement = document.createElement("div");
        rowElement.className = "seat-row";

        // أول 4 كراسي
        for (let i = 0; i < SEATS_PER_SIDE; i++) {

            const seat = document.createElement("div");

            seat.className = "seat";

            seat.textContent = `A${number}`;

            seat.dataset.seat = `A${number}`;

            rowElement.appendChild(seat);

            number++;
        }

        // الممر
        const aisle = document.createElement("div");
        aisle.className = "aisle";

        rowElement.appendChild(aisle);

        // آخر 4 كراسي
        for (let i = 0; i < SEATS_PER_SIDE; i++) {

            const seat = document.createElement("div");

            seat.className = "seat";

            seat.textContent = `A${number}`;

            seat.dataset.seat = `A${number}`;

            rowElement.appendChild(seat);

            number++;
        }

        seatsContainer.appendChild(rowElement);
    }
}

createSeats();
