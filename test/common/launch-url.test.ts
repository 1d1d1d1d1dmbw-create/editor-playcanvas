import { expect } from 'chai';
import { describe, it } from 'mocha';

import { buildLaunchSceneUrl, getEngineVersionQuery } from '../../src/editor/viewport-controls/launch-url';

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

describe('getEngineVersionQuery', () => {
    it('should return null for current engine', () => {
        expect(getEngineVersionQuery({ current: { version: '2.0.0' } }, 'current')).to.equal(null);
    });

    it('should return null for unknown engine version keys', () => {
        expect(getEngineVersionQuery({ current: { version: '2.0.0' } }, 'beta')).to.equal(null);
    });

    it('should return version query for known engine version keys', () => {
        expect(getEngineVersionQuery({ stable: { version: '2.1.0' } }, 'stable')).to.equal('version=2.1.0');
    });
});
