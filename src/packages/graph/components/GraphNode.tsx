/**
 * Container for node on graph.
 */

import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import CollapsedGraphNode from '../../../components/organisms/CollapsedGraphNode';
import { DragHandle } from '../../../packages/dnd-editor/components/Draggable';
import ResizableBox from '../../../packages/resizable/resizableBox';
import DrawingContext, {
  DrawingContextInterface,
} from '../context/GraphDrawingContext';
import GraphActionContext, {
  GraphActionContextInterface,
} from '../context/GraphActionContext';
import { OFFSET } from '../hooks/drawingHooks';
import { useDragNode } from '../hooks/draggingHooks';
import { Dropdown } from '../../../components/organisms/Dropdown';
import IconButton from '../../../components/atoms/IconButton';
import { updateNode } from '../../../helpers/backend/mutateHelpers';
import GraphViewContext, {
  GraphViewContextInterface,
} from '../context/GraphViewContext';
import IconCircleButton from '../../../components/molecules/IconCircleButton';
import { iconList } from '../../../theme/iconList';
import { colors } from '../../../theme/colors';
import ViewContext, {
  ViewContextInterface,
} from '../../../components/context/ViewContext';

export interface NodeProps {
  id: any;
  left: number;
  top: number;
  size: number[];
  children: ReactNode;
  title: string;
  icon: string;
  color: string;
  updateStartPos: (val: { left: number; top: number }) => void;
}
export const GraphNode: FC<NodeProps> = ({
  id,
  left,
  top,
  size,
  title,
  children,
  icon,
  color,
  updateStartPos,
}) => {
  const {
    canDrag,
    setCanDrag,
    hideSourceOnDrag,
    // addAction,
  } = useContext(GraphActionContext) as GraphActionContextInterface;

  const { drawingMode, setDrawingMode } = useContext(
    DrawingContext
  ) as DrawingContextInterface;

  const { windowVar, documentVar } = useContext(
    ViewContext
  ) as ViewContextInterface;

  const viewContext = useContext(GraphViewContext) as GraphViewContextInterface;
  const [showDropdown, setShowDropdown] = useState(false);

  //disables dragging if we're drawing
  useEffect(() => {
    if (drawingMode) {
      setCanDrag(false);
    } else {
      setCanDrag(true);
    }
  }, [drawingMode]);

  //DND dragging hook
  const [{ isDragging }, drag, preview] = useDragNode(
    id,
    left,
    top,
    size[0],
    size[1],
    canDrag
  );

  if (isDragging && hideSourceOnDrag) {
    return (
      <div
        style={{
          left,
          top,
        }}
        className='absolute'
      />
    );
  }

  return (
    <div>
      <div
        className=' h-[30px] w-[30px] absolute z-10'
        style={{ left: left - OFFSET / 2, top: top - OFFSET / 2 }}
        onMouseDown={() => {
          updateStartPos({ left, top });
          setDrawingMode(false);
        }}
        ref={drag}
      >
        <DragHandle />
      </div>
      {/* This div and the resizable box must remain siblings for the line drawing */}
      <div
        className='absolute flex flex-row justify-center align-middle items-center hover:bg-selected_white pointer-pencil rounded-md'
        style={{
          left: left - OFFSET / 2,
          top: top - OFFSET / 2,
          width: size[0] + OFFSET,
          height: size[1] + OFFSET,
        }}
        ref={preview}
        id={id}
      ></div>
      <ResizableBox
        classes={
          'p-sm overflow-hidden h-full w-full bg-base_white  h-12 rounded-sm border-grey border-[1px] flex flex-row items-center align-middle z-10 p-3 gap-x-3 border-l-[3px] '
        }
        style={{
          width: size[0],
          height: size[1],
          borderLeftColor: color,
          left,
          top,
        }}
        id={id}
      >
        {/* {size[0] > 205 || size[1] > 80 ? (
          <div className='bg-base_white h-full'>
            <EditorComponent />
            <Cube className='absolute right-sm top-sm' size={'1.5em'} />
          </div>
        ) : ( */}
        <CollapsedGraphNode
          toggleDropdown={() => setShowDropdown(!showDropdown)}
          title={title}
          id={id}
          icon={icon}
          color={color}
        />
        {/* )} */}
      </ResizableBox>
      {showDropdown && (
        <div
          className='w-full absolute'
          style={{ left: left, top: top + (2 * size[1]) / 3 }}
        >
          <Dropdown
            activeIndex={0}
            list={false}
            windowVar={windowVar}
            setShowDropdown={setShowDropdown}
            showDropdown={showDropdown}
          >
            <div>
              <div className='gap-x-0 grid grid-cols-4'>
                {colors.map((color, i) => {
                  return (
                    <div
                      className={
                        'w-[40px] h-[40px] bg-[' +
                        color +
                        '] m-1 break-inside-avoid hover:opacity-70 hover: cursor-pointer'
                      }
                      onClick={() =>
                        updateNode('color', color, id, viewContext)
                      }
                    ></div>
                  );
                })}
              </div>
              <div className='columns-4 gap-x-0'>
                {iconList.map((icon, i) => {
                  return (
                    <div className='p-2 hover:bg-gray-100 flex justify-center align-middle items-center'>
                      <IconCircleButton
                        src={icon}
                        circle={false}
                        size={40}
                        onClick={() =>
                          updateNode('icon', icon, id, viewContext)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
};
