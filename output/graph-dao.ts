// tslint:disable:max-classes-per-file
// tslint:disable:no-any
export interface IQlInput {
    query: string;
    variables: { [key: string]: any };
}

interface IResponseContent {
    errors?: IRequestErrorMsg[];
    data: { [key: string]: any };
}

interface IRequestErrorMsg {
    message: string;
    locations: Array<{ line: number, column: number }>;
    path: string[];
    statusCode?: number;
}

interface IErrResp {
    message: string;
    code: number;
}

type IErrFn = (e: IErrResp) => Promise<any>;

export class RequestError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
    }
}

export abstract class GraphDao {
    public static domain = "backend-dev.mittskolval.se";
    public static path = "/admin-ql";
    public static errorHandlers = new Map<number, IErrFn>();

    private static protocol = "https://";

    // tslint:disable-next-line:max-line-length
    private static readonly REGEX = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

    public constructor() {
        this.post = this.post.bind(this);
        this.parseDates = this.parseDates.bind(this);
        this.parseResponse = this.parseResponse.bind(this);
        this.getHeaders = this.getHeaders.bind(this);
    }

    protected async post(body: IQlInput): Promise<any> {
        const response = await fetch(this.getUrl(), {
            body: JSON.stringify(body),
            credentials: "include",
            headers: this.getHeaders(),
            method: "POST"
        });
        const contentData = await this.getDataContent(response);
        if (contentData) {
            return this.parseResponse(contentData);
        }
        return undefined;
    }

    private errorHandler(message: string, code: number) {
        const handler = GraphDao.errorHandlers.get(code);
        if (handler) {
            handler({ code, message });
            // return undefined;
        }
        throw new RequestError(message, code);
    }

    private getUrl() {
        let url = GraphDao.domain;
        if (!url.startsWith(GraphDao.protocol)) {
            url = GraphDao.protocol + url;
        }
        if (!url.endsWith("/")) {
            url += "/";
        }
        url += GraphDao.path.startsWith("/") ? GraphDao.path.substring(1) : GraphDao.path;
        return url;
    }

    private async getDataContent(response: Response) {
        const text = await response.text(); // Parse it as text
        if (response.status !== 200 || !text) {
            return this.errorHandler("Internal Error, bad server communication", 500);
        }
        const content: IResponseContent = JSON.parse(text);
        if (content.errors && content.errors.length) {
            return this.errorHandler(content.errors[0].message, content.errors[0].statusCode || 0);
        }
        return content.data;
    }

    private parseResponse(data: { [key: string]: any }): any {
        for (const key in data) {
            this.parseDates(data[key]);
            return data[key];
        }
    }

    private getHeaders() {
        return {
            Accept: "application/json"
        };
    }

    private parseDates(item: any) {
        if (!item || typeof item === "string") {
            return;
        }
        for (const key in item) {
            const value = item[key];
            if (typeof value === "string" && this.isDate(value)) {
                item[key] = new Date(value);
            } else if (Array.isArray(value)) {
                value.forEach(i2 => this.parseDates(i2));
            } else if (typeof value === "object") {
                this.parseDates(value);
            }
        }
    }

    private isDate(text: string): boolean {
        return GraphDao.REGEX.test(text);
    }
}
