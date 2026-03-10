import { z } from './zod';

const selectEntityTaskSchema = z.object({
    action: z.literal('select-entity'),
    payload: z.object({
        entityId: z.union([z.string(), z.number()]).transform(value => String(value))
    })
});

const selectAssetTaskSchema = z.object({
    action: z.literal('select-asset'),
    payload: z.object({
        assetId: z.union([z.string(), z.number()]).transform(value => String(value))
    })
});

const clearSelectionTaskSchema = z.object({
    action: z.literal('clear-selection'),
    payload: z.object({}).optional().default({})
});

const focusViewportTaskSchema = z.object({
    action: z.literal('focus-viewport'),
    payload: z.object({}).optional().default({})
});

export const taskPacketSchema = z.object({
    type: z.literal('playcanvas:task-packet'),
    source: z.literal('orchestrator'),
    taskId: z.string().min(1),
    task: z.discriminatedUnion('action', [
        selectEntityTaskSchema,
        selectAssetTaskSchema,
        clearSelectionTaskSchema,
        focusViewportTaskSchema
    ])
});

export type TaskPacket = ReturnType<typeof taskPacketSchema.parse>;

type EditorCall = (method: string, ...args: any[]) => any;

export const handleTaskPacket = (call: EditorCall, packet: TaskPacket): boolean => {
    const { task } = packet;

    if (task.action === 'select-entity') {
        const entity = call('entities:get', task.payload.entityId);
        if (!entity) {
            return false;
        }

        call('selector:set', 'entity', [entity]);
        return true;
    }

    if (task.action === 'select-asset') {
        const asset = call('assets:get', task.payload.assetId);
        if (!asset) {
            return false;
        }

        call('selector:set', 'asset', [asset]);
        call('assets:open', [asset]);
        return true;
    }

    if (task.action === 'clear-selection') {
        call('selector:clear');
        return true;
    }

    if (task.action === 'focus-viewport') {
        call('viewport:focus');
        return true;
    }

    return false;
};
