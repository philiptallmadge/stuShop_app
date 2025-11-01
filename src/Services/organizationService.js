import { apiRequest } from "./api";

// Get all organizations
export function getOrganizations(token) {
  return apiRequest("/organizations", "GET", null, token);
}

// Get one organization by ID
export function getOrganizationById(id, token) {
  return apiRequest(`/organizations/${id}`, "GET", null, token);
}

// Create a new organization
export function createOrganization(organization, token) {
  return apiRequest("/organizations", "POST", organization, token);
}

// Update an existing organization
export function updateOrganization(id, updates, token) {
  return apiRequest(`/organizations/${id}`, "PUT", updates, token);
}

// Delete an organization
export function deleteOrganization(id, token) {
  return apiRequest(`/organizations/${id}`, "DELETE", null, token);
}