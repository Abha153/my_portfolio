// ---- UFO scroll journey ----
const ufo = document.getElementById('ufo-wrap');
const beam = document.getElementById('ufo-beam');
const doc = document.documentElement;

function updateUFO() {
  if (!ufo || !beam) return;

  const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
  const pct = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
  const vw = window.innerWidth;
  const margin = Math.min(140, vw * 0.12);
  const x = margin + (vw - margin * 2) * (0.5 + 0.5 * Math.sin(pct * Math.PI * 2.4));
  const viewportY = 60 + Math.sin(pct * Math.PI * 3) * 40;
  const rotate = Math.sin(pct * Math.PI * 2.4) * 10 - 4;

  ufo.style.transform = `translate(${x}px, ${viewportY}px) rotate(${rotate}deg)`;
  const beamStrength = Math.max(0, (pct - 0.85) / 0.15);
  beam.style.height = `${beamStrength * 220}px`;
}

window.addEventListener('scroll', updateUFO, { passive: true });
window.addEventListener('resize', updateUFO);
updateUFO();

// ---- Footer year ----
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ---- Dark / light mode ----
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
      themeBtn.textContent = '☀️';
    }
  } catch (error) {
    // Theme toggling still works when browser storage is unavailable.
  }

  themeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (error) {
      // Ignore storage restrictions; the active page theme has still changed.
    }
  });
}

// ---- CropWise modal (safe to skip when the modal isn't on this page) ----
const cropwiseDemoBtn = document.getElementById('cropwise-demo-btn');
const cropwiseModal = document.getElementById('cropwise-modal');
const cropwiseClose = document.getElementById('cropwise-close');
const cropwiseVideo = document.getElementById('cropwise-video');
const cropwiseBackdrop = document.querySelector('.video-modal-backdrop');
const cropwiseVideoURL = 'https://www.youtube.com/embed/qdThTYtyWhY?autoplay=1&rel=0';

function openCropwiseDemo() {
  if (!cropwiseModal || !cropwiseVideo) return;
  cropwiseVideo.src = cropwiseVideoURL;
  cropwiseModal.classList.add('active');
  cropwiseModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeCropwiseDemo() {
  if (!cropwiseModal || !cropwiseVideo) return;
  cropwiseModal.classList.remove('active');
  cropwiseModal.setAttribute('aria-hidden', 'true');
  cropwiseVideo.src = '';
  document.body.style.overflow = '';
}

if (cropwiseDemoBtn) cropwiseDemoBtn.addEventListener('click', openCropwiseDemo);
if (cropwiseClose) cropwiseClose.addEventListener('click', closeCropwiseDemo);
if (cropwiseBackdrop) cropwiseBackdrop.addEventListener('click', closeCropwiseDemo);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cropwiseModal && cropwiseModal.classList.contains('active')) {
    closeCropwiseDemo();
  }
});

// ---- Pre-fill the enquiry form when a package CTA is selected ----
const serviceSelect = document.getElementById('service');
const messageField = document.getElementById('message');
document.querySelectorAll('.package-cta').forEach((link) => {
  link.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = 'Portfolio / Website';
    if (messageField && !messageField.value.trim()) {
      messageField.value = `I'm interested in the ${link.dataset.package} package. Please let me know the next steps.`;
    }
  });
});

// ---- Freelance enquiry form with visible success / error feedback ----
const freelanceForm = document.querySelector('.freelance-form');
const formStatus = document.getElementById('form-status');

if (freelanceForm && formStatus) {
  freelanceForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!freelanceForm.reportValidity()) return;

    const submitButton = freelanceForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }

    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending your enquiry…';

    try {
      const formData = Object.fromEntries(new FormData(freelanceForm).entries());
      const ajaxURL = freelanceForm.action.replace('https://formsubmit.co/', 'https://formsubmit.co/ajax/');
      const response = await fetch(ajaxURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      let result = {};
      try {
        result = await response.json();
      } catch (parseError) {
        result = {};
      }

      const successValue = result.success;
      const confirmed = response.ok && (successValue === true || successValue === 'true');
      if (!confirmed) {
        throw new Error(result.message || 'The form service did not confirm delivery.');
      }

      formStatus.classList.add('is-success');
      formStatus.textContent = 'Thanks — your enquiry was sent. I’ll review it and reply by email.';
      freelanceForm.reset();
    } catch (error) {
      formStatus.classList.add('is-error');
      formStatus.textContent = 'The form could not confirm sending. Please try again or email abha69528@gmail.com with your project details.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText || '→ Send Enquiry';
      }
    }
  });
}
