import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LevelSelect from './pages/LevelSelect';
import PuzzleList from './pages/PuzzleList';
import GameBoard from './pages/GameBoard';
import './styles/app.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/levels" element={<LevelSelect />} />
        <Route path="/levels/:size" element={<PuzzleList />} />
        <Route path="/game/:size/:levelId" element={<GameBoard />} />
        <Route path="/" element={<Navigate to="/levels" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
