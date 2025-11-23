export enum LoadingState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface PatentImage {
    url: string;
    local_path: string;
}

export interface Patent {
    id: string;
    page_url: string;
    title: string;
    pdf_url: string;
    abstract: string;
    images: PatentImage[];
    pdf_local_path: string;
    tags?: string[];
}

export interface NavItem {
    label: string;
    path: string;
}
