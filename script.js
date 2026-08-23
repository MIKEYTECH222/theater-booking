const seats = document.querySelectorAll(".seat");

let selectedSeats = [];

seats.forEach((seat) => {
    seat.addEventListener("click", function () {

        if (seat.classList.contains("reserved")) {
            return;
        }

        const seatNumber = seat.dataset.seat;

        if (selectedSeats.includes(seatNumber)) {

            selectedSeats = selectedSeats.filter(
                s => s !== seatNumber
            );

            seat.classList.remove("selected");

        } else {

            selectedSeats.push(seatNumber);

            seat.classList.add("selected");
        }

        console.log("Selected:", selectedSeats);
    });
});
