import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import rawData from "../data/data.json";

// 1) Tableau des notes (grades)
// -> 1 entrée = 1 note pour 1 étudiant dans 1 matière
export const grades = rawData.map((row) => ({
  id: row.unique_id,
  studentId: row.student.id,
  courseCode: row.course,   // on utilise le nom du cours comme identifiant
  date: row.date,
  grade: row.grade,
}));

// 2) Tableau des étudiants (uniques)
const studentsMap = new Map();

rawData.forEach((row) => {
  const s = row.student;
  if (!studentsMap.has(s.id)) {
    studentsMap.set(s.id, {
      id: s.id,
      firstname: s.firstname,
      lastname: s.lastname,
    });
  }
});

export const students = Array.from(studentsMap.values());

// 3) Tableau des matières (uniques)
const coursesMap = new Map();

rawData.forEach((row) => {
  const code = row.course; // ex: "Math 101"
  if (!coursesMap.has(code)) {
    coursesMap.set(code, {
      code,       // identifiant de la matière
      label: code // pour l'affichage (tu pourras changer plus tard)
    });
  }
});

export const courses = Array.from(coursesMap.values());


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

export function StudentTable() {
  if (!Array.isArray(students) || students.length === 0) {
    return <p>Aucun étudiant à afficher</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="tableau des étudiants">
        <TableHead>
          <TableRow>
            <TableCell>ID étudiant</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Nom</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {students.map((s) => (
            <Student key={s.id} student={s} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export function Student({ student }) {
  return (
    <TableRow>
      <TableCell>{student.id}</TableCell>
      <TableCell>{student.firstname}</TableCell>
      <TableCell>{student.lastname}</TableCell>
    </TableRow>
  );
}


export function Course({ course }) {
  return (
    <TableRow>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.label}</TableCell>
    </TableRow>
  );
}

export function CourseTable() {
  if (!Array.isArray(courses) || courses.length === 0) {
    return <p>Aucune matière à afficher</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="tableau des matières">
        <TableHead>
          <TableRow>
            <TableCell>Code matière</TableCell>
            <TableCell>Intitulé</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {courses.map((c) => (
            <Course key={c.code} course={c} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function Grade({ grade, student, course }) {
  return (
    <TableRow>
      <TableCell>{grade.id}</TableCell>
      <TableCell>{student ? `${student.firstname} ${student.lastname}` : "-"}</TableCell>
      <TableCell>{student ? student.id : "-"}</TableCell>
      <TableCell>{course ? course.label : grade.courseCode}</TableCell>
      <TableCell>{grade.date}</TableCell>
      <TableCell align="right">{grade.grade}</TableCell>
    </TableRow>
  );
}

export function GradeTable() {
  if (!Array.isArray(grades) || grades.length === 0) {
    return <p>Aucune note à afficher</p>;
  }

  // Index pour retrouver rapidement étudiant et matière
  const studentById = new Map(students.map((s) => [s.id, s]));
  const courseByCode = new Map(courses.map((c) => [c.code, c]));

  return (
    <TableContainer component={Paper}>
      <Table aria-label="tableau des notes">
        <TableHead>
          <TableRow>
            <TableCell>Unique ID</TableCell>
            <TableCell>Étudiant</TableCell>
            <TableCell>ID Étudiant</TableCell>
            <TableCell>Matière</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Note</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {grades.map((g) => {
            const student = studentById.get(g.studentId);
            const course = courseByCode.get(g.courseCode);

            return (
              <Grade
                key={g.id}
                grade={g}
                student={student}
                course={course}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
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
    return <GradeTable/>;
  }

  if (activeItem === "etudiants") {
    return <StudentTable />;
  }

  if (activeItem === "matieres") {
    return <CourseTable/>;
  }

  if (activeItem === "apropos") {
    return <p>Ce projet est réalisé par Mackey CHARLES</p>;
  }

  return <p>Veuillez choisir une section dans le menu.</p>;
}
