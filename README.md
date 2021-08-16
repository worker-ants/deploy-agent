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
