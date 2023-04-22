import { useState } from "react";
import Wordle from "./components/Wordle";
import StatsIcon from "./assets/stats.svg";
import Rodal from "rodal";
import Stats from "./components/Stats";
import { Toaster } from "react-hot-toast";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />

      <Rodal
        height="350"
        visible={isModalVisible}
        onClose={hideModal}
        className="container-stats"
      >
        <Stats />
      </Rodal>

      <div className="header">
        <div>
          <h1>WORDLE</h1>
          <img
            src={StatsIcon}
            alt="Stats"
            className="header-icon"
            onClick={showModal}
          />
        </div>
      </div>

      <Wordle />
    </div>
  );
}

export default App;
