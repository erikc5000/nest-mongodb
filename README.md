# nest-mongodb

## Description

This is a MongoDB module for [NestJS](https://nestjs.com/), making it easy to inject the [MongoDB driver](https://www.npmjs.com/package/mongodb) into your project.  It's modeled after the official [Mongoose module](https://github.com/nestjs/mongoose), allowing for asynchronous configuration and such.

## Installation

In your existing NestJS-based project:

```
$ npm install nest-mongodb mongodb
```

## Usage

Overall, it works very similarly to the [Mongoose](https://docs.nestjs.com/techniques/mongodb) module described in the NestJS documentation, though without any notion of models.  You may want to refer to those docs as well -- and maybe the [dependency injection](https://docs.nestjs.com/fundamentals/custom-providers) docs too if you're still trying to wrap your head around the NestJS implementation of it.

### Simple example

In the simplest case, you can explicitly specify the database URI, name, and options you'd normally provide to your `MongoClient` using `MongoModule.forRoot()`:

```typescript
import { Module } from '@nestjs/common'
import { MongoModule } from 'nest-mongodb'

@Module({
    imports: [MongoModule.forRoot('mongodb://localhost', 'BestAppEver')]
})
export class CatsModule {}
```

To inject the Mongo `Db` object:

```typescript
import * as mongo from 'mongodb'
import { Injectable } from '@nestjs/common'
import { InjectDb } from 'nest-mongodb'
import { Cat } from './interfaces/cat'

@Injectable()
export class CatsRepository {
    private readonly collection: mongo.Collection

    constructor(@InjectDb() private readonly db: mongo.Db) {
        this.collection = this.db.collection('cats')
    }

    async create(cat: Cat) {
        const result = await this.collection.insertOne(cat)

        if (result.insertedCount !== 1 || result.ops.length < 1) {
            throw new Error('Insert failed!')
        }

        return result.ops[0]
    }
}
```

### Asynchrous configuration

If you want to pass in Mongo configuration options from a ConfigService or other provider, you'll need to perform the Mongo module configuration asynchronously, using `MongoModule.forRootAsync()`.  The are several different ways of doing this.

#### Use a factory function

The first is to specify a factory function that populates the options:

```typescript
import { Module } from '@nestjs/common'
import { MongoModule } from 'nest-mongodb'
import { ConfigService } from '../config/config.service'

@Module({
    imports: [MongoModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
            uri: config.mongoUri,
            dbName: config.mongoDatabase
        },
        inject: [ConfigService]
    })]
})
export class CatsModule {}
```

#### Use a class

Alternatively, you can write a class that implements the `MongoOptionsFactory` interface and use that to create the options:

```typescript
import { Module } from '@nestjs/common'
import { MongoModule, MongoOptionsFactory, MongoModuleOptions } from 'nest-mongodb'

@Injectable()
export class MongoConfigService implements MongoOptionsFactory {
    private readonly uri = 'mongodb://localhost'
    private readonly dbName = 'BestAppEver'

    createMongoOptions(): MongoModuleOptions {
        return {
            uri: this.uri,
            dbName: this.dbName
        }
    }
}

@Module({
    imports: [MongoModule.forRootAsync({
        useClass: MongoConfigService
    })]
})
export class CatsModule {}
```

Just be aware that the `useClass` option will instantiate your class inside the MongoModule, which may not be what you want.

#### Use existing

If you wish to instead import your MongoConfigService class from a different module, the `useExisting` option will allow you to do that.

```typescript
import { Module } from '@nestjs/common'
import { MongoModule, MongoOptionsFactory, MongoModuleOptions } from 'nest-mongodb'

@Module({
    imports: [MongoModule.forRootAsync({
        imports: [ConfigModule]
        useExisting: ConfigService
    })]
})
export class CatsModule {}
```

In this example, we're assuming that `ConfigService` implements the `MongoOptionsFactory` interface and can be found in the ConfigModule.
