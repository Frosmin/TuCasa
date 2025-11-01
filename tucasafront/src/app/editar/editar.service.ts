import { PropertyPayload } from "../publicar/types/property.types";
import { URL_BACKEND } from "@/config/constants";




export async function fecthOferta(id: number) {
    const res = await fetch(`${URL_BACKEND}/oferta/${id}`);

    if(!res.ok) {
        throw new Error(`error al obtener oferta:${res.status}`)
    }
    const json = await res.json();

    return json.data;
}


export async function updateOferta(payload: PropertyPayload, id:number): Promise<any> {

    const res = await fetch(`${URL_BACKEND}/oferta/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    let errorData: any = {};
    const contentType = res.headers.get('Content-Type');


    if (!res.ok) {
        if (contentType && contentType.includes('application/json')) {
            errorData = await res.json().catch(() => ({}));
        } else {
            const text = await res.text();
            errorData = { message: text };
        }

        console.error('Error del servidor:', errorData);
        console.error('Payload que causó el error:', payload);
        throw { status: res.status, data: errorData };
    }

    const data = await res.json();
    return data;
}