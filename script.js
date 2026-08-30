/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://vxcqzmyhsrwfnxztbxdl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_GK-t6OfY2KjSlOcmneNwfQ_fKTWAn53";

const BOOKINGS_URL =
    `${SUPABASE_URL}/rest/v1/bookings`;


/* =====================================================
   SETTINGS
===================================================== */

const ROWS = 9;

const LEFT_SEATS = 5;

const RIGHT_SEATS = 6;

const MAX_SEATS = 3;


/* =====================================================
   STATE
===================================================== */

let selectedSeats = [];

let reservedSeats = [];


/* =====================================================
   ELEMENTS
===================================================== */

const seatsContainer =
    document.getElementById("seats");

const selectedSeatText =
    document.getElementById("selectedSeat");

const nameInput =
    document.getElementById("name");

const phoneInput =
    document.getElementById("phone");

const bookButton =
    document.getElementById("bookButton");

const bookingMessage =
    document.getElementById("bookingMessage");

const invitationSection =
    document.getElementById("invitationSection");

const invitationCanvas =
    document.getElementById("invitationCanvas");

const downloadInvitation =
    document.getElementById("downloadInvitation");


/* =====================================================
   SUPABASE HEADERS
===================================================== */

function getHeaders(extra = {}) {

    return {
        "apikey":
            SUPABASE_KEY,

        "Authorization":
            `Bearer ${SUPABASE_KEY}`,

        "Content-Type":
            "application/json",

        ...extra
    };
}


/* =====================================================
   LOAD RESERVED SEATS
===================================================== */

async function loadReservedSeats() {

    try {

        const response =
            await fetch(
                `${BOOKINGS_URL}?select=seat`,
                {
                    method: "GET",

                    headers:
                        getHeaders()
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(error);
        }


        const data =
            await response.json();


        reservedSeats =
            Array.isArray(data)
                ? data
                    .map(
                        item =>
                            String(item.seat)
                    )
                    .filter(Boolean)
                : [];


        renderSeats();


    } catch (error) {

        console.error(
            "Supabase load error:",
            error
        );


        /*
           حتى لو Supabase فيه مشكلة،
           الكراسي تفضل ظاهرة.
        */

        renderSeats();
    }
}


/* =====================================================
   CREATE 99 SEATS
===================================================== */

function renderSeats() {

    seatsContainer.innerHTML = "";


    for (
        let rowNumber = 1;
        rowNumber <= ROWS;
        rowNumber++
    ) {

        const row =
            document.createElement("div");

        row.className =
            "seat-row";


        /*
           كل صف 11 كرسي:

           1 2 3 4 5
              ممر
           6 7 8 9 10 11
        */


        /* LEFT - 5 */

        for (
            let number = 1;
            number <= LEFT_SEATS;
            number++
        ) {

            const seatNumber =
                getSeatName(
                    rowNumber,
                    number
                );


            row.appendChild(
                createSeat(
                    seatNumber
                )
            );
        }


        /* AISLE */

        const aisle =
            document.createElement("div");

        aisle.className =
            "aisle";

        aisle.setAttribute(
            "aria-hidden",
            "true"
        );

        row.appendChild(
            aisle
        );


        /* RIGHT - 6 */

        for (
            let number = 1;
            number <= RIGHT_SEATS;
            number++
        ) {

            const actualNumber =
                LEFT_SEATS +
                number;


            const seatNumber =
                getSeatName(
                    rowNumber,
                    actualNumber
                );


            row.appendChild(
                createSeat(
                    seatNumber
                )
            );
        }


        seatsContainer.appendChild(
            row
        );
    }
}


/* =====================================================
   SEAT NAME
===================================================== */

function getSeatName(
    row,
    number
) {

    /*
       A1 -> A11
       B1 -> B11
       ...
       I1 -> I11
    */

    const letter =
        String.fromCharCode(
            64 + row
        );


    return `${letter}${number}`;
}


/* =====================================================
   CREATE ONE SEAT
===================================================== */

function createSeat(
    seatNumber
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "seat";


    button.textContent =
        seatNumber;


    button.dataset.seat =
        seatNumber;


    button.setAttribute(
        "aria-label",
        `المقعد ${seatNumber}`
    );


    /* RESERVED */

    if (
        reservedSeats.includes(
            seatNumber
        )
    ) {

        button.classList.add(
            "reserved"
        );

        button.disabled =
            true;

        return button;
    }


    /* SELECTED */

    if (
        selectedSeats.includes(
            seatNumber
        )
    ) {

        button.classList.add(
            "selected"
        );
    }


    /* CLICK */

    button.addEventListener(
        "click",
        function () {

            toggleSeat(
                seatNumber,
                button
            );
        }
    );


    return button;
}


/* =====================================================
   TOGGLE SEAT
===================================================== */

function toggleSeat(
    seatNumber,
    button
) {

    /* REMOVE */

    if (
        selectedSeats.includes(
            seatNumber
        )
    ) {

        selectedSeats =
            selectedSeats.filter(
                seat =>
                    seat !== seatNumber
            );


        button.classList.remove(
            "selected"
        );


        updateSelectedText();

        return;
    }


    /* MAX 2 */

    if (
        selectedSeats.length >=
        MAX_SEATS
    ) {

        showMessage(
            "مسموح بحجز مقعدين فقط.",
            false
        );

        return;
    }


    /* ADD */

    selectedSeats.push(
        seatNumber
    );


    button.classList.add(
        "selected"
    );


    updateSelectedText();


    showMessage(
        "",
        true
    );
}


/* =====================================================
   UPDATE SELECTED TEXT
===================================================== */

function updateSelectedText() {

    if (
        selectedSeats.length === 0
    ) {

        selectedSeatText.textContent =
            "لم يتم اختيار أي مقعد";

        return;
    }


    selectedSeatText.textContent =
        `المقاعد المختارة: ${selectedSeats.join(" ، ")}`;
}


/* =====================================================
   NORMALIZE PHONE
===================================================== */

function normalizePhone(
    phone
) {

    return phone.replace(
        /[\s\-()+]/g,
        ""
    );
}


/* =====================================================
   CHECK PHONE BOOKINGS
===================================================== */

async function getPhoneBookings(
    phone
) {

    const encodedPhone =
        encodeURIComponent(
            phone
        );


    const response =
        await fetch(
            `${BOOKINGS_URL}?phone=eq.${encodedPhone}&select=seat`,
            {
                method: "GET",

                headers:
                    getHeaders()
            }
        );


    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }


    return response.json();
}


/* =====================================================
   CHECK LIVE SEAT AVAILABILITY
===================================================== */

async function getLiveReservedSeats() {

    const response =
        await fetch(
            `${BOOKINGS_URL}?select=seat`,
            {
                method: "GET",

                headers:
                    getHeaders()
            }
        );


    if (!response.ok) {

        const error =
            await response.text();

        throw new Error(error);
    }


    const data =
        await response.json();


    return data.map(
        item =>
            String(item.seat)
    );
}


/* =====================================================
   BOOK BUTTON
===================================================== */

bookButton.addEventListener(
    "click",
    bookSeats
);


/* =====================================================
   BOOK SEATS
===================================================== */

async function bookSeats() {

    const name =
        nameInput.value.trim();


    const rawPhone =
        phoneInput.value.trim();


    /* =========================
       NAME
    ========================== */

    if (!name) {

        showMessage(
            "من فضلك اكتب الاسم.",
            false
        );

        nameInput.focus();

        return;
    }


    /* =========================
       PHONE
    ========================== */

    if (!rawPhone) {

        showMessage(
            "من فضلك اكتب رقم الهاتف.",
            false
        );

        phoneInput.focus();

        return;
    }


    const phone =
        normalizePhone(
            rawPhone
        );


    if (
        phone.length < 8
    ) {

        showMessage(
            "من فضلك اكتب رقم هاتف صحيح.",
            false
        );

        phoneInput.focus();

        return;
    }


    /* =========================
       SEATS
    ========================== */

    if (
        selectedSeats.length === 0
    ) {

        showMessage(
            "من فضلك اختر مقعدًا واحدًا على الأقل.",
            false
        );

        return;
    }


    if (
        selectedSeats.length > MAX_SEATS
    ) {

        showMessage(
            "مسموح بحجز 3 مقاعد فقط.",
            false
        );

        return;
    }


    /* =========================
       BUTTON
    ========================== */

    bookButton.disabled =
        true;

    bookButton.textContent =
        "جاري الحجز...";


    try {

        /* =========================================
           CHECK PHONE LIMIT
        ========================================= */

        const existingBookings =
            await getPhoneBookings(
                phone
            );


        const existingCount =
            Array.isArray(
                existingBookings
            )
                ? existingBookings.length
                : 0;


        if (
            existingCount +
            selectedSeats.length >
            MAX_SEATS
        ) {

            throw new Error(
                `هذا الرقم لديه ${existingCount} كرسي بالفعل. الحد الأقصى كرسيان.`
            );
        }


        /* =========================================
           GET LIVE SEATS
        ========================================= */

        const liveReserved =
            await getLiveReservedSeats();


        const conflicts =
            selectedSeats.filter(
                seat =>
                    liveReserved.includes(
                        seat
                    )
            );


        if (
            conflicts.length > 0
        ) {

            reservedSeats =
                liveReserved;


            renderSeats();


            selectedSeats =
                selectedSeats.filter(
                    seat =>
                        !conflicts.includes(
                            seat
                        )
                );


            updateSelectedText();


            throw new Error(
                `المقاعد ${conflicts.join(" ، ")} تم حجزها بالفعل.`
            );
        }


        /* =========================================
           PREPARE DATA
        ========================================= */

        const rows =
            selectedSeats.map(
                seat => ({
                    name:
                        name,

                    phone:
                        phone,

                    seat:
                        seat
                })
            );


        /* =========================================
           INSERT
        ========================================= */

        const response =
            await fetch(
                BOOKINGS_URL,
                {
                    method: "POST",

                    headers:
                        getHeaders({
                            "Prefer":
                                "return=minimal"
                        }),

                    body:
                        JSON.stringify(
                            rows
                        )
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            /*
               لو حصل unique violation
               بسبب إن حد حجز المقعد
               في نفس اللحظة.
            */

            if (
                error.includes("duplicate") ||
                error.includes("23505")
            ) {

                throw new Error(
                    "أحد المقاعد تم حجزه في نفس الوقت. حدّث الصفحة واختر مقعدًا آخر."
                );
            }


            throw new Error(
                error
            );
        }


        /* =========================================
           SAVE BOOKED SEATS
        ========================================= */

        const bookedSeats =
            [...selectedSeats];


        reservedSeats =
            [
                ...reservedSeats,
                ...bookedSeats
            ];


        selectedSeats = [];


        renderSeats();

        updateSelectedText();


        /* =========================================
           SUCCESS
        ========================================= */

        showMessage(
            "تم الحجز بنجاح 🎉",
            true
        );


        /* =========================================
           INVITATION
        ========================================= */

        drawInvitation(
            name,
            bookedSeats
        );


        invitationSection.style.display =
            "block";


        invitationSection.scrollIntoView({
            behavior:
                "smooth",

            block:
                "start"
        });


        /* =========================================
           CLEAR INPUTS
        ========================================= */

        nameInput.value =
            name;

        phoneInput.value =
            rawPhone;


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        showMessage(
            error.message ||
            "حدث خطأ أثناء الحجز.",
            false
        );


        /*
           تحديث المقاعد بعد الخطأ.
        */

        try {

            await loadReservedSeats();

        } catch {

            // لا شيء
        }


    } finally {

        bookButton.disabled =
            false;

        bookButton.textContent =
            "تأكيد الحجز";
    }
}


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(
    message,
    success
) {

    bookingMessage.textContent =
        message;


    if (!message) {

        bookingMessage.style.color =
            "";

        return;
    }


    bookingMessage.style.color =
        success
            ? "#2e7d32"
            : "#d32f2f";
}


/* =====================================================
   DRAW INVITATION
===================================================== */

function drawInvitation(
    name,
    seats
) {

    const canvas =
        invitationCanvas;

    const ctx =
        canvas.getContext(
            "2d"
        );


    const W =
        canvas.width;

    const H =
        canvas.height;


    /* =========================
       BACKGROUND
    ========================== */

    const background =
        ctx.createLinearGradient(
            0,
            0,
            W,
            H
        );


    background.addColorStop(
        0,
        "#eee0c7"
    );


    background.addColorStop(
        0.5,
        "#fffaf0"
    );


    background.addColorStop(
        1,
        "#dfc89f"
    );


    ctx.fillStyle =
        background;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* =========================
       BORDER
    ========================== */

    ctx.strokeStyle =
        "#947044";

    ctx.lineWidth =
        12;


    ctx.strokeRect(
        45,
        45,
        W - 90,
        H - 90
    );


    ctx.strokeStyle =
        "#c3a16b";

    ctx.lineWidth =
        3;


    ctx.strokeRect(
        70,
        70,
        W - 140,
        H - 140
    );


    /* =========================
       DECORATION
    ========================== */

    ctx.fillStyle =
        "rgba(148,112,68,.12)";


    ctx.beginPath();

    ctx.arc(
        110,
        175,
        85,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        W - 110,
        175,
        85,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* =========================
       TITLE
    ========================== */

    invitationText(
        ctx,
        "✦ دعــــــــوة خــــــــاصة ✦",
        W / 2,
        235,
        "bold 55px Arial",
        "#76552e"
    );


    invitationText(
        ctx,
        "تتشرف",
        W / 2,
        360,
        "bold 42px Arial",
        "#4a3827"
    );


    invitationText(
        ctx,
        "أسرتي أبطال الإيمان و شهيدات",
        W / 2,
        460,
        "bold 46px Arial",
        "#8b6335"
    );


    invitationText(
        ctx,
        "بدعوة سيادتكم لحضور",
        W / 2,
        590,
        "38px Arial",
        "#4a3827"
    );


    invitationText(
        ctx,
        "حفل ختام الأنشطة",
        W / 2,
        695,
        "bold 66px Arial",
        "#76552e"
    );


    /* =========================
       LINE
    ========================== */

    ctx.strokeStyle =
        "#b38d59";

    ctx.lineWidth =
        4;


    ctx.beginPath();


    ctx.moveTo(
        W / 2 - 280,
        780
    );


    ctx.lineTo(
        W / 2 + 280,
        780
    );


    ctx.stroke();


    /* =========================
       DATE
    ========================== */

    invitationText(
        ctx,
        "يوم الثلاثاء الموافق",
        W / 2,
        890,
        "34px Arial",
        "#4a3827"
    );


    invitationText(
        ctx,
        "1 سبتمبر 2026",
        W / 2,
        975,
        "bold 52px Arial",
        "#8b6335"
    );


    /* =========================
       TIME
    ========================== */

    invitationText(
        ctx,
        "في تمام الساعة السادسة و النصف مساءً",
        W / 2,
        1075,
        "bold 38px Arial",
        "#4a3827"
    );


    /* =========================
       LOCATION
    ========================== */

    invitationText(
        ctx,
        "بمسرح كنيسة السيدة العذراء مريم",
        W / 2,
        1175,
        "bold 39px Arial",
        "#76552e"
    );


    invitationText(
        ctx,
        "والبابا كيرلس السادس بأغاخان",
        W / 2,
        1245,
        "bold 38px Arial",
        "#76552e"
    );


    /* =========================
       NAME BOX
    ========================== */

    drawRoundedBox(
        ctx,
        120,
        1370,
        W - 240,
        205,
        30,
        "#fffaf0",
        "#b38d59"
    );


    invitationText(
        ctx,
        "اسم المدعو",
        W / 2,
        1435,
        "30px Arial",
        "#76552e"
    );


    invitationText(
        ctx,
        name,
        W / 2,
        1520,
        "bold 48px Arial",
        "#3d3021"
    );


    /* =========================
       SEATS
    ========================== */

    drawRoundedBox(
        ctx,
        120,
        1615,
        W - 240,
        155,
        30,
        "#76552e",
        "#76552e"
    );


    invitationText(
        ctx,
        `المقاعد: ${seats.join(" ، ")}`,
        W / 2,
        1692,
        "bold 42px Arial",
        "#ffffff"
    );


    /* =========================
       FOOTER
    ========================== */

    invitationText(
        ctx,
        "نتمنى لكم وقتًا ممتعًا ومباركًا ❤️",
        W / 2,
        1820,
        "bold 29px Arial",
        "#76552e"
    );
}


/* =====================================================
   INVITATION TEXT
===================================================== */

function invitationText(
    ctx,
    text,
    x,
    y,
    font,
    color
) {

    ctx.font =
        font;

    ctx.fillStyle =
        color;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        text,
        x,
        y
    );
}


/* =====================================================
   ROUNDED BOX
===================================================== */

function drawRoundedBox(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke
) {

    ctx.beginPath();


    ctx.moveTo(
        x + radius,
        y
    );


    ctx.lineTo(
        x + width - radius,
        y
    );


    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );


    ctx.lineTo(
        x + width,
        y + height - radius
    );


    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );


    ctx.lineTo(
        x + radius,
        y + height
    );


    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );


    ctx.lineTo(
        x,
        y + radius
    );


    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );


    ctx.closePath();


    ctx.fillStyle =
        fill;

    ctx.fill();


    ctx.strokeStyle =
        stroke;

    ctx.lineWidth =
        4;

    ctx.stroke();
}


/* =====================================================
   DOWNLOAD INVITATION
===================================================== */

downloadInvitation.addEventListener(
    "click",
    function () {

        try {

            const image =
                invitationCanvas.toDataURL(
                    "image/png"
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                image;


            link.download =
                "دعوة-حفل-ختام-الانشطة.png";


            document.body.appendChild(
                link
            );


            link.click();


            link.remove();


        } catch (error) {

            console.error(
                "Download error:",
                error
            );


            alert(
                "حدث خطأ أثناء تحميل الدعوة."
            );
        }
    }
);


/* =====================================================
   START
===================================================== */

/*
   مهم:
   الكراسي تتعمل أولًا فورًا،
   وبعدها نستعلم من Supabase عن المحجوز.
*/

renderSeats();

updateSelectedText();

loadReservedSeats();
