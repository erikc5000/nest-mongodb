import { Db } from 'mongodb'
import { getCollectionToken, getDbToken } from './mongo.util'

export function createMongoProviders(connectionName?: string, collections: string[] = []) {
    return (collections || []).map(collectionName => ({
        provide: getCollectionToken(collectionName),
        useFactory: (db: Db) => db.collection(collectionName),
        inject: [getDbToken(connectionName)]
    }))
}
