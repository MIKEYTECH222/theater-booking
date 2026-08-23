```javascript
// ============================================
// SUPABASE
// ============================================

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


// ============================================
// ELEMENTS
// ============================================

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


// ============================================
// SELECTED SEATS
// ============================================

let selectedSeats = [];


// ============================================
// CREATE 99 SEATS
//
// 9 ROWS
// 5 SEATS + AISLE + 6 SEATS
//
// A = 11 seats
// B = 11 seats
// ...
// I = 11 seats
//
// TOTAL = 99
// ============================================

const rows =
    "ABCDEFGHI".split("");

rows.forEach(
    (letter, rowIndex) => {

        // ------------------------------------
        // First row label
        // This appears directly ABOVE A1-A11
        // ------------------------------------

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


        // ------------------------------------
        // Create row
        // ------------------------------------

        const row =
            document.createElement("div");

        row.className =
            "row";


        // ====================================
        // FIRST SIDE = 5 SEATS
        // ====================================

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


            // First row locked
            if (rowIndex === 0) {

                seat.classList.add(
                    "locked"
                );

                seat.disabled =
                    true;

                seat.title =
                    "خاص بالآباء الكهنة";
            }


            row.appendChild(
                seat
            );
        }


        // ====================================
        // AISLE
        // ====================================

        const aisle =
            document.createElement("div");

        aisle.className =
            "aisle";

        row.appendChild(
            aisle
        );


        // ====================================
        // SECOND SIDE = 6 SEATS
        // ====================================

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


            // First row locked
            if (rowIndex === 0) {

                seat.classList.add(
                    "locked"
                );

                seat.disabled =
                    true;

                seat.title =
                    "خاص بالآباء الكهنة";
            }


            row.appendChild(
                seat
            );
        }


        // Add row
        seatsContainer.appendChild(
            row
        );
    }
);


// ============================================
// ALL SEATS
// ============================================

const seats =
    document.querySelectorAll(".seat");


// ============================================
// UPDATE SELECTED SEATS TEXT
// ============================================

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


// ============================================
// LOAD RESERVED SEATS
// ============================================

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
            (booking) => {

                const seat =
                    document.querySelector(
                        `.seat[data-seat="${booking.seat}"]`
                    );


                if (!seat) {
                    return;
                }


                // Locked seats remain locked
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
            "Error loading reserved seats:",
            error
        );
    }
}


// ============================================
// SELECT MULTIPLE SEATS
// ============================================

seats.forEach(
    (seat) => {

        seat.addEventListener(
            "click",
            () => {

                // Locked seat
                if (
                    seat.classList.contains(
                        "locked"
                    )
                ) {
                    return;
                }


                // Reserved seat
                if (
                    seat.classList.contains(
                        "reserved"
                    )
                ) {
                    return;
                }


                const seatNumber =
                    seat.dataset.seat;


                // --------------------------------
                // Unselect
                // --------------------------------

                if (
                    selectedSeats.includes(
                        seatNumber
                    )
                ) {

                    selectedSeats =
                        selectedSeats.filter(
                            (item) =>
                                item !==
                                seatNumber
                        );


                    seat.classList.remove(
                        "selected"
                    );
                }


                // --------------------------------
                // Select
                // --------------------------------

                else {

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


// ============================================
// CREATE INVITATION
// ============================================

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


    // Clear
    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // ========================================
    // BACKGROUND
    // ========================================

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


    // ========================================
    // DECORATION
    // ========================================

    ctx.globalAlpha =
        0.45;


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


    ctx.globalAlpha =
        1;


    // ========================================
    // TEXT
    // ========================================

    ctx.textAlign =
        "center";


    // Family
    ctx.fillStyle =
        "#6366f1";


    ctx.font =
        "bold 48px Arial";


    ctx.fillText(
        "✨ أسرة السمائيين",
        width / 2,
        200
    );


    // Invitation
    ctx.fillStyle =
        "#172033";


    ctx.font =
        "bold 95px Arial";


    ctx.fillText(
        "دعــوة",
        width / 2,
        410
    );


    // Event
    ctx.fillStyle =
        "#6b7280";


    ctx.font =
        "42px Arial";


    ctx.fillText(
        "حفلة نهاية الأنشطة",
        width / 2,
        515
    );


    // Welcome
    ctx.fillStyle =
        "#172033";


    ctx.font =
        "bold 48px Arial";


    ctx.fillText(
        "أهلاً بك",
        width / 2,
        700
    );


    // Name
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


    // ========================================
    // SEATS CARD
    // ========================================

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


    ctx.lineWidth =
        3;


    ctx.stroke();


    // Seats title
    ctx.fillStyle =
        "#6b7280";


    ctx.font =
        "38px Arial";


    ctx.fillText(
        "المقاعد المحجوزة",
        width / 2,
        1035
    );


    // Seats
    ctx.fillStyle =
        "#22c55e";


    ctx.font =
        "bold 55px Arial";


    ctx.fillText(
        bookedSeats.join(" • "),
        width / 2,
        1155
    );


    // Bottom
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


    // Footer
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


// ============================================
// DOWNLOAD INVITATION
// ============================================

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


// ============================================
// BOOKING
// ============================================

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


        // ------------------------------------
        // Validate seats
        // ------------------------------------

        if (
            selectedSeats.length === 0
        ) {

            alert(
                "من فضلك اختر مقعدًا واحدًا على الأقل."
            );

            return;
        }


        // ------------------------------------
        // Validate name
        // ------------------------------------

        if (!name) {

            alert(
                "من فضلك اكتب الاسم."
            );

            return;
        }


        // ------------------------------------
        // Validate phone
        // ------------------------------------

        if (!phone) {

            alert(
                "من فضلك اكتب رقم الهاتف."
            );

            return;
        }


        // ------------------------------------
        // Loading
        // ------------------------------------

        bookButton.disabled =
            true;


        bookButton.textContent =
            "جاري الحجز...";


        try {

            // --------------------------------
            // Prepare bookings
            // --------------------------------

            const bookings =
                selectedSeats.map(
                    (seat) => ({
                        seat: seat,
                        name: name,
                        phone: phone
                    })
                );


            // --------------------------------
            // Insert
            // --------------------------------

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


            // --------------------------------
            // Error
            // --------------------------------

            if (!response.ok) {

                console.error(
                    "Supabase error:",
                    result
                );


                const resultText =
                    JSON.stringify(
                        result
                    ).toLowerCase();


                // Duplicate
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
                        "واحد أو أكثر من المقاعد التي اخترتها اتحجز بالفعل.\n" +
                        "تم تحديث المقاعد، اختار مقاعد تانية."
                    );


                    await loadReservedSeats();


                    selectedSeats =
                        [];


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


            // --------------------------------
            // Save booked seats
            // --------------------------------

            const bookedSeats =
                [...selectedSeats];


            // --------------------------------
            // Mark reserved
            // --------------------------------

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

                        seat.disabled =
                            true;
                    }
                }
            );


            // --------------------------------
            // Create invitation
            // --------------------------------

            createInvitation(
                name,
                bookedSeats
            );


            // --------------------------------
            // Show invitation
            // --------------------------------

            invitationSection.style.display =
                "block";


            invitationSection.scrollIntoView({
                behavior: "smooth"
            });


            // --------------------------------
            // Clear
            // --------------------------------

            selectedSeats =
                [];


            document
                .getElementById("name")
                .value =
                "";


            document
                .getElementById("phone")
                .value =
                "";


            updateSelectedSeatsText();


            alert(
                "تم الحجز بنجاح 🎉\n\n" +
                "دعوتك جاهزة للتحميل!"
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


// ============================================
// START
// ============================================

loadReservedSeats();
```
