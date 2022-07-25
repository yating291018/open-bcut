declare type configType = {
    schema: string;
    iosURL?: string;
    iosStoreURL?: string;
    androidURL?: string;
    packageName?: string;
    middlePageURl?: string;
    schemaType?: 'bcut-schema' | 'bcut-schema-h5';
};
export declare const immediateDownload: (androidURL?: string, iosStoreURL?: string) => void;
export declare const addEventListener: () => void;
export declare const removeEventListener: () => void;
export declare const openBcut: (config: string | configType) => Promise<unknown>;
export {};
