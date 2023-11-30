import {page} from "./Shared.js"

export class DepartmentList {
    async getList() {
        await page.goto(`https://www.uwrf.edu/ClassSchedule/DepartmentList.cfm`);
        const departmentLinks = await page.$$('#departments a[href^="DepartmentCourses.cfm?subject"]');
        let departments = []
        for (let departmentLink of departmentLinks) {
            departments.push(new URL(await departmentLink.getProperty('href').then(p => p.jsonValue())).searchParams.get('subject'));

        }
        return departments;
    }
}