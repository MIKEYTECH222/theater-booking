const SUPABASE_URL = "https://vxcqzmyhsrwfnxztbxdl.supabase.co";
const SUPABASE_KEY = "sb_publishable_GK-t6OfY2KjSlOcmneNwfQ_fKTWAn53";

const seats = document.querySelectorAll(".seat");
const selectedSeatText = document.getElementById("selectedSeat");
const bookButton = document.getElementById("bookButton");

const BOOKINGS_URL = `${SUPABASE_URL}/rest/v1/bookings`;

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
};

let selectedSeats = [];

// تحميل المقاعد المحجوزة
async function loadReservedSeats() {
    try {
        const response = await fetch(
            `${BOOKINGS_URL}?select=seat`,
            {
                method: "GET",
                headers
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const bookings = await response.json();

        bookings.forEach((booking) => {
            const seat = document.querySelector(
                `.seat[data-seat="${booking.seat}"]`
            );

            if (seat) {
                seat.classList.remove("selected");
                seat.classList.add("reserved");
                seat.disabled = true;
            }
        });

    } catch (error) {
        console.error("Load error:", error);
    }
}

// تحديث النص
function updateSelectedSeatsText() {
    if (selectedSeats.length === 0) {
        selectedSeatText.textContent = "لم يتم اختيار أي مقعد";
    } else {
        selectedSeatText.textContent =
            `المقاعد المختارة: ${selectedSeats.join(" - ")}`;
    }
}

// اختيار وإلغاء اختيار المقاعد
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

        updateSelectedSeatsText();
    });

});

// تأكيد الحجز
bookButton.addEventListener("click", async function () {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (selectedSeats.length === 0) {
        alert("اختر مقعدًا واحدًا على الأقل.");
        return;
    }

    if (!name) {
        alert("اكتب الاسم.");
        return;
    }

    if (!phone) {
        alert("اكتب رقم الهاتف.");
        return;
    }

    bookButton.disabled = true;
    bookButton.textContent = "جاري الحجز...";

    try {

        const bookings = selectedSeats.map(seat => ({
            seat: seat,
            name: name,
            phone: phone
        }));

        const response = await fetch(BOOKINGS_URL, {
            method: "POST",
            headers: {
                ...headers,
                "Prefer": "return=representation"
            },
            body: JSON.stringify(bookings)
        });

        const result = await response.json();

        if (!response.ok) {

            console.error(result);

            if (response.status === 409) {
                alert("واحد من المقاعد التي اخترتها اتحجز بالفعل.");

                selectedSeats = [];

                document.querySelectorAll(".seat.selected")
                    .forEach(seat => seat.classList.remove("selected"));

                await loadReservedSeats();

                updateSelectedSeatsText();

                return;
            }

            throw new Error("Booking failed");
        }

        const bookedSeats = [...selectedSeats];

        bookedSeats.forEach(seatNumber => {

            const seat = document.querySelector(
                `.seat[data-seat="${seatNumber}"]`
            );

            if (seat) {
                seat.classList.remove("selected");
                seat.classList.add("reserved");
                seat.disabled = true;
            }
        });

        selectedSeats = [];

        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";

        updateSelectedSeatsText();

        alert(
            `تم الحجز بنجاح ✅\n\n` +
            `المقاعد: ${bookedSeats.join(" - ")}\n` +
            `الاسم: ${name}\n` +
            `رقم الهاتف: ${phone}`
        );

    } catch (error) {

        console.error(error);

        alert("حصل خطأ أثناء الحجز.");

    } finally {

        bookButton.disabled = false;
        bookButton.textContent = "تأكيد الحجز";
    }
});

loadReservedSeats();
