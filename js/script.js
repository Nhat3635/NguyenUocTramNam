// 1. CLOUDINARY CONFIGURATION & IMAGE CDN MAPPING
const CLOUDINARY_CLOUD_NAME = "dei5euvmf";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto`;

// 2. RSVP GOOGLE SHEETS SCRIPT URL CONFIGURATION
// Paste your Google Apps Script Web App URL here. If left empty, it will simulate successful submission.
const RSVP_SCRIPT_URL = "";

const cloudinaryMapping = {
  "image/nguyenuoc.png": "nguyenuoc_pcrcv3",
  "image/5.png": "5_gi3ofm",
  "image/4.png": "4_pcgars",
  "image/Nền có họa tiết.jpg": "Nền_có_họa_tiết_wnesn4",
  "image/21 - 07 - 2026.png": "21_-_07_-_2026_xwrnjf",
  "image/8.png": "8_p0vzru",
  "image/9.png": "9_lpv90u",
  "image/Layer 1.png": "Layer_1_copy_2_b70tof",
  "image/Layer 2.png": "Layer_2_copy_yrj5sa",
  "image/Slo.png": "Slo_kfcuju",
  "image/6.png": "6_oraetv",
  "image/7.png": "7_uxhvyl",
  "image/Truyền thống.png": "Truyền_thống_e41xph",
  "image/Nam Kỳ.png": "Nam_Kỳ_jhr3el",
  "image/Hiện Đại.png": "Hiện_Đại_xp8xcm",
  "image/01.png": "01_txs5o4"
};

// Helper function to resolve image URL with optional width restriction
window.getCloudinaryUrl = function (localPath, width = null) {
  if (!localPath) return "";
  const normalized = localPath.replace(/\\/g, '/');
  const publicId = cloudinaryMapping[normalized];
  if (publicId) {
    const widthParam = width ? `,w_${width}` : '';
    return `${CLOUDINARY_BASE_URL}${widthParam}/${publicId}`;
  }
  return localPath; // Fallback to local if not mapped (e.g. 90-2000.png or logo/rings if kept local)
};

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

// 2. GLOBAL LIGHTBOX & PREVIEW FUNCTIONS
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
    
    // Pass original local path so preview can fetch high-res (w_1600)
    itemWrapper.onclick = () => window.previewFullPhoto(imgUrl);

    const img = document.createElement("img");
    // Resolve dynamic path via Cloudinary API with width 800 for optimization
    img.src = window.getCloudinaryUrl(imgUrl, 800);
    img.alt = "Wedding Photo";
    img.className =
      "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.98] group-hover:brightness-100";
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

  // Load high-resolution (w_1600) image for full-screen preview
  previewImage.src = window.getCloudinaryUrl(imgUrl, 1600);
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
  const floatingRsvpContainer = document.getElementById("floating-rsvp-container");

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

  // horizontal Slider scroll detection (Active Center Effect with 3D Coverflow & Infinite Loop)
  // horizontal Slider scroll detection (Active Center Effect with 3D Coverflow & Infinite Loop)
  const galleryContainer = document.getElementById("gallery-container");
  const cards = document.querySelectorAll(".gallery-card");
  const dotsContainer = document.getElementById("slider-dots");
  const dots = dotsContainer ? dotsContainer.children : [];

  let isLooping = false;

  // Drag scrolling support variables
  let isDown = false;
  let startX = 0;
  let dragScrollLeft = 0;

  function updateActiveCard() {
    if (!galleryContainer || cards.length === 0) return;

    const containerRect = galleryContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const cardWidth = cards[0].offsetWidth || 300;

    let closestCard = null;
    let minDistance = Infinity;

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCard = card;
      }
    });

    if (!closestCard) return;

    const activeIndex = parseInt(closestCard.getAttribute("data-index")) || 0;

    // Update dot indicators dynamically using data-index
    for (let i = 0; i < dots.length; i++) {
      if (i === activeIndex) {
        dots[i].classList.remove("bg-burgundy-200/40", "transform", "scale-100");
        dots[i].classList.add("bg-gold-400", "transform", "scale-125");
      } else {
        dots[i].classList.remove("bg-gold-400", "transform", "scale-125");
        dots[i].classList.add("bg-burgundy-200/40", "transform", "scale-100");
      }
    }

    cards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = cardCenter - containerCenter;
      const absDist = Math.abs(distance);
      const ratio = Math.min(absDist / (cardWidth * 1.2), 1.5);

      if (card === closestCard) {
        card.classList.remove("border-gold-600/30");
        card.classList.add("border-gold-600", "shadow-2xl", "z-10");
      } else {
        card.classList.remove("border-gold-600", "shadow-2xl", "z-10");
        card.classList.add("border-gold-600/30");
      }

      // Compute 3D values: scale down, rotate Y, and slide inward for card overlap
      const scale = 1.02 - ratio * 0.15;
      const rotY = -Math.sign(distance) * ratio * 32;
      const transX = -Math.sign(distance) * ratio * 50; // overlap effect
      const opacity = 1.0 - ratio * 0.65;
      const blurVal = ratio * 1.2;

      // Apply transform and style properties
      card.style.transform = `scale(${scale}) rotateY(${rotY}deg) translateX(${transX}px)`;
      card.style.opacity = opacity;
      card.style.filter = blurVal > 0.1 ? `blur(${blurVal}px)` : "none";
    });
  }

  function handleInfiniteScroll() {
    if (!galleryContainer || cards.length === 0 || isLooping) return;

    const containerRect = galleryContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIdx = -1;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    if (closestIdx === -1) return;

    // Reset if active card is a boundary clone
    if (closestIdx <= 3) {
      const targetIdx = closestIdx + 4; // index 0..3 (left clones) -> index 4..7 (Originals)
      const targetCard = cards[targetIdx];
      if (targetCard) {
        const oldScrollLeft = galleryContainer.scrollLeft;
        const targetScrollLeft = targetCard.offsetLeft - galleryContainer.clientWidth / 2 + targetCard.clientWidth / 2;

        isLooping = true;
        galleryContainer.scrollLeft = targetScrollLeft;
        updateActiveCard();

        if (isDown) {
          const delta = targetScrollLeft - oldScrollLeft;
          dragScrollLeft += delta;
        }
        isLooping = false;
      }
    } else if (closestIdx >= 8) {
      const targetIdx = closestIdx - 4; // index 8..11 (right clones) -> index 4..7 (Originals)
      const targetCard = cards[targetIdx];
      if (targetCard) {
        const oldScrollLeft = galleryContainer.scrollLeft;
        const targetScrollLeft = targetCard.offsetLeft - galleryContainer.clientWidth / 2 + targetCard.clientWidth / 2;

        isLooping = true;
        galleryContainer.scrollLeft = targetScrollLeft;
        updateActiveCard();

        if (isDown) {
          const delta = targetScrollLeft - oldScrollLeft;
          dragScrollLeft += delta;
        }
        isLooping = false;
      }
    }
  }

  if (galleryContainer) {
    galleryContainer.addEventListener("scroll", () => {
      handleInfiniteScroll();
      updateActiveCard();
    });

    // Initialize position to original Card 1 (index 4) on load
    setTimeout(() => {
      const card1 = cards[4];
      if (card1) {
        galleryContainer.scrollLeft = card1.offsetLeft - galleryContainer.clientWidth / 2 + card1.clientWidth / 2;
        updateActiveCard();
      }
    }, 100);
  }

  // Maps dot clicks (0-3) to original DOM elements (4-7)
  window.scrollToCard = function (index) {
    const card = cards[index + 4];
    if (!card || !galleryContainer) return;

    const cardCenterOffset = card.offsetLeft - galleryContainer.clientWidth / 2 + card.clientWidth / 2;
    galleryContainer.scrollTo({
      left: cardCenterOffset,
      behavior: "smooth",
    });
  };

  // Gallery Navigation Buttons - slides by DOM indices relative to current active card
  window.scrollGallery = function (direction) {
    if (!galleryContainer || cards.length === 0) return;

    const containerRect = galleryContainer.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestCardIdx = 4;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(cardCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestCardIdx = idx;
      }
    });

    let targetDOMIndex = closestCardIdx + direction;
    if (targetDOMIndex < 0) targetDOMIndex = 0;
    if (targetDOMIndex >= cards.length) targetDOMIndex = cards.length - 1;

    const targetCard = cards[targetDOMIndex];
    if (targetCard) {
      const cardCenterOffset = targetCard.offsetLeft - galleryContainer.clientWidth / 2 + targetCard.clientWidth / 2;
      galleryContainer.scrollTo({
        left: cardCenterOffset,
        behavior: "smooth",
      });
    }
  };

  if (galleryContainer) {
    galleryContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      galleryContainer.classList.add("active");
      startX = e.pageX - galleryContainer.offsetLeft;
      dragScrollLeft = galleryContainer.scrollLeft;
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
      galleryContainer.scrollLeft = dragScrollLeft - walk;
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
      if (floatingRsvpContainer) floatingRsvpContainer.classList.remove("hidden");

      setTimeout(() => {
        if (screenDetail) {
          screenDetail.classList.remove("opacity-0");
          screenDetail.classList.add("opacity-100");
        }
        if (musicPlayerContainer) {
          musicPlayerContainer.classList.remove("opacity-0");
          musicPlayerContainer.classList.add("opacity-100");
        }
        if (floatingRsvpContainer) {
          floatingRsvpContainer.classList.remove("opacity-0");
          floatingRsvpContainer.classList.add("opacity-100");
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

  // Swipe up and mouse wheel scroll down on envelope screen to open it
  let touchStartY = 0;
  let touchEndY = 0;
  if (screenEnvelope) {
    screenEnvelope.addEventListener("touchstart", (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    screenEnvelope.addEventListener("touchend", (e) => {
      touchEndY = e.changedTouches[0].screenY;
      const swipeDistance = touchStartY - touchEndY;
      if (swipeDistance > 60) {
        transitionToDetail();
      }
    }, { passive: true });

    screenEnvelope.addEventListener("wheel", (e) => {
      if (e.deltaY > 20) {
        transitionToDetail();
      }
    }, { passive: true });
  }

  // High-performance IntersectionObserver for Scroll Reveal effects
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target); // Unobserve once animated
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("active"));
  }

  // Back to envelope click handler
  const backButtons = document.querySelectorAll(".back-to-envelope");
  backButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (screenDetail) screenDetail.classList.add("opacity-0");
      if (musicPlayerContainer) musicPlayerContainer.classList.add("opacity-0");
      if (floatingRsvpContainer) floatingRsvpContainer.classList.add("opacity-0");

      setTimeout(() => {
        if (screenDetail) screenDetail.classList.add("hidden");
        if (musicPlayerContainer) musicPlayerContainer.classList.add("hidden");
        if (floatingRsvpContainer) floatingRsvpContainer.classList.add("hidden");

        if (screenEnvelope) {
          screenEnvelope.classList.remove("hidden");
          setTimeout(() => {
            screenEnvelope.classList.remove("opacity-0", "pointer-events-none");
          }, 50);
        }
      }, 800);
    });
  });

  // ==========================================
  // RSVP Form Event Handlers & State Machine
  // ==========================================
  const openRsvpBtn = document.getElementById("open-rsvp-btn");
  const openRsvpBtnFloating = document.getElementById("open-rsvp-btn-floating");
  const rsvpModal = document.getElementById("rsvp-modal");
  const rsvpModalOverlay = document.getElementById("rsvp-modal-overlay");
  const closeRsvpModalX = document.getElementById("close-rsvp-modal-x");
  const closeRsvpModalBtn = document.getElementById("close-rsvp-modal-btn");
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpGuestsWrapper = document.getElementById("rsvp-guests-wrapper");
  const rsvpLoadingScreen = document.getElementById("rsvp-loading-screen");
  const rsvpSuccessScreen = document.getElementById("rsvp-success-screen");
  const closeRsvpSuccessBtn = document.getElementById("close-rsvp-success-btn");

  const rsvpOptYesLabel = document.getElementById("rsvp-opt-yes");
  const rsvpOptNoLabel = document.getElementById("rsvp-opt-no");
  const rsvpOptYesInput = document.querySelector('input[name="attendance"][value="yes"]');
  const rsvpOptNoInput = document.querySelector('input[name="attendance"][value="no"]');

  function openRsvp() {
    if (rsvpModal) {
      rsvpModal.classList.remove("hidden");
      rsvpModal.offsetHeight; // force reflow for transitions
      rsvpModal.classList.remove("opacity-0");
      rsvpModal.classList.add("opacity-100");
      document.body.style.overflow = "hidden"; // Lock background scroll
    }
  }

  function closeRsvp() {
    if (rsvpModal) {
      rsvpModal.classList.remove("opacity-100");
      rsvpModal.classList.add("opacity-0");
      document.body.style.overflow = ""; // Unlock scroll
      setTimeout(() => {
        rsvpModal.classList.add("hidden");
        // Reset overlays
        if (rsvpLoadingScreen) {
          rsvpLoadingScreen.classList.add("hidden");
          rsvpLoadingScreen.classList.remove("opacity-100");
          rsvpLoadingScreen.classList.add("opacity-0");
        }
        if (rsvpSuccessScreen) {
          rsvpSuccessScreen.classList.add("hidden");
          rsvpSuccessScreen.classList.remove("opacity-100");
          rsvpSuccessScreen.classList.add("opacity-0");
        }
        if (rsvpForm) rsvpForm.reset();
        // Reset card selection styles
        updateOptionCards("yes");
      }, 350);
    }
  }

  function updateOptionCards(selectedValue) {
    if (selectedValue === "yes") {
      if (rsvpOptYesLabel) {
        rsvpOptYesLabel.classList.remove("unselected", "selected-no");
        rsvpOptYesLabel.classList.add("selected-yes");
      }
      if (rsvpOptNoLabel) {
        rsvpOptNoLabel.classList.remove("selected-yes", "selected-no");
        rsvpOptNoLabel.classList.add("unselected");
      }
    } else {
      if (rsvpOptYesLabel) {
        rsvpOptYesLabel.classList.remove("selected-yes", "selected-no");
        rsvpOptYesLabel.classList.add("unselected");
      }
      if (rsvpOptNoLabel) {
        rsvpOptNoLabel.classList.remove("unselected", "selected-yes");
        rsvpOptNoLabel.classList.add("selected-no");
      }
    }
  }

  if (rsvpOptYesLabel && rsvpOptNoLabel) {
    rsvpOptYesLabel.addEventListener("click", () => {
      if (rsvpOptYesInput) rsvpOptYesInput.checked = true;
      updateOptionCards("yes");
    });
    rsvpOptNoLabel.addEventListener("click", () => {
      if (rsvpOptNoInput) rsvpOptNoInput.checked = true;
      updateOptionCards("no");
    });
  }

  if (openRsvpBtn) openRsvpBtn.addEventListener("click", openRsvp);
  if (openRsvpBtnFloating) openRsvpBtnFloating.addEventListener("click", openRsvp);
  if (rsvpModalOverlay) rsvpModalOverlay.addEventListener("click", closeRsvp);
  if (closeRsvpModalX) closeRsvpModalX.addEventListener("click", closeRsvp);
  if (closeRsvpModalBtn) closeRsvpModalBtn.addEventListener("click", closeRsvp);
  if (closeRsvpSuccessBtn) closeRsvpSuccessBtn.addEventListener("click", closeRsvp);

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Form validation
      const nameVal = document.getElementById("rsvp-name").value.trim();
      const phoneVal = document.getElementById("rsvp-phone").value.trim();
      const attendanceInput = document.querySelector('input[name="attendance"]:checked');
      const attendanceVal = attendanceInput ? attendanceInput.value : "yes";
      const guestsVal = attendanceVal === "yes" ? "1" : "0";
      const wishVal = "";

      if (!nameVal || !phoneVal) {
        alert("Vui lòng nhập Họ tên và Số điện thoại!");
        return;
      }

      // Show loader overlay
      if (rsvpLoadingScreen) {
        rsvpLoadingScreen.classList.remove("hidden");
        rsvpLoadingScreen.offsetHeight;
        rsvpLoadingScreen.classList.remove("opacity-0");
        rsvpLoadingScreen.classList.add("opacity-100");
      }

      const payload = {
        name: nameVal,
        phone: phoneVal,
        attendance: attendanceVal === "yes" ? "Sẽ tham gia" : "Rất tiếc không thể đến",
        guests: guestsVal,
        wish: wishVal,
        timestamp: new Date().toLocaleString("vi-VN")
      };

      if (!RSVP_SCRIPT_URL) {
        // Simulation mode for testing/previewing UI
        setTimeout(() => {
          if (rsvpLoadingScreen) {
            rsvpLoadingScreen.classList.remove("opacity-100");
            rsvpLoadingScreen.classList.add("opacity-0");
            setTimeout(() => rsvpLoadingScreen.classList.add("hidden"), 350);
          }
          if (rsvpSuccessScreen) {
            rsvpSuccessScreen.classList.remove("hidden");
            rsvpSuccessScreen.offsetHeight;
            rsvpSuccessScreen.classList.remove("opacity-0");
            rsvpSuccessScreen.classList.add("opacity-100");
          }
        }, 1200);
      } else {
        // Send actual POST payload to Apps Script endpoint
        fetch(RSVP_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
        .then(() => {
          if (rsvpLoadingScreen) {
            rsvpLoadingScreen.classList.remove("opacity-100");
            rsvpLoadingScreen.classList.add("opacity-0");
            setTimeout(() => rsvpLoadingScreen.classList.add("hidden"), 350);
          }
          if (rsvpSuccessScreen) {
            rsvpSuccessScreen.classList.remove("hidden");
            rsvpSuccessScreen.offsetHeight;
            rsvpSuccessScreen.classList.remove("opacity-0");
            rsvpSuccessScreen.classList.add("opacity-100");
          }
        })
        .catch((err) => {
          console.error("Lỗi gửi RSVP:", err);
          // Fallback success for fetch quirks under no-cors
          if (rsvpLoadingScreen) {
            rsvpLoadingScreen.classList.remove("opacity-100");
            rsvpLoadingScreen.classList.add("opacity-0");
            setTimeout(() => rsvpLoadingScreen.classList.add("hidden"), 350);
          }
          if (rsvpSuccessScreen) {
            rsvpSuccessScreen.classList.remove("hidden");
            rsvpSuccessScreen.offsetHeight;
            rsvpSuccessScreen.classList.remove("opacity-0");
            rsvpSuccessScreen.classList.add("opacity-100");
          }
        });
      }
    });
  }
});
