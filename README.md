# @scaleforge/async-group
`AsyncGroup` simplifies promise management and ensures proper shutdown synchronization in NodeJS. It allows for storing promises in a shared context and conveniently wait for their settlement. `AsyncGroup` is ideal for background operations and ensuring completion before application shutdown.

## Installation
```
npm install --save @scaleforge/async-group
```
## Usage
```typescript
import AsyncGroup from '@scaleforge/async-group';

const group = new AsyncGroup();

async function asyncOperation() {
  await new Promise((resolve) {
    setTimeout(() => resolve(), Math.floor(Math.random() * 60000 ));
  })
}

async function onApplicationBootstrap() {
  group.add(asyncOperation());
  group.add(asyncOperation());
  group.add(asyncOperation());
}

async function onApplicationShutdown() {
  await group.wait();
}
```
