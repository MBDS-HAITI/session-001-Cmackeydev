import { useState, useEffect } from "react";
import students from "../../../data.json"

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
      <h1>Introduction à React </h1>
      <h2> A la découverte des premières notions de React </h2>
    </div>
  )
}

export function MainContent(){
  return (
    <p> <Horloge/> </p>
  )
}

export function Footer()
{
  return <FooterCredit/>
}



export function Horloge() {
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

