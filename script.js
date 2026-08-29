```javascript
/* ==================================================
   SETTINGS
================================================== */

const ROWS = 9;
const LEFT_SEATS = 5;
const RIGHT_SEATS = 6;

const MAX_SELECTED_SEATS = 2;


/* ==================================================
   ELEMENTS
================================================== */

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


/* ==================================================
   STATE
================================================== */

let selectedSeats = [];

let reservedSeats = [];


/* ==================================================
   CREATE SEATS
================================================== */

function createSeats() {

    seatsContainer.innerHTML = "";

    for (let row = 1; row <= ROWS; row++) {

        const rowElement =
            document.createElement("div");

        rowElement.className =
            "seat-row";


        /* =========================
           LEFT SIDE
        ========================== */

        for (
            let seat = 1;
            seat <= LEFT_SEATS;
            seat++
        ) {

            const seatNumber =
                `${row}-${seat}`;

            rowElement.appendChild(
                createSeat(
                    seatNumber,
                    row,
                    seat
                )
            );
        }


        /* =========================
           CENTER AISLE
        ========================== */

        const aisle =
            document.createElement("div");

        aisle.className = "aisle";

        rowElement.appendChild(aisle);


        /* =========================
           RIGHT SIDE
        ========================== */

        for (
            let seat = 1;
            seat <= RIGHT_SEATS;
            seat++
        ) {

            const seatNumber =
                `${row}-${seat + LEFT_SEATS}`;

            rowElement.appendChild(
                createSeat(
                    seatNumber,
                    row,
                    seat + LEFT_SEATS
                )
            );
        }


        seatsContainer.appendChild(
            rowElement
        );
    }
}


/* ==================================================
   CREATE ONE SEAT
================================================== */

function createSeat(
    seatNumber,
    row,
    number
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className = "seat available";

    button.textContent = number;

    button.dataset.seat =
        seatNumber;


    /* =========================
       RESERVED
    ========================== */

    if (
        reservedSeats.includes(
            seatNumber
        )
    ) {

        button.className =
            "seat reserved";

        button.disabled = true;

        return button;
    }


    /* =========================
       CLICK
    ========================== */

    button.addEventListener(
        "click",
        () => selectSeat(
            seatNumber,
            button
        )
    );

    return button;
}


/* ==================================================
   SELECT SEAT
================================================== */

function selectSeat(
    seatNumber,
    button
) {

    const index =
        selectedSeats.indexOf(
            seatNumber
        );


    /* =========================
       REMOVE SEAT
    ========================== */

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


    /* =========================
       MAX SEATS
    ========================== */

    if (
        selectedSeats.length >=
        MAX_SELECTED_SEATS
    ) {

        showMessage(
            "مسموح بحجز مقعدين فقط.",
            "error"
        );

        return;
    }


    /* =========================
       ADD SEAT
    ========================== */

    selectedSeats.push(
        seatNumber
    );

    button.classList.add(
        "selected"
    );

    updateSelectedText();
}


/* ==================================================
   UPDATE SELECTED TEXT
================================================== */

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


/* ==================================================
   BOOKING
================================================== */

bookButton.addEventListener(
    "click",
    () => {

        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();


        /* =========================
           VALIDATION
        ========================== */

        if (
            selectedSeats.length === 0
        ) {

            showMessage(
                "من فضلك اختر مقعدًا أولًا.",
                "error"
            );

            return;
        }


        if (!name) {

            showMessage(
                "من فضلك اكتب الاسم.",
                "error"
            );

            nameInput.focus();

            return;
        }


        if (!phone) {

            showMessage(
                "من فضلك اكتب رقم الهاتف.",
                "error"
            );

            phoneInput.focus();

            return;
        }


        /* =========================
           DEMO BOOKING
        ========================== */

        reservedSeats.push(
            ...selectedSeats
        );


        const bookedSeats =
            [...selectedSeats];


        showMessage(
            "تم الحجز بنجاح 🎉",
            "success"
        );


        createSeats();


        /* =========================
           DRAW INVITATION
        ========================== */

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


        selectedSeats = [];

        updateSelectedText();

    }
);


/* ==================================================
   DRAW INVITATION
================================================== */

function drawInvitation(
    name,
    seats
) {

    const canvas =
        invitationCanvas;

    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width;

    const height =
        canvas.height;


    /* =========================
       BACKGROUND
    ========================== */

    const background =
        ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

    background.addColorStop(
        0,
        "#f7efe1"
    );

    background.addColorStop(
        0.5,
        "#fffaf2"
    );

    background.addColorStop(
        1,
        "#ead9bd"
    );


    ctx.fillStyle =
        background;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* =========================
       OUTER BORDER
    ========================== */

    ctx.strokeStyle =
        "#9a7848";

    ctx.lineWidth = 12;

    ctx.strokeRect(
        45,
        45,
        width - 90,
        height - 90
    );


    ctx.strokeStyle =
        "#c5a66f";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        65,
        65,
        width - 130,
        height - 130
    );


    /* =========================
       DECORATIVE CIRCLES
    ========================== */

    drawCircle(
        ctx,
        120,
        150,
        55,
        "#c5a66f"
    );

    drawCircle(
        ctx,
        width - 120,
        150,
        55,
        "#c5a66f"
    );

    drawCircle(
        ctx,
        120,
        height - 150,
        55,
        "#c5a66f"
    );

    drawCircle(
        ctx,
        width - 120,
        height - 150,
        55,
        "#c5a66f"
    );


    /* =========================
       TOP
    ========================== */

    drawCenteredText(
        ctx,
        "✦ دعــــوة خــــاصــــة ✦",
        width / 2,
        260,
        "bold 54px Arial",
        "#75552f"
    );


    drawCenteredText(
        ctx,
        "تتشرف",
        width / 2,
        380,
        "bold 42px Arial",
        "#4c3a28"
    );


    /* =========================
       FAMILY NAME
    ========================== */

    drawCenteredText(
        ctx,
        "أسرتي أبطال الإيمان وأسرة شهيدات",
        width / 2,
        475,
        "bold 52px Arial",
        "#8b6335"
    );


    /* =========================
       INVITATION TEXT
    ========================== */

    drawCenteredText(
        ctx,
        "بدعوة سيادتكم لحضور",
        width / 2,
        620,
        "38px Arial",
        "#4c3a28"
    );


    drawCenteredText(
        ctx,
        "حفل ختام الأنشطة",
        width / 2,
        715,
        "bold 68px Arial",
        "#75552f"
    );


    /* =========================
       DIVIDER
    ========================== */

    drawDivider(
        ctx,
        width / 2,
        790
    );


    /* =========================
       DATE
    ========================== */

    drawCenteredText(
        ctx,
        "يوم الثلاثاء الموافق",
        width / 2,
        900,
        "34px Arial",
        "#4c3a28"
    );


    drawCenteredText(
        ctx,
        "1 سبتمبر 2026",
        width / 2,
        980,
        "bold 52px Arial",
        "#8b6335"
    );


    /* =========================
       TIME
    ========================== */

    drawCenteredText(
        ctx,
        "في تمام الساعة السادسة مساءً",
        width / 2,
        1080,
        "bold 38px Arial",
        "#4c3a28"
    );


    /* =========================
       LOCATION
    ========================== */

    drawCenteredText(
        ctx,
        "بمسرح",
        width / 2,
        1190,
        "34px Arial",
        "#4c3a28"
    );


    drawCenteredText(
        ctx,
        "كنيسة السيدة العذراء مريم",
        width / 2,
        1260,
        "bold 43px Arial",
        "#75552f"
    );


    drawCenteredText(
        ctx,
        "والبابا كيرلس السادس بأغاخان",
        width / 2,
        1325,
        "bold 39px Arial",
        "#75552f"
    );


    /* =========================
       GUEST NAME BOX
    ========================== */

    roundRect(
        ctx,
        120,
        1410,
        width - 240,
        190,
        30,
        "#fffaf2",
        "#b08a54",
        5
    );


    drawCenteredText(
        ctx,
        "اسم المدعو",
        width / 2,
        1470,
        "30px Arial",
        "#75552f"
    );


    drawCenteredText(
        ctx,
        name,
        width / 2,
        1545,
        "bold 48px Arial",
        "#3e3021"
    );


    /* =========================
       SEATS BOX
    ========================== */

    roundRect(
        ctx,
        120,
        1640,
        width - 240,
        145,
        30,
        "#75552f",
        "#75552f",
        0
    );


    drawCenteredText(
        ctx,
        `المقاعد: ${seats.join(" ، ")}`,
        width / 2,
        1730,
        "bold 42px Arial",
        "#ffffff"
    );


    /* =========================
       FOOTER
    ========================== */

    drawCenteredText(
        ctx,
        "نتمنى لكم وقتًا ممتعًا ومباركًا ❤️",
        width / 2,
        1830,
        "bold 29px Arial",
        "#75552f"
    );
}


/* ==================================================
   DRAW CIRCLE
================================================== */

function drawCircle(
    ctx,
    x,
    y,
    radius,
    color
) {

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        color;

    ctx.globalAlpha =
        0.15;

    ctx.fill();

    ctx.globalAlpha =
        1;
}


/* ==================================================
   CENTERED TEXT
================================================== */

function drawCenteredText(
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


/* ==================================================
   DIVIDER
================================================== */

function drawDivider(
    ctx,
    x,
    y
) {

    ctx.strokeStyle =
        "#b08a54";

    ctx.lineWidth =
        4;

    ctx.beginPath();

    ctx.moveTo(
        x - 300,
        y
    );

    ctx.lineTo(
        x + 300,
        y
    );

    ctx.stroke();

    drawCircle(
        ctx,
        x,
        y,
        10,
        "#b08a54"
    );
}


/* ==================================================
   ROUND RECTANGLE
================================================== */

function roundRect(
    ctx,
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke,
    lineWidth
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


    if (fill) {

        ctx.fillStyle =
            fill;

        ctx.fill();
    }


    if (stroke && lineWidth > 0) {

        ctx.strokeStyle =
            stroke;

        ctx.lineWidth =
            lineWidth;

        ctx.stroke();
    }
}


/* ==================================================
   DOWNLOAD INVITATION
================================================== */

downloadInvitation.addEventListener(
    "click",
    () => {

        try {

            const image =
                invitationCanvas.toDataURL(
                    "image/png"
                );


            const link =
                document.createElement("a");

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
                error
            );

            alert(
                "حصل خطأ أثناء تحميل الدعوة."
            );
        }
    }
);


/* ==================================================
   MESSAGE
================================================== */

function showMessage(
    message,
    type
) {

    bookingMessage.textContent =
        message;

    if (type === "error") {

        bookingMessage.style.color =
            "#d32f2f";

    } else {

        bookingMessage.style.color =
            "#2e7d32";
    }
}


/* ==================================================
   START
================================================== */

createSeats();
```
