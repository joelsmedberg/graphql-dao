import * as changeCase from "change-case";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import * as Request from "request-promise-native";
import { DaoInterfaceBuilder } from "./dao-interface-builder";
import { GraphDaoBuilder } from "./graph-dao-builder";
import { QueryBuilder } from "./query-builder";
import { ISchema, ISchemaReply } from "./schema-reply";
import { TypeBuilder } from "./type-builder";
const query = `{
  __schema {
    queryType {
      ...comparisonFields
    }
    mutationType {
      ...comparisonFields
    }
    types {
    name
    inputFields {
      type{
        name
        kind
        ofType {
          name
        }
      }
      name
    }
    fields {
      type {
        kind
        ofType {
          name
        }
      }
      name
        type {
          name,
          kind,
          ofType {
            name
          }
        }
      }
    }
  }
}

fragment comparisonFields on __Type {
  fields{
    name,
    description,
    type {
      name,
      kind,
      ofType {
      	name
      }
    },
    args {
      description defaultValue,
        type {
          name,
          kind,
          ofType {
            name
          }}
      name
    }
	}
}`;

export class Runner {
  private outputFolder: string;
  constructor(private endpoint: string, output: string = "./", private isNode: boolean = false) {
    if (!output.endsWith("/")) {
      output = output + "/";
    }
    this.outputFolder = output;
  }
  // private readonly ENDPOINT = "http://localhost:8081/graphql";
  // private readonly ENDPOINT = "https://backend-dev.mittskolval.se/graphql";

  public async run() {
    const data = { query: query, variables: null, operationName: null };
    const reply = await Request(this.endpoint, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });
    const parsed: ISchemaReply = JSON.parse(reply);
    return this.toDao(parsed.data.__schema);
  }

  private toDao(schema: ISchema) {
    const daoInterfaceBuilder = new DaoInterfaceBuilder();
    const formattedSchema = daoInterfaceBuilder.render(schema);
    const qBuiler = new QueryBuilder();
    if (!existsSync(this.outputFolder)) {
      mkdirSync(this.outputFolder);
    }
    for (const key in formattedSchema.classes) {
      const c = formattedSchema.classes[key];
      const filename = changeCase.paramCase(c.className) + "-dao.generated.ts";
      writeFileSync(this.outputFolder + filename, qBuiler.renderClass(c));
    }
    const strDao = new GraphDaoBuilder().build(this.endpoint, this.isNode);
    writeFileSync(this.outputFolder + "graph-dao.ts", strDao);
    new TypeBuilder(this.outputFolder).run(schema);
  }
}
