import { apiRequest } from "./api"

export function getCustomerById(id,token) {
    return apiRequest(`/customer/${id}`, "GET", null, token);
}

export function addOrder(orderData, token) {
  return apiRequest(`/add_order`, "POST", orderData, token);
}