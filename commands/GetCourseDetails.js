import {Course} from "../api/Course.js";
import {terminate} from "../api/Shared.js";
import {DepartmentList} from "../api/DepartmentList.js";

try {
    const course = new Course(process.argv[2], process.argv[3], await new DepartmentList().getList());
    await terminate(0, {
        departmentId: process.argv[2],
        courseId: Number(process.argv[3]),
        ...await course.getDetails()
    });
} catch (e) {
    await terminate(1, e);
}