import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/SignupPage";
import MatchingPage from "./components/MatchingPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./components/Chat";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/matching" element={<MatchingPage />} />
            </Route>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
