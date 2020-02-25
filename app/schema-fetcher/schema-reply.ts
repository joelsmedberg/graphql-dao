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

export interface IType {
  name: string;
  kind: KIND | null;
  enumValues: null | Array<{ name: string}>;
  fields: null | undefined | ITypeField[];
  inputFields: null | undefined | ITypeField[];
}

export interface ITypeField {
  name: string;
  type: {
    kind: KIND | null | undefined;
    ofType: INameDesc | undefined;
    name: string | undefined;
  };
}

export interface INameDesc {
  name: string;
  description: string | undefined;
}

export interface IFieldReturnType {
  name: string | undefined | null;
  kind: KIND | null | undefined;
  enumValues: null | Array<{ name: string}>;
  ofType: IOfType;
}

export interface IField extends INameDesc {
  type: IFieldReturnType;
  args: IArg[];
}

export interface IOfType extends INameDesc {
  kind: KIND | null | undefined;
  name: string;
}

export interface IArg extends INameDesc {
  defaultValue?: string | undefined | null;
  type: {
    kind: KIND | null | undefined;
    ofType: IOfType | undefined;
    name: string | undefined;
  };
}

export type KIND = "OBJECT" | "LIST" | "SCALAR" | "INPUT_OBJECT" | "ENUM";
