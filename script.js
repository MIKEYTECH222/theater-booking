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

    for (
        let row = 1;
        row <= ROWS;
        row++
    ) {

        const rowElement =
            document.createElement("div");

        rowElement.className =
            "seat-row";


        /* LEFT */

        for (
            let seat = 1;
            seat <= LEFT_SEATS;
            seat++
        ) {

            const number = seat;

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
            document.createElement("div");

        aisle.className =
            "aisle";

        rowElement.appendChild(
            aisle
        );


        /* RIGHT */

        for (
            let seat = 1;
            seat <= RIGHT_SEATS;
            seat++
        ) {

            const number =
                LEFT_SEATS + seat;

            const seatId =
                `${row}-${number}`;

            rowElement.appendChild(
                createSeat(
                    seatId,
                    number
                )
            );
        }


        seatsContainer.appendChild(
            rowElement
        );
    }
}


/* ==================================================
   CREATE SEAT
================================================== */

function createSeat(
    seatId,
    number
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "seat";


    button.textContent =
        number;


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


/* ==================================================
   TOGGLE SEAT
================================================== */

function toggleSeat(
    seatId,
    button
) {

    const index =
        selectedSeats.indexOf(
            seatId
        );


    /* REMOVE */

    if (index !== -1) {

        selectedSeats.splice(
            index,
            1
        );

        button.classList.remove(
            "selected"
        );

        updateSelectedSeats();

        return;
    }


    /* MAX */

    if (
        selectedSeats.length >=
        MAX_SELECTED_SEATS
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

    updateSelectedSeats();
}


/* ==================================================
   UPDATE SELECTED
================================================== */

function updateSelectedSeats() {

    if (
        selectedSeats.length === 0
    ) {

        selectedSeatText.textContent =
            "لم يتم اختيار أي مقعد";

        return;
    }


    selectedSeatText.textContent =
        "المقاعد المختارة: " +
        selectedSeats.join(" ، ");
}


/* ==================================================
   BOOK
================================================== */

bookButton.addEventListener(
    "click",
    function () {

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


        /* SAVE SEATS */

        const bookedSeats =
            [...selectedSeats];


        reservedSeats.push(
            ...bookedSeats
        );


        /* MESSAGE */

        showMessage(
            "تم الحجز بنجاح 🎉",
            true
        );


        /* REDRAW */

        createSeats();


        /* DRAW INVITATION */

        drawInvitation(
            name,
            bookedSeats
        );


        invitationSection.style.display =
            "block";


        invitationSection.scrollIntoView({
            behavior: "smooth"
        });


        /* CLEAR */

        selectedSeats = [];

        updateSelectedSeats();
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


    /* BACKGROUND */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            width,
            height
        );

    gradient.addColorStop(
        0,
        "#f7efe1"
    );

    gradient.addColorStop(
        0.5,
        "#fffaf2"
    );

    gradient.addColorStop(
        1,
        "#ead9bd"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* BORDER */

    ctx.strokeStyle =
        "#9a7848";

    ctx.lineWidth =
        12;

    ctx.strokeRect(
        45,
        45,
        width - 90,
        height - 90
    );


    ctx.strokeStyle =
        "#c5a66f";

    ctx.lineWidth =
        3;

    ctx.strokeRect(
        65,
        65,
        width - 130,
        height - 130
    );


    /* TITLE */

    centeredText(
        ctx,
        "✦ دعــــوة خــــاصــــة ✦",
        width / 2,
        250,
        "bold 54px Arial",
        "#75552f"
    );


    centeredText(
        ctx,
        "تتشرف",
        width / 2,
        370,
        "bold 42px Arial",
        "#4c3a28"
    );


    /* FAMILY */

    centeredText(
        ctx,
        "أسرتي أبطال الإيمان وأسرة شهيدات",
        width / 2,
        470,
        "bold 50px Arial",
        "#8b6335"
    );


    /* INVITATION */

    centeredText(
        ctx,
        "بدعوة سيادتكم لحضور",
        width / 2,
        610,
        "38px Arial",
        "#4c3a28"
    );


    centeredText(
        ctx,
        "حفل ختام الأنشطة",
        width / 2,
        710,
        "bold 68px Arial",
        "#75552f"
    );


    /* DIVIDER */

    ctx.strokeStyle =
        "#b08a54";

    ctx.lineWidth =
        4;

    ctx.beginPath();

    ctx.moveTo(
        width / 2 - 300,
        790
    );

    ctx.lineTo(
        width / 2 + 300,
        790
    );

    ctx.stroke();


    /* DATE */

    centeredText(
        ctx,
        "يوم الثلاثاء الموافق",
        width / 2,
        900,
        "34px Arial",
        "#4c3a28"
    );

    centeredText(
        ctx,
        "1 سبتمبر 2026",
        width / 2,
        980,
        "bold 52px Arial",
        "#8b6335"
    );


    /* TIME */

    centeredText(
        ctx,
        "في تمام الساعة السادسة مساءً",
        width / 2,
        1080,
        "bold 38px Arial",
        "#4c3a28"
    );


    /* LOCATION */

    centeredText(
        ctx,
        "بمسرح",
        width / 2,
        1180,
        "34px Arial",
        "#4c3a28"
    );

    centeredText(
        ctx,
        "كنيسة السيدة العذراء مريم",
        width / 2,
        1250,
        "bold 43px Arial",
        "#75552f"
    );

    centeredText(
        ctx,
        "والبابا كيرلس السادس بأغاخان",
        width / 2,
        1320,
        "bold 39px Arial",
        "#75552f"
    );


    /* NAME BOX */

    roundedBox(
        ctx,
        120,
        1400,
        width - 240,
        190,
        30,
        "#fffaf2",
        "#b08a54"
    );


    centeredText(
        ctx,
        "اسم المدعو",
        width / 2,
        1460,
        "30px Arial",
        "#75552f"
    );


    centeredText(
        ctx,
        name,
        width / 2,
        1535,
        "bold 48px Arial",
        "#3e3021"
    );


    /* SEATS BOX */

    roundedBox(
        ctx,
        120,
        1630,
        width - 240,
        145,
        30,
        "#75552f",
        "#75552f"
    );


    centeredText(
        ctx,
        "المقاعد: " +
        seats.join(" ، "),
        width / 2,
        1705,
        "bold 42px Arial",
        "#ffffff"
    );


    /* FOOTER */

    centeredText(
        ctx,
        "نتمنى لكم وقتًا ممتعًا ومباركًا ❤️",
        width / 2,
        1825,
        "bold 29px Arial",
        "#75552f"
    );
}


/* ==================================================
   CENTER TEXT
================================================== */

function centeredText(
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
   ROUNDED BOX
================================================== */

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


/* ==================================================
   DOWNLOAD
================================================== */

downloadInvitation.addEventListener(
    "click",
    function () {

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
    }
);


/* ==================================================
   MESSAGE
================================================== */

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


/* ==================================================
   START
================================================== */

createSeats();
```
