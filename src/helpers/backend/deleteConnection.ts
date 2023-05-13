import { GraphViewContextInterface } from '../../packages/graph/context/GraphViewContext';

export const deleteConnection = (
  start: string,
  end: string,
  viewContext: GraphViewContextInterface
) => {
  viewContext.setAlert(
    'Deleted connection from ' +
      viewContext.nodeData_Graph[start].title +
      ' to ' +
      viewContext.nodeData_Graph[end].title
  );
  let newNodes = { ...viewContext.nodeData_Graph };
  delete newNodes[start].connections[end];
  delete newNodes[end].connections[start];

  viewContext.setnodeData_Graph(newNodes);
};