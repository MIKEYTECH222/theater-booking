const seats = document.querySelectorAll(".seat");
const selectedSeatText = document.getElementById("selectedSeat");
const bookButton = document.getElementById("bookButton");

let selectedSeat = null;

seats.forEach((seat) => {

    seat.addEventListener("click", () => {

        // لو الكرسي محجوز
        if (seat.classList.contains("reserved")) {
            return;
        }

        // إلغاء الاختيار القديم
        seats.forEach((s) => {
            s.classList.remove("selected");
        });

        // اختيار الكرسي الجديد
        seat.classList.add("selected");

        selectedSeat = seat.dataset.seat;

        selectedSeatText.textContent =
            `أنت اخترت المقعد ${selectedSeat}`;
    });

});


bookButton.addEventListener("click", () => {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!selectedSeat) {
        alert("من فضلك اختر مقعدًا أولًا.");
        return;
    }

    if (!name) {
        alert("من فضلك اكتب اسمك.");
        return;
    }

    if (!phone) {
        alert("من فضلك اكتب رقم الهاتف.");
        return;
    }

    alert(
        `تم اختيار المقعد ${selectedSeat}\n\n` +
        `الاسم: ${name}\n` +
        `الهاتف: ${phone}`
    );

});
