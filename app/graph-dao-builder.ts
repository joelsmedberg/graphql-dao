import * as Handlebars from "handlebars";
import * as Url from "url";
const template = `/**
 * Auto generated, do not modify!
 */
/* eslint-disable */
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
 public static domain = "{{{domain}}}";
 public static path = "{{path}}";
 public static errorHandlers = new Map<number, IErrFn>();
 public static headerHookFn: undefined | ((dict: {[key: string]: string}) => void);

 private static protocol = "https://";

 private static readonly REGEX = /(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))|(\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d([+-][0-2]\\d:[0-5]\\d|Z))/;

 public constructor() {
   this.post = this.post.bind(this);
   this.parseDates = this.parseDates.bind(this);
   this.parseResponse = this.parseResponse.bind(this);
   this.getHeaders = this.getHeaders.bind(this);
 }

 protected async post(body: IQlInput): Promise<any> {
   this.parseEnums(body, "ENCODE");
   const headers = this.getHeaders();
   if(GraphDao.headerHookFn){
     GraphDao.headerHookFn(headers);
   }
   const response = await fetch(this.getUrl(), {
     headers,
     body: JSON.stringify(body),
     credentials: "include",
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
     this.parseEnums(data[key], "PARSE");
     return data[key];
   }
 }

 private getHeaders() {
   return {
     Accept: "application/json"
   };
 }

 private parseEnums(item: any, mode: "PARSE" | "ENCODE") {
   if (!item || typeof item === "string") {
     return;
   }
   for (const key in item) {
     const value = item[key];
     if (typeof value === "string") {
       if (mode === "PARSE") {
         item[key] = this.graphqlCompliantToValue(value);
       } else {
         item[key] = this.valueToGraphqlCompliant(value);

       }
     } else if (Array.isArray(value)) {
       value.forEach(i2 => this.parseEnums(i2, mode));
     } else if (typeof value === "object") {
       this.parseEnums(value, mode);
     }
   }
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

 private valueToGraphqlCompliant(text: string) {
   const translations = {
     Ä: "AE__",
     Å: "AO__",
     Ö: "OE__"
   };
   return this.translateFromDictionary(text, translations);
 }

 private graphqlCompliantToValue(text: string) {
   const translations: { [key: string]: string } = {
     AE__: "Ä",
     AO__: "Å",
     OE__: "Ö"
   };
   return this.translateFromDictionary(text, translations);
 }

 private translateFromDictionary(text: string, dict: { [key: string]: string }): string {
   if (!text) {
     return text;
   }
   Object.keys(dict).forEach((key: string) => {
     const value = dict[key];
     while (text.indexOf(key) !== -1) {
       text = text.replace(key, value);
     }
   });
   return text;
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
