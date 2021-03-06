import * as change_case from "change-case";
import * as fs from "fs";
import { Dict } from "../dao-build-interface";
import { isObject, isSystemType } from "./schema-helpers";
import { ISchema, ISubType, IType, ITypeField } from "./schema-reply";

export class InterfaceBuilder {
  public constructor(private schema: ISchema) {

  }

  public render(outputFolder: string) {
    const types = this.schema.types.filter(t => isObject(t.kind!) && !isSystemType(t.name!));

    types.forEach(t => {
      const postfix = "input";
      if (t.kind === "INPUT_OBJECT" && t.name?.toLowerCase().endsWith(postfix)) {
        t.name = t.name.substring(0, t.name.length - postfix.length);
      }
      const strContent = this.toTypescriptInterface(t);
      this.writeFile(outputFolder, strContent, t.name!);
    });
  }

  private toTypescriptInterface(t: IType) {
    const rows = this.buildRows(t.fields ? t.fields : t.inputFields);
    const references = this.findReferences(t);

    const imports = Object.keys(references).map(r => {
      const path = references[r] ? `../enums/` : "./";
      const prefix = references[r] ? "" : "I";
      return `import { ${prefix}${r} } from "${path}${change_case.paramCase(r)}.generated"`;
    }).join("\n");
    return this.mergeTemplate(imports, t.name!, rows);

  }

  private buildRows(fields?: ITypeField[] | null) {
    if (!fields) {
      return "";
    }
    const rows = fields.map(f => {
      return `  ${f.name}?: ${this.getTypescriptType(f.type)};`;
    }).join("\n");
    return rows;
  }

  private getTypescriptType(fieldType: ISubType): string {
    if (fieldType.kind === "ENUM") {
      return fieldType.name!;
    } else if (isObject(fieldType.kind!)) {
      return "I" + fieldType.name;
    } else if (fieldType.kind === "SCALAR") {
      return this.getScalarTypescriptType(fieldType.name!);
    } else if (fieldType.kind === "LIST") {
      return this.getTypescriptType(fieldType.ofType!);
    }
    throw new Error("Unknown type");
  }

  private getScalarTypescriptType(name: string) {
    const type = name.toLowerCase();
    if (type === "int" || type === "float") {
      return "number";
    } else if (type === "datetime") {
      return "Date";
    }
    return type;
  }

  private findReferences(type: IType): Dict<boolean> {
    const dict: Dict<boolean> = {};
    const fields = type.fields || type.inputFields;
    if (fields) {
      fields.forEach(f => {
        if (f.type.kind === "ENUM") {
          dict[f.type.name!] = true;
        } else if (isObject(f.type.kind!)) {
          dict[f.type.name!] = false;
        } else if (f.type.kind === "LIST") {
          this.setListType(f, dict);
        }
      });
    }
    return dict;
  }

  private setListType(f: ITypeField, dict: Dict<boolean>) {
    const kind = f.type.ofType?.kind!;
    const name = f.type.ofType!.name!;
    if (kind === "ENUM") {
      dict[name] = true;
    } else if (isObject(kind)) {
      dict[name] = false;
    }
  }

  private writeFile(outputFolder: string, content: string, name: string) {
    if (!outputFolder.endsWith("/")) {
      outputFolder += "/";
    }
    const path = outputFolder + "interfaces/";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    const filename = change_case.paramCase(name) + ".generated.ts";
    fs.writeFileSync(path + filename, content);
  }

  private mergeTemplate(imports: string, name: string, rows: string) {
    return (
      `/**
 * Auto generated, do not modify!
 */
/* eslint-disable */
${imports}
export interface I${change_case.pascalCase(name)} {
${ rows}
}
`);

  }
}
