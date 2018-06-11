// tslint:disable-next-line:max-line-length
import { IDaoBuildInterface, IDaoClassDescription, IDaoFnInput, IDaoFunction, ITreeDictionary, ITypeTreeNode } from "./dao-build-interface";
import { IArg, IField, ISchema, IType } from "./schema-reply";

const MAX_DEPTH = 3;
export class DaoInterfaceBuilder {
  private readonly DEFAULT_NODE = { type: undefined, name: undefined, primitives: [], nodes: [] };
  public render(reply: ISchema): IDaoBuildInterface {
    const fieldTypes = this.renderFieldTypeMap(reply);
    const fns = [
      ...reply.queryType.fields.map(f => this.fieldToFunction(f, fieldTypes, false)),
      ...reply.mutationType.fields.map(f => this.fieldToFunction(f, fieldTypes, true))
    ];
    const classNames = fns.map(fn => fn.className).filter((item, pos, self) => {
      return self.indexOf(item) === pos;
    });
    const dictionary: IDaoBuildInterface = {
      classes: {},
      types: {}
    };
    classNames.forEach(cn => {
      dictionary.classes[cn] = {
        className: cn,
        fns: [],
        imports: []
      } as IDaoClassDescription;
    });
    fns.forEach(fn => dictionary.classes[fn.className].fns.push(fn));
    for (const key in dictionary.classes) {
      const item = dictionary.classes[key];
      this.renderReferences(item);
    }
    return dictionary;
  }

  private renderReferences(dao: IDaoClassDescription) {
    let references: string[] = [];
    dao.fns.map(fns => references.push(...fns.references));
    references = references.filter(r => !this.isPrimitive(r));
    references = references.filter((item, pos, self) => self.indexOf(item) === pos);
    dao.imports = references;
  }

  private renderFieldTypeMap(schema: ISchema): ITreeDictionary {
    return schema.types.reduce((prev, cur) => {
      if (!this.isSystemType(cur.name)) {
        prev[cur.name] = {
          name: undefined,
          nodes: [],
          primitives: [],
          type: undefined
        } as ITypeTreeNode;
        if (cur.fields) {
          prev[cur.name] = this.buildTypeTree(cur, schema, undefined, 0);
        }
      }
      return prev;
    }, {} as any);
  }

  private isSystemType(name: string) {
    if (name === "Query") {
      return true;
    } else if (name === "Mutation") {
      return true;
    } else if (this.isPrimitive(name)) {
      return true;
    } else if (name.startsWith("__")) {
      return true;
    }
    return false;
  }

  private getTypeFromSchema(schema: ISchema, name: string | undefined): IType | undefined {
    if (!name) {
      return undefined;
    }
    return schema.types.find(t => t.name === name);
  }

  private buildTypeTree(t: IType, schema: ISchema, name: string | undefined, depth: number): ITypeTreeNode {
    if (depth > MAX_DEPTH) {
      return this.DEFAULT_NODE;
    }
    const primitives = t.fields ? t.fields.filter(f => this.isPrimitive(f.type.name)) : [];
    const objs = t.fields ? t.fields.filter(f => !this.isPrimitive(f.type.name)) : [];
    const nodes = objs.map(obj => {
      const typeSub = this.getTypeFromSchema(schema, obj.type.name);
      if (typeSub) {
        return this.buildTypeTree(typeSub, schema, obj.name, depth + 1);
      }
      return this.DEFAULT_NODE;
    });
    const node: ITypeTreeNode = {
      name: name,
      nodes: nodes,
      primitives: primitives.map(p => p.name),
      type: t.name
    };
    return node;
  }

  private getClassName(str: string): string {
    return str.substr(0, str.indexOf("_"));
  }

  private getFnName(str: string): string {
    return str.substr(str.indexOf("_") + 1);
  }

  private fieldToFunction(field: IField, fieldTypes: ITreeDictionary, mutation: boolean): IDaoFunction {
    const references = [this.getTsReturnType(field).replace("[]", "")];
    return {
      className: this.getClassName(field.name),
      description: field.description,
      fnName: this.getFnName(field.name),
      inputArguments: field.args.map(a => this.getInputArgument(a)),
      mutation: mutation,
      queryFields: fieldTypes[this.getBaseReturnType(field)],
      references: references,
      tsReturnType: this.getTsReturnType(field)
    };
  }

  private getInputArgument(a: IArg): IDaoFnInput {
    let tsType = this.isPrimitive(a.type.name) ? a.type.name.toLowerCase() : "I" + a.type.name;
    if (tsType === "int" || tsType === "float") {
      tsType = "number";
    }
    if (tsType.endsWith("Input")) {
      tsType = tsType.substr(0, tsType.indexOf("Input"));
    }
    return {
      inputName: a.name,
      qlType: a.type.name,
      tsType: tsType
    } as IDaoFnInput;
  }

  private isPrimitive(tsType: string | undefined): boolean {
    if (!tsType) {
      return false;
    }
    const primitives = ["int", "string", "boolean", "number", "float"];
    return primitives.some(p => p === tsType.toLowerCase());
  }

  private getBaseReturnType(field: IField): string {
    if (field.type.name) {
      return field.type.name;
    } else if (field.type.kind === "LIST" && field.type.ofType) {
      return field.type.ofType.name;
    }
    return "any";
  }

  private getTsReturnType(field: IField) {
    let fieldName = field.type.name || "";
    if (field.type.kind === "LIST" && field.type.ofType) {
      fieldName = field.type.ofType.name;
      fieldName = fieldName + "[]";
    }
    if (this.isPrimitive(fieldName)) {
      fieldName = fieldName.toLowerCase();
    } else {
      fieldName = "I" + fieldName;
    }
    return fieldName;
  }
}
