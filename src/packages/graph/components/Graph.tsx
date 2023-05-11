/**
 * Main Graph component
 * Creates and sets all the global props that go into Context wrappers
 */

import React, { useContext, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../../backend/driver/fetcher';
import {
  ConnectionData,
  GraphNodeData,
  NodeData,
} from '../../../schemas/Data_structures/DS_schema';
import DrawingContext from '../context/GraphDrawingContext';
import GraphViewContext from '../context/GraphViewContext';
import { BoxDragLayer } from '../helpers/BoxDragLayer';
import { handleDrawingHotkey } from '../hooks/drawingHooks';
import { GraphContainer } from './GraphContainer';
import ViewContext, {
  ViewContextInterface,
} from '../../../components/context/ViewContext';
import { getTags } from '../../../helpers/backend/getHelpers';
import SplitPaneContext, {
  SplitPaneContextInterface,
} from '../../../components/organisms/split-pane/SplitPaneContext';

const Graph: React.FC<{
  viewId: string;
}> = ({ viewId }) => {
  if (!document || !window) return <div></div>;

  const { nodeId, username } = useContext(ViewContext) as ViewContextInterface;

  const { data, error, isLoading } = useSWR(
    nodeId ? `/api/${username}/${nodeId}/graph/${viewId}` : null,
    fetcher
  );
  let nodeData: { [key: string]: NodeData } = {};
  let visualData: { [key: string]: GraphNodeData } = {};
  if (!isLoading) {
    for (let node in data) {
      let nodeConnections: { [key: string]: ConnectionData } = {};
      for (let connection in data[node].connections) {
        nodeConnections[data[node].connections[connection].endNode] = {
          ...data[node].connections[connection],
          content: [],
        };
      }
      nodeData[data[node].node.id] = {
        ...data[node].node,
        icon: 'block',
        connections: nodeConnections,
        color: 'black',
      };

      visualData[data[node].node.id] = data[node].relationship;
    }
  }

  //Graph in view of one node
  const [nodeInView, setNodeInView] = useState('homenode');
  //Data of nodes to display (comes from Connection information between each node and the node in view)

  // node data
  const [nodeData_Graph, setnodeData_Graph] = useState(
    // getNodesToDisplay(nodeInView, allNodes)
    nodeData
  );

  // nodeVisualData_Graph is
  const [nodeVisualData_Graph, setnodeVisualData_Graph] = useState(visualData);

  const [currGraphViewId, setCurrGraphViewId] = useState(viewId);
  console.log('nodeData_Graph');
  console.log(JSON.stringify(nodeData_Graph));
  console.log('nodeVisualData_Graph');
  console.log(nodeVisualData_Graph);

  useEffect(() => {
    setnodeData_Graph(nodeData);
    setnodeVisualData_Graph(visualData);
  }, [isLoading]);

  //Drawing states
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawingMode, setDrawingMode] = useState(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  //Drawing line data
  const startNode = useRef<string>('');
  const endNode = useRef<string>('');

  //Line functions for detecting arrows
  let isPointInCanvasFuncs = useRef<any>({});
  let numPointsInTriangleFuncs = useRef<any>({});

  //Modal to show node details and connection details
  const [modalNode, setModalNode] = useState('');

  const [showModalConnection, setShowModalConnection] = useState(false);
  // const [currConnection, setCurrConnection] = useState(lines[0]);

  // Hot key for undo/redo
  useEffect(() => {
    const listenerFunc = (evt: any) => {
      evt.stopImmediatePropagation();
      if (evt.code === 'KeyZ' && (evt.ctrlKey || evt.metaKey) && evt.shiftKey) {
        // redo();
      } else if (evt.code === 'KeyZ' && (evt.ctrlKey || evt.metaKey)) {
        // undo();
      }
    };
    document.addEventListener('keydown', (event) => listenerFunc(event));
    return document.removeEventListener('keydown', (event) =>
      listenerFunc(event)
    );
  }, []);

  //graph view tags default
  const [tags, setTags] = useState(getTags(nodeData_Graph));

  return (
    <div
      onKeyDown={(event) =>
        handleDrawingHotkey(event, drawingMode, setDrawingMode)
      }
      tabIndex={-1}
      ref={containerRef}
    >
      <DrawingContext.Provider
        value={{
          startNode: startNode,
          endNode: endNode,
          isPointInCanvasFuncs: isPointInCanvasFuncs,
          numPointsInTriangleFuncs: numPointsInTriangleFuncs,
          drawingMode: drawingMode,
          setDrawingMode: setDrawingMode,
          isDrawing: isDrawing,
          setIsDrawing: setIsDrawing,
        }}
      >
        <GraphViewContext.Provider
          value={{
            setNodeInView: setNodeInView,
            nodeData_Graph: nodeData_Graph,
            setnodeData_Graph: setnodeData_Graph,
            nodeVisualData_Graph: nodeVisualData_Graph,
            setnodeVisualData_Graph: setnodeVisualData_Graph,
            modalNode: modalNode,
            setModalNode: setModalNode,
            nodeInView: nodeInView,
            graphViewId: currGraphViewId as string,
            setGraphViewId: setCurrGraphViewId,
            tags: tags,
            setTags: setTags,
          }}
        >
          <GraphContainer />
          {/* <BoxDragLayer parentRef={containerRef} /> */}
        </GraphViewContext.Provider>
      </DrawingContext.Provider>
    </div>
  );
};

export default Graph;
