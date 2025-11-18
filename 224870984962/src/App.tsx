import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Training from "@/pages/Training";
import { createContext, useState } from "react";
import TreasureBoxGame from "@/components/games/TreasureBoxGame";
import MemoryCardGame from "@/components/games/MemoryCardGame";
import ExpressionScenarioGame from "@/components/games/ExpressionScenarioGame";
import ExpressionSelectionGame from "@/components/games/ExpressionSelectionGame";
import SettingsPage from "@/pages/Settings";
import EmotionRecognition from "@/pages/EmotionRecognition";
import EmotionSupportAgent from "@/pages/EmotionSupportAgent";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value: boolean) => {},
  logout: () => {},
});

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/training" element={<Training />} />
        <Route path="/emotion-recognition" element={<EmotionRecognition />} />
        <Route path="/emotion-support" element={<EmotionSupportAgent />} />

        <Route path="/training/game/treasure" element={<TreasureBoxGame />} />
        <Route path="/training/game/memory" element={<MemoryCardGame />} />
        <Route path="/training/game/scenario" element={<ExpressionScenarioGame />} />
        <Route path="/training/game/selection" element={<ExpressionSelectionGame />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AuthContext.Provider>
  );
}
