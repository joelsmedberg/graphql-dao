export interface IDaoBuildInterface {
  classes: {
    [key: string]: IDaoClassDescription;
  };
  types: {
    [typeName: string]: IQlType;
  };
}

export interface IQlType {
  [fieldName: string]: string;
}

export interface IDaoClassDescription {
  className: string;
  imports: string[];
  fns: IDaoFunction[];
}

export interface IDaoFunction {
  mutation: boolean;
  fnName: string;
  className: string;
  references: string[];
  queryFields: ITypeTreeNode | undefined;
  tsReturnType: string;
  description?: string;
  inputArguments: IDaoFnInput[];
}
export type Dict<T = any> = { [key: string]: T };

export interface ITreeDictionary {
  [key: string]: ITypeTreeNode;
}

export interface ITypeTreeNode {
  primitives: string[];
  name: string | undefined;
  type: string | undefined;
  nodes: ITypeTreeNode[];
}

export interface IDaoFnInput {
  isObject: boolean;
  inputName: string;
  tsType: string;
  qlType: string;
  isList: boolean;
}
