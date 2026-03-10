/* global describe, it */

import { expect } from 'chai';

import { handleTaskPacket, taskPacketSchema, type TaskPacket } from '../../src/editor/components/bridge/task-packet';

describe('taskPacketSchema', () => {
    it('parses select-entity task packets', () => {
        const parsed = taskPacketSchema.parse({
            type: 'playcanvas:task-packet',
            source: 'orchestrator',
            taskId: 'task-1',
            task: {
                action: 'select-entity',
                payload: {
                    entityId: 123
                }
            }
        });

        expect(parsed.task.payload.entityId).to.equal('123');
    });

    it('rejects packets with unexpected source', () => {
        const parsed = taskPacketSchema.safeParse({
            type: 'playcanvas:task-packet',
            source: 'unknown',
            taskId: 'task-1',
            task: {
                action: 'focus-viewport'
            }
        });

        expect(parsed.success).to.equal(false);
    });
});

describe('handleTaskPacket', () => {
    it('maps select-entity action to entities:get and selector:set', () => {
        const entity = { id: 'e1' };
        const calls: any[][] = [];

        const call = (method: string, ...args: any[]) => {
            calls.push([method, ...args]);
            if (method === 'entities:get') {
                return entity;
            }

            return undefined;
        };

        const packet: TaskPacket = taskPacketSchema.parse({
            type: 'playcanvas:task-packet',
            source: 'orchestrator',
            taskId: 'task-entity',
            task: {
                action: 'select-entity',
                payload: {
                    entityId: 'e1'
                }
            }
        });

        const handled = handleTaskPacket(call, packet);

        expect(handled).to.equal(true);
        expect(calls).to.deep.equal([
            ['entities:get', 'e1'],
            ['selector:set', 'entity', [entity]]
        ]);
    });

    it('returns false when select-asset target does not exist', () => {
        const calls: any[][] = [];

        const call = (method: string, ...args: any[]) => {
            calls.push([method, ...args]);
            return undefined;
        };

        const packet: TaskPacket = taskPacketSchema.parse({
            type: 'playcanvas:task-packet',
            source: 'orchestrator',
            taskId: 'task-asset',
            task: {
                action: 'select-asset',
                payload: {
                    assetId: 'a1'
                }
            }
        });

        const handled = handleTaskPacket(call, packet);

        expect(handled).to.equal(false);
        expect(calls).to.deep.equal([
            ['assets:get', 'a1']
        ]);
    });

    it('maps clear-selection and focus-viewport actions', () => {
        const calls: any[][] = [];
        const call = (method: string, ...args: any[]) => {
            calls.push([method, ...args]);
            return undefined;
        };

        const clearPacket: TaskPacket = taskPacketSchema.parse({
            type: 'playcanvas:task-packet',
            source: 'orchestrator',
            taskId: 'task-clear',
            task: {
                action: 'clear-selection'
            }
        });

        const focusPacket: TaskPacket = taskPacketSchema.parse({
            type: 'playcanvas:task-packet',
            source: 'orchestrator',
            taskId: 'task-focus',
            task: {
                action: 'focus-viewport'
            }
        });

        expect(handleTaskPacket(call, clearPacket)).to.equal(true);
        expect(handleTaskPacket(call, focusPacket)).to.equal(true);
        expect(calls).to.deep.equal([
            ['selector:clear'],
            ['viewport:focus']
        ]);
    });
});
