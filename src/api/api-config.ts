import { BASE_URL } from "@/constants/definitions";
import Cookies from 'js-cookie';
import { ENDPOINT } from "./helper";


const token = Cookies.get('token')

export const GET = async (endpoint: ENDPOINT) => {

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200 || response.status === 201) {
            return await response.json();
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error in PostAPI:', error);
        throw error;
    }
}


export const POST = async (endpoint: ENDPOINT, payload: any) => {

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(payload)
        });
        if (response.status === 200 || response.status === 201) {
            return await response.json();
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error in PostAPI:', error);
        throw error;
    }
}

export const PUT = async (endpoint: ENDPOINT, payload?: any) => {

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify(payload)
        });
        if (response.status === 200 || response.status === 201) {
            return await response.json();
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error in PostAPI:', error);
        throw error;
    }
}