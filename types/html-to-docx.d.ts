declare module "html-to-docx" {
    interface DocxOptions {
        table?: { row?: { cantSplit?: boolean } };
        footer?: boolean;
        header?: boolean;
        pageNumber?: boolean;
        margins?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
    }

    export default function HTMLtoDOCX(
        htmlString: string,
        headerHTMLString: string | null,
        options?: DocxOptions
    ): Promise<Blob>;
}
