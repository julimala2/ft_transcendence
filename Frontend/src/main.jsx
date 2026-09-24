import App from "./App.jsx"
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./Context/AuthContext.jsx"
import './Styling/Stylesheet.css'

createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <App />
    </AuthProvider>
  </>
) 