// Toggle dropdown menu on click for mobile or hover for desktop
document.addEventListener('DOMContentLoaded', () => {
    const listings = document.querySelector('nav ul li:nth-child(2)');
    const dropdown = listings.querySelector('.dropdown');
  
    listings.addEventListener('mouseenter', () => {
      dropdown.style.display = 'block';
    });
  
    listings.addEventListener('mouseleave', () => {
      dropdown.style.display = 'none';
    });
  });
  
  // Toggle chatbot window visibility
document.getElementById("chatbot-toggle").addEventListener("click", () => {
  const chatbotWindow = document.getElementById("chatbot-window");
  chatbotWindow.style.display =
    chatbotWindow.style.display === "flex" ? "none" : "flex";
});

// Handle role selection
function showFAQs(role) {
  const faqButtons = document.getElementById("faq-buttons");
  const chatlog = document.getElementById("chatlog");
  faqButtons.innerHTML = "";
  chatlog.innerHTML = "";

  let faqs = [];

  if (role === "student") {
    faqs = [
      "How do I search for a PG?",
      "What is the rent range?",
      "How to contact an owner?",
    ];
  } else if (role === "owner") {
    faqs = [
      "How do I list my property?",
      "Can I edit my listing later?",
      "How to contact tenants?",
    ];
  }

  faqs.forEach((question) => {
    const btn = document.createElement("button");
    btn.innerText = question;
    btn.addEventListener("click", () => {
      chatlog.innerHTML += `<div><strong>You:</strong> ${question}</div>`;
      chatlog.innerHTML += `<div><strong>Bot:</strong> ${
        getResponse(question) || "Let me connect you with support."
      }</div>`;
      chatlog.scrollTop = chatlog.scrollHeight;
    });
    faqButtons.appendChild(btn);
  });
}

// Simple FAQ bot responses
function getResponse(question) {
  const answers = {
    "How do I search for a PG?": "Use the search bar on the homepage to filter by location, type, and budget.",
    "What is the rent range?": "Most PGs range from ₹4,000 to ₹12,000 depending on services.",
    "How to contact an owner?": "Click on a listing to see contact options or use the chat feature.",
    "How do I list my property?": "Go to the Owner Dashboard and fill in your PG details.",
    "Can I edit my listing later?": "Yes, listings can be edited anytime from your Owner Dashboard.",
    "How to contact tenants?": "Tenants can message you directly through the platform chat.",
  };

  return answers[question];
}

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.querySelector('.carousel-track');
  const images = document.querySelectorAll('.carousel-track img');
  const imageWidth = images[0].clientWidth;
  let position = 0;
  let imageCount = images.length / 2; // We're only counting unique images (half the total due to duplicates)
  
  // Initial setup to position all images in a row
  carouselTrack.style.width = `${imageWidth * images.length}px`;
  
  // Automatic sliding function
  function moveCarousel() {
    position -= 1; // Move by one pixel for smooth scrolling
    
    // If we've scrolled past an image width, reset counter
    if (Math.abs(position) >= imageWidth * imageCount) {
      position = 0;
    }
    
    carouselTrack.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(moveCarousel);
  }
  
  // Start the carousel animation
  moveCarousel();
});





