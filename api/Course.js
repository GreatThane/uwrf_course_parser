import {page} from "./Shared.js"

export class Course {
    constructor(departmentId, courseId) {
        if (!departmentId) {
            throw new Error(`"${departmentId}" is not a valid department.`);
        }
        if (!courseId) {
            throw new Error(`"${courseId}" is not a valid course.`);
        }
        this.departmentId = departmentId;
        this.courseId = courseId;
    }

    async getDetails() {
        await page.goto(`https://www.uwrf.edu/ClassSchedule/courseLightbox.cfm?subject=${this.departmentId}&catalogNumber=${this.courseId}`);
        const rows = await page.$$('tbody > tr');
        if (!rows || rows.length === 0) {
            throw new Error(`Course "${this.courseId}" is not associated with department "${this.departmentId}".`);
        }
        const coreDetails = await rows[1].$$('td');
        const output = {
            title: (await coreDetails[2].evaluate(e => e.textContent)).trim()
        };
        const credits = coreDetails.length > 3 ? (await coreDetails[3].evaluate(e => e.textContent)).trim() : null;
        if (credits?.includes('-')) {
            const [min, max] = credits.split('-').map(s => Number(s.trim()));
            output.credits = { min, max };
        } else if (credits) output.credits = Number(credits);

        if (rows.length > 2
            && await rows[2].evaluate(e => e.children.length > 0)
            && await rows[2].$eval('td strong', e => e.textContent.includes('Details:'))) {
            let details = await rows[2].$eval('td', e => e.childNodes[1].textContent.trim());
            if (details.endsWith(')') || details.endsWith(').')) {
                const semesters = details.substring(details.lastIndexOf('(') + 1, details.lastIndexOf(')'));
                output.semesters = semesters.split(',').map(s => s.trim());
                details = details.substring(0, details.lastIndexOf('(')).trim();
            }
            const preReqRegex = /Prerequisite:|Prerequisite :|Prerequisites :|Prerequisites:/g;
            if (preReqRegex.test(details)) {
                let prerequisites;
                [details, prerequisites] = details.split(preReqRegex);
                output.details = details.replaceAll('\n', '').trim();
                prerequisites = prerequisites.trim().split(/,|and/gi)
                    .map(s => s.trim().split(" "))
                    .map(a => a.map(s => s.replaceAll(/\W/g,'')))
                    .map(a => a.filter(s => /^(?:\d+|[A-Z]+)$/g.test(s)))
                    .map(a => a.filter((s, i, a) => (i !== 0 && /[A-Z]+/g.test(a[i - 1]) && /\d+/g.test(s))
                        || (i !== a.length - 1 && /\d+/g.test(a[i + 1]) && /[A-Z]+/g.test(s))))
                    .filter(a => a.length > 0);

                output.prerequisites = [];
                for (let i = 0; i < prerequisites.length; i++) {
                    if (prerequisites[i].length >= 2) {
                        for (let j = 0; j < prerequisites[i].length; j += 2) {
                            output.prerequisites.push([prerequisites[i][j], prerequisites[i][j + 1]]);
                        }
                    } else {
                        output.prerequisites.push(prerequisites[i]);
                    }
                }
                output.prerequisites = output.prerequisites.map(a => ({
                    department: a[0].trim(),
                    course: Number(a[1].trim())
                }));

            } else output.details = details;

        }

        const numSections = (await page.$$('tbody > .tr-border')).length;
        if (numSections > 0) {
            output.sections = [];
        }

        let rowIndex = 3;
        for (let i = 0; i < numSections; i++) {
            const innerRows = [];
            do {
                innerRows.push(await rows[rowIndex].$$eval('td', a => a.map(e => e.textContent.trim())));
                rowIndex++;
            } while (await rows[rowIndex - 1].evaluate(e => !e.classList.contains('tr-border')));
            while (rows.length > rowIndex && await rows[rowIndex].evaluate(e => e.children.length === 0)) {
                rowIndex++;
            }

            let dates = innerRows[2][1];
            if (dates.includes("-")) {
                const [from, to] = dates.split('-').map(s => {
                    const [month, day, year] = s.trim().split('/').map(s => Number(s.trim()));
                    return new Date(year, month - 1, day);
                });
                dates = { from, to };
            }
            let enrollment = innerRows[4][1];
            if (enrollment.includes("of")) {
                const [current, capacity] = enrollment.split('of').map(s => Number(s.trim()));
                enrollment = { current, capacity };
            }

            let time = innerRows[3][1].trim();
            if (time) {
                const pieces = time.split(' ');
                time = {
                    start: `${pieces[0]} ${pieces[1]}`,
                    end: `${pieces[3]} ${pieces[4]}`,
                    days: pieces.slice(5)
                }
            } else time = null;

            let notes = innerRows.length > 5 ? innerRows[5][1].trim() : null;

            output.sections.push({
                section: Number(innerRows[0][1]),
                classNumber: Number(innerRows[0][3]),
                term: innerRows[1][1],
                status: innerRows[1][3],
                dates,
                topic: innerRows[2][3],
                time,
                instructor: innerRows[3][3],
                enrollment,
                room: innerRows[4][3],
                notes
            });
        }
        return output;
    }
}