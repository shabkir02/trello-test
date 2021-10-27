export type TTodoItem = {
    title: string;
    id: string
    description: string;
    creationDate: string;
    editDate: string;
}

export type TCardItem = {
    id: string;
    title: string;
    content: Array<TTodoItem>
}