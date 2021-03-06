import * as changeCase from "change-case";
import * as fs from "fs";
import * as Handlebars from "handlebars";
import { ISchema, IType, ITypeField, ISubType } from "./schema-fetcher/schema-reply";
const TEMPLATE = `/**
 * Auto generated, do not modify!
 */
/* eslint-disable */
{{{imports}}}
export interface {{className}} {
\t{{{fields}}}
}`;
export class TypeBuilder {
  private compiledTempate = Handlebars.compile(TEMPLATE);
  private outputFolder: string;
  constructor(outputFolder: string) {
    this.outputFolder = outputFolder + "interfaces/";
  }

  public run(schema: ISchema) {
    if (!fs.existsSync(this.outputFolder)) {
      fs.mkdirSync(this.outputFolder);
    }
    for (const t of schema.types) {
      if (this.isSystemType(t.name!)) {
        continue;
      } else if (t.kind === "ENUM") {
        continue;
      }
      const strOutput = this.buildClass(t);
      if (strOutput) {
        const filename = this.outputFolder + this.toTsFileName(t.name!);
        if (!fs.existsSync(filename) || t.kind === "OBJECT") {
          fs.writeFileSync(this.outputFolder + this.toTsFileName(t.name!), strOutput);
        }
      }
    }
    console.log(this.outputFolder);
  }

  private renderImports(t: IType) {
    if (!t.fields && !t.inputFields) {
      return "";
    }
    const fields = this.getAllFields(t);
    const imps = fields.map(f => this.fieldToImport(f))
      .filter(f => !!f)
      .filter((f, i, self) => self.indexOf(f) === i)
      .join("\n");
    return imps;
  }

  private getAllFields(t: IType): ITypeField[] {
    const fields: ITypeField[] = [];
    if (t.fields) {
      fields.push(...t.fields);
    }
    if (t.inputFields) {
      fields.push(...t.inputFields);
    }
    return fields;
  }

  private fieldToImport(f: ITypeField): string {
    let input = this.getOffType(f.type);
    input = this.stripInputType(input);
    let fileName = this.toTsFileName(input);
    const className = this.strToTsType(input, f);
    if (fileName && className) {
      fileName = fileName.endsWith(".ts") ? fileName.substr(0, fileName.length - 3) : fileName;
      let path = "./";
      if (this.isEnum(f)) {
        path += "../enums/";
      }
      return `import { ${className} } from "${path}${fileName}";`;
    }
    return "";
  }

  private buildClass(t: IType): string {
    const className = this.strToTsType(t.name!, t);
    const fields = this.getAllFields(t);
    const str = fields.map(f => this.buildField(f));
    if (str) {
      const strFields = str.join("\n\t");
      const imps = this.renderImports(t);
      return this.compiledTempate({ fields: strFields, className, imports: imps });
    }
    return "";
  }

  private buildField(field: ITypeField): string {
    const nullable = field.type.kind === "NON_NULL" ? "" : " | null";
    return `${field.name}: ${this.fieldToTsType(field)}${nullable};`;
  }

  private isPrimitive(tsType: string | undefined): boolean {
    if (!tsType) {
      return false;
    }
    const primitives = ["int", "string", "boolean", "number", "float", "datetime", "void"];
    return primitives.some(p => p === tsType.toLowerCase());
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

  private toTsFileName(qlType: string | undefined): string {
    if (!qlType || this.isPrimitive(qlType)) {
      return "";
    }
    qlType = this.stripInputType(qlType);
    return changeCase.paramCase(qlType) + ".generated.ts";
  }

  private stripInputType(name: string): string {
    const STRIP = "Input";
    if (name.endsWith(STRIP)) {
      name = name.substr(0, name.length - STRIP.length);
    }
    return name;
  }

  private mergNumTypes(qlType: string): string {
    if (qlType === "int" || qlType === "float") {
      qlType = "number";
    }
    return qlType;
  }

  private isDate(qlType: string | undefined): boolean {
    return !!qlType && (qlType.toLowerCase() === "datetime");
  }

  private isVoid(qlType: string | undefined): boolean {
    return !!qlType && (qlType.toLowerCase() === "void");
  }

  private isEnum(type: ITypeField | IType): boolean {
    if ("type" in type) {
      return (type.type.kind === "ENUM") || ((type.type.ofType?.kind) === "ENUM");
    }
    return type.kind === "ENUM";
  }

  private strToTsType(qlType: string | undefined, type: ITypeField | IType): string {
    if (!qlType) {
      throw new Error("Unable to find type, " + type);
      // return "any";
    }
    let tsType = "any";
    if (this.isDate(qlType)) {
      tsType = "Date";
    } else if (this.isVoid(qlType)) {
      tsType = "void";
    } else if (this.isPrimitive(qlType)) {
      tsType = qlType.toLowerCase();
    } else if (this.isEnum(type)) {
      tsType = qlType;
    } else {
      tsType = "I" + qlType;
    }
    tsType = this.mergNumTypes(tsType);
    tsType = this.stripInputType(tsType);
    return tsType;
  }

  private fieldToTsType(field: ITypeField): string {
    if (field.type.name) {
      return this.strToTsType(field.type.name, field);
    }
    const tsType = this.strToTsType(this.getOffType(field.type), field);
    const isList = this.getOfTypeList(field.type);
    return tsType + (isList ? "[]" : "");
  }

  private getOfTypeList(t: ISubType): boolean {
    if (t.kind === "LIST") {
      return true;
    }
    if (t.ofType) {
      return this.getOfTypeList(t.ofType);
    }
    return false;
  }

  private getOffType(t: ISubType): string {
    if (t.name) {
      return t.name
    } else if (t.ofType) {
      return this.getOffType(t.ofType);
    }
    throw Error("Foo bar");
  }

}
