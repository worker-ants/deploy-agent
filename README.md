# Deploy Agent
sync local revision to metadata

## Required
- git: 1.8.5 higher
- k8s: kubectl with default credential

## configure
- agent env: see `src/agent.config.ts`
- packages: set `packages/*`
  - example: `packages-example/*`

## deploy types
- git
  - git reset --hard ${commitHash}
- k8s
  - kubectl set image ... ${image}:{tag}

## webhook
- method: POST
- body: `src/types/WebhookData.type.ts`
  - serverName: agent server
  - package: deploy rule in the agent server
  - metadata: deploy metadata in the build server
  - revision: revision data

body example
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
