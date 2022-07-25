declare type configType = {
    schema?: string;
    pageurl?: string;
    iosURL?: string;
    iosStoreURL?: string;
    androidURL?: string;
    packageName?: string;
    middlePageURl?: string;
    schemaType?: 'bcutSchema' | 'bcutSchemaH5';
};
export declare const immediateDownload: (androidURL?: string, iosStoreURL?: string) => void;
export declare const addEventListener: () => void;
export declare const removeEventListener: () => void;
export declare const openBcut: (config: string | configType) => Promise<unknown>;
export {};
