document.addEventListener("DOMContentLoaded", () => {
  const jokeButton = document.getElementById("getJoke")
  const resetButton = document.getElementById("resetFields")
  const jokeContainer = document.getElementById("result")
  const loadingOverlay = document.querySelector(".loading-overlay")
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")
  const themeButtons = document.querySelectorAll(".theme-btn")
  const minimizeBtn = document.querySelector(".minimize-btn")
  const expandBtn = document.querySelector(".expand-btn")
  const reactionButtons = document.querySelectorAll(".reaction-btn")
  const confettiContainer = document.querySelector(".confetti-container")
  const floatingEmojis = document.querySelectorAll(".floating-emoji")

  const categoryInputs = document.querySelectorAll("input[name='category']")
  const anyCategory = document.querySelector("input[name='category'][value='any']")
  const customCategory = document.querySelector("input[name='category'][value='custom']")

  // Event Listeners
  jokeButton.addEventListener("click", fetchJoke)
  resetButton.addEventListener("click", resetFields)
  anyCategory.addEventListener("change", toggleCategorySelection)
  customCategory.addEventListener("change", toggleCategorySelection)

  // Theme switcher
  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme")
      document.body.className = theme-${theme}

      // Update active button
      themeButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Save theme preference
      localStorage.setItem("selectedTheme", theme)

      // Update floating emojis animation
      animateFloatingEmojis()
    })
  })

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("selectedTheme")
  if (savedTheme) {
    document.body.className = theme-${savedTheme}
    themeButtons.forEach((btn) => {
      if (btn.getAttribute("data-theme") === savedTheme) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  }

  // Animate floating emojis randomly
  function animateFloatingEmojis() {
    floatingEmojis.forEach((emoji) => {
      const randomX = Math.floor(Math.random() * 20) - 10
      const randomY = Math.floor(Math.random() * 20) - 10
      const randomRotate = Math.floor(Math.random() * 20) - 10

      emoji.style.transform = translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)

      setTimeout(() => {
        emoji.style.transform = ""
      }, 500)
    })
  }

  // Animate emojis on page load
  setTimeout(animateFloatingEmojis, 1000)

  // Animate emojis periodically
  setInterval(animateFloatingEmojis, 10000)

  // Tab functionality
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => {
        content.style.display = "none"
      })
      document.getElementById(tabId).style.display = "block"
    })
  })

  // Card controls
  minimizeBtn.addEventListener("click", () => {
    const card = document.querySelector(".card")
    card.classList.toggle("minimized")

    if (card.classList.contains("minimized")) {
      card.style.height = "60px"
      card.style.overflow = "hidden"
      minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>'
    } else {
      card.style.height = ""
      card.style.overflow = ""
      minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>'
    }
  })

  expandBtn.addEventListener("click", () => {
    const card = document.querySelector(".card")
    card.classList.toggle("expanded")

    if (card.classList.contains("expanded")) {
      card.style.position = "fixed"
      card.style.top = "20px"
      card.style.left = "20px"
      card.style.right = "20px"
      card.style.bottom = "20px"
      card.style.zIndex = "1000"
      card.style.maxWidth = "none"
      expandBtn.innerHTML = '<i class="fas fa-compress"></i>'
    } else {
      card.style.position = ""
      card.style.top = ""
      card.style.left = ""
      card.style.right = ""
      card.style.bottom = ""
      card.style.zIndex = ""
      card.style.maxWidth = ""
      expandBtn.innerHTML = '<i class="fas fa-expand"></i>'
    }
  })

  // Reaction buttons
  reactionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const reaction = button.getAttribute("data-reaction")

      // Visual feedback
      button.classList.add("active")
      setTimeout(() => {
        button.classList.remove("active")
      }, 1000)

      // Create confetti effect
      createConfetti()

      // Animate floating emojis
      animateFloatingEmojis()
    })
  })

  categoryInputs.forEach((input) => {
    if (input.value !== "any" && input.value !== "custom") {
      input.addEventListener("change", () => {
        if (anyCategory.checked) {
          anyCategory.checked = false
          toggleCategorySelection()
        }
      })
    }
  })

  // Create confetti effect
  function createConfetti() {
    confettiContainer.innerHTML = ""
    confettiContainer.style.opacity = "1"

    const colors = [
      getComputedStyle(document.documentElement).getPropertyValue("--primary-color"),
      getComputedStyle(document.documentElement).getPropertyValue("--secondary-color"),
      getComputedStyle(document.documentElement).getPropertyValue("--accent-color"),
      "#ffffff",
    ]

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = Math.random() * 100 + "vw"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.width = Math.random() * 10 + 5 + "px"
      confetti.style.height = Math.random() * 10 + 5 + "px"
      confetti.style.opacity = Math.random() + 0.5
      confetti.style.animationDuration = Math.random() * 3 + 2 + "s"

      confettiContainer.appendChild(confetti)
    }

    setTimeout(() => {
      confettiContainer.style.opacity = "0"
    }, 2500)
  }

  function fetchJoke() {
    const selectedCategories = getSelectedCategories()
    const blacklistedFlags = getBlacklistedFlags()
    const selectedLanguage = document.getElementById("language").value

    // Show loading overlay
    loadingOverlay.classList.add("active")

    // Switch to result tab
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    tabButtons[1].classList.add("active")
    tabContents.forEach((content) => {
      content.style.display = "none"
    })
    document.getElementById("result").style.display = "block"

    let apiUrl = https://v2.jokeapi.dev/joke/${selectedCategories}?lang=${selectedLanguage}
    if (blacklistedFlags.length > 0) {
      apiUrl += &blacklistFlags=${blacklistedFlags.join(",")}
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Hide loading overlay
        loadingOverlay.classList.remove("active")

        if (data.error) {
          jokeContainer.innerHTML = `<div class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              <p>Error fetching joke. Please try again.</p>
            </div>`
        } else {
          displayJoke(data)
        }
      })
      .catch((error) => {
        // Hide loading overlay
        loadingOverlay.classList.remove("active")

        jokeContainer.innerHTML = `<div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error: ${error.message}</p>
          </div>`
      })
  }

  function getSelectedCategories() {
    const checkedCategories = Array.from(categoryInputs)
      .filter((input) => input.checked)
      .map((input) => input.value)

    return checkedCategories.includes("any")
      ? "Any"
      : checkedCategories.filter((cat) => cat !== "custom").join(",") || "Any"
  }

  function getBlacklistedFlags() {
    const blacklistInputs = document.querySelectorAll(".blacklist-selection input:checked")
    return Array.from(blacklistInputs).map((input) => input.value)
  }

  function displayJoke(data) {
    // Get a random emoji for the joke
    const emojis = [
      '<i class="fas fa-laugh-squint"></i>',
      '<i class="fas fa-grin-tears"></i>',
      '<i class="fas fa-laugh-beam"></i>',
      '<i class="fas fa-grin-stars"></i>',
      '<i class="fas fa-laugh-wink"></i>',
    ]
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    if (data.type === "single") {
      jokeContainer.innerHTML = `<div class="joke-wrapper fade-in">
          <div class="joke-emoji">${randomEmoji}</div>
          <i class="fas fa-quote-left quote-icon"></i>
          <p>${data.joke}</p>
          <i class="fas fa-quote-right quote-icon"></i>
        </div>`
    } else {
      jokeContainer.innerHTML = `<div class="joke-wrapper fade-in">
          <div class="joke-emoji">${randomEmoji}</div>
          <i class="fas fa-quote-left quote-icon"></i>
          <p>${data.setup}</p>
          <p class="punchline"><strong>${data.delivery}</strong></p>
          <i class="fas fa-quote-right quote-icon"></i>
        </div>`
    }

    // Add emoji styling
    const jokeEmoji = jokeContainer.querySelector(".joke-emoji")
    jokeEmoji.style.position = "absolute"
    jokeEmoji.style.top = "-30px"
    jokeEmoji.style.right = "-20px"
    jokeEmoji.style.fontSize = "3rem"
    jokeEmoji.style.color = "var(--primary-color)"
    jokeEmoji.style.transform = "rotate(15deg)"
    jokeEmoji.style.opacity = "0.8"
    jokeEmoji.style.transition = "transform 0.3s"

    jokeEmoji.addEventListener("mouseover", () => {
      jokeEmoji.style.transform = "rotate(0deg) scale(1.2)"
    })

    jokeEmoji.addEventListener("mouseout", () => {
      jokeEmoji.style.transform = "rotate(15deg) scale(1)"
    })

    // Create confetti effect for successful joke fetch
    createConfetti()

    // Animate floating emojis
    animateFloatingEmojis()
  }

  function resetFields() {
    categoryInputs.forEach((input) => (input.checked = false))
    anyCategory.checked = true
    toggleCategorySelection()

    document.querySelectorAll(".blacklist-selection input").forEach((input) => {
      input.checked = false
    })

    document.getElementById("language").value = "en"

    jokeContainer.innerHTML = `<div class="empty-state">
        <i class="fas fa-laugh-squint empty-icon"></i>
        <p>Such empty. Very await. Wow.</p>
      </div>`

    // Switch back to options tab
    tabButtons.forEach((btn) => btn.classList.remove("active"))
    tabButtons[0].classList.add("active")
    tabContents.forEach((content) => {
      content.style.display = "none"
    })
    document.getElementById("options").style.display = "block"
  }

  function toggleCategorySelection() {
    const isAnySelected = anyCategory.checked
    const isCustomSelected = customCategory.checked

    categoryInputs.forEach((input) => {
      if (input.value !== "any" && input.value !== "custom") {
        input.disabled = isAnySelected // Disable all if "Any" is checked
      }
    })

    if (isCustomSelected) {
      anyCategory.disabled = false // Allow selecting "Any" again
    } else {
      anyCategory.disabled = false // Keep "Any" selectable when it's not checked
    }
  }

  // Initialize the UI
  toggleCategorySelection()
})