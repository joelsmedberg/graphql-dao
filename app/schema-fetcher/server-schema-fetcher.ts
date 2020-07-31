import * as Request from "request-promise-native";
import { ISchemaReply } from "./schema-reply";
const query = `{
  __schema {
    queryType {
      ...comparisonFields
    }
    mutationType {
      ...comparisonFields
    }
    types {
      kind
      enumValues {
        name
      }
      name
      inputFields {
        type{
          name
          kind
          enumValues{
            name
          }
          ofType {
            name,
            kind,
            ofType {
              name,
              kind
              ofType {
                name,
                kind
              }
            },
          }
        }
        name
    }
    fields {
      type {
        kind
        ofType {
          name,
          kind,
          ofType {
            name,
            kind
          }
        }
      }
      name
        type {
          name,
          kind,
          ofType {
            name,
            kind,
            ofType {
              name,
              kind,
              ofType {
                name,
                kind
              }
            }
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
        name,
        kind,
        ofType {
          name,
          kind,
          ofType {
            name,
            kind,
            ofType {
              name,
              kind
            }
          }
        }
      }
    },
    args {
      description defaultValue,
      type {
        name,
        kind,
        ofType {
          name,
          ofType {
            name,
            kind,
            ofType {
              name,
              kind
            }
          }
        }}
      name
    }
	}
}`;

export class ServerSchemaFetcher {
  public static async fetchSchema(endpoint: string): Promise<ISchemaReply> {
    const data = { query: query, variables: null, operationName: null };
    const reply = await Request(endpoint, {
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    });
    const parsed: ISchemaReply = JSON.parse(reply);
    return parsed;
  }
}
