import { Navigate, Routes, Route } from 'react-router-dom';
import HomePage from './scenes/HomePage/HomePage';
import LoginPage from './scenes/LoginPage/LoginPage';
import ProfilePage from './scenes/ProfilePage/ProfilePage';

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
            </Routes>
        </div>
    );
}

export default App;
