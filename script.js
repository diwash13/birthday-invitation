/* ==========================================================
   CONFIGURATION
========================================================== */

const CONFIG = {
  child: {
    name: "Kairav",
    age: 2,
  },

  gallery: {
    totalImages: 18,
    initialImages: 8,
  },

  event: {
    date: new Date("2026-10-25T12:00:00"),

    end: new Date("2026-10-25T16:00:00"),

    address: "15 Lansing Drive",

    city: "Nashua, NH",

    mapsUrl: "https://maps.google.com/?q=15+Lansing+Drive+Nashua+NH",
  },

  rsvp: {
    endpoint:
      "https://script.google.com/macros/s/AKfycbyYNzki3zxp_W5YLx5j_fMxJgwgegmQIJ-gZHGjLLNTxnmeD5ooCcYqAJSdCPRwvijFiw/exec",
  },
};

/* ==========================================================
   DOM CACHE
========================================================== */

const DOM = {};

function cacheDOM() {
  (DOM.days = document.getElementById("days")),
    (DOM.hours = document.getElementById("hours")),
    (DOM.minutes = document.getElementById("minutes")),
    (DOM.seconds = document.getElementById("seconds")),
    (DOM.eventDate = document.getElementById("event-date")),
    (DOM.eventTime = document.getElementById("event-time")),
    (DOM.eventAddress = document.getElementById("event-address")),
    (DOM.mapsLink = document.getElementById("maps-link")),
    (DOM.mapFrame = document.getElementById("map-frame")),
    (DOM.gallery = document.getElementById("gallery-grid")),
    (DOM.form = document.getElementById("rsvp-form"));

  DOM.comingYes = document.getElementById("coming-yes");
  DOM.comingNo = document.getElementById("coming-no");
}

/* ==========================================================
   INIT
========================================================== */

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheDOM();

  populateEventDetails();

  setupMap();

  startCountdown();

  buildGallery();

  bindEvents();

  // revealElements();
}

/* ==========================================================
   EVENTS
========================================================== */

function bindEvents() {
  DOM.comingYes.addEventListener("click", () => submitRSVP("Yes"));

  DOM.comingNo.addEventListener("click", () => submitRSVP("No"));
}

/* ==========================================================
   EVENT DETAILS
========================================================== */

function populateEventDetails() {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  DOM.eventDate.textContent = CONFIG.event.date.toLocaleDateString(
    "en-US",
    options
  );

  DOM.eventTime.textContent = "12:00 PM – 4:00 PM";

  DOM.eventAddress.innerHTML = `
        ${CONFIG.event.address}<br>
        ${CONFIG.event.city}
    `;

  DOM.mapsLink.href = CONFIG.event.mapsUrl;
}

/* ==========================================================
   COUNTDOWN
========================================================== */

function startCountdown() {
  updateCountdown();

  setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  const now = new Date();

  const distance = CONFIG.event.date - now;

  if (distance <= 0) {
    DOM.days.textContent = "00";
    DOM.hours.textContent = "00";
    DOM.minutes.textContent = "00";
    DOM.seconds.textContent = "00";

    return;
  }

  const seconds = Math.floor(distance / 1000);

  const days = Math.floor(seconds / 86400);

  const hours = Math.floor((seconds % 86400) / 3600);

  const minutes = Math.floor((seconds % 3600) / 60);

  const remainingSeconds = seconds % 60;

  DOM.days.textContent = pad(days);

  DOM.hours.textContent = pad(hours);

  DOM.minutes.textContent = pad(minutes);

  DOM.seconds.textContent = pad(remainingSeconds);
}

function pad(number) {
  return number.toString().padStart(2, "0");
}

/* ==========================================================
   GOOGLE MAP
========================================================== */

function setupMap() {
  DOM.mapFrame.innerHTML = `

        <iframe

            src="https://www.google.com/maps?q=15+Lansing+Drive+Nashua+NH&output=embed"

            loading="lazy"

            allowfullscreen

            referrerpolicy="no-referrer-when-downgrade">

        </iframe>

    `;
}

/* ==========================================================
   GALLERY
========================================================== */

const GALLERY = {
  images: [],
  visibleImages: [],
  showingAll: false,

  captions: [
    "Happy Moments ❤️",

    "Too Cute 🥰",

    "Growing Up Fast 🌱",

    "Little Explorer 🚜",

    "Making Memories 📸",

    "Our Little Sunshine ☀️",

    "Adventure Time 🌈",

    "Our Favorite Boy 💙",

    "Birthday Memories 🎈",

    "Smiles Everywhere 😊",
  ],
};
function getInitialGalleryCount() {
  return window.innerWidth < 768 ? 6 : 8;
}
GALLERY.visibleImages = GALLERY.images.slice(0, getInitialGalleryCount());

function buildGallery() {
  GALLERY.images = [];

  for (let i = 1; i <= CONFIG.gallery.totalImages; i++) {
    GALLERY.images.push(`images/gallery/${i}.jpg`);
  }

  shuffleArray(GALLERY.images);

  GALLERY.visibleImages = GALLERY.images.slice(0, CONFIG.gallery.initialImages);

  renderGallery();

  const showMore = document.getElementById("show-more");

  showMore.addEventListener("click", toggleGallery);
}

function renderGallery() {
  DOM.gallery.innerHTML = "";

  GALLERY.visibleImages.forEach((image, index) => {
    const card = document.createElement("article");

    card.className = "gallery__item reveal";

    const img = document.createElement("img");

    img.src = image;

    img.alt = `Kairav photo ${index + 1}`;

    img.loading = "lazy";

    img.dataset.index = index;

    const caption = document.createElement("div");

    caption.className = "gallery__caption";

    caption.textContent = randomCaption();

    card.appendChild(img);

    card.appendChild(caption);

    DOM.gallery.appendChild(card);
  });
}

/* ==========================================================
   SHOW MORE
========================================================== */

function toggleGallery() {
  const button = document.getElementById("show-more");

  if (!GALLERY.showingAll) {
    GALLERY.visibleImages = [...GALLERY.images];

    button.textContent = "📸 Show Fewer";
  } else {
    GALLERY.visibleImages = GALLERY.images.slice(
      0,
      CONFIG.gallery.initialImages
    );

    button.textContent = "📸 See More Memories";
  }

  GALLERY.showingAll = !GALLERY.showingAll;

  renderGallery();

  revealElements();
}

/* ==========================================================
   HELPERS
========================================================== */

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomCaption() {
  return GALLERY.captions[Math.floor(Math.random() * GALLERY.captions.length)];
}

/* ==========================================================
   RSVP
========================================================== */

async function submitRSVP(attending) {
  const payload = {
    name: document.getElementById("name").value.trim(),

    adults: Number(document.getElementById("adults").value),

    kids: Number(document.getElementById("kids").value),

    coming: attending,

    foodRestrictions: document.getElementById("food").value.trim(),

    message: document.getElementById("message").value.trim(),
  };

  if (!payload.name) {
    alert("Please enter your name.");

    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await fetch(CONFIG.rsvp.endpoint, {
      method: "POST",
      body: formData,
    });

    const text = await response.text();

    const result = JSON.parse(text);

    if (result.success) {
      showSuccess(attending);
    } else {
      throw new Error();
    }
  } catch (error) {
    alert("Something went wrong. Please try again.");
  }

  setLoading(false);
}

/* ==========================================================
   LOADING
========================================================== */

function setLoading(isLoading) {
  DOM.comingYes.disabled = isLoading;

  DOM.comingNo.disabled = isLoading;

  if (isLoading) {
    DOM.comingYes.innerHTML = "⏳ Sending RSVP...";

    DOM.comingNo.disabled = true;
  } else {
    DOM.comingYes.innerHTML = "🎈 Wackadoo! We'll Be There!";

    DOM.comingNo.innerHTML = "💙 Oh Biscuits... We'll Miss the Fun!";

    DOM.comingYes.disabled = false;

    DOM.comingNo.disabled = false;
  }
}

/* ==========================================================
   SUCCESS
========================================================== */

function showSuccess(attending) {
  const message =
    attending === "Yes"
      ? `
                <h3>🎉 Hooray!</h3>

                <p>

                    Thanks for letting us know!

                    We can't wait to celebrate
                    with you!

                </p>
            `
      : `
                <h3>💙 Thanks!</h3>

                <p>

                    We'll miss you,
                    but thanks for letting us know!

                </p>
            `;

  DOM.form.innerHTML = `<div class="rsvp-success">

            ${message}

        </div>`;
}
