import { config } from '@/editor/config';

import { createAiGenerateBridgePayload } from './ai-generate-bridge-payload';

editor.once('load', () => {
    editor.method('bridge:aiGenerate', () => {
        const payload = createAiGenerateBridgePayload(config);

        if (window.parent && window.parent !== window) {
            window.parent.postMessage(payload, '*');
        }

        console.log('AI Generate clicked', payload);
    });
});
