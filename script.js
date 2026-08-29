```javascript
/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://vxcqzmyhsrwfnxztbxdl.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_GK-t6OfY2KjSlOcmneNwfQ_fKTWAn53";


/* =====================================================
   SETTINGS
===================================================== */

const ROWS = 9;
const LEFT_SEATS = 5;
const RIGHT_SEATS = 6;
const MAX_SEATS = 2;

const SPECIAL_SEATS = [
    "A1", "A2", "A3", "A4", "A5", "A6",
    "A7", "A8", "A9", "A10", "A11"
];


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
   CHECK ELEMENTS
===================================================== */

if (!seatsContainer) {
    console.error("Element #seats غير موجود في index.html");
}


/* =====================================================
   SUPABASE REQUEST
===================================================== */

async function supabaseRequest(endpoint, options = {}) {

    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/${endpoint}`,
        {
            ...options,

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",

                ...(options.headers || {})
            }
        }
    );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            errorText || `HTTP ${response.status}`
        );
    }


    if (response.status === 204) {
        return null;
    }


    return response.json();
}


/* =====================================================
   CREATE ALL SEATS
===================================================== */

function createSeats() {

    if (!seatsContainer) {
        return;
    }


    seatsContainer.innerHTML = "";


    /* =================================================
       SPECIAL AREA
    ================================================= */

    const specialTitle =
        document.createElement("div");

    specialTitle.className =
        "special-area";

    specialTitle.textContent =
        "🔒 خاص بالآباء الكهنة";

    seatsContainer.appendChild(
        specialTitle
    );


    const specialRow =
        document.createElement("div");

    specialRow.className =
        "seat-row";


    for (
        let i = 0;
        i < SPECIAL_SEATS.length;
        i++
    ) {

        const seatId =
            SPECIAL_SEATS[i];

        const seat =
            createSpecialSeat(
                seatId
            );

        specialRow.appendChild(
            seat
        );
    }


    seatsContainer.appendChild(
        specialRow
    );


    /* =================================================
       NORMAL ROWS
    ================================================= */

    for (
        let row = 1;
        row <= ROWS;
        row++
    ) {

        const rowElement =
            document.createElement("div");

        rowElement.className =
            "seat-row";


        /* ---------------------------------------------
           LEFT SIDE - 5
        --------------------------------------------- */

        for (
            let number = 1;
            number <= LEFT_SEATS;
            number++
        ) {

            const seatId =
                `${row}-${number}`;

            rowElement.appendChild(
                createSeat(
                    seatId,
                    number
                )
            );
        }


        /* ---------------------------------------------
           AISLE
        --------------------------------------------- */

        const aisle =
            document.createElement("div");

        aisle.className =
            "aisle";

        rowElement.appendChild(
            aisle
        );


        /* ---------------------------------------------
           RIGHT SIDE - 6
        --------------------------------------------- */

        for (
            let number = 1;
            number <= RIGHT_SEATS;
            number++
        ) {

            const seatNumber =
                LEFT_SEATS + number;

            const seatId =
                `${row}-${seatNumber}`;

            rowElement.appendChild(
                createSeat(
                    seatId,
                    seatNumber
                )
            );
        }


        seatsContainer.appendChild(
            rowElement
        );
    }
}


/* =====================================================
   CREATE SPECIAL SEAT
===================================================== */

function createSpecialSeat(seatId) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "seat reserved";

    button.textContent =
        seatId;

    button.disabled = true;

    button.title =
        "خاص بالآباء الكهنة";

    return button;
}


/* =====================================================
   CREATE NORMAL SEAT
===================================================== */

function createSeat(seatId, label) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "seat";

    button.textContent =
        label;

    button.dataset.seat =
        seatId;


    /* ---------------------------------------------
       RESERVED
    --------------------------------------------- */

    if (
        reservedSeats.includes(seatId)
    ) {

        button.classList.add(
            "reserved"
        );

        button.disabled = true;

        return button;
    }


    /* ---------------------------------------------
       SELECTED
    --------------------------------------------- */

    if (
        selectedSeats.includes(seatId)
    ) {

        button.classList.add(
            "selected"
        );
    }


    /* ---------------------------------------------
       CLICK
    --------------------------------------------- */

    button.addEventListener(
        "click",
        () => {

            toggleSeat(
                seatId,
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
    seatId,
    button
) {

    const index =
        selectedSeats.indexOf(
            seatId
        );


    /* ---------------------------------------------
       REMOVE
    --------------------------------------------- */

    if (index !== -1) {

        selectedSeats.splice(
            index,
            1
        );

        button.classList.remove(
            "selected"
        );

        updateSelectedText();

        return;
    }


    /* ---------------------------------------------
       MAXIMUM 2
    --------------------------------------------- */

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


    /* ---------------------------------------------
       ADD
    --------------------------------------------- */

    selectedSeats.push(
        seatId
    );

    button.classList.add(
        "selected"
    );

    updateSelectedText();
}


/* =====================================================
   UPDATE SELECTED SEATS
===================================================== */

function updateSelectedText() {

    if (
        !selectedSeatText
    ) {
        return;
    }


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
   LOAD RESERVED SEATS
===================================================== */

async function loadReservedSeats() {

    try {

        const data =
            await supabaseRequest(
                "bookings?select=seat"
            );


        reservedSeats =
            Array.isArray(data)
                ? data
                    .map(
                        row => String(row.seat)
                    )
                    .filter(Boolean)
                : [];


        createSeats();


    } catch (error) {

        console.error(
            "Supabase Error:",
            error
        );


        /*
           حتى لو Supabase فيه مشكلة
           الكراسي تظهر عادي
        */

        createSeats();


        showMessage(
            "تعذر تحميل الحجوزات من قاعدة البيانات.",
            false
        );
    }
}


/* =====================================================
   BOOK BUTTON
===================================================== */

if (bookButton) {

    bookButton.addEventListener(
        "click",
        bookSeats
    );
}


/* =====================================================
   BOOK SEATS
===================================================== */

async function bookSeats() {

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const phone =
        phoneInput
            ? phoneInput.value.trim()
            : "";


    /* ---------------------------------------------
       CHECK SEATS
    --------------------------------------------- */

    if (
        selectedSeats.length === 0
    ) {

        showMessage(
            "من فضلك اختر مقعدًا أولًا.",
            false
        );

        return;
    }


    /* ---------------------------------------------
       CHECK NAME
    --------------------------------------------- */

    if (!name) {

        showMessage(
            "من فضلك اكتب الاسم.",
            false
        );

        if (nameInput) {
            nameInput.focus();
        }

        return;
    }


    /* ---------------------------------------------
       CHECK PHONE
    --------------------------------------------- */

    if (!phone) {

        showMessage(
            "من فضلك اكتب رقم الهاتف.",
            false
        );

        if (phoneInput) {
            phoneInput.focus();
        }

        return;
    }


    const cleanPhone =
        phone.replace(
            /[\s\-()+]/g,
            ""
        );


    if (
        cleanPhone.length < 8
    ) {

        showMessage(
            "من فضلك اكتب رقم هاتف صحيح.",
            false
        );

        if (phoneInput) {
            phoneInput.focus();
        }

        return;
    }


    /* ---------------------------------------------
       BUTTON
    --------------------------------------------- */

    bookButton.disabled = true;

    bookButton.textContent =
        "جاري الحجز...";


    try {

        /* =========================================
           GET CURRENT BOOKINGS
        ========================================= */

        const latest =
            await supabaseRequest(
                "bookings?select=seat"
            );


        const latestReserved =
            Array.isArray(latest)
                ? latest.map(
                    row => String(row.seat)
                )
                : [];


        /* =========================================
           CHECK CONFLICT
        ========================================= */

        const conflicts =
            selectedSeats.filter(
                seat =>
                    latestReserved.includes(
                        seat
                    )
            );


        if (
            conflicts.length > 0
        ) {

            reservedSeats =
                latestReserved;


            selectedSeats =
                selectedSeats.filter(
                    seat =>
                        !conflicts.includes(
                            seat
                        )
                );


            createSeats();

            updateSelectedText();


            throw new Error(
                `المقاعد ${conflicts.join(" ، ")} تم حجزها بالفعل.`
            );
        }


        /* =========================================
           INSERT
        ========================================= */

        const rows =
            selectedSeats.map(
                seat => ({
                    name: name,
                    phone: cleanPhone,
                    seat: seat
                })
            );


        await supabaseRequest(
            "bookings",
            {
                method: "POST",

                headers: {
                    "Prefer":
                        "return=minimal"
                },

                body:
                    JSON.stringify(
                        rows
                    )
            }
        );


        /* =========================================
           SAVE BOOKED SEATS
        ========================================= */

        const bookedSeats =
            [...selectedSeats];


        reservedSeats.push(
            ...bookedSeats
        );


        /* =========================================
           CLEAR
        ========================================= */

        selectedSeats = [];


        createSeats();

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


    } catch (error) {

        console.error(
            "Booking Error:",
            error
        );


        showMessage(
            error.message ||
            "حدث خطأ أثناء الحجز.",
            false
        );


    } finally {

        bookButton.disabled =
            false;

        bookButton.textContent =
            "تأكيد الحجز";
    }
}


/* =====================================================
   DRAW INVITATION
===================================================== */

function drawInvitation(
    name,
    seats
) {

    if (
        !invitationCanvas
    ) {
        return;
    }


    const ctx =
        invitationCanvas.getContext(
            "2d"
        );


    const W =
        invitationCanvas.width;

    const H =
        invitationCanvas.height;


    /* ---------------------------------------------
       BACKGROUND
    --------------------------------------------- */

    const bg =
        ctx.createLinearGradient(
            0,
            0,
            W,
            H
        );


    bg.addColorStop(
        0,
        "#f1e2c8"
    );


    bg.addColorStop(
        0.5,
        "#fffaf0"
    );


    bg.addColorStop(
        1,
        "#e4cda6"
    );


    ctx.fillStyle =
        bg;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* ---------------------------------------------
       BORDER
    --------------------------------------------- */

    ctx.strokeStyle =
        "#967344";

    ctx.lineWidth =
        12;

    ctx.strokeRect(
        45,
        45,
        W - 90,
        H - 90
    );


    ctx.strokeStyle =
        "#c5a66f";

    ctx.lineWidth =
        3;

    ctx.strokeRect(
        70,
        70,
        W - 140,
        H - 140
    );


    /* ---------------------------------------------
       TITLE
    --------------------------------------------- */

    centerText(
        ctx,
        "✦ دعــــوة خــــاصــــة ✦",
        W / 2,
        240,
        "bold 54px Arial",
        "#72532d"
    );


    centerText(
        ctx,
        "تتشرف",
        W / 2,
        370,
        "bold 42px Arial",
        "#4b3a29"
    );


    centerText(
        ctx,
        "أسرتي أبطال الإيمان وأسرة شهيدات",
        W / 2,
        470,
        "bold 46px Arial",
        "#8a6335"
    );


    centerText(
        ctx,
        "بدعوة سيادتكم لحضور",
        W / 2,
        600,
        "38px Arial",
        "#4b3a29"
    );


    centerText(
        ctx,
        "حفل ختام الأنشطة",
        W / 2,
        705,
        "bold 66px Arial",
        "#72532d"
    );


    /* ---------------------------------------------
       DIVIDER
    --------------------------------------------- */

    ctx.strokeStyle =
        "#b28b57";

    ctx.lineWidth =
        4;

    ctx.beginPath();

    ctx.moveTo(
        W / 2 - 280,
        790
    );

    ctx.lineTo(
        W / 2 + 280,
        790
    );

    ctx.stroke();


    /* ---------------------------------------------
       DATE
    --------------------------------------------- */

    centerText(
        ctx,
        "يوم الثلاثاء الموافق",
        W / 2,
        890,
        "34px Arial",
        "#4b3a29"
    );


    centerText(
        ctx,
        "1 سبتمبر 2026",
        W / 2,
        970,
        "bold 52px Arial",
        "#8a6335"
    );


    /* ---------------------------------------------
       TIME
    --------------------------------------------- */

    centerText(
        ctx,
        "في تمام الساعة السادسة مساءً",
        W / 2,
        1070,
        "bold 38px Arial",
        "#4b3a29"
    );


    /* ---------------------------------------------
       LOCATION
    --------------------------------------------- */

    centerText(
        ctx,
        "بمسرح كنيسة السيدة العذراء مريم",
        W / 2,
        1170,
        "bold 39px Arial",
        "#72532d"
    );


    centerText(
        ctx,
        "والبابا كيرلس السادس بأغاخان",
        W / 2,
        1240,
        "bold 38px Arial",
        "#72532d"
    );


    /* ---------------------------------------------
       NAME BOX
    --------------------------------------------- */

    roundedBox(
        ctx,
        120,
        1380,
        W - 240,
        200,
        30,
        "#fffaf0",
        "#b28b57"
    );


    centerText(
        ctx,
        "اسم المدعو",
        W / 2,
        1440,
        "30px Arial",
        "#72532d"
    );


    centerText(
        ctx,
        name,
        W / 2,
        1525,
        "bold 48px Arial",
        "#3e3021"
    );


    /* ---------------------------------------------
       SEATS
    --------------------------------------------- */

    roundedBox(
        ctx,
        120,
        1620,
        W - 240,
        155,
        30,
        "#72532d",
        "#72532d"
    );


    centerText(
        ctx,
        `المقاعد: ${seats.join(" ، ")}`,
        W / 2,
        1698,
        "bold 42px Arial",
        "#ffffff"
    );


    /* ---------------------------------------------
       FOOTER
    --------------------------------------------- */

    centerText(
        ctx,
        "نتمنى لكم وقتًا ممتعًا ومباركًا ❤️",
        W / 2,
        1825,
        "bold 29px Arial",
        "#72532d"
    );


    /* ---------------------------------------------
       SHOW INVITATION
    --------------------------------------------- */

    if (
        invitationSection
    ) {

        invitationSection.style.display =
            "block";


        invitationSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* =====================================================
   CENTER TEXT
===================================================== */

function centerText(
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

function roundedBox(
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

if (downloadInvitation) {

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
                    "Download Error:",
                    error
                );


                alert(
                    "حدث خطأ أثناء تحميل الدعوة."
                );
            }
        }
    );
}


/* =====================================================
   START
===================================================== */

/*
   أولًا نرسم الكراسي فورًا.
   بعد ذلك نحمل الحجوزات من Supabase.
*/

createSeats();

loadReservedSeats();

updateSelectedText();
```
