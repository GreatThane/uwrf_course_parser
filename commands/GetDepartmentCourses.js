import {Department} from "../api/Department.js";
import {terminate} from "../api/Shared.js";

try {
    const department = new Department(process.argv[2]);
    await terminate(0, {
        id: department.id,
        name: await department.getName(),
        courses: await department.getCourses()
    });
} catch (e) {
    await terminate(1, e.message);
}