# Deploy Agent
sync local revision to metadata

## deploy types
- git
  - git reset --hard ${commitHash}
- k8s
  - kubectl set image ... ${image}:{tag}

## flow diagram
![flow diagram](./resource/deploy-agent.jpg)
