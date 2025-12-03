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
export const grades = rawData.map((row) => ({
  id: row.unique_id,
  studentId: row.student.id,
  courseCode: row.course,
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

export function RandomStudent() {
  var index = Math.floor(Math.random() * students.length);
  return (<Student id={index} />);
}

/* ===================== */
/*     STUDENT TABLE     */
/* ===================== */

export function StudentTable() {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  if (!Array.isArray(students) || students.length === 0) {
    return <p>Aucun étudiant à afficher</p>;
  }

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setPage(0);
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      String(s.id).includes(q) ||
      s.firstname.toLowerCase().includes(q) ||
      s.lastname.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const cmp = aStr.localeCompare(bStr);
    return sortConfig.direction === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = page * rowsPerPage;
  const paginated = sorted.slice(start, start + rowsPerPage);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <>
      <div className="table-controls">
        <input
          type="text"
          placeholder="Rechercher un étudiant..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="tableau des étudiants">
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                ID étudiant {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("firstname")}
                style={{ cursor: "pointer" }}
              >
                Prénom {sortConfig.key === "firstname" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("lastname")}
                style={{ cursor: "pointer" }}
              >
                Nom {sortConfig.key === "lastname" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((s) => (
              <Student key={s.id} student={s} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination">
        <button onClick={goPrev} disabled={page === 0}>
          Précédent
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button onClick={goNext} disabled={page >= totalPages - 1}>
          Suivant
        </button>
      </div>
    </>
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

/* ===================== */
/*     COURSE TABLE      */
/* ===================== */

export function Course({ course }) {
  return (
    <TableRow>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.label}</TableCell>
    </TableRow>
  );
}

export function CourseTable() {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "code", direction: "asc" });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  if (!Array.isArray(courses) || courses.length === 0) {
    return <p>Aucune matière à afficher</p>;
  }

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setPage(0);
  };

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.label.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const cmp = aStr.localeCompare(bStr);
    return sortConfig.direction === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = page * rowsPerPage;
  const paginated = sorted.slice(start, start + rowsPerPage);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <>
      <div className="table-controls">
        <input
          type="text"
          placeholder="Rechercher une matière..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="tableau des matières">
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("code")}
                style={{ cursor: "pointer" }}
              >
                Code matière {sortConfig.key === "code" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("label")}
                style={{ cursor: "pointer" }}
              >
                Intitulé {sortConfig.key === "label" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map((c) => (
              <Course key={c.code} course={c} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination">
        <button onClick={goPrev} disabled={page === 0}>
          Précédent
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button onClick={goNext} disabled={page >= totalPages - 1}>
          Suivant
        </button>
      </div>
    </>
  );
}

/* ===================== */
/*      GRADE TABLE      */
/* ===================== */

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
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  if (!Array.isArray(grades) || grades.length === 0) {
    return <p>Aucune note à afficher</p>;
  }

  // Index pour retrouver rapidement étudiant et matière
  const studentById = new Map(students.map((s) => [s.id, s]));
  const courseByCode = new Map(courses.map((c) => [c.code, c]));

  const enriched = grades.map((g) => {
    const student = studentById.get(g.studentId);
    const course = courseByCode.get(g.courseCode);
    const studentName = student ? `${student.firstname} ${student.lastname}` : "";
    const courseLabel = course ? course.label : g.courseCode;
    return { grade: g, student, course, studentName, courseLabel };
  });

  const filtered = enriched.filter(({ grade, studentName, courseLabel }) => {
    const q = search.toLowerCase();
    return (
      String(grade.id).includes(q) ||
      String(grade.studentId).includes(q) ||
      grade.date.toLowerCase().includes(q) ||
      String(grade.grade).includes(q) ||
      studentName.toLowerCase().includes(q) ||
      courseLabel.toLowerCase().includes(q)
    );
  });

  const getValue = (item, key) => {
    switch (key) {
      case "id":
        return item.grade.id;
      case "studentName":
        return item.studentName;
      case "studentId":
        return item.grade.studentId;
      case "course":
        return item.courseLabel;
      case "date":
        return item.grade.date;
      case "grade":
        return item.grade.grade;
      default:
        return "";
    }
  };

  const sorted = [...filtered].sort((a, b) => {
    const aVal = getValue(a, sortConfig.key);
    const bVal = getValue(b, sortConfig.key);

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const cmp = aStr.localeCompare(bStr);
    return sortConfig.direction === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = page * rowsPerPage;
  const paginated = sorted.slice(start, start + rowsPerPage);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setPage(0);
  };

  return (
    <>
      <div className="table-controls">
        <input
          type="text"
          placeholder="Rechercher une note, un étudiant, une matière..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="tableau des notes">
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("id")}
                style={{ cursor: "pointer" }}
              >
                Unique ID {sortConfig.key === "id" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("studentName")}
                style={{ cursor: "pointer" }}
              >
                Étudiant {sortConfig.key === "studentName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("studentId")}
                style={{ cursor: "pointer" }}
              >
                ID Étudiant {sortConfig.key === "studentId" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("course")}
                style={{ cursor: "pointer" }}
              >
                Matière {sortConfig.key === "course" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer" }}
              >
                Date {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
              <TableCell
                align="right"
                onClick={() => handleSort("grade")}
                style={{ cursor: "pointer" }}
              >
                Note {sortConfig.key === "grade" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginated.map(({ grade, student, course }) => (
              <Grade
                key={grade.id}
                grade={grade}
                student={student}
                course={course}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="pagination">
        <button onClick={goPrev} disabled={page === 0}>
          Précédent
        </button>
        <span>
          Page {page + 1} / {totalPages}
        </span>
        <button onClick={goNext} disabled={page >= totalPages - 1}>
          Suivant
        </button>
      </div>
    </>
  );
}

/* ===================== */
/*   LAYOUT & CONTENT    */
/* ===================== */

export function Header() {
  return (
    <div>
      <img src="/mbds_logo_transparent.svg" className="logo" alt="Vite logo" />
    </div>
  );
}

export function MainContent() {
  const [activeItem, setActiveItem] = useState("notes");

  return (
    <main>
      <Menu activeItem={activeItem} onChange={setActiveItem} />
      {/* Animation fade-in sur changement de menu */}
      <div key={activeItem} className="fade">
        <Content activeItem={activeItem} />
      </div>
    </main>
  );
}

export function Footer() {
  return <FooterCredit />;
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
    return <GradeTable />;
  }

  if (activeItem === "etudiants") {
    return <StudentTable />;
  }

  if (activeItem === "matieres") {
    return <CourseTable />;
  }

  if (activeItem === "apropos") {
    return <p>Ce projet est réalisé par Mackey CHARLES</p>;
  }

}
