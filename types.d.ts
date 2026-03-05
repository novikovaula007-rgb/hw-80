export interface Category {
    id: number,
    title: string,
    description: string
}

export interface CategoryMutation {
    title: string,
    description: string | null
}

export interface Item {
    id: number,
    category_id: number,
    place_id: number,
    title: string,
    image: string | null,
    description: string | null,
    created_at: Date
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

export interface PlaceMutation {
    title: string,
    description: string | null
}