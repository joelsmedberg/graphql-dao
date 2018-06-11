import * as changeCase from "change-case";
import { writeFileSync } from "fs";
import * as Request from "request-promise-native";
import { DaoInterfaceBuilder } from "./dao-interface-builder";
import { StrDao } from "./graph-dao-str";
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
    fields {
      type {
        kind
        ofType {
          name
        }
      }
      name
        type {
          name
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
      description defaultValue, type {name}
      name
    }
	}
}`;

export class Runner {
  private readonly ENDPOINT = "http://localhost:8081/graphql";
  // private readonly ENDPOINT = "https://backend-dev.mittskolval.se/graphql";

  public async run() {
    const data = { query: query, variables: null, operationName: null };
    const reply = await Request(this.ENDPOINT, {
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
    for (const key in formattedSchema.classes) {
      const c = formattedSchema.classes[key];
      const filename = changeCase.paramCase(c.className) + "-dao.generated.ts";
      writeFileSync("./output/" + filename, qBuiler.renderClass(c));
    }
    writeFileSync("./output/graph-dao.ts", StrDao);
    new TypeBuilder().run(schema);
  }
}
