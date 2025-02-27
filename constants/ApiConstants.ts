const NETCUP_BASE_URL = "https://152.53.124.121:30000/";
const MAP_LOCALHOST_URL = "http://localhost:7001/";
const INCIDENT_LOCALHOST_URL = "http://localhost:8080/";
const USER_LOCALHOST_URL = "http://localhost:5500/api/v1/";

const BASE_URL = NETCUP_BASE_URL;


export const API_CONSTANTS: any = {
    LOGIN: USER_LOCALHOST_URL + "signin",
    LOGOUT: USER_LOCALHOST_URL + "signout",
    VERIFY_USER: USER_LOCALHOST_URL + "verify",
    REGISTER: USER_LOCALHOST_URL + "users",
    GET_ZONES: MAP_LOCALHOST_URL + "zones",
    GET_ROUTE: MAP_LOCALHOST_URL + "routing",
    CALC_EVACUATION: MAP_LOCALHOST_URL + "evacuation",
    GET_TRAFFIC: MAP_LOCALHOST_URL + "traffic",
    INCIDENTS: INCIDENT_LOCALHOST_URL + "api/incidents",
    PATCH_INCIDENT: (id: string) => `${INCIDENT_LOCALHOST_URL}api/incidents/${id}/status/`,
};
