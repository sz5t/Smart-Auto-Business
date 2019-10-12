/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
    id: string;
}

interface WebpackRequire {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (
        paths: string[],
        callback: (require: <T>(path: string) => T) => void
    ) => void;
}
// interface NodeRequire extends WebpackRequire {}
declare var require: NodeRequire;

// G2
declare var G2: any;
declare var DataSet: any;
declare var Slider: any;
declare var Cloud: any;
declare var Intense: any;

declare var editormd: any;
declare var domtoimage: any;
declare var html2canvas: any;



