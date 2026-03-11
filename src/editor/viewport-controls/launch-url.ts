const absoluteUrlPattern = /^https?:\/\//;

const resolveAgainstBase = (value: string, baseUrl?: string | null): string => {
    if (absoluteUrlPattern.test(value)) {
        return value;
    }

    if (!baseUrl || !absoluteUrlPattern.test(baseUrl)) {
        return value;
    }

    return new URL(value, baseUrl).toString();
};

export const buildLaunchSceneUrl = (launchBaseUrl: string, sceneId: string): string => {
    const normalizedBaseUrl = launchBaseUrl.endsWith('/') ? launchBaseUrl : `${launchBaseUrl}/`;
    return `${normalizedBaseUrl}${encodeURIComponent(sceneId)}`;
};

export const getEditorProjectUrl = (
    homeUrl: string | null | undefined,
    projectId: number | null | undefined
): string | null => {
    if (!homeUrl || !absoluteUrlPattern.test(homeUrl) || !projectId) {
        return null;
    }

    return new URL(`/editor/project/${projectId}`, homeUrl).toString();
};

export const getLaunchTargetUrl = (
    launchBaseUrl: string | null | undefined,
    sceneId: string | null | undefined,
    playUrl: string | null | undefined,
    homeUrl: string | null | undefined,
    projectId: number | null | undefined
): string | null => {
    if (launchBaseUrl && sceneId) {
        return resolveAgainstBase(buildLaunchSceneUrl(launchBaseUrl, sceneId), homeUrl);
    }

    if (playUrl) {
        return resolveAgainstBase(playUrl, homeUrl);
    }

    return getEditorProjectUrl(homeUrl, projectId);
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
