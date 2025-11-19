import { apiRequest } from "./api"

export function getCustomerById(id,token) {
    return apiRequest(`/customer/${id}`, "GET", null, token);
}