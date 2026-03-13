import logo from "./assets/logo.png";
import "./styles/construction.css";

function App() {
  return (
    <div className="container">

      <img src={logo} alt="PrimaVista Logo" className="logo" />

      <h1 className="trockenbau">TROCKENBAU</h1>
      <h2 className="primavista">PRIMA VISTA</h2>

      <p className="construction">Website under construction</p>

      <div className="links">
        <a
          href="https://www.instagram.com/primavista.bauprojekte"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>

        <a
          href="https://www.facebook.com/PrimaVistaBauprojekte"
          target="_blank"
          rel="noreferrer"
        >
          Facebook
        </a>
      </div>

    </div>
  );
}

export default App;