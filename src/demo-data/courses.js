const today = new Date();
let day = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

export const courses = [
  {
    courseCode: "COMP3278",
    courseName: "Introduction to Database Management System",
    academicYear: year,
    lecturer: "Dr. Ping Luo",
    desc: "This course studies the principles, design, administration, and implementation of database management systems. Topics include: entity-relationship model, relational model, relational algebra, database design and normalization, database query languages, indexing schemes, integrity and concurrency control.",
    preRequisites: [],
    startOn: new Date(year, 8, 1),
    endOn: new Date(year, 11, 30),
    schedules: [
      {
        weekday: 1,
        startAt: new Date(year, month, day, 14, 30),
        endAt: new Date(year, month, day, 15, 20),
      },
      {
        weekday: 4,
        startAt: new Date(year, month, day, 13, 30),
        endAt: new Date(year, month, day, 15, 20),
      },
    ],
  },
  {
    courseCode: "COMP3330",
    courseName: "Interactive Mobile Application Design and Programming",
    academicYear: year,
    lecturer: "Chim T W",
    desc: "This course introduces the techniques for developing interactive mobile applications on Android platform. Topics include user interface design, graphics, parallel computing, database, network, multimedia, sensors and location service. Trends and tools for developing applications on various mobile platforms are also discussed. Students participate in both individual assignments and group projects to practice ideation, reading, writing, coding and presentation skills. ",
    preRequisites: ["COMP2396"],
    startOn: new Date(year, 8, 1),
    endOn: new Date(year, 11, 30),
    schedules: [
      {
        weekday: 2,
        startAt: new Date(year, month, day, 13, 30),
        endAt: new Date(year, month, day, 15, 20),
      },
      {
        weekday: 5,
        startAt: new Date(year, month, day, 13, 30),
        endAt: new Date(year, month, day, 14, 20),
      },
    ],
  },
  {
    courseCode: "COMP3297",
    courseName: "Software Development",
    academicYear: year,
    lecturer: "Chim T W",
    desc: "This course introduces the techniques for developing interactive mobile applications on Android platform. Topics include user interface design, graphics, parallel computing, database, network, multimedia, sensors and location service. Trends and tools for developing applications on various mobile platforms are also discussed. Students participate in both individual assignments and group projects to practice ideation, reading, writing, coding and presentation skills. ",
    preRequisites: ["COMP2396"],
    startOn: new Date(year, 8, 1),
    endOn: new Date(year, 11, 30),
    schedules: [
      {
        weekday: 2,
        startAt: new Date(year, month, day, 9, 30),
        endAt: new Date(year, month, day, 10, 20),
      },
      {
        weekday: 5,
        startAt: new Date(year, month, day, 9, 30),
        endAt: new Date(year, month, day, 11, 20),
      },
    ],
  },
];
