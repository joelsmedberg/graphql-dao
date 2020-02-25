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

export interface IReference {
  name: string;
  isEnum: boolean;
}

export interface IDaoClassDescription {
  className: string;
  imports: IReference[];
  fns: IDaoFunction[];
}

export interface IDaoFunction {
  mutation: boolean;
  fnName: string;
  className: string;
  references: IReference[];
  queryFields: ITypeTreeNode | undefined;
  tsReturnType: string;
  description?: string;
  inputArguments: IDaoFnInput[];
}

export interface ITreeDictionary {
  [key: string]: ITypeTreeNode;
}

export interface ITypeTreeNode {
  primitives: string[];
  isEnum: boolean;
  name: string | undefined;
  type: string | undefined;
  nodes: ITypeTreeNode[];
}

export interface IDaoFnInput {
  inputName: string;
  tsType: string;
  qlType: string;
  isList: boolean;
  isEnum: boolean;
}
