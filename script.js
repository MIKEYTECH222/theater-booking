// ===============================
// Supabase
// ===============================

const SUPABASE_URL =
    "https://vxcqzmyhsrwfnxztbxdl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_GK-t6OfY2KjSlOcmneNwfQ_fKTWAn53";

const BOOKINGS_URL =
    `${SUPABASE_URL}/rest/v1/bookings`;

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
};


// ===============================
// عناصر الصفحة
// ===============================

const seatsContainer =
    document.getElementById("seats");

const selectedSeatText =
    document.getElementById("selectedSeat");

const bookButton =
    document.getElementById("bookButton");


// ===============================
// المقاعد المختارة
// ===============================

let selectedSeats = [];


// ===============================
// إنشاء 88 كرسي
// 11 صف
// 4 شمال + ممر + 4 يمين
// ===============================

const rows = "ABCDEFGHIJK".split("");

rows.forEach((letter) => {

    const row = document.createElement("div");

    row.className = "row";


    // -------------------------------
    // 4 كراسي الناحية الأولى
    // -------------------------------

    for (let number = 1; number <= 4; number++) {

        const seat =
            document.createElement("button");

        seat.className = "seat";

        seat.dataset.seat =
            `${letter}${number}`;

        seat.textContent =
            `${letter}${number}`;

        row.appendChild(seat);
    }


    // -------------------------------
    // الممر
    // -------------------------------

    const aisle =
        document.createElement("div");

    aisle.className = "aisle";

    row.appendChild(aisle);


    // -------------------------------
    // 4 كراسي الناحية الثانية
    // -------------------------------

    for (let number = 5; number <= 8; number++) {

        const seat =
            document.createElement("button");

        seat.className = "seat";

        seat.dataset.seat =
            `${letter}${number}`;

        seat.textContent =
            `${letter}${number}`;

        row.appendChild(seat);
    }


    // إضافة الصف
    seatsContainer.appendChild(row);
});


// ===============================
// نحصل على كل المقاعد
// ===============================

const seats =
    document.querySelectorAll(".seat");


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
// تحميل المقاعد المحجوزة
// ===============================

async function loadReservedSeats() {

    try {

        const response = await fetch(
            `${BOOKINGS_URL}?select=seat`,
            {
                method: "GET",
                headers: headers
            }
        );


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }


        const bookings =
            await response.json();


        bookings.forEach((booking) => {

            const seat =
                document.querySelector(
                    `.seat[data-seat="${booking.seat}"]`
                );


            if (seat) {

                seat.classList.remove("selected");

                seat.classList.add("reserved");

                seat.disabled = true;
            }
        });


    } catch (error) {

        console.error(
            "Load reserved seats error:",
            error
        );
    }
}


// ===============================
// اختيار المقاعد
// ===============================

seats.forEach((seat) => {

    seat.addEventListener("click", () => {


        // لو المقعد محجوز
        if (
            seat.classList.contains("reserved")
        ) {
            return;
        }


        const seatNumber =
            seat.dataset.seat;


        // ---------------------------
        // إلغاء اختيار المقعد
        // ---------------------------

        if (
            selectedSeats.includes(seatNumber)
        ) {

            selectedSeats =
                selectedSeats.filter(
                    (item) =>
                        item !== seatNumber
                );


            seat.classList.remove(
                "selected"
            );
        }


        // ---------------------------
        // اختيار المقعد
        // ---------------------------

        else {

            selectedSeats.push(
                seatNumber
            );


            seat.classList.add(
                "selected"
            );
        }


        updateSelectedSeatsText();
    });

});


// ===============================
// تأكيد الحجز
// ===============================

bookButton.addEventListener(
    "click",
    async () => {


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        // ---------------------------
        // التحقق من المقاعد
        // ---------------------------

        if (selectedSeats.length === 0) {

            alert(
                "من فضلك اختر مقعدًا واحدًا على الأقل."
            );

            return;
        }


        // ---------------------------
        // التحقق من الاسم
        // ---------------------------

        if (!name) {

            alert(
                "من فضلك اكتب اسمك."
            );

            return;
        }


        // ---------------------------
        // التحقق من الهاتف
        // ---------------------------

        if (!phone) {

            alert(
                "من فضلك اكتب رقم الهاتف."
            );

            return;
        }


        // ---------------------------
        // تعطيل الزر
        // ---------------------------

        bookButton.disabled = true;

        bookButton.textContent =
            "جاري الحجز...";


        try {


            // -------------------------
            // تجهيز الحجوزات
            // -------------------------

            const bookings =
                selectedSeats.map(
                    (seat) => {

                        return {
                            seat: seat,
                            name: name,
                            phone: phone
                        };

                    }
                );


            // -------------------------
            // إرسال البيانات
            // -------------------------

            const response =
                await fetch(
                    BOOKINGS_URL,
                    {
                        method: "POST",

                        headers: {
                            ...headers,

                            "Prefer":
                                "return=representation"
                        },

                        body:
                            JSON.stringify(
                                bookings
                            )
                    }
                );


            const result =
                await response.json();


            // -------------------------
            // لو حصل خطأ
            // -------------------------

            if (!response.ok) {

                console.error(result);


                // نفس الكرسي اتحجز
                if (
                    response.status === 409 ||
                    JSON.stringify(result)
                        .toLowerCase()
                        .includes("duplicate")
                ) {

                    alert(
                        "واحد أو أكثر من المقاعد التي اخترتها اتحجز بالفعل.\n" +
                        "تم تحديث المقاعد."
                    );


                    // تحديث المقاعد
                    await loadReservedSeats();


                    // مسح الاختيارات
                    selectedSeats = [];


                    document
                        .querySelectorAll(
                            ".seat.selected"
                        )
                        .forEach(
                            (seat) => {

                                seat.classList.remove(
                                    "selected"
                                );
                            }
                        );


                    updateSelectedSeatsText();

                    return;
                }


                throw new Error(
                    "Booking failed"
                );
            }


            // -------------------------
            // حفظ المقاعد المحجوزة
            // -------------------------

            const bookedSeats =
                [...selectedSeats];


            bookedSeats.forEach(
                (seatNumber) => {

                    const seat =
                        document.querySelector(
                            `.seat[data-seat="${seatNumber}"]`
                        );


                    if (seat) {

                        seat.classList.remove(
                            "selected"
                        );

                        seat.classList.add(
                            "reserved"
                        );

                        seat.disabled = true;
                    }
                }
            );


            // -------------------------
            // تفريغ الاختيارات
            // -------------------------

            selectedSeats = [];


            // -------------------------
            // تفريغ البيانات
            // -------------------------

            document
                .getElementById("name")
                .value = "";


            document
                .getElementById("phone")
                .value = "";


            // -------------------------
            // تحديث النص
            // -------------------------

            selectedSeatText.textContent =
                "تم الحجز بنجاح ✅";


            // -------------------------
            // رسالة نجاح
            // -------------------------

            alert(
                `تم الحجز بنجاح ✅\n\n` +
                `المقاعد: ${bookedSeats.join(" - ")}\n` +
                `الاسم: ${name}\n` +
                `رقم الهاتف: ${phone}`
            );


        } catch (error) {

            console.error(
                "Booking error:",
                error
            );


            alert(
                "حصل خطأ أثناء الحجز."
            );


        } finally {

            bookButton.disabled =
                false;

            bookButton.textContent =
                "تأكيد الحجز";
        }

    }
);


// ===============================
// تشغيل الموقع
// ===============================

loadReservedSeats();
