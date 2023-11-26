import {Department} from "../api/Department.js";
import {terminate} from "../api/Shared.js";
import {Course} from "../api/Course.js";

try {
    const department = new Department(process.argv[2]);
    const courses = [];
    for (let courseId of await department.getCourses()) {
        try {
            courses.push({
                courseId: courseId,
                ...await new Course(department.id, courseId).getDetails()
            });
        } catch (e) {
            courses.push({
                courseId: courseId
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