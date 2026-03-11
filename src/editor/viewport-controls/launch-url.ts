export const buildLaunchSceneUrl = (launchBaseUrl: string, sceneId: string): string => {
    const normalizedBaseUrl = launchBaseUrl.endsWith('/') ? launchBaseUrl : `${launchBaseUrl}/`;
    return `${normalizedBaseUrl}${encodeURIComponent(sceneId)}`;
};
