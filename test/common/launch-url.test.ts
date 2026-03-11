import { expect } from 'chai';
import { describe, it } from 'mocha';

import { buildLaunchSceneUrl } from '../../src/editor/viewport-controls/launch-url';

describe('buildLaunchSceneUrl', () => {
    it('should append scene id when launch URL already has trailing slash', () => {
        const url = buildLaunchSceneUrl('https://playcanvas.com/launch/', '12345');

        expect(url).to.equal('https://playcanvas.com/launch/12345');
    });

    it('should append missing slash before scene id when launch URL has no trailing slash', () => {
        const url = buildLaunchSceneUrl('https://playcanvas.com/launch', '12345');

        expect(url).to.equal('https://playcanvas.com/launch/12345');
    });

    it('should URL-encode the scene id', () => {
        const url = buildLaunchSceneUrl('https://playcanvas.com/launch', 'scene with spaces');

        expect(url).to.equal('https://playcanvas.com/launch/scene%20with%20spaces');
    });
});
