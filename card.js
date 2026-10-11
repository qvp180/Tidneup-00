const cards = document.querySelectorAll(".card");

let activeCard = null;
let isAutoScrolling = false;
let scrollTimer = null;

// ปิดการ์ดที่กำลังขยาย
function closeExpandedCard() {
    if (!activeCard) return;

    activeCard.classList.remove("expanded");
    activeCard.setAttribute("aria-expanded", "false");

    activeCard = null;
}

// เปิดหรือปิดการ์ด
function toggleCard(card) {

    // ถ้ากดการ์ดที่เปิดอยู่แล้ว ให้ปิด
    if (activeCard === card) {
        closeExpandedCard();
        return;
    }

    // ถ้ามีการ์ดอื่นเปิดอยู่ จะไม่เปิดใบใหม่
    if (activeCard !== null) {
        return;
    }

    // เปิดการ์ดที่เลือก
    activeCard = card;
    card.classList.add("expanded");
    card.setAttribute("aria-expanded", "true");

    // เลื่อนหน้าจอไปยังการ์ดที่เปิด
    isAutoScrolling = true;

    clearTimeout(scrollTimer);

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    // ปลดสถานะเลื่อนอัตโนมัติ
    scrollTimer = setTimeout(() => {
        isAutoScrolling = false;
    }, 1000);
}

// ตั้งค่าการคลิกการ์ดแต่ละใบ
cards.forEach((card) => {

    card.addEventListener("click", (event) => {

        // หากคลิกลิงก์ ให้เปิดหน้าเว็บตามปกติ
        if (event.target.closest("a")) {
            return;
        }

        toggleCard(card);
    });

    // รองรับการกด Enter และ Space บนคีย์บอร์ด
    card.addEventListener("keydown", (event) => {

        if (
            (event.key === "Enter" || event.key === " ") &&
            !event.target.closest("a")
        ) {
            event.preventDefault();
            toggleCard(card);
        }
    });
});

// เลื่อนด้วยล้อเมาส์แล้วปิดการ์ด
window.addEventListener("wheel", () => {

    if (isAutoScrolling) return;

    closeExpandedCard();

}, { passive: true });

// ปัดหน้าจอมือถือแล้วปิดการ์ด
window.addEventListener("touchmove", () => {

    if (isAutoScrolling) return;

    closeExpandedCard();

}, { passive: true });

// เลื่อนหน้าจอด้วยคีย์บอร์ดแล้วปิดการ์ด
window.addEventListener("keydown", (event) => {

    const scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " "
    ];

    // ไม่ปิดการ์ดหากกำลังพิมพ์ในช่องกรอกข้อความ
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (scrollKeys.includes(event.key)) {

        // Space ใช้คลิกการ์ดได้ จึงปล่อยให้ตัวจัดการการ์ดทำงาน
        if (event.key === " ") return;

        closeExpandedCard();
    }
});

