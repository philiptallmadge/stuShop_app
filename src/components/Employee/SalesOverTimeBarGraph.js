import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {getOrganizations, getOrganizationById, getListingsByOrganizationId, getOrdersByListing} from "../../Services/organizationService.js"


export default function SalesOverTimeBarGraph( {data} ) {
    //interactive by time
    return (
        <BarChart data={data}>
        
        </BarChart>
    );
}