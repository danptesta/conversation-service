# Conversation Service
This service provides all operations needed to allow two users (Alice and Bob) to collaboratively edit conversations.

The service is built with [Node.js](https://nodejs.org), using the [Serverless](https://serverless.com) framework to deploy to [AWS](https://aws.amazon.com).  It uses the API Gateway, Lambda, and DynamoDB services on AWS.

The Lambda entry point for the /mutations and /conversations endpoint is [```src/conversations/adapters/conversations-http-lambda-adapter.js```](https://github.com/danptesta/conversation-service/blob/master/src/conversations/adapters/conversations-http-lambda-adapter.js).

### APIs ###

The Conversation service provides several APIs across two endpoints to facilitate collaborative editing of conversations between Alice and Bob.

#### Add Mutation - Insert ####
URL: `POST /mutations`

Sample Request:
```json
{
  "author": "bob",
  "conversationId": "greeting",
  "data": {
    "index": 0,
    "text": "hello world",
    "type": "insert"
  },
  "origin": {
    "alice": 0,
    "bob": 0
  }
}
```

Sample Response (200):
```json
{
    "ok": true,
    "text": "hello world"
}
```

#### Add Mutation - Delete ####
URL: `POST /mutations`

Sample Request:
```json
{
  "author": "alice",
  "conversationId": "greeting",
  "data": {
    "index": 5,
    "length": 6,
    "type": "delete"
  },
  "origin": {
    "alice": 0,
    "bob": 1
  }
}
```

Sample Response (200):
```json
{
    "ok": true,
    "text": "hello"
}
```

#### Find Conversation By Id ###
URL: `GET /conversations/{conversationId}`

Sample Response (200):
```json
{
    "ok": true,
    "text": "hello",
    "conversationId": "dan1",
    "lastMutation": {
        "data": {
            "length": 6,
            "type": "delete",
            "index": 5
        },
        "author": "alice",
        "conversationId": "greeting",
        "origin": {
            "bob": 1,
            "alice": 0
        }
    },
    "state": {
        "bob": 1,
        "alice": 1
    }
}
```

#### List Conversations ####
URL: `GET /conversations`

Sample Response:
```json
{
    "ok": true,
    "conversations": [
        {
            "text": "hello",
            "conversationId": "greeting",
            "lastMutation": {
                "data": {
                    "length": 6,
                    "type": "delete",
                    "index": 5
                },
                "author": "alice",
                "conversationId": "greeting",
                "origin": {
                    "bob": 1,
                    "alice": 0
                }
            },
            "state": {
                "bob": 1,
                "alice": 1
            }
        }
    ]
}
```

#### Remove Conversation ####
URL: `DELETE /conversations/{conversationId}`

Sample Response:
This URL always responds with a 204 status code and no body, regardless of whether the given conversation exists (idempotent).

### Code Styling ###
Code styling is enforced using [ESLint](https://eslint.org/) uses the popular `airbnb-base` style guide as its base.  Style checking can be run using the command:
```bash
yarn lint
```

### Testing ###
Tests are written using [Mocha](https://mochajs.org).  Assertions are applied using [Chai]().  Code coverage is instrumented using [nyc](https://www.npmjs.com/package/nyc).

#### Unit Tests ####
With Hexagonal Architecture, unit tests focus only on the parts inside the hexagon (application, domain, and ports).  We are able to achieve 100% code coverage on the core application logic since this pattern provides a clean separation from "deployment plumbing" code (outside the hexagon, in the adapters).  The unit tests run very quickly and are intended to be run with every build in a CI/CD pipeline.  Tests can be run locally with the command: 
```bash
yarn test
```

### Integration Tests ###
Integration tests focus on the parts of the system outside the hexagon (the adapters) and provide assurance they are working correctly.  These tests are slower and less reliable since they have external system dependencies.  Thus, they are intended to be run less frequently as needed during development of the adapters.  The Conversation service has one integration test that validates its connection to DynamoDB.
```bash
yarn int-conversation-repo
```

### Deployment ###
The Conversation service is deployed on an entirely serverless infrastructure, which automates many of the deployment concerns allowing us to focus more on our core value proposition (the application).  The serverless framework is used to deploy the application to AWS.
```bash
➜  conversation-service git:(lambda) ✗ sls deploy
```

Successful output should look like the following:
```bash
➜  conversation-service git:(lambda) ✗ sls deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service conversations.zip file to S3 (14.04 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..........................
Serverless: Stack update finished...
Service Information
service: conversations
stage: dev
region: us-east-1
stack: conversations-dev
resources: 32
api keys:
  None
endpoints: (redacted)
functions:
  ping: conversations-dev-ping
  info: conversations-dev-info
  conversations_api: conversations-dev-conversations_api
layers:
  None
Serverless: Removing old service artifacts from S3...
Serverless: Run the "serverless" command to setup monitoring, troubleshooting and testing.
```

#### Architecture ####
The code is structured and organized using the [`Hexagonal Architecture`](https://codingcanvas.com/hexagonal-architecture/) pattern (aka, "Ports and Adapters"), first presented by [`Alistair Cockburn`](https://alistair.cockburn.us/coming-soon/).  This pattern helps separate core application logic (application + domain) from deployment (adapters).  This allows us to easily pivot our deployment decisions without impacting the core application logic.

Below is a diagram of the components that make up the Conversation service.

<img src="https://github.com/danptesta/conversation-service/blob/master/assets/conversation-service-architecture.png" center="true">
