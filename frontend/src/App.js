import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from "./components/SignupPage";
import MatchingPage from "./components/MatchingPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route
              exact
              path="/"
              element={<Navigate replace to="/signup" />}
            ></Route>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/matching" element={<MatchingPage />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
