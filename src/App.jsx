import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { menuCategories } from "./data/menu";

const MAP_URL = "https://maps.app.goo.gl/8yBMBiGVHU9eA89w7";

function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState(() => JSON.parse(localStorage.getItem("greenCafeOrder") || "[]"));
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("greenCafeFavorites") || "[]"));
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem("greenCafeReviews") || "[]"));
  const [showOrder, setShowOrder] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const categories = ["All", ...menuCategories.map((category) => category.name)];

  const filteredCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return menuCategories
      .filter((category) => {
        if (activeCategory === "All") return true;
        return category.name === activeCategory;
      })
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          item.name.toLowerCase().includes(search)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [activeCategory, searchTerm]);

  useEffect(() => localStorage.setItem("greenCafeOrder", JSON.stringify(order)), [order]);
  useEffect(() => localStorage.setItem("greenCafeFavorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("greenCafeReviews", JSON.stringify(reviews)), [reviews]);

  const addToOrder = (item) => {
    setOrder((current) => {
      const existing = current.find((entry) => entry.name === item.name);
      if (existing) {
        return current.map((entry) => entry.name === item.name ? { ...entry, quantity: entry.quantity + 1 } : entry);
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setShowOrder(true);
  };

  const changeQuantity = (name, amount) => {
    setOrder((current) => current.map((entry) => entry.name === name ? { ...entry, quantity: entry.quantity + amount } : entry).filter((entry) => entry.quantity > 0));
  };

  const removeFromOrder = (name) => setOrder((current) => current.filter((entry) => entry.name !== name));

  const toggleFavorite = (item) => {
    setFavorites((current) => current.some((entry) => entry.name === item.name)
      ? current.filter((entry) => entry.name !== item.name)
      : [...current, item]);
  };

  const isFavorite = (name) => favorites.some((item) => item.name === name);
  const orderTotal = order.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const submitReview = (event) => {
    event.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    setReviews((current) => [{ id: Date.now(), name: reviewName.trim(), text: reviewText.trim(), rating: reviewRating }, ...current]);
    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-container">
          <a
            href="#home"
            className="logo"
            onClick={() => scrollToSection("home")}
          >
            <span className="logo-leaf">🌿</span>

            <div>
              <span className="logo-main">THE GREEN</span>
              <span className="logo-sub">CAFE</span>
            </div>
          </a>

          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#menu">Menu</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="nav-actions">
            <button className="nav-icon-btn" onClick={() => setShowFavorites(true)} aria-label="Favorites">❤️ <span>{favorites.length}</span></button>
            <button className="nav-icon-btn order-nav-btn" onClick={() => setShowOrder(true)} aria-label="Order">🛒 <span>{order.reduce((sum, item) => sum + item.quantity, 0)}</span></button>
          </div>

          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-direction"
          >
            Get Directions
          </a>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section id="home" className="hero">
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <div className="hero-badge">
              <span>🌿</span>
              PURE VEG CAFE
            </div>

            <p className="hero-small">WELCOME TO</p>

            <h1>
              THE GREEN
              <span>CAFE</span>
            </h1>

            <div className="hero-line">
              <span></span>
              <span>✦</span>
              <span></span>
            </div>

            <p className="hero-tagline">Good Food | Good Mood</p>

            <p className="hero-description">
              Fresh flavours, delicious food and a memorable cafe experience.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => scrollToSection("menu")}
              >
                Explore Menu
                <span>→</span>
              </button>

              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn"
              >
                📍 Find Us
              </a>
            </div>
          </div>

          <div className="hero-scroll">
            <span>SCROLL TO EXPLORE</span>
            <div>↓</div>
          </div>
        </section>

        {/* QUICK INFO */}
        <section className="info-strip">
          <div className="info-item">
            <span className="info-icon">🌱</span>
            <div>
              <strong>PURE VEG</strong>
              <small>Cafe</small>
            </div>
          </div>

          <div className="info-divider"></div>

          <div className="info-item">
            <span className="info-icon">🍕</span>
            <div>
              <strong>FRESH FOOD</strong>
              <small>Made for you</small>
            </div>
          </div>

          <div className="info-divider"></div>

          <div className="info-item">
            <span className="info-icon">☕</span>
            <div>
              <strong>GOOD MOOD</strong>
              <small>Every visit</small>
            </div>
          </div>
        </section>

        {/* MENU */}
        <section id="menu" className="menu-section">
          <div className="section-heading">
            <span className="section-kicker">EXPLORE OUR</span>
            <h2>
              Delicious <span>Menu</span>
            </h2>
            <p>
              Explore our selection of vegetarian favourites, refreshing
              beverages and delightful desserts.
            </p>
          </div>

          {/* CATEGORY FILTER */}
          <div className="category-wrapper">
            <div className="category-scroll">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${
                    activeCategory === category ? "active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category !== "All" && (
                    <span>
                      {
                        menuCategories.find(
                          (item) => item.name === category
                        )?.icon
                      }
                    </span>
                  )}

                  {category === "All" ? "All Menu" : category}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH */}
         <div className="search-container">
  <span className="search-icon">⌕</span>

  <input
    type="text"
    placeholder="Search your favourite dish..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        setSearchTerm(event.target.value);
      }
    }}
  />

  {searchTerm && (
    <button
      className="clear-search"
      onClick={() => setSearchTerm("")}
      aria-label="Clear search"
    >
      
    </button>
  )}

  <button
    className="search-button"
    onClick={() => {
      setSearchTerm(searchTerm.trim());
    }}
  >
    Search
  </button>
</div>

          {/* MENU CATEGORIES */}
          <div className="menu-content">
            {filteredCategories.map((category) => (
              <div className="menu-category" key={category.name}>
                <div className="category-title">
                  <div className="category-title-icon">
                    {category.icon}
                  </div>

                  <div>
                    <span>OUR</span>
                    <h3>{category.name}</h3>
                  </div>

                  <div className="category-line"></div>
                </div>

                <div className="menu-grid">
                  {category.items.map((item) => (
                    <article className="menu-card" key={item.name}>
                      <div className="menu-image-wrapper">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                        />

                        <div className="image-overlay">
                          <span>🌿</span>
                        </div>
                      </div>

                      <div className="menu-card-content">
                        <div className="menu-card-title">
                          <h4>{item.name}</h4>

                          <span className="price">
                            ₹{item.price}
                          </span>
                        </div>

                        <div className="menu-dots"></div>

                        <span className="veg-label">
                          <span className="veg-symbol">●</span>
                          VEG
                        </span>

                        <div className="menu-card-actions">
                          <button className={`favorite-btn ${isFavorite(item.name) ? "active" : ""}`} onClick={() => toggleFavorite(item)}>{isFavorite(item.name) ? "♥" : "♡"}</button>
                          <button className="add-order-btn" onClick={() => addToOrder(item)}>🛒 Add to Order</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="no-results">
                <div>🍽️</div>
                <h3>No dish found</h3>
                <p>Try searching for another menu item.</p>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                >
                  View Full Menu
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about-section">
          <div className="about-decoration about-decoration-one">
            🌿
          </div>

          <div className="about-container">
            <div className="about-image">
              <div className="about-image-card">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80"
                  alt="Cafe interior"
                  loading="lazy"
                />

                <div className="about-image-label">
                  <span>🌿</span>
                  <strong>THE GREEN CAFE</strong>
                  <small>PURE VEG CAFE</small>
                </div>
              </div>
            </div>

            <div className="about-content">
              <span className="section-kicker">ABOUT US</span>

              <h2>
                Good Food.
                <br />
                <span>Good Mood.</span>
              </h2>

              <div className="about-divider">
                <span></span>
                ✦
                <span></span>
              </div>

              <p>
                Welcome to <strong>The Green Cafe</strong>, a pure vegetarian
                cafe offering a variety of starters, sandwiches, noodles,
                rice, pizzas, pasta, momos, burgers, beverages, thick shakes
                and desserts.
              </p>

              <p>
                Whether you're looking for a quick bite, a refreshing drink or
                something sweet to finish your meal, explore our menu and
                discover your favourites.
              </p>

              <div className="about-features">
                <div>
                  <span>🌱</span>
                  <strong>Pure Veg</strong>
                </div>

                <div>
                  <span>🍴</span>
                  <strong>Wide Menu</strong>
                </div>

                <div>
                  <span>☕</span>
                  <strong>Cafe Experience</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER REVIEWS */}
        <section id="reviews" className="reviews-section">
          <div className="section-heading">
            <span className="section-kicker">CUSTOMER REVIEWS</span>
            <h2>What Our <span>Customers Say</span></h2>
            <p>Share your experience and help other guests discover their favourites.</p>
          </div>
          <div className="reviews-layout">
            <form className="review-form" onSubmit={submitReview}>
              <h3>Write a Review</h3>
              <input value={reviewName} onChange={(e) => setReviewName(e.target.value)} placeholder="Your name" required />
              <div className="rating-picker">
                {[1,2,3,4,5].map((star) => <button type="button" key={star} className={star <= reviewRating ? "selected" : ""} onClick={() => setReviewRating(star)}>★</button>)}
              </div>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Tell us about your experience..." rows="4" required />
              <button className="submit-review-btn" type="submit">Post Review</button>
            </form>
            <div className="review-list">
              {reviews.length === 0 ? <div className="empty-reviews"><span>⭐</span><h3>Be the first to review</h3><p>Your review will appear here.</p></div> : reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-card-top"><div><strong>{review.name}</strong><div className="stars">{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</div></div><button onClick={() => setReviews((current) => current.filter((item) => item.id !== review.id))} aria-label="Remove review">×</button></div>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact-section">
          <div className="contact-container">
            <div className="section-heading contact-heading">
              <span className="section-kicker">COME VISIT US</span>

              <h2>
                Let's <span>Connect</span>
              </h2>

              <p>
                Find us, call us or send us a message. We'd love to see you.
              </p>
            </div>

            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-icon">📍</div>

                <span>ADDRESS</span>

                <p>
                  Corporation Shopping Complex,
                  <br />
                  3rd Avenue, Indira Nagar, Adyar,
                  <br />
                  Chennai - 600020
                </p>

                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  Open in Google Maps →
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>

                <span>PHONE</span>

                <p>+91 73393 97641</p>

                <a
                  href="tel:+919500103336"
                  className="contact-link"
                >
                  Call Us →
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">✉️</div>

                <span>EMAIL</span>

                <p>thegreencafechennai@gmail.com</p>

                <a
                  href="mailto:thegreencafechennai@gmail.com"
                  className="contact-link"
                >
                  Send Email →
                </a>
              </div>

              <div className="contact-card">
                <div className="contact-icon">◎</div>

                <span>INSTAGRAM</span>

                <p>@the_green_cafe_chennai</p>

                <a
                  href="https://www.instagram.com/the_green_cafe_chennai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  Follow Us →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showOrder && (
        <div className="modal-backdrop" onClick={() => setShowOrder(false)}>
          <aside className="side-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header"><div><span>YOUR</span><h2>Order</h2></div><button onClick={() => setShowOrder(false)}>×</button></div>
            {order.length === 0 ? <div className="panel-empty">🛒<h3>Your order is empty</h3><p>Add delicious dishes from the menu.</p></div> : <>
              <div className="order-list">{order.map((item) => <div className="order-item" key={item.name}><img src={item.image} alt={item.name}/><div className="order-item-info"><strong>{item.name}</strong><span>₹{item.price}</span><div className="qty"><button onClick={() => changeQuantity(item.name,-1)}>−</button><b>{item.quantity}</b><button onClick={() => changeQuantity(item.name,1)}>+</button><button className="remove-item" onClick={() => removeFromOrder(item.name)}>Remove</button></div></div></div>)}</div>
              <div className="order-total"><span>Total</span><strong>₹{orderTotal}</strong></div>
              <a className="checkout-btn" href={`https://wa.me/7339397641?text=${encodeURIComponent(`Hello The Green Cafe, I would like to place an order:\n\n${order.map((item) => `${item.name} x ${item.quantity} - ₹${Number(item.price)*item.quantity}`).join("\n")}\n\nTotal: ₹${orderTotal}`)}`} target="_blank" rel="noopener noreferrer">Order on WhatsApp →</a>
            </>}
          </aside>
        </div>
      )}

      {showFavorites && (
        <div className="modal-backdrop" onClick={() => setShowFavorites(false)}>
          <aside className="side-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header"><div><span>SAVED</span><h2>Favorites</h2></div><button onClick={() => setShowFavorites(false)}>×</button></div>
            {favorites.length === 0 ? <div className="panel-empty">♡<h3>No favorites yet</h3><p>Tap the heart on any dish to save it here.</p></div> : <>
              <div className="favorites-toolbar"><span>{favorites.length} saved {favorites.length === 1 ? "dish" : "dishes"}</span><button className="clear-favorites-btn" onClick={() => setFavorites([])}>Clear All</button></div>
              <div className="favorite-list">{favorites.map((item) => <div className="favorite-item" key={item.name}><img src={item.image} alt={item.name}/><div><strong>{item.name}</strong><span>₹{item.price}</span><div><button className="add-order-small" onClick={() => addToOrder(item)}>Add to Order</button><button className="remove-fav" onClick={() => toggleFavorite(item)}>Remove</button></div></div></div>)}</div>
            </>}
          </aside>
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-leaves">🌿</div>

        <div className="footer-logo">
          <span>THE GREEN</span>
          <strong>CAFE</strong>
        </div>

        <p className="footer-tagline">Good Food | Good Mood</p>

        <div className="footer-line"></div>

        <p className="copyright">
          © {new Date().getFullYear()} The Green Cafe. All rights reserved.
        </p>
      </footer>

      {/* FLOATING WHATSAPP / CALL */}
      <a
        href="tel:+919500103336"
        className="floating-call"
        aria-label="Call The Green Cafe"
      >
        📞
      </a>
    </div>
  );
}

export default App;