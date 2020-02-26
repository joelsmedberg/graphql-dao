import { ISchema, KIND } from "./schema-reply";

export function isSystemType(name: string): boolean {
  return name.startsWith("__") || name === "Query" || name === "Mutation";
}

export function isObject(kind: KIND) {
  return kind === "INPUT_OBJECT" || kind === "OBJECT";
}

export function getKind(name: string, schema: ISchema): KIND | null {
  const find = schema.types.find(t => t.name === name);
  return find?.kind || null;
}
