import { page } from "./Shared.js";

export class Department {
    constructor(id) {
        if (!id) {
            throw new Error(`"${id}" is not a valid department.`);
        }
        this.id = id;
    }

    async getName() {
        await page.goto(`https://www.uwrf.edu/ClassSchedule/DepartmentCourses.cfm?subject=${this.id}`);
        return await page.$eval('#bodySpanTop h4', e => e.textContent);
    }

    async getCourses() {
        await page.goto(`https://www.uwrf.edu/ClassSchedule/DepartmentCourses.cfm?subject=${this.id}`);
        const courses = await page.$$(`#bodySpanTop a[href^="courseLightbox.cfm?subject=${this.id}"]`);

        if (courses.length === 0) {
            throw new Error(`No courses associated with department "${this.id}".`);
        }

        const output = []
        for (let course of courses) {
            output.push(
                Number(new URL(await course.getProperty('href').then(p => p.jsonValue()))
                    .searchParams.get('catalogNumber').trim())
            );
        }

        return output;
    }
}
