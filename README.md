# UWRF Course Parser
Provides a few useful utilities for scraping UWRF course information.

## Getting started
1. Install Node.js.
2. Clone the project. 
3. Run `npm install` in the project directory.

## Getting Courses Associated with a Department
1. Find your department ID (if you were looking at the page https://www.uwrf.edu/ClassSchedule/DepartmentCourses.cfm?subject=CIDS, 
the department ID would be `CIDS` as shown in the URL).
2. `npm run get_department_courses -- CIDS` (or whatever your department ID is).

Will result in a status code of 1 in the result of an error (with a relevant error message), 
or status code 0 in the event of a successful scrape and the department details.
```json
{
  "id": "CIDS",
  "name": "Computer,Info and Data Science (CIDS)",
  "courses": [
    105, 120, 151, 161, 162, 215, 225, 235,
    237, 239, 246, 247, 248, 279, 289, 317,
    323, 325, 328, 333, 334, 337, 339, 343,
    346, 355, 373, 378, 379, 389, 402, 416,
    423, 425, 429, 431, 433, 435, 440, 441,
    451, 452, 484, 488, 489, 490, 499, 630,
    631, 634, 732, 733, 735, 736, 738, 789
  ]
}
```

## Getting Details About a Specific Course
1. Find your department ID (see above section)
2. Find your course number (self-explanatory)
3. `npm run get_course_details -- CIDS 490` (or whatever your department ID is) (or whatever your course number is).

Will result a status code of 1 in the result of an error (with a relevant error message),
or a status code of 0 in the event of a successful scrape and the course details.
```json
{
  "departmentId": "CIDS",
  "courseId": 423,
  "title": "Systems Analysis and Design",
  "credits": 3,
  "semesters": [ "F", "Sp" ],
  "details": "This course will enable students to apply the concepts, principles, and techniques of systems analysis and design to build a prototype of an information system or of a software application that addresses a real-world problem. Students will work on a project to elicit requirements, develop appropriate data and process models, design a solution, and implement it using a prototype. Students will also develop a project plan.",
  "prerequisites": [
    { "department": "CIDS", "course": 333 },
    { "department": "CIDS", "course": 343 }
  ],
  "sections": [
    {
      "section": 1,
      "classNumber": 1431,
      "term": "Fall 2023-2024",
      "status": "Active",
      "dates": { "from": "9/6/2023", "to": "12/15/2023" },
      "topic": "None",
      "time": { "start": "12:30 PM", "end": "01:45 PM", "days": [ "Tu", "Th" ] },
      "instructor": "Jani,Arpankumar",
      "enrollment": { "current": 11, "capacity": 25 },
      "room": "Davee Library 164"
    }
  ]
}
```
In the event that a course has variable credits, it will instead be in the following format:
```json
{
  "credits": { "min": 1, "max": 3 }
}
```

## Getting Details for All Courses Under a Department
1. Find your department ID (see above section)
2. `npm run get_department_course_details -- CIDS` (or whatever your department ID is)

Will result in a status code of 1 in the result of an error (with a relevant error message),
or status code 0 in the event of a successful scrape and the department details.

Course details will be filled in instead of just the course ID.

In the event that a course errors our during retrieval (such as a dead link on the department page), a stubbed entry 
will still be included for visibility.
```json
{
      "courseId": 789
}
```