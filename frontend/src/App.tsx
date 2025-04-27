import { Routes, Route } from 'react-router-dom'

import ContinueWithGoogle from "@/features/auth/continue-with-google-landing-page"
import HomePage from '@/routes/HomePage'
import PrivateRoute from '@/routes/PrivateRoute'
import SignUpForm from '@/features/auth/SignUp'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <PrivateRoute url="/" redirectTo="/sign-in">
          <HomePage />
        </PrivateRoute>
      } />
      <Route path="/sign-in" element={
        <PrivateRoute url="/sign-in" redirectTo="/">
          <ContinueWithGoogle />
        </PrivateRoute>
      } />
      <Route path="/sign-up" element={
        <PrivateRoute url="/sign-up" redirectTo="/">
          <SignUpForm />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default App
