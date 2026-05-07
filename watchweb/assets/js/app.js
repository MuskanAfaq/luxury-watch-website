const HORIZON_PRODUCTS = [
  {
    id: "aurora-tourbillon",
    name: "Aurora Tourbillon",
    price: 12499,
    category: "Limited Edition",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80",
    description: "Sculpted in brushed titanium with a visible tourbillon cage."
  },
  {
    id: "obsidian-chrono",
    name: "Obsidian Chronograph",
    price: 8699,
    category: "Racing Heritage",
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=900&q=80",
    description: "A black-on-gold statement piece calibrated for precision timing."
  },
  {
    id: "celestial-moonphase",
    name: "Celestial Moonphase",
    price: 9399,
    category: "Dress Classic",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=80",
    description: "Elegant moonphase complication in a slim polished case."
  },
  {
    id: "mariner-gmt",
    name: "Mariner GMT",
    price: 7999,
    category: "Travel Series",
    image:
      "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80",
    description: "Dual-time functionality with deep-ocean inspired detailing."
  },
  {
    id: "eclipse-skeleton",
    name: "Eclipse Skeleton",
    price: 11299,
    category: "Avant-Garde",
    image:
      "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80",
    description: "Architectural movement design framed with champagne accents."
  },
  {
    id: "sovereign-heritage",
    name: "Sovereign Heritage",
    price: 6899,
    category: "Signature",
    image:
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80",
    description: "A refined automatic with luminous baton markers and sapphire crystal."
  }
];

const STORAGE_KEY = "horizon-cart";
const TAX_RATE = 0.08;

const state = {
  cart: loadCart()
};

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function getProduct(productId) {
  return HORIZON_PRODUCTS.find((item) => item.id === productId);
}

function getCartSummary() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  return {
    subtotal,
    tax,
    total: subtotal + tax,
    count: state.cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

function addToCart(productId) {
  const product = getProduct(productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  updateCartCount();
  openCart();
}

function updateQuantity(productId, delta) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  }

  saveCart();
  renderCart();
  updateCartCount();
  renderCheckoutSummary();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((entry) => entry.id !== productId);
  saveCart();
  renderCart();
  updateCartCount();
  renderCheckoutSummary();
}

function injectProducts() {
  const homeGrid = document.querySelector("[data-featured-grid]");
  const productGrid = document.querySelector("[data-product-grid]");

  if (homeGrid) {
    homeGrid.innerHTML = HORIZON_PRODUCTS.slice(0, 4)
      .map(
        (product) => `
          <article class="watch-card glass-card section-fade overflow-hidden rounded-[28px]">
            <div class="overflow-hidden">
              <img class="watch-image h-80 w-full object-cover" src="${product.image}" alt="${product.name}">
            </div>
            <div class="space-y-4 p-6">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.35em] text-amber-200/70">${product.category}</p>
                  <h3 class="mt-2 font-display text-2xl text-white">${product.name}</h3>
                </div>
                <span class="text-sm text-amber-300">${money(product.price)}</span>
              </div>
              <p class="text-sm leading-7 text-slate-300">${product.description}</p>
              <button data-add-to-cart="${product.id}" class="btn-shimmer inline-flex items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10 px-5 py-3 text-sm font-semibold tracking-[0.18em] text-amber-200 transition hover:border-amber-300/60 hover:bg-amber-300/15">
                Add To Cart
              </button>
            </div>
          </article>
        `
      )
      .join("");
  }

  if (productGrid) {
    productGrid.innerHTML = HORIZON_PRODUCTS.map(
      (product) => `
        <article class="watch-card glass-card section-fade flex h-full flex-col overflow-hidden rounded-[28px]">
          <div class="overflow-hidden">
            <img class="watch-image h-80 w-full object-cover" src="${product.image}" alt="${product.name}">
          </div>
          <div class="flex flex-1 flex-col p-6">
            <div class="mb-4 flex items-start justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.32em] text-amber-200/70">${product.category}</p>
                <h3 class="mt-2 font-display text-2xl text-white">${product.name}</h3>
              </div>
              <span class="text-sm text-amber-300">${money(product.price)}</span>
            </div>
            <p class="mb-6 flex-1 text-sm leading-7 text-slate-300">${product.description}</p>
            <button data-add-to-cart="${product.id}" class="btn-shimmer inline-flex items-center justify-center rounded-full border border-amber-300/30 bg-amber-400/10 px-5 py-3 text-sm font-semibold tracking-[0.18em] text-amber-200 transition hover:border-amber-300/60 hover:bg-amber-300/15">
              Quick Add
            </button>
          </div>
        </article>
      `
    ).join("");
  }
}

function buildCartDrawer() {
  if (document.getElementById("cart-overlay")) return;

  const drawerMarkup = `
    <div id="cart-overlay" class="cart-overlay closed fixed inset-0 z-50"></div>
    <aside id="cart-panel" class="cart-panel glass-card fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col border-l border-amber-300/15">
      <div class="flex items-center justify-between border-b border-amber-300/10 px-6 py-5">
        <div>
          <p class="text-xs uppercase tracking-[0.34em] text-amber-200/70">Shopping Cart</p>
          <h3 class="mt-2 font-display text-2xl text-white">HORIZON</h3>
        </div>
        <button data-close-cart class="rounded-full border border-amber-300/20 p-3 text-slate-200 transition hover:border-amber-300/50 hover:text-amber-200">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div id="cart-items" class="flex-1 space-y-4 overflow-y-auto px-6 py-6"></div>
      <div class="border-t border-amber-300/10 px-6 py-6">
        <div class="space-y-3 text-sm text-slate-300">
          <div class="flex items-center justify-between">
            <span>Subtotal</span>
            <span id="cart-subtotal">${money(0)}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Tax</span>
            <span id="cart-tax">${money(0)}</span>
          </div>
          <div class="flex items-center justify-between border-t border-amber-300/10 pt-3 text-base font-semibold text-white">
            <span>Grand Total</span>
            <span id="cart-total">${money(0)}</span>
          </div>
        </div>
        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="checkout.html" class="btn-shimmer inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold tracking-[0.16em] text-slate-950 transition hover:bg-amber-200">
            Checkout
          </a>
          <button data-close-cart class="inline-flex items-center justify-center rounded-full border border-amber-300/20 px-5 py-3 text-sm font-semibold tracking-[0.16em] text-white transition hover:border-amber-300/50 hover:text-amber-200">
            Continue
          </button>
        </div>
      </div>
    </aside>
  `;

  document.body.insertAdjacentHTML("beforeend", drawerMarkup);
  bindCartUi();
  renderCart();
}

function bindCartUi() {
  const overlay = document.getElementById("cart-overlay");
  const panel = document.getElementById("cart-panel");

  document.querySelectorAll("[data-cart-trigger]").forEach((button) => {
    button.addEventListener("click", openCart);
  });

  document.querySelectorAll("[data-close-cart]").forEach((button) => {
    button.addEventListener("click", closeCart);
  });

  overlay?.addEventListener("click", closeCart);

  panel?.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const { action, id } = target.dataset;
    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
  });
}

function openCart() {
  const overlay = document.getElementById("cart-overlay");
  const panel = document.getElementById("cart-panel");
  overlay?.classList.remove("closed");
  overlay?.classList.add("open");
  panel?.classList.add("open");
  document.body.classList.add("menu-open");
}

function closeCart() {
  const overlay = document.getElementById("cart-overlay");
  const panel = document.getElementById("cart-panel");
  overlay?.classList.remove("open");
  overlay?.classList.add("closed");
  panel?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

function renderCart() {
  const itemsRoot = document.getElementById("cart-items");
  if (!itemsRoot) return;

  const summary = getCartSummary();
  const subtotal = document.getElementById("cart-subtotal");
  const tax = document.getElementById("cart-tax");
  const total = document.getElementById("cart-total");

  if (!state.cart.length) {
    itemsRoot.innerHTML = `
      <div class="glass-card rounded-[24px] p-6 text-center">
        <p class="font-display text-2xl text-white">Your cart is empty</p>
        <p class="mt-3 text-sm leading-7 text-slate-300">Add one of Horizon's signature timepieces to begin your collection.</p>
      </div>
    `;
  } else {
    itemsRoot.innerHTML = state.cart
      .map(
        (item) => `
          <div class="glass-card flex gap-4 rounded-[24px] p-4">
            <img src="${item.image}" alt="${item.name}" class="h-24 w-20 rounded-2xl object-cover">
            <div class="flex flex-1 flex-col">
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-display text-xl text-white">${item.name}</h4>
                <button data-action="remove" data-id="${item.id}" class="text-xs uppercase tracking-[0.22em] text-rose-300 transition hover:text-rose-200">Remove</button>
              </div>
              <p class="mt-2 text-sm text-amber-300">${money(item.price)}</p>
              <div class="mt-auto flex items-center justify-between pt-4">
                <div class="flex items-center gap-3 rounded-full border border-amber-300/15 px-3 py-2">
                  <button data-action="decrease" data-id="${item.id}" class="text-white transition hover:text-amber-200">-</button>
                  <span class="text-sm text-white">${item.quantity}</span>
                  <button data-action="increase" data-id="${item.id}" class="text-white transition hover:text-amber-200">+</button>
                </div>
                <span class="text-sm font-semibold text-white">${money(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        `
      )
      .join("");
  }

  if (subtotal) subtotal.textContent = money(summary.subtotal);
  if (tax) tax.textContent = money(summary.tax);
  if (total) total.textContent = money(summary.total);
  renderCheckoutSummary();
}

function updateCartCount() {
  const { count } = getCartSummary();
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(count);
  });
}

function bindAddToCartButtons() {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addToCart));
  });
}

function initNavbar() {
  const nav = document.querySelector("[data-navbar]");
  if (!nav) return;

  const updateNav = () => {
    nav.classList.toggle("nav-solid", window.scrollY > 18);
  };

  updateNav();
  window.addEventListener("scroll", updateNav);
}

function initObserver() {
  const elements = document.querySelectorAll(".section-fade");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
}

function initParallax() {
  const hero = document.querySelector("[data-parallax]");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const offset = Math.min(window.scrollY * 0.35, 180);
    hero.style.backgroundPosition = `center calc(50% + ${offset}px)`;
  });
}

function initCountdown() {
  const timerRoot = document.querySelector("[data-countdown]");
  if (!timerRoot) return;

  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 12);
  releaseDate.setHours(20, 0, 0, 0);

  const cards = {
    days: timerRoot.querySelector("[data-days]"),
    hours: timerRoot.querySelector("[data-hours]"),
    minutes: timerRoot.querySelector("[data-minutes]"),
    seconds: timerRoot.querySelector("[data-seconds]")
  };

  const tick = () => {
    const remaining = releaseDate.getTime() - Date.now();
    if (remaining <= 0) {
      Object.values(cards).forEach((element) => {
        if (element) element.textContent = "00";
      });
      return;
    }

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    cards.days.textContent = String(days).padStart(2, "0");
    cards.hours.textContent = String(hours).padStart(2, "0");
    cards.minutes.textContent = String(minutes).padStart(2, "0");
    cards.seconds.textContent = String(seconds).padStart(2, "0");
  };

  tick();
  setInterval(tick, 1000);
}

function renderCheckoutSummary() {
  const summaryRoot = document.querySelector("[data-checkout-summary]");
  if (!summaryRoot) return;

  const { subtotal, tax, total } = getCartSummary();
  const itemsMarkup = state.cart.length
    ? state.cart
        .map(
          (item) => `
            <div class="flex items-center justify-between gap-4 border-b border-amber-300/10 py-3">
              <div>
                <p class="text-sm font-medium text-white">${item.name}</p>
                <p class="text-xs uppercase tracking-[0.25em] text-slate-400">Qty ${item.quantity}</p>
              </div>
              <span class="text-sm text-slate-200">${money(item.price * item.quantity)}</span>
            </div>
          `
        )
        .join("")
    : `<p class="text-sm leading-7 text-slate-300">Your cart is empty. Add a Horizon watch before completing checkout.</p>`;

  summaryRoot.innerHTML = `
    <div class="space-y-2">${itemsMarkup}</div>
    <div class="mt-6 space-y-3 text-sm text-slate-300">
      <div class="flex items-center justify-between">
        <span>Subtotal</span>
        <span>${money(subtotal)}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>Tax</span>
        <span>${money(tax)}</span>
      </div>
      <div class="flex items-center justify-between border-t border-amber-300/10 pt-3 text-base font-semibold text-white">
        <span>Grand Total</span>
        <span>${money(total)}</span>
      </div>
    </div>
  `;
}

function initCheckoutForm() {
  const form = document.querySelector("[data-checkout-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;
    const fields = Array.from(form.querySelectorAll("[data-required]"));

    fields.forEach((field) => {
      const value = field.value.trim();
      field.classList.remove("field-error");

      const isEmail = field.type === "email";
      const emailValid = /\S+@\S+\.\S+/.test(value);

      if (!value || (isEmail && !emailValid)) {
        field.classList.add("field-error");
        valid = false;
      }
    });

    if (!state.cart.length) {
      valid = false;
      status.textContent = "Add at least one watch to your cart before placing the order.";
      status.className = "mt-4 text-sm text-rose-300";
      return;
    }

    if (!valid) {
      status.textContent = "Please complete all required fields with valid information.";
      status.className = "mt-4 text-sm text-rose-300";
      return;
    }

    status.textContent = "Order placed successfully. A Horizon concierge will confirm your delivery shortly.";
    status.className = "mt-4 text-sm text-emerald-300";
    state.cart = [];
    saveCart();
    renderCart();
    updateCartCount();
    renderCheckoutSummary();
    form.reset();
  });
}

function initLucide() {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  injectProducts();
  buildCartDrawer();
  bindAddToCartButtons();
  updateCartCount();
  initNavbar();
  initObserver();
  initParallax();
  initCountdown();
  renderCheckoutSummary();
  initCheckoutForm();
  initLucide();
});
