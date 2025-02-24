const NETCUP_BASE_URL = "https://152.53.124.121:30000/";
const MAP_LOCALHOST_URL = "http://localhost:7001/";
const INCIDENT_LOCALHOST_URL = "http://localhost:3001/";
const USER_LOCALHOST_URL = "http://localhost:3002/";

const BASE_URL = NETCUP_BASE_URL;
const MAP_URL = MAP_LOCALHOST_URL;
const INCIDENT_URL = INCIDENT_LOCALHOST_URL;
const USER_URL = USER_LOCALHOST_URL;


export const API_CONSTANTS = {
    LOGIN: BASE_URL + "login",
    LOGOUT: BASE_URL + "logout",
    GET_ZONES: MAP_URL + "zones",
    GET_ROUTE: MAP_URL + "routing",
    CALC_EVACUATION: MAP_URL + "evacuation",
    GET_TRAFFIC: MAP_URL + "traffic",
    INCIDENTS: BASE_URL + "incidents",

};