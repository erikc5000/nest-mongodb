import { MongoClientOptions } from 'mongodb'

export const MONGO_CONNECTION_NAME = 'MongoConnectionName'
export const MONGO_MODULE_OPTIONS = 'MongoModuleOptions'

export const DEFAULT_MONGO_CONNECTION_NAME = 'DefaultMongo'
export const DEFAULT_MONGO_CLIENT_OPTIONS: MongoClientOptions = { useNewUrlParser: true }