import {terminate} from "../api/Shared.js";
import {DepartmentList} from "../api/DepartmentList.js";

try {
    await terminate(0, await new DepartmentList().getList());
} catch (e) {
    await terminate(1, e.message);
}