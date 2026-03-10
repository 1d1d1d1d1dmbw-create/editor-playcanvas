import assert from 'node:assert/strict';

import { handleTaskPacket, taskPacketSchema } from './src/editor/components/bridge/task-packet.ts';

const packet = taskPacketSchema.parse({
    type: 'playcanvas:task-packet',
    source: 'orchestrator',
    taskId: 'verify-1',
    task: {
        action: 'select-entity',
        payload: {
            entityId: 99
        }
    }
});

const callLog = [];
const entity = { id: '99' };
const call = (method, ...args) => {
    callLog.push([method, ...args]);
    if (method === 'entities:get') {
        return entity;
    }
    return undefined;
};

const handled = handleTaskPacket(call, packet);
assert.equal(handled, true);
assert.deepEqual(callLog, [
    ['entities:get', '99'],
    ['selector:set', 'entity', [entity]]
]);

console.log('verify_logic.js passed');
