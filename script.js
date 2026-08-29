// ============================================
// SETTINGS
// ============================================

// عدد الصفوف
// أنت زودت صف → 10 صفوف
const ROWS = 11;

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


        // إضافة الصف بالكامل
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

                    // لو الكرسي محجوز
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
                                (item) =>
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

                        // أقصى اختيار في الحجز الواحد
                        if (
                            selectedSeats.length >= 2
                        ) {

                            alert(
                                "مسموح باختيار كرسيين فقط."
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

function createInvitation(name, bookedSeats) {

    if (!invitationCanvas) {
        return;
    }

    const ctx = invitationCanvas.getContext("2d");

    const width = invitationCanvas.width;
    const height = invitationCanvas.height;

    // تنظيف الكانفس
    ctx.clearRect(0, 0, width, height);

    // ========================================
    // الخلفية - كحلي غامق يفتح تدريجيًا
    // ========================================

    const background = ctx.createLinearGradient(
        0,
        0,
        0,
        height
    );

    background.addColorStop(0, "#07152e");
    background.addColorStop(0.28, "#102b52");
    background.addColorStop(0.58, "#27527d");
    background.addColorStop(0.82, "#6f9dbd");
    background.addColorStop(1, "#d9edf7");

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);


    // ========================================
    // زخارف ناعمة
    // ========================================

    ctx.globalAlpha = 0.16;

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(
        100,
        130,
        110,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
        980,
        330,
        170,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.beginPath();
    ctx.arc(
        920,
        1660,
        150,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.globalAlpha = 1;


    // ========================================
    // إعداد النص
    // ========================================

    ctx.textAlign = "center";


    // ========================================
    // اسم الأسرة
    // ========================================

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 52px Arial";

    ctx.fillText(
        "أسرة السمائيين",
        width / 2,
        180
    );


    // ========================================
    // العنوان الرئيسي
    // ========================================

    ctx.font = "bold 105px Arial";

    ctx.fillText(
        "دعــــوة",
        width / 2,
        360
    );


    // ========================================
    // الخط تحت العنوان
    // ========================================

    ctx.fillStyle = "#dbeafe";

    ctx.fillRect(
        270,
        400,
        540,
        4
    );


    // ========================================
    // نص الدعوة
    // ========================================

    ctx.fillStyle = "#ffffff";

    ctx.font = "42px Arial";

    ctx.fillText(
        "تتشرف أسرتي",
        width / 2,
        540
    );

    ctx.font = "bold 48px Arial";

    ctx.fillText(
        "أبطال الإيمان وأسرة شهيدات",
        width / 2,
        615
    );

    ctx.font = "42px Arial";

    ctx.fillText(
        "بدعوة سيادتكم لحضور",
        width / 2,
        700
    );

    ctx.font = "bold 54px Arial";

    ctx.fillText(
        "حفل ختام الأنشطة",
        width / 2,
        780
    );


    // ========================================
    // الاسم
    // ========================================

    ctx.fillStyle = "#dbeafe";

    ctx.font = "34px Arial";

    ctx.fillText(
        "السيد / ة",
        width / 2,
        905
    );


    let displayName = name || "";

    if (displayName.length > 22) {
        displayName =
            displayName.substring(0, 22) + "...";
    }


    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 64px Arial";

    ctx.fillText(
        displayName,
        width / 2,
        990
    );


    // ========================================
    // بطاقة المقاعد
    // ========================================

    ctx.fillStyle = "rgba(255,255,255,0.16)";

    ctx.beginPath();

    ctx.roundRect(
        120,
        1060,
        width - 240,
        220,
        35
    );

    ctx.fill();


    ctx.strokeStyle = "rgba(255,255,255,0.35)";

    ctx.lineWidth = 3;

    ctx.stroke();


    // عنوان المقاعد
    ctx.fillStyle = "#dbeafe";

    ctx.font = "34px Arial";

    ctx.fillText(
        "رقم / أرقام المقاعد",
        width / 2,
        1130
    );


    // المقاعد
    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 60px Arial";

    ctx.fillText(
        bookedSeats.join(" • "),
        width / 2,
        1225
    );


    // ========================================
    // التاريخ والوقت
    // ========================================

    ctx.fillStyle = "#ffffff";

    ctx.font = "39px Arial";

    ctx.fillText(
        "الثلاثاء الموافق 1 سبتمبر 2026",
        width / 2,
        1390
    );

    ctx.fillText(
        "في تمام الساعة السادسة مساءً",
        width / 2,
        1460
    );


    // ========================================
    // المكان
    // ========================================

    ctx.font = "34px Arial";

    ctx.fillText(
        "بمسرح كنيسة السيدة العذراء مريم",
        width / 2,
        1570
    );

    ctx.fillText(
        "والبابا كيرلس السادس - باكوس",
        width / 2,
        1630
    );


    // ========================================
    // الختام
    // ========================================

    ctx.fillStyle = "#e0f2fe";

    ctx.font = "bold 44px Arial";

    ctx.fillText(
        "في انتظار تشريفكم ❤️",
        width / 2,
        1760
    );


    // ========================================
    // Footer
    // ========================================

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 34px Arial";

    ctx.fillText(
        "أسرة السمائيين",
        width / 2,
        1850
    );
}    // ==================================
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
            // VALIDATION
            // =================================

            if (
                selectedSeats.length === 0
            ) {

                alert(
                    "من فضلك اختر كرسيًا واحدًا على الأقل."
                );

                return;
            }


            if (
                selectedSeats.length > 2
            ) {

                alert(
                    "مسموح بكرسيين فقط لكل رقم هاتف."
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


            // =================================
            // LOADING
            // =================================

            bookButton.disabled =
                true;

            bookButton.textContent =
                "جاري الحجز...";


            try {

                // =================================
                // CALL book_seats RPC
                // =================================

                const response =
                    await fetch(
                        SUPABASE_URL +
                        "/rest/v1/rpc/book_seats",
                        {
                            method: "POST",

                            headers: {
                                "apikey":
                                    SUPABASE_KEY,

                                "Authorization":
                                    "Bearer " +
                                    SUPABASE_KEY,

                                "Content-Type":
                                    "application/json"
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


                // قراءة الرد
                const resultText =
                    await response.text();


                console.log(
                    "Supabase status:",
                    response.status
                );

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


                    // حد الهاتف
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


                    // كرسي محجوز
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


                        selectedSeats = [];


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


                    // لا يوجد كراسي
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


                    // أي خطأ آخر
                    console.error(
                        "Supabase booking error:",
                        resultText
                    );


                    alert(
                        "حصل خطأ من Supabase:\n\n" +
                        resultText
                    );

                    return;
                }


                // =================================
                // SUCCESS
                // =================================

                const bookedSeats =
                    [...selectedSeats];


                // تحويل الكراسي إلى محجوزة
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


                // إنشاء الدعوة
                createInvitation(
                    name,
                    bookedSeats
                );


                // إظهار الدعوة
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


                // تصفير الاختيار
                selectedSeats = [];


                // مسح البيانات
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

                console.error(
                    "Booking error:",
                    error
                );

                alert(
                    "حصل خطأ أثناء الحجز:\n\n" +
                    error.message
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
