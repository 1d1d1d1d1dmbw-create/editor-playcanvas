/* global describe, it */

import { expect } from 'chai';

import { createAiGenerateBridgePayload } from '../../src/editor/components/bridge/ai-generate-bridge-payload';

describe('createAiGenerateBridgePayload', () => {
    it('should create the expected bridge payload shape', () => {
        const payload = createAiGenerateBridgePayload({
            project: {
                id: 42
            },
            scene: {
                id: '88'
            }
        });

        expect(payload).to.deep.equal({
            type: 'playcanvas:ai-generate',
            source: 'editor',
            projectId: 42,
            sceneId: '88'
        });
    });
});
