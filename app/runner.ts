import * as changeCase from "change-case";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { DaoInterfaceBuilder } from "./dao-interface-builder";
import { GraphDaoBuilder } from "./graph-dao-builder";
import { QueryBuilder } from "./query-builder";
import { EnumBuilder } from "./schema-fetcher/enum-builder";
import { InterfaceBuilder } from "./schema-fetcher/interface-builder";
import { ISchema } from "./schema-fetcher/schema-reply";
import { ServerSchemaFetcher } from "./schema-fetcher/server-schema-fetcher";

export class Runner {
  private outputFolder: string;
  constructor(output: string = "./", private isNode: boolean) {
    if (!output.endsWith("/")) {
      output = output + "/";
    }
    this.outputFolder = output;
  }

  public async run(endpoint: string) {
    // Load the ql schema frorm the server
    const schema = await ServerSchemaFetcher.fetchSchema(endpoint);
    // Use downloaded schema to generate interfaces
    return this.renderDao(schema.data.__schema, endpoint);
  }

  private renderDao(schema: ISchema, endpoint: string) {
    if (!existsSync(this.outputFolder)) {
      mkdirSync(this.outputFolder);
    }
    // Generate enums
    const enumBuilder = new EnumBuilder(schema);
    enumBuilder.render(this.outputFolder);

    const interfaceBuilder = new InterfaceBuilder(schema);
    interfaceBuilder.render(this.outputFolder);

    // Generate interfaces
    const daoInterfaceBuilder = new DaoInterfaceBuilder(schema);
    const formattedSchema = daoInterfaceBuilder.render();

    const qBuiler = new QueryBuilder();
    for (const key in formattedSchema.classes) {
      const c = formattedSchema.classes[key];
      const filename = changeCase.paramCase(c.className) + "-dao.generated.ts";
      writeFileSync(this.outputFolder + filename, qBuiler.renderClass(c, schema));
    }
    const strDao = new GraphDaoBuilder().build(endpoint, this.isNode);
    writeFileSync(this.outputFolder + "graph-dao.ts", strDao);
  }
}
