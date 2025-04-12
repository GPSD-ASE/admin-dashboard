const NETCUP_BASE_URL = "https://gpsd.duckdns.org/";
// const NETCUP_BASE_URL = "http://localhost:7001/";
const INCIDENT_LOCALHOST_URL = "http://localhost:8080/";
const USER_LOCALHOST_URL = "http://localhost:5500/api/v1/";

const BASE_URL = NETCUP_BASE_URL;


export const API_CONSTANTS: any = {
    LOGIN: NETCUP_BASE_URL + "signin",
    LOGOUT: NETCUP_BASE_URL + "signout",
    VERIFY_USER: NETCUP_BASE_URL + "verify",
    REGISTER: NETCUP_BASE_URL + "register-admin",
    GET_USER: NETCUP_BASE_URL + "users/",
    GET_ZONES: NETCUP_BASE_URL + "zones",
    SAFEZONES: NETCUP_BASE_URL + "safezones",
    GET_ROUTE: NETCUP_BASE_URL + "routing",
    CALC_EVACUATION: NETCUP_BASE_URL + "evacuation",
    GET_TRAFFIC: NETCUP_BASE_URL + "traffic",
    INCIDENTS: NETCUP_BASE_URL + "incidents",
    PATCH_INCIDENT: (id: string) => `${NETCUP_BASE_URL}incidents/${id}/status/`,

};
