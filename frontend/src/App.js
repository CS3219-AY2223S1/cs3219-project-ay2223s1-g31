import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import MatchingPage from "./pages/MatchingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoomPage from "./pages/RoomPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/matching" element={<MatchingPage />} />
              <Route path="/room" element={<RoomPage />} />
            </Route>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
