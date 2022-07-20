declare type configType = {
    scheme: string;
    iosURL?: string;
    iosStoreURL?: string;
    androidURL?: string;
    packageName?: string;
    middlePageURl?: string;
};
export declare const addEventListener: () => void;
export declare const removeEventListener: () => void;
export declare const openBcut: (config: string | configType) => Promise<unknown>;
export {};
