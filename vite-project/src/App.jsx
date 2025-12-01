import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState, useEffect } from "react";

function Horloge() {
  const [now, setNow] = useState(new Date());

  // Met à jour l'heure chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Nettoyage quand le composant est démonté
    return () => clearInterval(timer);
  }, []);

  const joursSemaine = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  const moisNoms = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const jourSemaine = joursSemaine[now.getDay()];
  const jour = now.getDate();
  const mois = moisNoms[now.getMonth()];
  const annee = now.getFullYear();

  const heure = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const seconde = String(now.getSeconds()).padStart(2, "0");

  return (
    <p>
      Bonjour, on est le {jourSemaine} {jour} {mois} {annee} et il est{" "}
      {heure}:{minute}:{seconde}
    </p>
  );
}
function Test() {
  return <p>Test du composant</p>
}

function Header()
{
  return (
    <div>
      <img src="/mbds_logo_transparent.svg" className="logo" alt="Vite logo" />
      <h1>Introduction à React </h1>
      <h2> A la découverte des premières notions de React </h2>
    </div>
  )
}

function MainContent(){
  return (
    <p> <Horloge/> </p>
  )
}

function Footer()
{
  return <p>Tous droits réservés - CHARLES Mackey </p>
}
// Composant avec un state local
function Backup() {
  const [count, setCount] = useState(0)   // ✅ state défini ici

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        <Test />

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

function App() {
  return (
    <>
      <Header/>
      <MainContent/>
      <Footer/>
      
    </>
  )
}

export default App
