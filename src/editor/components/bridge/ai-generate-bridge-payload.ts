export interface AiGenerateBridgePayload {
    type: 'playcanvas:ai-generate';
    source: 'editor';
    projectId: number | null;
    sceneId: string | null;
}

interface BridgeConfigInput {
    project?: {
        id?: number;
    };
    scene?: {
        id?: string;
    };
}

export const createAiGenerateBridgePayload = (bridgeConfig: BridgeConfigInput): AiGenerateBridgePayload => {
    return {
        type: 'playcanvas:ai-generate',
        source: 'editor',
        projectId: bridgeConfig.project?.id ?? null,
        sceneId: bridgeConfig.scene?.id ?? null
    };
};
