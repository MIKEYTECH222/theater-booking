```javascript
/* =====================================================
   SUPABASE
===================================================== */

// حط بيانات Supabase بتاعت مشروعك هنا
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =====================================================
   SETTINGS
===================================================== */

// 11 صف × 8 كراسي = 88 كرسي
const TOTAL_ROWS = 11;
const SEATS_PER_ROW = 8;

// أقصى عدد كراسي لنفس رقم الهاتف
const MAX_SEATS_PER_PHONE = 2;


/* =====================================================
   VARIABLES
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

const invitationSection =
    document.getElementById("invitationSection");

const invitationCanvas =
    document.getElementById("invitationCanvas");

const downloadInvitation =
    document.getElementById("downloadInvitation");


let selectedSeats = [];

let reservedSeats = new Set();

let lastBooking = null;


/* =====================================================
   CREATE NORMAL SEATS
===================================================== */

function createSeats() {

    seatsContainer.innerHTML = "";

    let seatNumber = 1;

    for (let row = 0; row < TOTAL_ROWS; row++) {

        const rowElement =
            document.createElement("div");

        rowElement.className = "seat-row";


        // أول 4 كراسي
        for (let i = 0; i < 4; i++) {

            createSeat(
                rowElement,
                `A${seatNumber}`
            );

            seatNumber++;
        }


        // الممر
        const aisle =
            document.createElement("div");

        aisle.className = "aisle";

        rowElement.appendChild(aisle);


        // آخر 4 كراسي
        for (let i = 0; i < 4; i++) {

            createSeat(
                rowElement,
                `A${seatNumber}`
            );

            seatNumber++;
        }


        seatsContainer.appendChild(rowElement);
    }
}


/* =====================================================
   CREATE SEAT
===================================================== */

function createSeat(rowElement, seatId) {

    const seat =
        document.createElement("div");

    seat.className = "seat";

    seat.dataset.seat = seatId;

    seat.textContent = seatId;

    seat.addEventListener(
        "click",
        () => toggleSeat(seat)
    );

    rowElement.appendChild(seat);
}


/* =====================================================
   SELECT / UNSELECT
===================================================== */

function toggleSeat(seat) {

    const seatId =
        seat.dataset.seat;


    // محجوز
    if (
        reservedSeats.has(seatId) ||
        seat.classList.contains("reserved")
    ) {
        return;
    }


    // لو مختار بالفعل
    if (
        selectedSeats.includes(seatId)
    ) {

        selectedSeats =
            selectedSeats.filter(
                id => id !== seatId
            );

        seat.classList.remove("selected");

        updateSelectedText();

        return;
    }


    // الحد الأقصى
    if (
        selectedSeats.length >=
        MAX_SEATS_PER_PHONE
    ) {

        alert(
            "مسموح بحجز كرسيين فقط لكل رقم هاتف."
        );

        return;
    }


    selectedSeats.push(seatId);

    seat.classList.add("selected");

    updateSelectedText();
}


/* =====================================================
   UPDATE SELECTED TEXT
===================================================== */

function updateSelectedText() {

    if (selectedSeats.length === 0) {

        selectedSeatText.textContent =
            "لم يتم اختيار أي مقعد";

        return;
    }


    selectedSeatText.textContent =
        "المقاعد المختارة: " +
        selectedSeats.join(" - ");
}


/* =====================================================
   LOAD RESERVED SEATS
===================================================== */

async function loadReservedSeats() {

    try {

        /*
           مهم:

           غيّر اسم الجدول هنا لو جدولك في Supabase
           اسمه مختلف.

           المفروض يكون عندك عمود اسمه seat.
        */

        const { data, error } =
            await supabaseClient
                .from("bookings")
                .select("seat");


        if (error) {
            console.error(error);

            alert(
                "حصل خطأ أثناء تحميل الحجوزات."
            );

            return;
        }


        reservedSeats.clear();


        data.forEach(booking => {

            if (booking.seat) {

                reservedSeats.add(
                    booking.seat
                );
            }
        });


        updateReservedUI();

    } catch (error) {

        console.error(error);
    }
}


/* =====================================================
   UPDATE RESERVED UI
===================================================== */

function updateReservedUI() {

    const allSeats =
        document.querySelectorAll(".seat");


    allSeats.forEach(seat => {

        const id =
            seat.dataset.seat;


        if (
            reservedSeats.has(id)
        ) {

            seat.classList.remove("selected");

            seat.classList.add("reserved");

            seat.title = "محجوز";

        } else {

            seat.classList.remove("reserved");

            seat.title = "متاح";
        }
    });


    selectedSeats =
        selectedSeats.filter(
            id => !reservedSeats.has(id)
        );

    updateSelectedText();
}


/* =====================================================
   CHECK PHONE BOOKINGS
===================================================== */

async function checkPhoneBookings(phone) {

    const { data, error } =
        await supabaseClient
            .from("bookings")
            .select("seat")
            .eq("phone", phone);


    if (error) {

        console.error(error);

        throw error;
    }


    return data || [];
}


/* =====================================================
   BOOK
===================================================== */

bookButton.addEventListener(
    "click",
    async () => {

        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();


        // الاسم
        if (!name) {

            alert("اكتب الاسم أولاً.");

            nameInput.focus();

            return;
        }


        // الهاتف
        if (!phone) {

            alert("اكتب رقم الهاتف.");

            phoneInput.focus();

            return;
        }


        // الكراسي
        if (selectedSeats.length === 0) {

            alert(
                "اختار كرسي واحد على الأقل."
            );

            return;
        }


        if (
            selectedSeats.length >
            MAX_SEATS_PER_PHONE
        ) {

            alert(
                "الحد الأقصى كرسيان لكل رقم هاتف."
            );

            return;
        }


        bookButton.disabled = true;

        bookButton.textContent =
            "جاري الحجز...";


        try {

            /*
              نتحقق من عدد الحجوزات القديمة
              لنفس رقم الهاتف.
            */

            const oldBookings =
                await checkPhoneBookings(phone);


            if (
                oldBookings.length +
                selectedSeats.length >
                MAX_SEATS_PER_PHONE
            ) {

                alert(
                    "رقم الهاتف ده وصل للحد الأقصى وهو كرسيان."
                );

                return;
            }


            /*
              نتأكد إن الكراسي لسه متاحة
              قبل الإدخال.
            */

            const { data: currentBookings, error } =
                await supabaseClient
                    .from("bookings")
                    .select("seat")
                    .in("seat", selectedSeats);


            if (error) {
                throw error;
            }


            if (
                currentBookings &&
                currentBookings.length > 0
            ) {

                const alreadyTaken =
                    currentBookings.map(
                        booking => booking.seat
                    );


                alert(
                    "للأسف كرسي أو أكثر اتاخد بالفعل: " +
                    alreadyTaken.join(" - ")
                );


                await loadReservedSeats();

                return;
            }


            /*
              تجهيز بيانات الحجز
            */

            const bookings =
                selectedSeats.map(seat => ({
                    name: name,
                    phone: phone,
                    seat: seat
                }));


            /*
              إدخال الحجز في Supabase
            */

            const { data, error: insertError } =
                await supabaseClient
                    .from("bookings")
                    .insert(bookings)
                    .select();


            if (insertError) {

                throw insertError;
            }


            /*
              نجاح الحجز
            */

            lastBooking = {
                name: name,
                phone: phone,
                seats: selectedSeats.slice()
            };


            // تحديث الكراسي
            selectedSeats.forEach(id => {

                reservedSeats.add(id);
            });


            updateReservedUI();


            // إنشاء الدعوة
            createInvitation(lastBooking);


            invitationSection.classList.add(
                "show"
            );


            invitationSection.scrollIntoView({
                behavior: "smooth"
            });


            alert(
                "تم الحجز بنجاح 🎉"
            );


        } catch (error) {

            console.error(error);

            alert(
                "حصل خطأ أثناء الحجز. راجع Supabase."
            );

        } finally {

            bookButton.disabled = false;

            bookButton.textContent =
                "تأكيد الحجز";
        }
    }
);


/* =====================================================
   CREATE INVITATION
===================================================== */

function createInvitation(booking) {

    const canvas =
        invitationCanvas;

    const ctx =
        canvas.getContext("2d");


    const width =
        canvas.width;

    const height =
        canvas.height;


    // Background
    ctx.fillStyle =
        "#101827";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // Main title
    ctx.fillStyle =
        "#ffffff";

    ctx.textAlign =
        "center";

    ctx.font =
        "bold 80px Arial";

    ctx.fillText(
        "أسرة السمائيين",
        width / 2,
        350
    );


    // Subtitle
    ctx.font =
        "bold 50px Arial";

    ctx.fillStyle =
        "#facc15";

    ctx.fillText(
        "حفلة نهاية الأنشطة",
        width / 2,
        450
    );


    // Name
    ctx.fillStyle =
        "#ffffff";

    ctx.font =
        "bold 55px Arial";

    ctx.fillText(
        "الاسم",
        width / 2,
        750
    );


    ctx.font =
        "bold 70px Arial";

    ctx.fillText(
        booking.name,
        width / 2,
        850
    );


    // Seats
    ctx.font =
        "bold 50px Arial";

    ctx.fillStyle =
        "#facc15";

    ctx.fillText(
        "المقاعد",
        width / 2,
        1050
    );


    ctx.font =
        "bold 65px Arial";

    ctx.fillText(
        booking.seats.join(" - "),
        width / 2,
        1150
    );


    // Footer
    ctx.fillStyle =
        "#cbd5e1";

    ctx.font =
        "40px Arial";

    ctx.fillText(
        "نتمنى لكم وقتًا سعيدًا ❤️",
        width / 2,
        1450
    );
}


/* =====================================================
   DOWNLOAD INVITATION
===================================================== */

downloadInvitation.addEventListener(
    "click",
    () => {

        const link =
            document.createElement("a");

        link.download =
            "invitation.png";

        link.href =
            invitationCanvas.toDataURL(
                "image/png"
            );

        link.click();
    }
);


/* =====================================================
   START
===================================================== */

createSeats();

loadReservedSeats();
```
