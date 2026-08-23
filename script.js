```javascript
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


// =================================
// Elements
// =================================

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

let selectedSeats = [];


// =================================
// Create 99 seats
// 9 rows
// 5 seats + aisle + 6 seats
// =================================

const rows =
    "ABCDEFGHI".split("");

rows.forEach(
    (letter, rowIndex) => {

        /*
         * أول حاجة:
         * نعمل صف خاص بالآباء الكهنة
         * ويظهر مباشرة فوق A1 إلى A11
         */

        if (rowIndex === 0) {

            const priestsLabel =
                document.createElement("div");

            priestsLabel.className =
                "priests-label";

            priestsLabel.textContent =
                "🔒 خاص بالآباء الكهنة";

            seatsContainer.appendChild(
                priestsLabel
            );
        }


        // إنشاء صف المقاعد
        const row =
            document.createElement("div");

        row.className =
            "row";


        // =================================
        // الناحية الأولى: 5 كراسي
        // =================================

        for (
            let number = 1;
            number <= 5;
            number++
        ) {

            const seat =
                document.createElement("button");

            seat.className =
                "seat";

            seat.dataset.seat =
                `${letter}${number}`;

            seat.textContent =
                `${letter}${number}`;


            // الصف الأول مقفول
            if (rowIndex === 0) {

                seat.classList.add(
                    "locked"
                );

                seat.disabled =
                    true;

                seat.title =
                    "خاص بالآباء الكهنة";
            }


            row.appendChild(seat);
        }


        // =================================
        // الممر
        // =================================

        const aisle =
            document.createElement("div");

        aisle.className =
            "aisle";

        row.appendChild(aisle);


        // =================================
        // الناحية الثانية: 6 كراسي
        // =================================

        for (
            let number = 6;
            number <= 11;
            number++
        ) {

            const seat =
                document.createElement("button");

            seat.className =
                "seat";

            seat.dataset.seat =
                `${letter}${number}`;

            seat.textContent =
                `${letter}${number}`;


            // الصف الأول مقفول
            if (rowIndex === 0) {

                seat.classList.add(
                    "locked"
                );

                seat.disabled =
                    true;

                seat.title =
                    "خاص بالآباء الكهنة";
            }


            row.appendChild(seat);
        }


        // إضافة الصف كاملًا
        seatsContainer.appendChild(row);
    }
);


// كل المقاعد
const seats =
    document.querySelectorAll(".seat");


// =================================
// Selected seats text
// =================================

function updateSelectedSeatsText() {

    if (
        selectedSeats.length === 0
    ) {

        selectedSeatText.textContent =
            "لم يتم اختيار أي مقعد";

        return;
    }

    selectedSeatText.textContent =
        `المقاعد المختارة: ${selectedSeats.join(" - ")}`;
}


// =================================
// Load reserved seats
// =================================

async function loadReservedSeats() {

    try {

        const response =
            await fetch(
                `${BOOKINGS_URL}?select=seat`,
                {
                    method: "GET",
                    headers: headers
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const bookings =
            await response.json();


        bookings.forEach(
            booking => {

                const seat =
                    document.querySelector(
                        `.seat[data-seat="${booking.seat}"]`
                    );


                if (!seat) {
                    return;
                }


                if (
                    seat.classList.contains(
                        "locked"
                    )
                ) {
                    return;
                }


                seat.classList.remove(
                    "selected"
                );

                seat.classList.add(
                    "reserved"
                );

                seat.disabled =
                    true;
            }
        );


    } catch (error) {

        console.error(
            "Loading seats failed:",
            error
        );
    }
}


// =================================
// Seat selection
// =================================

seats.forEach(
    seat => {

        seat.addEventListener(
            "click",
            () => {

                // مقفول
                if (
                    seat.classList.contains(
                        "locked"
                    )
                ) {
                    return;
                }


                // محجوز
                if (
                    seat.classList.contains(
                        "reserved"
                    )
                ) {
                    return;
                }


                const seatNumber =
                    seat.dataset.seat;


                // إلغاء الاختيار
                if (
                    selectedSeats.includes(
                        seatNumber
                    )
                ) {

                    selectedSeats =
                        selectedSeats.filter(
                            item =>
                                item !==
                                seatNumber
                        );


                    seat.classList.remove(
                        "selected"
                    );

                } else {

                    // اختيار كرسي
                    selectedSeats.push(
                        seatNumber
                    );

                    seat.classList.add(
                        "selected"
                    );
                }


                updateSelectedSeatsText();
            }
        );
    }
);


// =================================
// Create Invitation
// =================================

function createInvitation(
    name,
    bookedSeats
) {

    const ctx =
        invitationCanvas.getContext(
            "2d"
        );

    const width =
        invitationCanvas.width;

    const height =
        invitationCanvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // الخلفية
    const background =
        ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

    background.addColorStop(
        0,
        "#eaf7ff"
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


    // ديكور
    ctx.globalAlpha = 0.45;

    ctx.fillStyle =
        "#bfdbfe";

    ctx.beginPath();

    ctx.arc(
        130,
        180,
        115,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#f5d0fe";

    ctx.beginPath();

    ctx.arc(
        920,
        320,
        150,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#bbf7d0";

    ctx.beginPath();

    ctx.arc(
        900,
        1610,
        135,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;


    // العنوان
    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#6366f1";

    ctx.font =
        "bold 48px Arial";

    ctx.fillText(
        "✨ أسرة السمائيين",
        width / 2,
        200
    );


    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 95px Arial";

    ctx.fillText(
        "دعــوة",
        width / 2,
        410
    );


    ctx.fillStyle =
        "#6b7280";

    ctx.font =
        "42px Arial";

    ctx.fillText(
        "حفلة نهاية الأنشطة",
        width / 2,
        515
    );


    ctx.fillStyle =
        "#172033";

    ctx.font =
        "bold 48px Arial";

    ctx.fillText(
        "أهلاً بك",
        width / 2,
        700
    );


    let displayName =
        name;

    if (
        displayName.length > 22
    ) {

        displayName =
            displayName.substring(
                0,
                22
            ) + "...";
    }


    ctx.fillStyle =
        "#6366f1";

    ctx.font =
        "bold 68px Arial";

    ctx.fillText(
        displayName,
        width / 2,
        820
    );


    // كارت المقاعد
    const cardX =
        100;

    const cardY =
        950;

    const cardWidth =
        width - 200;

    const cardHeight =
        330;


    ctx.fillStyle =
        "rgba(255,255,255,0.90)";

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


    ctx.fillStyle =
        "#6b7280";

    ctx.font =
        "38px Arial";

    ctx.fillText(
        "المقاعد المحجوزة",
        width / 2,
        1035
    );


    ctx.fillStyle =
        "#22c55e";

    ctx.font =
        "bold 55px Arial";

    ctx.fillText(
        bookedSeats.join(" • "),
        width / 2,
        1155
    );


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


// =================================
// Download invitation
// =================================

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


// =================================
// Booking
// =================================

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
                "من فضلك اكتب الاسم."
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


                const resultText =
                    JSON.stringify(
                        result
                    ).toLowerCase();


                if (
                    response.status === 409 ||
                    resultText.includes(
                        "duplicate"
                    ) ||
                    resultText.includes(
                        "unique"
                    )
                ) {

                    alert(
                        "واحد أو أكثر من المقاعد التي اخترتها اتحجز بالفعل."
                    );


                    await loadReservedSeats();


                    selectedSeats =
                        [];


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


            // تحويل المقاعد لمحجوز
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

                        seat.disabled =
                            true;
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


            selectedSeats = [];


            document
                .getElementById("name")
                .value = "";


            document
                .getElementById("phone")
                .value = "";


            updateSelectedSeatsText();


            alert(
                "تم الحجز بنجاح 🎉\n\nدعوتك جاهزة للتحميل!"
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


// =================================
// Start
// =================================

loadReservedSeats();
```
