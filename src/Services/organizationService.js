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

// Get all listings for an organization based on organization ID
export function getListingsByOrganizationId(organizationId, token) {
  return apiRequest(`/organizations/${organizationId}/listings`, "GET", null, token);
}
//Get all orders for an organization
export function getOrdersByOrganizationId(organizationId, token) {
  return apiRequest(`/organizations/${organizationId}/orders`, "GET", null, token);
}
//Get all orders for a listing
export function getOrdersByListing(listingId, token) {
  return apiRequest(`/organizations/listings/${listingId}/orders`, "GET", null, token);
}

// Create a new listing for an organization
export function createListingForOrganization(organizationId, listing, token) {
  return apiRequest(`/organizations/${organizationId}/listings`, "POST", listing, token);
}

export function updateListing(listingId, updates, token) {
  return apiRequest(`/organizations/listings/${listingId}`, "PUT", updates, token);
}

export function deleteListing(listingId, token) {
  return apiRequest(`/organizations/listings/${listingId}`, "DELETE", null, token);
}