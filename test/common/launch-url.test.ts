import { expect } from 'chai';
import { describe, it } from 'mocha';

import { buildLaunchSceneUrl, getLaunchTargetUrl, getEngineVersionQuery } from '../../src/editor/viewport-controls/launch-url';

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

describe('getLaunchTargetUrl', () => {
    it('should return scene launch URL when launch base and scene id are present', () => {
        const url = getLaunchTargetUrl('https://playcanvas.com/launch', '12345', 'https://playcanvas.com/project/123/launch');

        expect(url).to.equal('https://playcanvas.com/launch/12345');
    });

    it('should fallback to playUrl when launch base URL is missing', () => {
        const url = getLaunchTargetUrl(null, '12345', 'https://playcanvas.com/project/123/launch');

        expect(url).to.equal('https://playcanvas.com/project/123/launch');
    });

    it('should fallback to playUrl when scene id is missing', () => {
        const url = getLaunchTargetUrl('https://playcanvas.com/launch', null, 'https://playcanvas.com/project/123/launch');

        expect(url).to.equal('https://playcanvas.com/project/123/launch');
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
