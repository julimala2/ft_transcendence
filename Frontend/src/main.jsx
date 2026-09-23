import App from "./App.jsx"
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./Context/AuthContext.jsx"  
import { LoginForm } from "./Auth/LoginForm.jsx"
import { RegisterForm } from "./Auth/RegisterForm.jsx"

createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      {/* <App /> */}
      <div style={{padding:20,backgroundColor:"steelblue"}}>
        <label>Log In</label>
        <LoginForm></LoginForm>
      </div>
      <div style={{padding:20}}>
        <label>Register</label>
        <RegisterForm></RegisterForm>
      </div>
    </AuthProvider>
  </>
) 