export interface ISchemaReply {
  data: {
    __schema: ISchema
  };
}

export interface ISchema {
  queryType: {
    fields: IField[]
  };
  mutationType: {
    fields: IField[]
  };
  types: IType[];
}

export interface INode {
  name: string | null;
  kind: KIND | null;
}

export interface IType extends INode {
  enumValues: null | Array<{ name: string }>;
  fields: null | undefined | ITypeField[];
  inputFields: null | undefined | ITypeField[];
}

export interface ITypeField {
  name: string;
  type: ISubType;
}

export interface INodeDescription extends INode {
  description: string | undefined;
}

export interface IEnumHolder extends ISubType {
  enumValues: null | Array<{ name: string }>;
}

export interface IField extends INodeDescription {
  type: IEnumHolder;
  args: IArg[];
}

export interface ISubType {
  kind: KIND | null | undefined;
  ofType: ISubType | undefined;
  name: string | undefined;
}

export interface IArg extends INodeDescription {
  defaultValue?: string | undefined | null;
  type: ISubType;
}

export type KIND = "OBJECT" | "LIST" | "SCALAR" | "INPUT_OBJECT" | "ENUM";
