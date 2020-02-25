import * as changeCase from "change-case";
import * as Handlebars from "handlebars";

import { IDaoClassDescription, IDaoFunction, ITypeTreeNode } from "./dao-build-interface";
// tslint:disable-next-line:max-line-length
const queryTemplate = `{{query}} {{namespace}}_{{fnName}}{{input}} {
    {{namespace}}_{{fnName}}{{input2}}
    {{fields}}
}`;

const fnTemplate = `
    /**
     * {{description}}
     * */
    public {{fnName}} = ({{input}}): Promise<{{returnType}}> => {
        const query = \`{{{query}}}\`;
        return this.post({ query, variables: { {{input2}} } });
    }`;

const classTemplate = `/**
 * Autogenerated interface, DO NOT MODIFY
 */
/* tslint:disable */
import { GraphDao } from "./graph-dao";
{{#each imports}}{{{this}}}
{{/each}}

export class {{className}}Dao extends GraphDao {
    {{#each fns}}
    {{{this}}}

    {{/each}}
}
`;
export interface IQueryArgs {
    fnName: string;
    inputParams: IInputParam[];
    fields: string[];
    tsReturnType: string;
    className: string;
}

export interface IInputParam { name: string; qlType: string; tsType: string; }

export class QueryBuilder {
    private compiledQueryTemplate = Handlebars.compile(queryTemplate);
    private compiledFnTemplate = Handlebars.compile(fnTemplate);
    private classTemplate = Handlebars.compile(classTemplate);

    public renderClass(arg: IDaoClassDescription): string {
        const fns = arg.fns.map(fn => this.renderFunction(fn));
        const proper = changeCase.pascalCase(arg.className);
        const t = this.classTemplate({ className: proper, fns, imports: this.makeImport(arg) });
        return t;
    }

    private renderFunction(daoFn: IDaoFunction): string {
        const input = daoFn.inputArguments.map(i => i.inputName + ": " + i.tsType).join(", ");
        const input2 = daoFn.inputArguments.map(i => i.inputName + ": " + i.inputName);
        const query = this.renderQuery(daoFn);
        const t = this.compiledFnTemplate({
            description: daoFn.description,
            fields: daoFn.queryFields,
            fnName: daoFn.fnName,
            input,
            input2,
            query,
            returnType: daoFn.tsReturnType
        });
        return t;
    }

    private makeImport(daoClass: IDaoClassDescription): string[] {
        return daoClass.imports.map(imp => {
            const param = changeCase.paramCase(imp.name);
            if (imp.isEnum) {
                return `import { ${imp.name} } from "./enums/${param}.generated"; `;
            }
            return `import { I${imp.name} } from "./interfaces/${param}.generated"; `;
        });
    }

    private wrapIfLength(str: string, w1: string, w2: string) {
        if (str && str.length > 1) {
            str = w1 + str + w2;
        }
        return str;
    }

    private parseTypeTree(node: ITypeTreeNode): string {
        const ps = node.primitives.join("\n ");
        const strNodes = node.nodes.map(n => {
            let internal = this.parseTypeTree(n);
            if (internal && (n.nodes.length || n.primitives.length)) {
                internal = n.name + this.wrapIfLength(internal, " { ", " } ");
            }
            return internal;
        });
        let output = strNodes.join(" ");
        if (!node.nodes.length && !node.primitives.length && !output.trim().length) {
            output = ` ${node.name} `;
        }
        return (ps + " " + output).trim();
    }

    private renderQuery(daoFn: IDaoFunction): string {
        let input = daoFn.inputArguments.map(i => {
            let type = i.qlType;
            if (i.isList) {
                type = "[" + type + "]";
            }
            return "$" + i.inputName + ": " + type;
        }).join(", ");
        let input2 = daoFn.inputArguments.map(i => i.inputName + ": $" + i.inputName).join(", ");
        let fields = daoFn.queryFields ? this.parseTypeTree(daoFn.queryFields) : "";
        input = this.wrapIfLength(input, "(", ")");
        input2 = this.wrapIfLength(input2, "(", ")");
        fields = this.wrapIfLength(fields, " { ", " } ");
        const query = daoFn.mutation ? "mutation" : "query";
        const t = this.compiledQueryTemplate({
            fields: fields,
            fnName: daoFn.fnName,
            input,
            input2,
            namespace: daoFn.className,
            query
        });
        return t;
    }

}
