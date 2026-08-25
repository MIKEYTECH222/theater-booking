```javascript
// ============================================
// SETTINGS
// ============================================

const ROWS = 11;

const LEFT_SEATS = 4;

const RIGHT_SEATS = 4;


// ============================================
// SUPABASE
// ============================================

const SUPABASE_URL =
    "https://vxcqzmyhsrwfnxztbxdl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_GK-t6OfY2KjSlOcmneNwfQ_fKTWAn53";


const BOOKINGS_URL =
    SUPABASE_URL + "/rest/v1/bookings";


const headers = {
    "apikey": SUPABASE_KEY,

    "Authorization":
        "Bearer " + SUPABASE_KEY,

    "Content-Type":
        "application/json"
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
    document.getElementById(
        "invitationSection"
    );


const invitationCanvas =
    document.getElementById(
        "invitationCanvas"
    );


const downloadInvitation =
    document.getElementById(
        "downloadInvitation"
    );


const phoneInput =
    document.getElementById("phone");


// ============================================
// SELECTED SEATS
// ============================================

let selectedSeats = [];


// ============================================
// CREATE 88 SEATS
//
// 11 ROWS
// 4 LEFT + AISLE + 4 RIGHT
//
// A1 A2 A3 A4 | A5 A6 A7 A8
// B1 B2 B3 B4 | B5 B6 B7 B8
// ...
// K1 K2 K3 K4 | K5 K6 K7 K8
// ============================================

function createSeats() {

    seatsContainer.innerHTML = "";


    for (
        let rowIndex = 0;
        rowIndex < ROWS;
        rowIndex++
    ) {

        const letter =
            String.fromCharCode(
                65 + rowIndex
            );


        const row =
            document.createElement("div");


        row.className = "row";


        // ====================================
        // LEFT SIDE - 4 SEATS
        // ====================================

        for (
            let number = 1;
            number <= LEFT_SEATS;
            number++
        ) {

            const seat =
                document.createElement(
                    "button"
                );


            seat.type = "button";


            seat.className =
                "seat";


            const seatName =
                letter + number;


            seat.dataset.seat =
                seatName;


            seat.textContent =
                seatName;


            row.appendChild(seat);
        }


        // ====================================
        // AISLE
        // ====================================

        const aisle =
            document.createElement("div");


        aisle.className =
            "aisle";


        row.appendChild(aisle);


        // ====================================
        // RIGHT SIDE - 4 SEATS
        // ====================================

        for (
            let number = 1;
            number <= RIGHT_SEATS;
            number++
        ) {

            const seat =
                document.createElement(
                    "button"
                );


            seat.type = "button";


            seat.className =
                "seat";


            const seatNumber =
                LEFT_SEATS + number;


            const seatName =
                letter + seatNumber;


            seat.dataset.seat =
                seatName;


            seat.textContent =
                seatName;


            row.appendChild(seat);
        }


        seatsContainer.appendChild(row);
    }
}


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
        "المقاعد المختارة: " +
        selectedSeats.join(" - ");
}


// ============================================
// LOAD RESERVED SEATS
// ============================================

async function loadReservedSeats() {

    try {

        const response =
            await fetch(
                BOOKINGS_URL +
                "?select=seat",
                {
                    method: "GET",

                    headers: headers
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status
            );
        }


        const bookings =
            await response.json();


        bookings.forEach(
            (booking) => {

                const seat =
                    document.querySelector(
                        '.seat[data-seat="' +
                        booking.seat +
                        '"]'
                    );


                if (!seat) {
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
            "Load seats error:",
            error
        );
    }
}


// ============================================
// SETUP SEAT SELECTION
// ============================================

function setupSeatSelection() {

    const seats =
        document.querySelectorAll(
            ".seat"
        );


    seats.forEach(
        (seat) => {

            seat.addEventListener(
                "click",
                () => {

                    if (
                        seat.classList.contains(
                            "reserved"
                        )
                    ) {

                        return;
                    }


                    const seatNumber =
                        seat.dataset.seat;


                    // =================================
                    // UNSELECT
                    // =================================

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
                    }


                    // =================================
                    // SELECT
                    // =================================

                    else {

                        if (
                            selectedSeats.length >= 2
                        ) {

                            alert(
                                "مسموح بحجز كرسيين فقط لكل رقم هاتف."
                            );

                            return;
                        }


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
}


// ============================================
// CREATE INVITATION
// ============================================

function createInvitation(
    name,
    bookedSeats
) {

    if (!invitationCanvas) {
        return;
    }


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


    // ====================================
    // BACKGROUND
    // ====================================

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


    ctx.textAlign =
        "center";


    // ====================================
    // FAMILY
    // ====================================

    ctx.fillStyle =
        "#6366f1";


    ctx.font =
        "bold 48px Arial";


    ctx.fillText(
        "✨ أسرة السمائيين",
        width / 2,
        200
    );


    // ====================================
    // INVITATION
    // ====================================

    ctx.fillStyle =
        "#172033";


    ctx.font =
        "bold 95px Arial";


    ctx.fillText(
        "دعــوة",
        width / 2,
        410
    );


    // ====================================
    // EVENT
    // ====================================

    ctx.fillStyle =
        "#6b7280";


    ctx.font =
        "42px Arial";


    ctx.fillText(
        "حفلة نهاية الأنشطة",
        width / 2,
        515
    );


    // ====================================
    // WELCOME
    // ====================================

    ctx.fillStyle =
        "#172033";


    ctx.font =
        "bold 48px Arial";


    ctx.fillText(
        "أهلاً بك",
        width / 2,
        700
    );


    // ====================================
    // NAME
    // ====================================

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


    // ====================================
    // SEATS
    // ====================================

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


    // ====================================
    // MESSAGE
    // ====================================

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


    // ====================================
    // FOOTER
    // ====================================

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

if (
    downloadInvitation
) {

    downloadInvitation.addEventListener(
        "click",
        () => {

            const link =
                document.createElement(
                    "a"
                );


            link.download =
                "دعوة-أسرة-السمائيين.png";


            link.href =
                invitationCanvas.toDataURL(
                    "image/png"
                );


            link.click();
        }
    );
}


// ============================================
// BOOKING
// ============================================

if (
    bookButton
) {

    bookButton.addEventListener(
        "click",
        async () => {

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const phone =
                phoneInput
                    .value
                    .trim();


            // =================================
            // VALIDATE SEATS
            // =================================

            if (
                selectedSeats.length === 0
            ) {

                alert(
                    "من فضلك اختر مقعدًا واحدًا على الأقل."
                );

                return;
            }


            // =================================
            // VALIDATE NAME
            // =================================

            if (!name) {

                alert(
                    "من فضلك اكتب الاسم."
                );

                return;
            }


            // =================================
            // VALIDATE PHONE
            // =================================

            if (!phone) {

                alert(
                    "من فضلك اكتب رقم الهاتف."
                );

                return;
            }


            // =================================
            // CLEAN PHONE
            // =================================

            const cleanPhone =
                phone.replace(
                    /\s+/g,
                    ""
                );


            bookButton.disabled =
                true;


            bookButton.textContent =
                "جاري التحقق والحجز...";


            try {

                // =================================
                // SUPABASE RPC
                // =================================

                const response =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/rpc/book_seats",
                        {
                            method: "POST",

                            headers: headers,

                            body:
                                JSON.stringify({
                                    p_name:
                                        name,

                                    p_phone:
                                        cleanPhone,

                                    p_seats:
                                        selectedSeats
                                })
                        }
                    );


                const result =
                    await response.text();


                // =================================
                // ERROR
                // =================================

                if (!response.ok) {

                    console.error(
                        "Booking RPC error:",
                        result
                    );


                    if (
                        result.includes(
                            "PHONE_LIMIT"
                        )
                    ) {

                        alert(
                            "الرقم ده حجز كرسيين بالفعل.\n" +
                            "مسموح بحد أقصى كرسيين فقط لكل رقم هاتف."
                        );

                        return;
                    }


                    if (
                        result.includes(
                            "SEAT_TAKEN"
                        )
                    ) {

                        alert(
                            "واحد من المقاعد اللي اخترتها اتحجز بالفعل.\n" +
                            "اختار مقاعد تانية."
                        );


                        await loadReservedSeats();


                        selectedSeats =
                            [];


                        document
                            .querySelectorAll(
                                ".seat.selected"
                            )
                            .forEach(
                                seat => {

                                    seat.classList.remove(
                                        "selected"
                                    );
                                }
                            );


                        updateSelectedSeatsText();


                        return;
                    }


                    if (
                        result.includes(
                            "NO_SEATS"
                        )
                    ) {

                        alert(
                            "اختار مقعدًا أولًا."
                        );

                        return;
                    }


                    throw new Error(
                        result
                    );
                }


                // =================================
                // SUCCESS
                // =================================

                const bookedSeats =
                    [
                        ...selectedSeats
                    ];


                bookedSeats.forEach(
                    seatNumber => {

                        const seat =
                            document.querySelector(
                                '.seat[data-seat="' +
                                seatNumber +
                                '"]'
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


                // =================================
                // CREATE INVITATION
                // =================================

                createInvitation(
                    name,
                    bookedSeats
                );


                // =================================
                // SHOW INVITATION
                // =================================

                if (
                    invitationSection
                ) {

                    invitationSection.style.display =
                        "block";


                    invitationSection.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }


                // =================================
                // CLEAR
                // =================================

                selectedSeats = [];


                document
                    .getElementById("name")
                    .value = "";


                phoneInput.value = "";


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
                    "حصل خطأ أثناء الحجز.\n" +
                    "حاول مرة أخرى."
                );


            } finally {

                bookButton.disabled =
                    false;


                bookButton.textContent =
                    "تأكيد الحجز";
            }
        }
    );
}


// ============================================
// START
// ============================================

createSeats();

setupSeatSelection();

loadReservedSeats();
```
