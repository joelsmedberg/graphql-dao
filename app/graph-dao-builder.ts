import * as Handlebars from "handlebars";
const template = `{{#if node}}import fetch from "node-fetch";
{{/if}}
export interface IQlInput {
    query: string;
    variables: { [key: string]: any };
}

export abstract class GraphDao {
    // tslint:disable-next-line:max-line-length
    private static readonly REGEX = /(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))/;

    private static readonly DOMAIN = "{{{endpoint}}}";
    protected async post(body: IQlInput): Promise<any> {
        const resp = await fetch(GraphDao.DOMAIN, {
            body: JSON.stringify(body),
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const text = await resp.text(); // Parse it as text
        return this.parseResponse(text);
    }

    private parseResponse(text: string): any {
        if (text) {
            const data = JSON.parse(text).data;
            for (const key in data) {
                const item = data[key];
                this.parseDates(item);
                return data[key];
            }
        }
        return undefined;
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
        const reply = this.compiledQueryTemplate({ node, endpoint });
        return reply;
    }
}
