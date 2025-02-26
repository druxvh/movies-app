import { Client, Databases, ID, Query } from "appwrite"
import { Movie, SearchTermMovie } from "./types"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID

// appwrite config
const client = new Client()
client.setProject(PROJECT_ID);

const database = new Databases(client)

// update search count fn
export const updateSearchCount = async (searchTerm: string, movie: Movie): Promise<void> => {
    try {
        const result = await database.listDocuments(DB_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ])
        // if exist in db, increase the count
        if (result.documents.length > 0) {
            const document = result.documents[0]

            await database.updateDocument(DB_ID, COLLECTION_ID, document.$id, { count: document.count + 1 })
        }
        // create a movie db with count
        else {
            await database.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.error(error)
    }
}

// gets trending movies from the db
export const getTrendingMovies = async (): Promise<SearchTermMovie[]> => {
    try {
        const data = await database.listDocuments(DB_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return data.documents
    } catch (error) {
        console.error(error)
        return []
    }
}