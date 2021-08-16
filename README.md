# Deploy Agent
sync local revision using metadata server

## Required
- metadata server
  - request: GET `http(s)://${HOST}/${PATH}/${project}/${branch}`
  - response: json (@see `src/types/Metadata.type.ts`)
- deploy provider
  - git: 1.8.5 higher (using `-C` option)
  - k8s: kubectl with default credential

## configure
- agent env: `.env`
  - @see `.env.example` 
  - @see `src/agent.config.ts`
- packages: `packages/*`
  - @see: `packages-example/*`

### .env example
```.dotenv
# agent
SERVER_NAME="TEST_SERVER-1"                 # [optional] server name (default: host name)
CONCURRENCY="5"                             # [optional] deploy worker count (default: 5)
DELAY="1000"                                # [optional] delay after deploy process (default: 1000)
PACKAGE_PATH="./packages"                   # [optional] package config path (default: ./packages)

# metadata
METADATA_URL="http://localhost:80/metadata" # [required] metadata URL (required)
METADATA_TIMEOUT="3000"                     # [required] metadata request timeout (required)

# webhook
WEBHOOK_URL="http://localhost:80/webhook"   # [optional] webhook URL (optional)
WEBHOOK_TIMEOUT="3000"                      # [optional] webhook request timeout (optional)
```

## deploy types
- git
  - git reset --hard ${commitHash}
- k8s
  - kubectl set image ... ${image}:{tag}

## metadata
- method: GET
- path: `http(s)://${HOST}/${PATH}/${project}/${branch}`
- response body: json

### response body example
```json
{
  "label": "test package 1",
  "project": "test project",
  "branch": "test-branch",
  "revision": "test2hash"
}
```

## webhook
- method: POST
- body: `src/types/WebhookData.type.ts`
  - serverName: agent server
  - package: deploy rule in the agent server
  - metadata: deploy metadata in the build server
  - revision: revision data

### request body example
```json
{
  "serverName": "test-server-1",
  "package": {
    "label": "test rule 1",
    "project": "test project",
    "branch": "test-branch",
    "deployType": "git",
    "deployTarget": {
      "path": "/home/test-project",
      "branch": "test"
    }
  },
  "metadata": {
    "label": "test project 1",
    "project": "test project",
    "branch": "test",
    "revision": "test2hash"
  },
  "revision": {
    "before": "test1hash",
    "after": "test2hash"
  }
}
```

## flow diagram
![flow diagram](./resource/deploy-agent.jpg)
