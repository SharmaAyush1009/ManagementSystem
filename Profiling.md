Before indexing->

db.placements.find({ branch: "CSE", batch: 2023 }).explain("executionStats")

{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'ManagementSystem.placements',
    parsedQuery: {
      '$and': [ { batch: { '$eq': 2023 } }, { branch: { '$eq': 'CSE' } } ]
    },
    indexFilterSet: false,
    queryHash: '2C30F0EE',
    planCacheShapeHash: '2C30F0EE',
    planCacheKey: '6F0FDFEE',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: {
        '$and': [ { batch: { '$eq': 2023 } }, { branch: { '$eq': 'CSE' } } ]
      },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 360,
    executionTimeMillis: 6,
    totalKeysExamined: 0,
    totalDocsExamined: 10012,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: {
        '$and': [ { batch: { '$eq': 2023 } }, { branch: { '$eq': 'CSE' } } ]
      },
      nReturned: 360,
      executionTimeMillisEstimate: 7,
      works: 10013,
      advanced: 360,
      needTime: 9652,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 10012
    }
  },
  queryShapeHash: '443F3BD29BA47C2C039DCA20DBC78DEC6982634F7CA68CEFA84DC727F20FA629',
  command: {
    find: 'placements',
    filter: { branch: 'CSE', batch: 2023 },
    '$db': 'ManagementSystem'
  },
  serverInfo: {
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
  },
  serverInfo: {
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
  serverInfo: {
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
    port: 27017,
    version: '8.0.17',
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1766497222, i: 3 }),
    signature: {
      hash: Binary.createFromBase64('rbOQwiiHLsjtzvHmnQ2ys5H4WeE=', 0),
      keyId: Long('7553015210550755329')
    }
  },
  operationTime: Timestamp({ t: 1766497222, i: 3 })
}

----------------------------------------------------------------------

After indexing->

{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'ManagementSystem.placements',
    parsedQuery: {
      '$and': [ { batch: { '$eq': 2023 } }, { branch: { '$eq': 'CSE' } } ]
    },
    indexFilterSet: false,
    queryHash: '2C30F0EE',
    planCacheShapeHash: '2C30F0EE',
    planCacheKey: '03C63920',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { branch: 1, batch: 1, package: -1 },
        indexName: 'branch_1_batch_1_package_-1',
        isMultiKey: false,
        multiKeyPaths: { branch: [], batch: [], package: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          branch: [ '["CSE", "CSE"]' ],
          batch: [ '[2023, 2023]' ],
          package: [ '[MaxKey, MinKey]' ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 360,
    executionTimeMillis: 3,
    totalKeysExamined: 360,
    totalDocsExamined: 360,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 360,
      executionTimeMillisEstimate: 1,
      works: 361,
      advanced: 360,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 360,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 360,
        executionTimeMillisEstimate: 0,
        works: 361,
        advanced: 360,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { branch: 1, batch: 1, package: -1 },
        indexName: 'branch_1_batch_1_package_-1',
        isMultiKey: false,
        multiKeyPaths: { branch: [], batch: [], package: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          branch: [ '["CSE", "CSE"]' ],
          batch: [ '[2023, 2023]' ],
          package: [ '[MaxKey, MinKey]' ]
        },
        keysExamined: 360,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '443F3BD29BA47C2C039DCA20DBC78DEC6982634F7CA68CEFA84DC727F20FA629',
  command: {
    find: 'placements',
    filter: { branch: 'CSE', batch: 2023 },
    '$db': 'ManagementSystem'
  },
  serverInfo: {
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
    '$db': 'ManagementSystem'
  },
  serverInfo: {
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
  },
  serverInfo: {
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
    host: 'ac-fgplddg-shard-00-01.ypiybql.mongodb.net',
    port: 27017,
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
  serverParameters: {
    port: 27017,
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
  serverParameters: {
    version: '8.0.17',
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
  serverParameters: {
    gitVersion: 'b20e43625b72f4bb43cc15107f80ac966ae13b6d'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 16793600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 33554432,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1766499417, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('VU6KOSSpjxEOOOfvKkNlD4I833k=', 0),
      keyId: Long('7553015210550755329')
    }
  },
  operationTime: Timestamp({ t: 1766499417, i: 1 })
}
-------------------------------------------------------------------

indexing->

db.placements.createIndex({ branch: 1, batch: 1, package: -1 })

################# Before
stage: COLLSCAN
totalDocsExamined: 10012
nReturned: 360
executionTimeMillis: 6

################# After
stage: IXSCAN → FETCH
totalDocsExamined: 360
totalKeysExamined: 360
nReturned: 360
executionTimeMillis: 3


andddddddddddddddddddddddddddddd
optimisation 2------------------------------------------------->>
.find(query).select("name branch batch company package")
This reduces BSON size → faster response.