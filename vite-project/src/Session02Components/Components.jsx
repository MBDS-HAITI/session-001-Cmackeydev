import { useState, useEffect } from "react";
import students from "../../../data.json"

const MENU_ITEMS = [
  { id: "notes", label: "Notes" },
  { id: "etudiants", label: "Etudiants" },
  { id: "matieres", label: "Matieres" },
  { id: "apropos", label: "A propos" },
];

export function Menu({ activeItem, onChange }) {
  return (
    <nav>
      <ul>
        {MENU_ITEMS.map((item) => (
          <li
            key={item.id}
            onClick={() => onChange(item.id)}
            className={activeItem === item.id ? "active" : ""}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function FooterCredit() {
  const annee = new Date().getFullYear();

  return (
    <p>
      Tous droits réservés - {annee} CHARLES Mackey
    </p>
  );
}

export function RandomStudent()
{
 var index= Math.floor(Math.random() * students.length)
  return (<Student id={index}/> );
}
export function Student({id})
{
  return ( <table border="1">
      <thead>
        <tr>
          <th>Unique ID</th>
          <th>Cours</th>
          <th>Prénom</th>
          <th>Nom</th>
          <th>ID étudiant</th>
          <th>Date</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{students[id].unique_id}</td>
          <td>{students[id].course}</td>
          <td>{students[id].student.firstname}</td>
          <td>{students[id].student.lastname}</td>
          <td>{students[id].student.id}</td>
          <td>{students[id].date}</td>
          <td>{students[id].grade}</td>
        </tr>
      </tbody>
    </table>);
}

export function Header()
{
  return (
    <div>
      <img src="/mbds_logo_transparent.svg" className="logo" alt="Vite logo" />
    </div>
  )
}

export function MainContent() {
  const [activeItem, setActiveItem] = useState("notes");

  return (
    <main>
      <Menu activeItem={activeItem} onChange={setActiveItem} />
      <Content activeItem={activeItem} />
    </main>
  );
}


export function Footer()
{
  return <FooterCredit/>
}



export function Horloge() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

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
    <>
      Bonjour, on est le {jourSemaine} {jour} {mois} {annee} et il est{" "}
      {heure}:{minute}:{seconde}
    </>
  );
}

export function Content({ activeItem }) {
  if (activeItem === "notes") {
    return <p>Contenu de la page : Notes</p>;
  }

  if (activeItem === "etudiants") {
    return <p>Contenu de la page : Etudiants</p>;
  }

  if (activeItem === "matieres") {
    return <p>Contenu de la page : Matieres</p>;
  }

  if (activeItem === "apropos") {
    return <p>Contenu de la page : A propos</p>;
  }

  return <p>Veuillez choisir une section dans le menu.</p>;
}
