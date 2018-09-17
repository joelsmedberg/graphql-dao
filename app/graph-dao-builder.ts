import * as Handlebars from "handlebars";
import * as Url from "url";
const template = `// tslint:disable:max-classes-per-file
// tslint:disable:max-line-length
// tslint:disable:no-any
{{#if node}}import fetch from "node-fetch";
{{/if}}
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

export class RequestError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
    }
}

export abstract class GraphDao {
    public static domain = "{{{domain}}}";
    public static path = "{{path}}";

    public static tokenKey = "GRAPHQL-DAO_KEY";
    private static protocol = "https://";

    private static headerKey = "x-access-token";

    private static readonly REGEX = /(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))/;

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
        this.saveNewKey(response);
        const contentData = await this.getDataContent(response);
        if (contentData) {
            return this.parseResponse(contentData);
        }
        return undefined;
    }

    private saveNewKey(response: Response) {
        const respKey = response.headers.get(GraphDao.headerKey);
        if (respKey) {
            localStorage.setItem(GraphDao.tokenKey, respKey);
        }
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
            throw new RequestError("Internal Error, bad server communication", 500);
        }
        const content: IResponseContent = JSON.parse(text);
        if (content.errors && content.errors.length) {
            throw new RequestError(content.errors[0].message, content.errors[0].statusCode);
        }
        return content.data;
    }

    private parseResponse(data: { [key: string]: any }): any {
        for (const key in data) {
            this.parseDates(data[key]);
            return data[key];
        }
    }

    private getToken() {
        return localStorage.getItem(GraphDao.tokenKey);
    }

    private getHeaders() {
        const headers: any = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        const token = this.getToken();
        if (token) {
            headers[GraphDao.headerKey] = token;
        }
        return headers;
    }

    private parseDates(item: any) {
        if (!item) {
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
`;

export class GraphDaoBuilder {
    private compiledQueryTemplate = Handlebars.compile(template);
    public build(endpoint: string, node: boolean = false): string {
        const url = new Url.URL(endpoint);
        const domain = url.hostname;
        const path = url.pathname;
        const reply = this.compiledQueryTemplate({ node, domain, path });
        return reply;
    }
}
