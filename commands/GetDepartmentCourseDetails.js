import {Department} from "../api/Department.js";
import {terminate} from "../api/Shared.js";
import {Course} from "../api/Course.js";
import {DepartmentList} from "../api/DepartmentList.js";

try {
    const departments = await new DepartmentList().getList();
    const department = new Department(process.argv[2]);
    const courses = [];
    for (let courseId of await department.getCourses()) {
        try {
            courses.push({
                id: courseId,
                ...await new Course(department.id, courseId, departments).getDetails()
            });
        } catch (e) {
            courses.push({
                id: courseId
            });
        }

    }
    await terminate(0, {
        id: department.id,
        name: await department.getName(),
        courses
    });
} catch (e) {
    await terminate(1, e);
}