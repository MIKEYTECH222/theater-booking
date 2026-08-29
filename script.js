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

/*
   9 صفوف

   كل صف:
   5 كراسي | ممر | 6 كراسي

   = 11 كرسي في الصف

   9 × 11 = 99 كرسي
*/

const ROWS = 9;

const LEFT_SEATS = 5;

const RIGHT_SEATS = 6;

const MAX_SEATS = 2;


/*
   المنطقة الخاصة بالآباء الكهنة

   A1 إلى A11
*/

const SPECIAL_SEATS = [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "A6",
    "A7",
    "A8",
    "A9",
    "A10",
    "A11"
];


/* =====================================================
   VARIABLES
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
   SUPABASE REQUEST
===================================================== */

async function supabaseRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {
                ...options,

                headers: {

                    "apikey":
                        SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,

                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})
                }
            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();

        throw new Error(
            errorText ||
            `HTTP ${response.status}`
        );
    }


    if (
        response.status === 204
    ) {

        return null;
    }


    return response.json();
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
            data
                .map(
                    row => String(row.seat)
                )
                .filter(Boolean);


        createSeats();


    } catch (error) {

        console.error(
            "Supabase Error:",
            error
        );


        createSeats();


        showMessage(
            "حدث خطأ في تحميل الحجوزات من قاعدة البيانات.",
            false
        );
    }
}


/* =====================================================
   CREATE ALL SEATS
===================================================== */

function createSeats() {

    seatsContainer.innerHTML = "";


    /* ================================================
       SPECIAL AREA
    ================================================= */

    const specialTitle =
        document.createElement(
            "div"
        );

    specialTitle.className =
        "special-area";

    specialTitle.textContent =
        "🔒 خاص بالآباء الكهنة";


    seatsContainer.appendChild(
        specialTitle
    );


    const specialRow =
        document.createElement(
            "div"
        );

    specialRow.className =
        "seat-row";


    SPECIAL_SEATS.forEach(
        seatId => {

            specialRow.appendChild(
                createSeat(
                    seatId,
                    seatId
                )
            );

        }
    );


    seatsContainer.appendChild(
        specialRow
    );


    /* ================================================
       NORMAL SEATS
    ================================================= */

    for (
        let row = 1;
        row <= ROWS;
        row++
    ) {

        const rowElement =
            document.createElement(
                "div"
            );

        rowElement.className =
            "seat-row";


        /* LEFT */

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


        /* AISLE */

        const aisle =
            document.createElement(
                "div"
            );

        aisle.className =
            "aisle";

        rowElement.appendChild(
            aisle
        );


        /* RIGHT */

        for (
            let number = 1;
            number <= RIGHT_SEATS;
            number++
        ) {

            const actualNumber =
                LEFT_SEATS + number;


            const seatId =
                `${row}-${actualNumber}`;


            rowElement.appendChild(
                createSeat(
                    seatId,
                    actualNumber
                )
            );
        }


        seatsContainer.appendChild(
            rowElement
        );
    }
}


/* =====================================================
   CREATE ONE SEAT
===================================================== */

function createSeat(
    seatId,
    label
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
        label;


    button.dataset.seat =
        seatId;


    /* RESERVED */

    if (
        reservedSeats.includes(
            seatId
        )
    ) {

        button.classList.add(
            "reserved"
        );

        button.disabled = true;

        return button;
    }


    /*
       منطقة A ممنوعة للحجز
    */

    if (
        SPECIAL_SEATS.includes(
            seatId
        )
    ) {

        button.classList.add(
            "reserved"
        );

        button.disabled = true;

        return button;
    }


    /* SELECTED */

    if (
        selectedSeats.includes(
            seatId
        )
    ) {

        button.classList.add(
            "selected"
        );
    }


    button.addEventListener(
        "click",
        function () {

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


    /* REMOVE */

    if (
        index !== -1
    ) {

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
        seatId
    );


    button.classList.add(
        "selected"
    );


    updateSelectedText();
}


/* =====================================================
   UPDATE SELECTED SEATS TEXT
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


    const phone =
        phoneInput.value.trim();


    /* CHECK SEATS */

    if (
        selectedSeats.length === 0
    ) {

        showMessage(
            "من فضلك اختر مقعدًا أولًا.",
            false
        );

        return;
    }


    /* CHECK NAME */

    if (!name) {

        showMessage(
            "من فضلك اكتب الاسم.",
            false
        );

        nameInput.focus();

        return;
    }


    /* CHECK PHONE */

    if (!phone) {

        showMessage(
            "من فضلك اكتب رقم الهاتف.",
            false
        );

        phoneInput.focus();

        return;
    }


    /*
       السماح بالأرقام فقط تقريبًا
    */

    const cleanPhone =
        phone.replace(
            /[\s\-()]/g,
            ""
        );


    if (
        cleanPhone.length < 8
    ) {

        showMessage(
            "من فضلك اكتب رقم هاتف صحيح.",
            false
        );

        phoneInput.focus();

        return;
    }


    /* DISABLE */

    bookButton.disabled =
        true;

    bookButton.textContent =
        "جاري الحجز...";


    try {

        /* ============================================
           GET LATEST BOOKINGS
        ============================================ */

        const latest =
            await supabaseRequest(
                "bookings?select=seat"
            );


        const latestReserved =
            latest.map(
                item =>
                    String(item.seat)
            );


        /* ============================================
           CHECK CONFLICT
        ============================================ */

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


            createSeats();


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


        /* ============================================
           INSERT BOOKINGS
        ============================================ */

        const rows =
            selectedSeats.map(
                seat => ({

                    name:
                        name,

                    phone:
                        cleanPhone,

                    seat:
                        seat
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


        /* ============================================
           SAVE BOOKED SEATS
        ============================================ */

        const bookedSeats =
            [...selectedSeats];


        reservedSeats.push(
            ...bookedSeats
        );


        /* ============================================
           CLEAR SELECTION
        ============================================ */

        selectedSeats = [];


        createSeats();

        updateSelectedText();


        /* ============================================
           SUCCESS
        ============================================ */

        showMessage(
            "تم الحجز بنجاح 🎉",
            true
        );


        /* ============================================
           DRAW INVITATION
        ============================================ */

        drawInvitation(
            name,
            bookedSeats
        );


        invitationSection.style.display =
            "block";


        invitationSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


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


    /* BACKGROUND */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            W,
            H
        );


    gradient.addColorStop(
        0,
        "#f2e5cf"
    );


    gradient.addColorStop(
        0.5,
        "#fffaf1"
    );


    gradient.addColorStop(
        1,
        "#e5cfaa"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* OUTER BORDER */

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


    /* INNER BORDER */

    ctx.strokeStyle =
        "#c4a16a";


    ctx.lineWidth =
        3;


    ctx.strokeRect(
        70,
        70,
        W - 140,
        H - 140
    );


    /* TITLE */

    centerText(
        ctx,
        "✦ دعــــوة خــــاصــــة ✦",
        W / 2,
        245,
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
        "bold 48px Arial",
        "#8a6335"
    );


    centerText(
        ctx,
        "بدعوة سيادتكم لحضور",
        W / 2,
        605,
        "38px Arial",
        "#4b3a29"
    );


    centerText(
        ctx,
        "حفل ختام الأنشطة",
        W / 2,
        705,
        "bold 68px Arial",
        "#72532d"
    );


    /* LINE */

    ctx.strokeStyle =
        "#b28b57";

    ctx.lineWidth =
        4;


    ctx.beginPath();


    ctx.moveTo(
        W / 2 - 290,
        790
    );


    ctx.lineTo(
        W / 2 + 290,
        790
    );


    ctx.stroke();


    /* DATE */

    centerText(
        ctx,
        "يوم الثلاثاء الموافق",
        W / 2,
        900,
        "34px Arial",
        "#4b3a29"
    );


    centerText(
        ctx,
        "1 سبتمبر 2026",
        W / 2,
        980,
        "bold 52px Arial",
        "#8a6335"
    );


    /* TIME */

    centerText(
        ctx,
        "في تمام الساعة السادسة مساءً",
        W / 2,
        1080,
        "bold 38px Arial",
        "#4b3a29"
    );


    /* LOCATION */

    centerText(
        ctx,
        "بمسرح",
        W / 2,
        1180,
        "34px Arial",
        "#4b3a29"
    );


    centerText(
        ctx,
        "كنيسة السيدة العذراء مريم",
        W / 2,
        1250,
        "bold 43px Arial",
        "#72532d"
    );


    centerText(
        ctx,
        "والبابا كيرلس السادس بأغاخان",
        W / 2,
        1320,
        "bold 39px Arial",
        "#72532d"
    );


    /* NAME BOX */

    roundedBox(
        ctx,
        120,
        1390,
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
        1450,
        "30px Arial",
        "#72532d"
    );


    centerText(
        ctx,
        name,
        W / 2,
        1535,
        "bold 48px Arial",
        "#3e3021"
    );


    /* SEATS BOX */

    roundedBox(
        ctx,
        120,
        1630,
        W - 240,
        150,
        30,
        "#72532d",
        "#72532d"
    );


    centerText(
        ctx,
        `المقاعد: ${seats.join(" ، ")}`,
        W / 2,
        1705,
        "bold 42px Arial",
        "#ffffff"
    );


    /* FOOTER */

    centerText(
        ctx,
        "نتمنى لكم وقتًا ممتعًا ومباركًا ❤️",
        W / 2,
        1830,
        "bold 29px Arial",
        "#72532d"
    );
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

downloadInvitation.addEventListener(
    "click",
    function () {

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
    }
);


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    success
) {

    bookingMessage.textContent =
        message;


    bookingMessage.style.color =
        success
            ? "#2e7d32"
            : "#d32f2f";
}


/* =====================================================
   START
===================================================== */

createSeats();

loadReservedSeats();
```
