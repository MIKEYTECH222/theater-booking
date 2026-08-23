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

const invitationSection =
    document.getElementById("invitationSection");

const invitationCanvas =
    document.getElementById("invitationCanvas");

const downloadInvitation =
    document.getElementById("downloadInvitation");


// ===============================
// المقاعد المختارة
// ===============================

let selectedSeats = [];


// ===============================
// إنشاء 88 كرسي
// ===============================

const rows = "ABCDEFGHIJK".split("");

rows.forEach((letter) => {

    const row = document.createElement("div");

    row.className = "row";


    // 4 كراسي
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


    // الممر
    const aisle =
        document.createElement("div");

    aisle.className = "aisle";

    row.appendChild(aisle);


    // 4 كراسي
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


    seatsContainer.appendChild(row);
});


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
            "Load seats error:",
            error
        );
    }
}


// ===============================
// اختيار المقاعد
// ===============================

seats.forEach((seat) => {

    seat.addEventListener("click", () => {

        if (
            seat.classList.contains("reserved")
        ) {
            return;
        }


        const seatNumber =
            seat.dataset.seat;


        if (
            selectedSeats.includes(seatNumber)
        ) {

            selectedSeats =
                selectedSeats.filter(
                    item =>
                        item !== seatNumber
                );

            seat.classList.remove(
                "selected"
            );

        } else {

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
// إنشاء الدعوة
// ===============================

function createInvitation(
    name,
    bookedSeats
) {

    const canvas =
        invitationCanvas;

    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width;

    const height =
        canvas.height;


    // تنظيف
    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // ---------------------------
    // الخلفية
    // ---------------------------

    const background =
        ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

    background.addColorStop(
        0,
        "#eef8ff"
    );

    background.addColorStop(
        0.5,
        "#ffffff"
    );

    background.addColorStop(
        1,
        "#fff0fb"
    );

    ctx.fillStyle =
        background;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // ---------------------------
    // دوائر ديكورية
    // ---------------------------

    ctx.globalAlpha = 0.45;

    ctx.fillStyle =
        "#bfdbfe";

    ctx.beginPath();

    ctx.arc(
        130,
        180,
        110,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#f5d0fe";

    ctx.beginPath();

    ctx.arc(
        930,
        350,
        150,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#bbf7d0";

    ctx.beginPath();

    ctx.arc(
        920,
        1600,
        140,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;


    // ---------------------------
    // عنوان صغير
    // ---------------------------

    ctx.fillStyle =
        "#6366f1";

    ctx.font =
        "bold 48px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "✨ أسرة السمائيين",
        width / 2,
        200
    );


    // ---------------------------
    // العنوان الرئيسي
    // ---------------------------

    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 95px Arial";

    ctx.fillText(
        "دعــوة",
        width / 2,
        410
    );


    // ---------------------------
    // النص
    // ---------------------------

    ctx.fillStyle =
        "#6b7280";

    ctx.font =
        "42px Arial";

    ctx.fillText(
        "حفلة نهاية الأنشطة",
        width / 2,
        510
    );


    // ---------------------------
    // الترحيب
    // ---------------------------

    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 48px Arial";

    ctx.fillText(
        "أهلاً بك",
        width / 2,
        700
    );


    // ---------------------------
    // اسم الشخص
    // ---------------------------

    ctx.fillStyle =
        "#6366f1";

    ctx.font =
        "bold 68px Arial";

    ctx.fillText(
        name,
        width / 2,
        820
    );


    // ---------------------------
    // بطاقة المقاعد
    // ---------------------------

    const cardX =
        100;

    const cardY =
        950;

    const cardWidth =
        width - 200;

    const cardHeight =
        300;


    ctx.fillStyle =
        "rgba(255,255,255,0.88)";


    ctx.beginPath();

    ctx.roundRect(
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        35
    );

    ctx.fill();


    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth = 3;

    ctx.stroke();


    // ---------------------------
    // عنوان المقاعد
    // ---------------------------

    ctx.fillStyle =
        "#6b7280";

    ctx.font =
        "38px Arial";

    ctx.fillText(
        "المقاعد المحجوزة",
        width / 2,
        1030
    );


    // ---------------------------
    // المقاعد
    // ---------------------------

    ctx.fillStyle =
        "#22c55e";

    ctx.font =
        "bold 55px Arial";

    ctx.fillText(
        bookedSeats.join("  •  "),
        width / 2,
        1140
    );


    // ---------------------------
    // عبارة ختامية
    // ---------------------------

    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 43px Arial";

    ctx.fillText(
        "مستنيينكم ❤️",
        width / 2,
        1450
    );


    ctx.fillStyle =
        "#6b7280";

    ctx.font =
        "35px Arial";

    ctx.fillText(
        "نتمنى لكم وقتًا رائعًا معنا ✨",
        width / 2,
        1525
    );


    // ---------------------------
    // أسفل الدعوة
    // ---------------------------

    ctx.fillStyle =
        "#6366f1";

    ctx.font =
        "bold 35px Arial";

    ctx.fillText(
        "أسرة السمائيين",
        width / 2,
        1750
    );
}


// ===============================
// زر تحميل الدعوة
// ===============================

downloadInvitation.addEventListener(
    "click",
    () => {

        const link =
            document.createElement("a");

        link.download =
            "دعوة-أسرة-السمائيين.png";

        link.href =
            invitationCanvas.toDataURL(
                "image/png"
            );

        link.click();
    }
);


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


        if (
            selectedSeats.length === 0
        ) {

            alert(
                "من فضلك اختر مقعدًا واحدًا على الأقل."
            );

            return;
        }


        if (!name) {

            alert(
                "من فضلك اكتب اسمك."
            );

            return;
        }


        if (!phone) {

            alert(
                "من فضلك اكتب رقم الهاتف."
            );

            return;
        }


        bookButton.disabled =
            true;

        bookButton.textContent =
            "جاري الحجز...";


        try {

            const bookings =
                selectedSeats.map(
                    seat => ({
                        seat: seat,
                        name: name,
                        phone: phone
                    })
                );


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


            if (!response.ok) {

                console.error(result);


                if (
                    response.status === 409 ||
                    JSON.stringify(result)
                        .toLowerCase()
                        .includes(
                            "duplicate"
                        )
                ) {

                    alert(
                        "واحد أو أكثر من المقاعد اتحجز بالفعل."
                    );


                    await loadReservedSeats();


                    selectedSeats = [];


                    document
                        .querySelectorAll(
                            ".seat.selected"
                        )
                        .forEach(
                            seat =>
                                seat.classList.remove(
                                    "selected"
                                )
                        );


                    updateSelectedSeatsText();

                    return;
                }


                throw new Error(
                    "Booking failed"
                );
            }


            const bookedSeats =
                [...selectedSeats];


            // تحويل المقاعد إلى محجوز
            bookedSeats.forEach(
                seatNumber => {

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


            // إنشاء الدعوة
            createInvitation(
                name,
                bookedSeats
            );


            // إظهار الدعوة
            invitationSection.style.display =
                "block";


            invitationSection.scrollIntoView({
                behavior: "smooth"
            });


            // تنظيف
            selectedSeats = [];


            document
                .getElementById("name")
                .value = "";


            document
                .getElementById("phone")
                .value = "";


            updateSelectedSeatsText();


            alert(
                "تم الحجز بنجاح 🎉\n\n" +
                "دعوتك جاهزة للتحميل!"
            );


        } catch (error) {

            console.error(error);

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
