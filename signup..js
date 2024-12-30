// validation.js

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("form");
    const loginForm = document.getElementById("login-form");
  
    // Signup form submission
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const name = document.getElementById("name-input").value.trim();
      const lastName = document.getElementById("lastname-input").value.trim();
      const email = document.getElementById("email-input").value.trim();
      const password = document.getElementById("password-input").value;
      const repeatPassword = document.getElementById("repeat-password-input").value;
  
      if (!name || !lastName || !email || !password || !repeatPassword) {
        document.getElementById("signup-error-message").textContent = "All fields are required.";
        return;
      }
  
      if (password !== repeatPassword) {
        document.getElementById("signup-error-message").textContent = "Passwords do not match.";
        return;
      }
  
      const userData = { name, lastName, email, password };
      localStorage.setItem(email, JSON.stringify(userData));
      document.getElementById("success-message").textContent = "Signup successful!";
      signupForm.reset();
      setTimeout(() => {
        showSignin();
      }, 2000);
    });
  
    // Login form submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = document.getElementById("login-email-input").value.trim();
      const password = document.getElementById("login-password-input").value;
  
      if (!email || !password) {
        document.getElementById("login-error-message").textContent = "All fields are required.";
        return;
      }
  
      const userData = JSON.parse(localStorage.getItem(email));
  
      if (!userData || userData.password !== password) {
        document.getElementById("login-error-message").textContent = "Invalid email or password.";
        return;
      }
  
      document.getElementById("login-error-message").textContent = "Login successful!";
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    });
  });
  
  // Helper functions for toggling forms
  function showSignin() {
    document.body.classList.remove("show-signup");
    document.body.classList.add("show-signin");
  }
  
  function showSignup() {
    document.body.classList.remove("show-signin");
    document.body.classList.add("show-signup");
  }
  