import { apiRequest } from "./api"

export function getEmployees(token) {
        return apiRequest("/employees", "GET", null, token);
}
export function getEmployeeById(id,token) {
    return apiRequest(`/employees/${id}`, "GET", null, token);
}
export function createEmployee(employee, token) {
    return apiRequest("/employees", "POST", employee, token)
}
export function updateEmployee(id, updates, token) {
    return apiRequest(`/employees/${id}`, "PUT", updates, token);
}
export function deleteEmployee(id, token) {
    return apiRequest(`/employees/${id}`, "DELETE", null, token);
}
export function getIncompleteOrders(id, token) {
    return apiRequest(`/employees/getIncompleteOrders`, "GET", null, token);
}
export function setCompleteOrder(OrderId, token) {
    return apiRequest(`/employees/setComplete`, "PUT", {"OrderId":OrderId}, token);
}