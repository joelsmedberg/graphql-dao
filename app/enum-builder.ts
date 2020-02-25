import * as change_case from "change-case";
import * as fs from "fs";
import { ISchema } from "./schema-fetcher/schema-reply";

export class EnumBuilder {
  public constructor(private schema: ISchema) {

  }

  public render(outputFolder: string) {
    const enums = this.schema.types.filter(t => t.kind === "ENUM");
    enums.forEach(e => {
      const strContent = this.toTypescriptEnum(e.name, e.enumValues!.map(v => v.name));
      if (!outputFolder.endsWith("/")) {
        outputFolder += "/";
      }
      const path = outputFolder + "enums/";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      const filename = change_case.paramCase(e.name) + ".generated.ts";
      fs.writeFileSync(path + filename, strContent);
    });
  }

  private toTypescriptEnum(name: string, values: string[]) {
    const rows = values.map(value => `\t${value} = "${value}"`).join(",\n");
    const template = `export enum ${name} {
${rows}
}`;
    return template;
  }
}