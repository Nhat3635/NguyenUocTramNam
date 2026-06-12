// 1. PHOTO CATEGORIES CONFIGURATION (Using Local Images for Instant Offline Loading)
const photoCategories = {
  truyenthong: {
    title: "Concept Truyền Thống Việt Nam",
    label: "Trang Phục Áo Dài Cổ Truyền",
    images: [
      "image/Truyền thống.png",
      "image/01.png",
      "image/Layer 1.png",
    ],
  },
  namky: {
    title: "Concept Nam Kỳ Cổ Điển",
    label: "Hồn xưa đất Nam Kỳ, Thập niên 60-70",
    images: [
      "image/Nam Kỳ.png",
      "image/5.png",
      "image/6.png",
    ],
  },
  retro: {
    title: "Concept Thập Niên 90-2000",
    label: "Ảnh Màu Film Nostalgia",
    images: [
      "image/90-2000.png",
      "image/7.png",
      "image/8.png",
    ],
  },
  hiendai: {
    title: "Concept Hiện Đại Tối Giản",
    label: "Phong cách Tây Âu Sang Trọng",
    images: [
      "image/Hiện Đại.png",
      "image/9.png",
      "image/Nhẫn.png",
    ],
  },
};

// 2. GLOBAL LIGHTBOX & PREVIEW FUNCTIONS (Defined at top-level for instant availability)
window.openCategory = function (catId) {
  const category = photoCategories[catId];
  if (!category) return;

  const lightbox = document.getElementById("album-lightbox");
  const lightboxLabel = document.getElementById("lightbox-label");
  const lightboxTitle = document.getElementById("lightbox-title");
  const photoGrid = document.getElementById("lightbox-photo-grid");
  const gridContainer = document.getElementById("lightbox-grid-container");

  if (!lightbox || !photoGrid) return;

  lightboxLabel.textContent = category.label;
  lightboxTitle.textContent = category.title;
  photoGrid.innerHTML = "";

  category.images.forEach((imgUrl) => {
    const itemWrapper = document.createElement("div");
    itemWrapper.className =
      "group relative aspect-[3/4.2] overflow-hidden rounded border border-gold-600/10 cursor-pointer shadow-md bg-stone-100 hover:shadow-xl hover:border-gold-500 transition-all duration-300";
    itemWrapper.onclick = () => window.previewFullPhoto(imgUrl);

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = "Wedding Photo";
    img.className =
      "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.98] group-hover:brightness-100";
    // Eager loading ensures images start loading immediately even inside hidden containers
    img.loading = "eager";

    const overlay = document.createElement("div");
    overlay.className =
      "absolute inset-0 bg-burgundy-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center";
    overlay.innerHTML = `
      <svg class="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
      </svg>
    `;

    itemWrapper.appendChild(img);
    itemWrapper.appendChild(overlay);
    photoGrid.appendChild(itemWrapper);
  });

  lightbox.classList.remove("hidden");
  setTimeout(() => {
    lightbox.classList.remove("opacity-0");
    lightbox.classList.add("opacity-100");
    if (gridContainer) {
      gridContainer.scrollTop = 0;
    }
  }, 50);
};

window.closeLightbox = function () {
  const lightbox = document.getElementById("album-lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("opacity-100");
  lightbox.classList.add("opacity-0");
  setTimeout(() => {
    lightbox.classList.add("hidden");
  }, 300);
};

window.previewFullPhoto = function (imgUrl) {
  const photoPreview = document.getElementById("photo-preview");
  const previewImage = document.getElementById("preview-image");

  if (!photoPreview || !previewImage) return;

  previewImage.src = imgUrl;
  photoPreview.classList.remove("hidden");
  setTimeout(() => {
    photoPreview.classList.remove("opacity-0");
    photoPreview.classList.add("opacity-100");
  }, 50);
};

window.closePhotoPreview = function () {
  const photoPreview = document.getElementById("photo-preview");
  const previewImage = document.getElementById("preview-image");

  if (!photoPreview || !previewImage) return;

  photoPreview.classList.remove("opacity-100");
  photoPreview.classList.add("opacity-0");
  setTimeout(() => {
    photoPreview.classList.add("hidden");
    previewImage.src = "";
  }, 300);
};

// 3. INITIALIZATION & SCROLL EVENT BINDINGS
document.addEventListener("DOMContentLoaded", () => {
  // Screens
  const screenEnvelope = document.getElementById("screen-envelope");
  const screenDetail = document.getElementById("screen-detail");
  const musicPlayerContainer = document.getElementById("music-player-container");

  // Envelope redirection/transition action
  const envelope = document.getElementById("envelope");
  const bottomText = document.getElementById("bottom-text");

  // Background Music Elements
  const bgMusic = document.getElementById("bg-music");
  const musicToggle = document.getElementById("music-toggle");
  const iconPlaying = document.getElementById("icon-playing");
  const iconPaused = document.getElementById("icon-paused");

  let isExplicitlyPaused = false;

  function playMusic() {
    if (!bgMusic || !musicToggle || !iconPlaying || !iconPaused) return;
    bgMusic.play()
      .then(() => {
        musicToggle.classList.add("playing");
        iconPlaying.classList.remove("hidden");
        iconPlaying.classList.add("block");
        iconPaused.classList.add("hidden");
        iconPaused.classList.remove("block");
      })
      .catch((err) => {
        console.log("Autoplay waiting for interaction...");
      });
  }

  function pauseMusic() {
    if (!bgMusic || !musicToggle || !iconPlaying || !iconPaused) return;
    bgMusic.pause();
    musicToggle.classList.remove("playing");
    iconPlaying.classList.add("hidden");
    iconPlaying.classList.remove("block");
    iconPaused.classList.remove("hidden");
    iconPaused.classList.add("block");
  }

  function toggleMusic() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      isExplicitlyPaused = false;
      playMusic();
    } else {
      isExplicitlyPaused = true;
      pauseMusic();
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // horizontal Slider scroll detection (Active Center Effect)
  const galleryContainer = document.getElementById("gallery-container");
  const cards = document.querySelectorAll(".gallery-card");
  const dotsContainer = document.getElementById("slider-dots");
  const dots = dotsContainer ? dotsContainer.children : [];

  function updateActiveCard() {
    if (!galleryContainer || cards.length === 0) return;

    const containerRect = galleryContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    cards.forEach((card, idx) => {
      if (card === closestCard) {
        card.classList.remove("scale-90", "opacity-40", "blur-[1px]", "border-gold-600/30");
        card.classList.add("scale-100", "sm:scale-105", "opacity-100", "blur-none", "border-gold-600", "shadow-2xl", "z-10");
        if (dots[idx]) {
          dots[idx].classList.remove("bg-burgundy-200/40", "transform", "scale-100");
          dots[idx].classList.add("bg-gold-400", "transform", "scale-125");
        }
      } else {
        card.classList.remove("scale-100", "sm:scale-105", "opacity-100", "blur-none", "border-gold-600", "shadow-2xl", "z-10");
        card.classList.add("scale-90", "opacity-40", "blur-[1px]", "border-gold-600/30");
        if (dots[idx]) {
          dots[idx].classList.remove("bg-gold-400", "transform", "scale-125");
          dots[idx].classList.add("bg-burgundy-200/40", "transform", "scale-100");
        }
      }
    });
  }

  if (galleryContainer) {
    galleryContainer.addEventListener("scroll", updateActiveCard);
  }

  window.scrollToCard = function (index) {
    const card = cards[index];
    if (!card || !galleryContainer) return;

    const cardCenterOffset = card.offsetLeft - galleryContainer.clientWidth / 2 + card.clientWidth / 2;
    galleryContainer.scrollTo({
      left: cardCenterOffset,
      behavior: "smooth",
    });
  };

  // Drag scrolling support
  let isDown = false;
  let startX;
  let scrollLeft;

  if (galleryContainer) {
    galleryContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      galleryContainer.classList.add("active");
      startX = e.pageX - galleryContainer.offsetLeft;
      scrollLeft = galleryContainer.scrollLeft;
    });

    galleryContainer.addEventListener("mouseleave", () => {
      isDown = false;
      galleryContainer.classList.remove("active");
    });

    galleryContainer.addEventListener("mouseup", () => {
      isDown = false;
      galleryContainer.classList.remove("active");
    });

    galleryContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryContainer.offsetLeft;
      const walk = (x - startX) * 2;
      galleryContainer.scrollLeft = scrollLeft - walk;
    });
  }



  // Parallax elements
  const parallaxElements = document.querySelectorAll(".parallax-bg");

  function runParallax() {
    const viewportHeight = window.innerHeight;
    parallaxElements.forEach((el) => {
      const rect = el.parentElement.getBoundingClientRect();
      const speed = parseFloat(el.getAttribute("data-speed")) || 0.1;

      const relativeScroll = rect.top - viewportHeight;
      const yPos = relativeScroll * speed;

      const baseTransform = el.getAttribute("data-base-transform") || "";
      el.style.transform = `${baseTransform} translateY(${yPos}px)`;
    });
  }

  window.addEventListener("scroll", () => {
    requestAnimationFrame(runParallax);
  });
  window.addEventListener("resize", () => {
    requestAnimationFrame(runParallax);
  });

  function transitionToDetail() {
    playMusic();

    if (screenEnvelope) {
      screenEnvelope.classList.add("opacity-0", "pointer-events-none");
    }

    setTimeout(() => {
      if (screenEnvelope) screenEnvelope.classList.add("hidden");
      if (screenDetail) screenDetail.classList.remove("hidden");
      if (musicPlayerContainer) musicPlayerContainer.classList.remove("hidden");

      setTimeout(() => {
        if (screenDetail) {
          screenDetail.classList.remove("opacity-0");
          screenDetail.classList.add("opacity-100");
        }
        if (musicPlayerContainer) {
          musicPlayerContainer.classList.remove("opacity-0");
          musicPlayerContainer.classList.add("opacity-100");
        }

        window.scrollTo({ top: 0, behavior: "instant" });

        scrollToCard(0);
        setTimeout(updateActiveCard, 100);


      }, 50);
    }, 800);
  }

  if (envelope) {
    envelope.addEventListener("click", transitionToDetail);
  }
  if (bottomText) {
    bottomText.addEventListener("click", transitionToDetail);
  }

  // Back to envelope click handler
  const backButtons = document.querySelectorAll(".back-to-envelope");
  backButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (screenDetail) screenDetail.classList.add("opacity-0");
      if (musicPlayerContainer) musicPlayerContainer.classList.add("opacity-0");

      setTimeout(() => {
        if (screenDetail) screenDetail.classList.add("hidden");
        if (musicPlayerContainer) musicPlayerContainer.classList.add("hidden");

        if (screenEnvelope) {
          screenEnvelope.classList.remove("hidden");
          setTimeout(() => {
            screenEnvelope.classList.remove("opacity-0", "pointer-events-none");
          }, 50);
        }
      }, 800);
    });
  });
});
