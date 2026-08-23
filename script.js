```javascript
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

// المقاعد التي اختارها المستخدم
let selectedSeats = [];


// ===============================
// تحميل المقاعد المحجوزة
// ===============================
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
            throw new Error("فشل تحميل الحجوزات");
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
        console.error(error);
        alert("حصل خطأ أثناء تحميل المقاعد.");
    }
}


// ===============================
// اختيار أكثر من مقعد
// ===============================
seats.forEach((seat) => {

    seat.addEventListener("click", () => {

        // لو محجوز بالفعل
        if (seat.classList.contains("reserved")) {
            return;
        }

        const seatNumber = seat.dataset.seat;

        // لو المقعد مختار بالفعل
        if (selectedSeats.includes(seatNumber)) {

            // نشيله من الاختيارات
            selectedSeats = selectedSeats.filter(
                (s) => s !== seatNumber
            );

            seat.classList.remove("selected");

        } else {

            // نضيفه للاختيارات
            selectedSeats.push(seatNumber);

            seat.classList.add("selected");
        }

        updateSelectedSeatsText();
    });

});


// ===============================
// تحديث النص
// ===============================
function updateSelectedSeatsText() {

    if (selectedSeats.length === 0) {

        selectedSeatText.textContent =
            "لم يتم اختيار أي مقعد";

        return;
    }

    selectedSeatText.textContent =
        `المقاعد المختارة: ${selectedSeats.join(" - ")}`;
}


// ===============================
// تأكيد الحجز
// ===============================
bookButton.addEventListener("click", async () => {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // التأكد من وجود مقاعد
    if (selectedSeats.length === 0) {
        alert("من فضلك اختر مقعدًا واحدًا على الأقل.");
        return;
    }

    // التأكد من الاسم
    if (!name) {
        alert("من فضلك اكتب اسمك.");
        return;
    }

    // التأكد من الهاتف
    if (!phone) {
        alert("من فضلك اكتب رقم الهاتف.");
        return;
    }

    bookButton.disabled = true;
    bookButton.textContent = "جاري الحجز...";

    try {

        // إنشاء قائمة الحجوزات
        const bookings = selectedSeats.map((seat) => ({
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

        // حصل تعارض لأن مقعدًا محجوز بالفعل
        if (!response.ok) {

            if (
                response.status === 409 ||
                JSON.stringify(result).toLowerCase().includes("duplicate")
            ) {

                alert(
                    "واحد أو أكثر من المقاعد التي اخترتها تم حجزه بالفعل.\n" +
                    "تم تحديث المقاعد. اختر المقاعد المتاحة وحاول مرة أخرى."
                );

                // إعادة تحميل الحالة
                await loadReservedSeats();

                // إزالة الاختيارات
                selectedSeats = [];

                seats.forEach((seat) => {
                    seat.classList.remove("selected");
                });

                updateSelectedSeatsText();

                return;
            }

            console.error(result);
            throw new Error("فشل الحجز");
        }


        // ===============================
        // تحويل المقاعد إلى محجوز
        // ===============================
        selectedSeats.forEach((seatNumber) => {

            const seat = document.querySelector(
                `.seat[data-seat="${seatNumber}"]`
            );

            if (seat) {
                seat.classList.remove("selected");
                seat.classList.add("reserved");
                seat.disabled = true;
            }

        });


        const bookedSeats = [...selectedSeats];


        // تفريغ الاختيارات
        selectedSeats = [];


        // تحديث الشاشة
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";

        selectedSeatText.textContent =
            "تم الحجز بنجاح ✅";


        alert(
            `تم الحجز بنجاح ✅\n\n` +
            `المقاعد: ${bookedSeats.join(" - ")}\n` +
            `الاسم: ${name}\n` +
            `رقم الهاتف: ${phone}`
        );


    } catch (error) {

        console.error(error);

        alert(
            "حصل خطأ أثناء الحجز.\n" +
            "راجع إعدادات Supabase."
        );

    } finally {

        bookButton.disabled = false;
        bookButton.textContent = "تأكيد الحجز";
    }
});


// تشغيل تحميل الحجوزات
loadReservedSeats();
```
