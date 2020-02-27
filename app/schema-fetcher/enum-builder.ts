import * as change_case from "change-case";
import * as fs from "fs";
import { ISchema } from "./schema-reply";

export class EnumBuilder {
  private static graphqlCompliantToValue(text: string) {
    if (!text) {
      return text;
    }
    const translations: { [key: string]: string } = {
      AO__: "Å",
      AE__: "Ä",
      OE__: "Ö"
    };
    Object.keys(translations).forEach((key: string) => {
      const value = translations[key];
      while (text.indexOf(key) !== -1) {
        text = text.replace(key, value);
      }
    });
    return text;
  }

  public constructor(private schema: ISchema) {

  }

  public render(outputFolder: string) {
    const enums = this.schema.types.filter(t => t.kind === "ENUM");
    enums.forEach(e => {
      const strContent = this.toTypescriptEnum(e.name!, e.enumValues!.map(v => v.name));
      if (!outputFolder.endsWith("/")) {
        outputFolder += "/";
      }
      const path = outputFolder + "enums/";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      const filename = change_case.paramCase(e.name!) + ".generated.ts";
      fs.writeFileSync(path + filename, strContent);
    });
  }

  private toRow(value: string): string {
    value = EnumBuilder.graphqlCompliantToValue(value);
    return `\t${value} = "${value}"`;
  }

  private toTypescriptEnum(name: string, values: string[]) {
    const rows = values.map(value => this.toRow(value)).join(",\n");
    const template = `export enum ${name} {
${rows}
}`;
    return template;
  }
}
