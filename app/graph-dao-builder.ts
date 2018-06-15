import * as Handlebars from "handlebars";
const template = `{{#if node}}import fetch from "node-fetch";
{{/if}}
export interface IQlInput {
    query: string;
    variables: { [key: string]: any };
}

export abstract class GraphDao {
    private static readonly DOMAIN = "{{{endpoint}}}";
    protected async post(body: IQlInput): Promise<any> {
        const resp = await fetch(GraphDao.DOMAIN, {
            body: JSON.stringify(body),{{#unless node}}
            credentials: "include",{{/unless}}
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const text = await resp.text(); // Parse it as text
        if (text) {
            const data = JSON.parse(text).data;
            for (const key in data) {
                return data[key];
            }
        }
        return undefined;
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
