export interface IPoint {
    id?: number;
    name: string;
    email: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    city: string;
    uf: string;
    image?: string;
    image_url?: string;
}

export interface IItem {
    id?: number;
    title: string;
    image: string;
    image_url?: string;
}

export interface IPointItem {
    item_id: number;
    point_id: number;
}