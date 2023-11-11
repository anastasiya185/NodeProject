//פונקציה של כפתור כניסה שלוקחת נתונים ושולכת לשרת
//בשרת זה פונקציה ראשונה
async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert(data.message);
      }
    });
}

//פונקציה של כפתור הרשמה מעבירה את המשתמש לעמוד של הרשמה
async function handleRegistration() {
  window.location.href = "/signup";
}

//פונקציה של הרשמה לוקחת נתונים מהמשתמש ומעבירה לשרת
//בשרת זה פונקציה שניה
async function createUser() {
  const userName = document.getElementById("userName").value;
  const emailSignUp = document.getElementById("emailSignUp").value;
  const passwordSignUp = document.getElementById("passwordSignUp").value;

  const response = await fetch("/signup", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userName, emailSignUp, passwordSignUp }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        alert(data.message);
      }
    });
}
