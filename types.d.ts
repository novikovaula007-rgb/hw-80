export interface Category {
    id: number,
    title: string,
    description: string
}

export interface Item {
    id: number,
    category_id: number,
    place_id: number,
    title: string,
    image: string | null,
    description: string | null,
    created_on: Date
}

export interface ItemMutation {
    category_id: number,
    place_id: number,
    title: string,
    image: string | null,
    description: string | null,
}

export interface Place {
    id: number,
    title: string,
    description: string
}