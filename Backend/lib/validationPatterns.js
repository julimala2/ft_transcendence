const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// caracteres speciaux acceptes : ! @ # $ % ^ & * ( ) _ + - = [ ] { } ; ' : " \ | , . < > / ?
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

module.exports = { emailRegex, passwordRegex };
