// ============================================
// SETTINGS
// ============================================

// عدد الصفوف
const ROWS = 10;

// عدد الكراسي في الشمال
const LEFT_SEATS = 5;

// عدد الكراسي في اليمين
const RIGHT_SEATS = 6;


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
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json"
};


// ============================================
// PAGE ELEMENTS
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
// CREATE SEATS
// ============================================

function createSeats() {

    seatsContainer.innerHTML = "";

    for (
        let rowIndex = 0;
        rowIndex < ROWS;
        rowIndex++
    ) {

        // A, B, C, D...
        const letter =
            String.fromCharCode(
                65 + rowIndex
            );

        const row =
            document.createElement("div");

        row.className =
            "row";


        // ==================================
        // LEFT SIDE
        // ==================================

        for (
            let number = 1;
            number <= LEFT_SEATS;
            number++
        ) {

            const seat =
                document.createElement("button");

            seat.type = "button";

            seat.className =
                "seat";

            seat.dataset.seat =
                letter + number;

            seat.textContent =
                letter + number;

            row.appendChild(
                seat
            );
        }


        // ==================================
        // AISLE
        // ==================================

        const aisle =
            document.createElement("div");

        aisle.className =
            "aisle";

        row.appendChild(
            aisle
        );


        // ==================================
        // RIGHT SIDE
        // ==================================

        for (
            let number = 1;
            number <= RIGHT_SEATS;
            number++
        ) {

            const seat =
                document.createElement("button");

            seat.type = "button";

            seat.className =
                "seat";

            const seatNumber =
                LEFT_SEATS + number;

            seat.dataset.seat =
                letter + seatNumber;

            seat.textContent =
                letter + seatNumber;

            row.appendChild(
                seat
            );
        }


        // Add complete row
        seatsContainer.appendChild(
            row
        );
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
            "Error loading reserved seats:",
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

                    // لو محجوز
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
                    // إلغاء الاختيار
                    // =================================

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


                    // =================================
                    // اختيار كرسي جديد
                    // =================================

                    else {

                        // الحد الأقصى كرسيين
                        if (
                            selectedSeats.length >= 2
                        ) {

                            alert(
                                "مسموح باختيار كرسيين فقط لكل حجز."
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


    // Clear
    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // ==================================
    // Background
    // ==================================

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


    // ==================================
    // Decorative circles
    // ==================================

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


    // ==================================
    // Text
    // ==================================

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


    // Main title
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


    // ==================================
    // Seats card
    // ==================================

    ctx.fillStyle =
        "#ffffff";

    ctx.globalAlpha =
        0.92;

    ctx.fillRect(
        100,
        950,
        width - 200,
        300
    );

    ctx.globalAlpha =
        1;

    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth =
        3;

    ctx.strokeRect(
        100,
        950,
        width - 200,
        300
    );


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


    // Bottom message
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

if (downloadInvitation) {

    downloadInvitation.addEventListener(
        "click",
        () => {

            if (!invitationCanvas) {
                return;
            }

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

if (bookButton) {

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


            // =================================
            // NO SEATS
            // =================================

            if (
                selectedSeats.length === 0
            ) {

                alert(
                    "من فضلك اختر كرسيًا واحدًا على الأقل."
                );

                return;
            }


            // =================================
            // MAX 2 SEATS
            // =================================

            if (
                selectedSeats.length > 2
            ) {

                alert(
                    "مسموح بكرسيين فقط لكل رقم هاتف."
                );

                return;
            }


            // =================================
            // NO NAME
            // =================================

            if (!name) {

                alert(
                    "من فضلك اكتب الاسم."
                );

                return;
            }


            // =================================
            // NO PHONE
            // =================================

            if (!phone) {

                alert(
                    "من فضلك اكتب رقم الهاتف."
                );

                return;
            }


            // =================================
            // LOADING
            // =================================

            bookButton.disabled =
                true;

            bookButton.textContent =
                "جاري التحقق والحجز...";


            try {

                // =================================
                // CALL SUPABASE FUNCTION
                // =================================
                //
                // بدل ما نحجز مباشرة في bookings،
                // بنستدعي book_seats
                // عشان Supabase يطبق حد الكرسيين.
                //
                // =================================

                const response =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/rpc/book_seats",
                        {
                            method: "POST",

                            headers: {
                                ...headers,

                                "Prefer":
                                    "return=representation"
                            },

                            body:
                                JSON.stringify({
                                    p_name:
                                        name,

                                    p_phone:
                                        phone,

                                    p_seats:
                                        selectedSeats
                                })
                        }
                    );


                // نقرأ الرد كنص أولًا
                // عشان نقدر نتعامل مع أخطاء
                // PostgreSQL بشكل صحيح.

                const resultText =
                    await response.text();


                console.log(
                    "Supabase response:",
                    resultText
                );


                // =================================
                // ERROR
                // =================================

                if (!response.ok) {

                    const errorText =
                        resultText.toLowerCase();


                    console.error(
                        "Supabase booking error:",
                        resultText
                    );


                    // =================================
                    // PHONE LIMIT
                    // =================================

                    if (
                        errorText.includes(
                            "phone_limit"
                        )
                    ) {

                        alert(
                            "الرقم ده وصل للحد الأقصى.\n\n" +
                            "مسموح بكرسيين فقط لكل رقم هاتف."
                        );

                        return;
                    }


                    // =================================
                    // SEAT TAKEN
                    // =================================

                    if (
                        errorText.includes(
                            "seat_taken"
                        ) ||
                        errorText.includes(
                            "duplicate"
                        ) ||
                        errorText.includes(
                            "unique"
                        ) ||
                        response.status === 409
                    ) {

                        alert(
                            "واحد أو أكثر من الكراسي التي اخترتها اتحجز بالفعل."
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


                    // =================================
                    // NO SEATS
                    // =================================

                    if (
                        errorText.includes(
                            "no_seats"
                        )
                    ) {

                        alert(
                            "من فضلك اختر كرسيًا."
                        );

                        return;
                    }


                    // =================================
                    // OTHER ERROR
                    // =================================

                    throw new Error(
                        resultText
                    );
                }


                // =================================
                // SUCCESS
                // =================================

                const bookedSeats =
                    [...selectedSeats];


                // =================================
                // CONVERT TO RESERVED
                // =================================

                bookedSeats.forEach(
                    (seatNumber) => {

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
                // CLEAR SELECTION
                // =================================

                selectedSeats =
                    [];


                // =================================
                // CLEAR INPUTS
                // =================================

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
                    "حصل خطأ أثناء الحجز.\n\n" +
                    "راجع Console لمعرفة الخطأ."
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
