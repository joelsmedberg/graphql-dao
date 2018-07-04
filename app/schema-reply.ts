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
  fields: null | undefined | ITypeField[];
  inputFields: null | undefined | ITypeField[];
}

export interface ITypeField {
  name: string;
  type: {
    kind: string |  undefined;
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
  kind: string;
  ofType: undefined | {
    name: string;
  };
}

export interface IField extends INameDesc {
  type: IFieldReturnType;
  args: IArg[];
}

export interface IArg extends INameDesc {
  defaultValue?: string | undefined | null;
  type: {
    kind: string |  undefined;
    ofType: INameDesc | undefined;
    name: string | undefined;
  };
}
