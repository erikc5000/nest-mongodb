import { Inject } from '@nestjs/common'
import { getClientToken, getDbToken } from './mongo.util'

/**
 * Inject the MongoClient object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectClient = (connectionName?: string) => Inject(getClientToken(connectionName))

/**
 * Inject the Mongo Db object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectDb = (connectionName?: string) => Inject(getDbToken(connectionName))
