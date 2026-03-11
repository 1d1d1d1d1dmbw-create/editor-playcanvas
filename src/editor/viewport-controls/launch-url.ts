export const buildLaunchSceneUrl = (launchBaseUrl: string, sceneId: string): string => {
    const normalizedBaseUrl = launchBaseUrl.endsWith('/') ? launchBaseUrl : `${launchBaseUrl}/`;
    return `${normalizedBaseUrl}${encodeURIComponent(sceneId)}`;
};

export const getLaunchTargetUrl = (
    launchBaseUrl: string | null | undefined,
    sceneId: string | null | undefined,
    playUrl: string | null | undefined
): string | null => {
    if (launchBaseUrl && sceneId) {
        return buildLaunchSceneUrl(launchBaseUrl, sceneId);
    }

    return playUrl ?? null;
};

export const getEngineVersionQuery = (
    engineVersions: Record<string, { version: string }> | undefined,
    engineVersion: string | null | undefined
): string | null => {
    if (!engineVersion || engineVersion === 'current') {
        return null;
    }

    const versionConfig = engineVersions?.[engineVersion];
    if (!versionConfig?.version) {
        return null;
    }

    return `version=${versionConfig.version}`;
};
