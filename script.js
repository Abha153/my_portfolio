
  // ---- UFO scroll journey ----
  const ufo = document.getElementById('ufo-wrap');
  const beam = document.getElementById('ufo-beam');
  const doc = document.documentElement;

  function updateUFO(){
    const scrollTop = window.scrollY;
    const scrollable = doc.scrollHeight - window.innerHeight;
    const pct = Math.min(Math.max(scrollTop / scrollable, 0), 1);

    // horizontal wander: sine wave across the page width
    const vw = window.innerWidth;
    const margin = Math.min(140, vw * 0.12);
    const x = margin + (vw - margin*2) * (0.5 + 0.5*Math.sin(pct * Math.PI * 2.4));

    // vertical: mostly follows scroll, but eased
    const y = 40 + pct * (document.body.scrollHeight * 0.0); // keep near top of viewport
    const viewportY = 60 + Math.sin(pct * Math.PI * 3) * 40;

    const rotate = Math.sin(pct * Math.PI * 2.4) * 10 - 4;

    ufo.style.transform = `translate(${x}px, ${viewportY}px) rotate(${rotate}deg)`;

    // beam grows near the bottom (contact/portal) section
    const beamStrength = Math.max(0, (pct - 0.85) / 0.15);
    beam.style.height = (beamStrength * 220) + 'px';
  }

  window.addEventListener('scroll', updateUFO, { passive:true });
  window.addEventListener('resize', updateUFO);
  updateUFO();


// ---------- Footer year ----------
const footerYear = document.getElementById("footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}
// ---------- Dark Mode ----------

const themeBtn = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }

});

/* =========================
   CROPWISE VIDEO MODAL
   ========================= */

const cropwiseDemoBtn = document.getElementById("cropwise-demo-btn");
const cropwiseModal = document.getElementById("cropwise-modal");
const cropwiseClose = document.getElementById("cropwise-close");
const cropwiseVideo = document.getElementById("cropwise-video");
const cropwiseBackdrop = document.querySelector(".video-modal-backdrop");

const cropwiseVideoURL =
    "https://www.youtube.com/embed/qdThTYtyWhY?autoplay=1&rel=0";

function openCropwiseDemo() {
    cropwiseVideo.src = cropwiseVideoURL;

    cropwiseModal.classList.add("active");
    cropwiseModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeCropwiseDemo() {
    cropwiseModal.classList.remove("active");
    cropwiseModal.setAttribute("aria-hidden", "true");

    // Stop the YouTube video when the modal closes
    cropwiseVideo.src = "";

    document.body.style.overflow = "";
}

if (cropwiseDemoBtn) {
    cropwiseDemoBtn.addEventListener("click", openCropwiseDemo);
}

if (cropwiseClose) {
    cropwiseClose.addEventListener("click", closeCropwiseDemo);
}

if (cropwiseBackdrop) {
    cropwiseBackdrop.addEventListener("click", closeCropwiseDemo);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cropwiseModal.classList.contains("active")) {
        closeCropwiseDemo();
    }
});