// ============================================
// 1. SUPABASE CONFIGURATION
// ============================================
// ضع بيانات Supabase الخاصة بك هنا عند الربط
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

let supabaseClient = null;

// التحقق من وجود مفاتيح Supabase بشكل صحيح
if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && typeof supabase !== "undefined") {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ============================================
// 2. STATE & CONFIGURATION
// ============================================
const TOTAL_ROWS = 12; // عدد الصفوف (من A إلى L)
const SEATS_PER_ROW = 10; // 5 يمين و 5 شمال
const LOCKED_SEATS = ["A1", "A2", "A3", "A4", "A5"]; // مقاعد الآباء الكهنة/الضيوف

let selectedSeats = [];
let reservedSeats = [];

// DOM Elements
const seatsContainer = document.getElementById("seatsContainer");
const selectedSeatText = document.getElementById("selectedSeat");
const userNameInput = document.getElementById("userName");
const userPhoneInput = document.getElementById("userPhone");
const bookButton = document.getElementById("bookButton");
const invitationSection = document.getElementById("invitationSection");
const invitationCanvas = document.getElementById("invitationCanvas");
const downloadBtn = document.getElementById("downloadInvitation");

// ============================================
// 3. GENERATE & LOAD SEATS
// ============================================
async function initSeats() {
    // حاول جلب الكراسي من Supabase إذا كانت المفاتيح موجودة
    if (supabaseClient) {
        await fetchReservedSeats();
    }
    // رسم الكراسي فوراً وبشكل مضمون
    renderSeats();
}

async function fetchReservedSeats() {
    try {
        const { data, error } = await supabaseClient
            .from("bookings")
            .select("seat_number");

        if (error) throw error;
        reservedSeats = data ? data.map(b => b.seat_number) : [];
    } catch (err) {
        console.warn("تنبيه: لم يتم الجلب من Supabase (تأكد من إعداد المفاتيح والجدول):", err.message);
    }
}

function renderSeats() {
    if (!seatsContainer) return;
    seatsContainer.innerHTML = "";
    
    const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    for (let i = 0; i < TOTAL_ROWS; i++) {
        const rowLetter = rowLetters[i];
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");

        for (let j = 1; j <= SEATS_PER_ROW; j++) {
            // الممر الأوسط
            if (j === 6) {
                const aisle = document.createElement("div");
                aisle.classList.add("aisle");
                rowDiv.appendChild(aisle);
            }

            const seatId = `${rowLetter}${j}`;
            const seatBtn = document.createElement("button");
            seatBtn.classList.add("seat");
            seatBtn.innerText = seatId;
            seatBtn.dataset.seat = seatId;

            // تحديد حالة المقعد
            if (LOCKED_SEATS.includes(seatId)) {
                seatBtn.classList.add("locked");
                seatBtn.disabled = true;
            } else if (reservedSeats.includes(seatId)) {
                seatBtn.classList.add("reserved");
                seatBtn.disabled = true;
            } else {
                seatBtn.addEventListener("click", () => toggleSeatSelection(seatId, seatBtn));
            }

            rowDiv.appendChild(seatBtn);
        }
        seatsContainer.appendChild(rowDiv);
    }
}

// ============================================
// 4. SEAT SELECTION & FORM VALIDATION
// ============================================
function toggleSeatSelection(seatId, seatBtn) {
    if (selectedSeats.includes(seatId)) {
        selectedSeats = selectedSeats.filter(id => id !== seatId);
        seatBtn.classList.remove("selected");
    } else {
        selectedSeats.push(seatId);
        seatBtn.classList.add("selected");
    }

    updateUI();
}

function updateUI() {
    if (selectedSeats.length > 0) {
        selectedSeatText.innerText = `المقاعد المحددة: ${selectedSeats.join(" ، ")}`;
    } else {
        selectedSeatText.innerText = "لم يتم اختيار أي مقعد بعد";
    }

    validateForm();
}

function validateForm() {
    const isNameValid = userNameInput.value.trim().length >= 3;
    const isPhoneValid = userPhoneInput.value.trim().length >= 10;
    const hasSeats = selectedSeats.length > 0;

    bookButton.disabled = !(isNameValid && isPhoneValid && hasSeats);
}

userNameInput.addEventListener("input", validateForm);
userPhoneInput.addEventListener("input", validateForm);

// ============================================
// 5. BOOKING SUBMISSION
// ============================================
bookButton.addEventListener("click", async () => {
    const name = userNameInput.value.trim();
    const phone = userPhoneInput.value.trim();

    if (!name || !phone || selectedSeats.length === 0) return;

    bookButton.disabled = true;
    bookButton.innerText = "جاري الحجز...";

    if (supabaseClient) {
        try {
            const insertData = selectedSeats.map(seat => ({
                user_name: name,
                user_phone: phone,
                seat_number: seat
            }));

            const { error } = await supabaseClient.from("bookings").insert(insertData);
            if (error) throw error;
        } catch (err) {
            alert("حدث خطأ أثناء الحجز في قاعدة البيانات.");
            console.error(err);
            bookButton.innerText = "تأكيد الحجز";
            bookButton.disabled = false;
            return;
        }
    }

    // نجاح الحجز وإنشاء الدعوة
    createInvitationCard(name, selectedSeats);
    
    invitationSection.style.display = "block";
    invitationSection.scrollIntoView({ behavior: "smooth" });

    // إعادة تهيئة
    reservedSeats.push(...selectedSeats);
    selectedSeats = [];
    renderSeats();
    userNameInput.value = "";
    userPhoneInput.value = "";
    selectedSeatText.innerText = "تم الحجز بنجاح!";
    bookButton.innerText = "تأكيد الحجز";
});

// ============================================
// 6. GENERATE INVITATION ON CANVAS
// ============================================
function createInvitationCard(name, seats) {
    if (!invitationCanvas) return;
    const ctx = invitationCanvas.getContext("2d");

    const bgImage = new Image();
    bgImage.src = "Artboard 1.png"; // تأكد من وجود ملف الصورة بنفس الاسم

    bgImage.onload = () => {
        invitationCanvas.width = bgImage.width;
        invitationCanvas.height = bgImage.height;

        const w = invitationCanvas.width;
        const h = invitationCanvas.height;

        // رسم خلفية الدعوة
        ctx.drawImage(bgImage, 0, 0, w, h);

        // إضافة صندوق البيانات السفلي
        const boxWidth = w * 0.82;
        const boxHeight = 180;
        const boxX = (w - boxWidth) / 2;
        const boxY = h - 230;

        ctx.fillStyle = "rgba(10, 15, 30, 0.88)";
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
            ctx.fill();
        } else {
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        }

        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 4;
        ctx.stroke();

        // الاسم
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 42px Tahoma, Arial";
        let displayName = "الاسم: " + name;
        if (displayName.length > 32) displayName = displayName.substring(0, 32) + "...";
        ctx.fillText(displayName, w / 2, boxY + 65);

        // المقاعد
        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 46px Tahoma, Arial";
        ctx.fillText("المقاعد المحجوزة: " + seats.join(" - "), w / 2, boxY + 135);
    };
}

// ============================================
// 7. DOWNLOAD INVITATION IMAGE
// ============================================
downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `دعوة_حضور.png`;
    link.href = invitationCanvas.toDataURL("image/png");
    link.click();
});

// بدء التشغيل
initSeats();
