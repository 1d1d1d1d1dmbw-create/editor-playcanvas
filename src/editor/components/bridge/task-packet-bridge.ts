import { handleTaskPacket, taskPacketSchema } from './task-packet';

editor.once('load', () => {
    const onMessage = (event: MessageEvent<unknown>) => {
        const parsedPacket = taskPacketSchema.safeParse(event.data);
        if (!parsedPacket.success) {
            return;
        }

        handleTaskPacket(editor.call.bind(editor), parsedPacket.data);
    };

    window.addEventListener('message', onMessage);

    editor.once('destroy', () => {
        window.removeEventListener('message', onMessage);
    });
});
