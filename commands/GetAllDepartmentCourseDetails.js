import {terminate} from "../api/Shared.js";
import {DepartmentList} from "../api/DepartmentList.js";
import {Department} from "../api/Department.js";
import {Course} from "../api/Course.js";

try {
    const departments = await new DepartmentList().getList();

    const output = {};
    for (let department of departments) {
        try {
            department = new Department(department);
            output[department.id] = {
                name: await department.getName(),
                courses: []
            }
            for (let course of await department.getCourses()) {
                try {
                    output[department.id].courses.push({
                        id: course,
                        ...await new Course(department.id, course, departments).getDetails()
                    });
                } catch (e) {
                    output[department.id].courses.push({
                        id: course
                    });
                }

            }
        } catch (e) {
            output[department] = null;
        }
    }

    await terminate(0, output);
} catch (e) {
    await terminate(1, e.message);
}