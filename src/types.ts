export interface Movie {
    id?: number;
    title?: string;
    poster_path?: string;
    vote_average?: number;
    release_date?: string;
    adult?: boolean;
    original_language?: string;
}

export interface SearchTermMovie {
    $collectionId?: string;
    $createdAt?: string;
    $databaseId?: string;
    $id?: string;
    $permissions?: object;
    $updatedAt?: string;
    searchTerm?: string;
    count?: number;
    movie_id?: number;
    poster_url?: string;
}