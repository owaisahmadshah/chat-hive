import { Routes, Route } from "react-router-dom";

import PrivateRoute from "@/routes/PrivateRoute";
import { SignUp } from "@/features/auth/SignUp";
import SignIn from "./features/auth/SignIn";
import ForgotPassword from "./features/auth/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute url="/" redirectTo="/sign-in">
            <div>Home page</div>
          </PrivateRoute>
        }
      />
      <Route
        path="/sign-in"
        element={
          <PrivateRoute url="/sign-in" redirectTo="/">
            <SignIn />
          </PrivateRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PrivateRoute url="/sign-up" redirectTo="/">
            <SignUp />
          </PrivateRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PrivateRoute url="/forgot-password" redirectTo="/">
            <ForgotPassword />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
