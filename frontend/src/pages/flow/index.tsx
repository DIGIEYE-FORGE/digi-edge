import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";
import { AccordionHeader, Card, List, ListItemPrefix, ListItem, Accordion, AccordionBody ,Typography} from "@material-tailwind/react";
import ReactFlow, { Controls, Background, addEdge, ReactFlowProvider, MarkerType, BackgroundVariant, Edge, updateEdge, ControlButton, useNodesState, useEdgesState, Panel, Position} from 'reactflow';
import 'reactflow/dist/style.css';
import React, { ReactNode, RefObject, useCallback, useEffect, useRef } from "react";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, BoltIcon, BookmarkIcon, ChevronDownIcon, ClipboardIcon, CodeBracketIcon, CodeBracketSquareIcon, DocumentDuplicateIcon, GlobeAltIcon, InboxIcon, KeyIcon , RectangleGroupIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import {MdEditOff, MdOutlineAlarmAdd} from "react-icons/md"
import {AiOutlineHolder, AiOutlineLogin} from "react-icons/ai"
import {TbForbid} from "react-icons/tb"
import {BiMath} from "react-icons/bi"
import {BsDeviceHdd} from "react-icons/bs"
import {AiOutlineCode,AiOutlineMail} from "react-icons/ai"
import {FaAws} from "react-icons/fa"
import {SiApachekafka, SiMqtt, SiRabbitmq} from "react-icons/si"
import {TbApi} from  "react-icons/tb"
import {TiFlowMerge} from  "react-icons/ti";
import {MdEdit} from  "react-icons/md";
import {randomNumberBetween,getId} from "./functions";
import { stringify as stringfyFlatted } from 'flatted';
import DownloadImage from "./download";


const connectionLineStyle = {
  strokeWidth: 0.8,
  stroke: '#000',
};

let defaultEdgeOptions = {
  style: { strokeWidth: 1, stroke: '#0C5866' },
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#0C5866',
  },
};

function FlowPage() {
  const { secondaryMenu } = useProvider<AppContext>();
  const [rfInstance, setRfInstance] = React.useState<any | null>(null);
  const [editFlow,setEditFlow] = React.useState<boolean>(true);
  

  useEffect(() => {
    const element = document.getElementsByClassName("icontrash");
    for (let i=0;i<element.length;i++){
      if (editFlow){
        element[i].setAttribute("style","display:block");
      }
      else{
       element[i].setAttribute("style","display:none");
      }
     }
  }, [editFlow]);

  
  const [widgets,] = React.useState<
  {
    elements:
    {
      name:string,
      icon: ReactNode,
      children:{
        color:string,
        label:string,
        icon:ReactNode
      }[]
    }
  }[]>(
    [
    {
        elements:{
            name: "filter",
            icon:<AdjustmentsHorizontalIcon className="h-5 w-5" />,
            children:[
                {
                    color:'#FDEEA9',
                    label:'Check alarm status',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },{
                    color:'#FDEEA9',
                    label:'Check alarm status',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Check existence fields',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Check relation',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Gps geofencing filter',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Message type',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Message type switch',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Originator type',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Originator type switch',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
  
                },
                {
                  
                    color:'#FDEEA9',
                    label:'Script',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                },
                {
                    color:'#FDEEA9',
                    label:'Switch',
                    icon:<AdjustmentsHorizontalIcon className="w-5 h-5"/>,
                }
            ]
        },
    },
    {
        elements:{
            name:"Enrichment",
            icon:<RectangleGroupIcon  className="h-5 w-5"/>,
            children:[
                {
                    color:'#C9FDA9',
                    label:'Check alarm status',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },{
                    color:'#C9FDA9',
                    label:'Calculate delta',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Customer attributes',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Customer details',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Fetch device credentials',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Originator attributes',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Originator fields',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Originator telemetry',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                },
                {
                    color:'#C9FDA9',
                    label:'Related attributes',
                    icon:<RectangleGroupIcon  className="h-5 w-5"/>,
                }
            ]
        },
    },
    {
        elements:{
            name:"Transformation",
            icon:<BoltIcon  className="h-5 w-5"/>,
            children:[
                {
                    color:'#A9EEFD',
                    label:'Change originator',
                    icon:<ArrowPathIcon className="h-5 w-5"/>,
                },{    
                    color:'#A9EEFD',
                    label:'Copy keys',
                    icon:<ClipboardIcon className="h-5 w-5"/>,
                },
                {
                    color:'#A9EEFD',
                    label:'Delete keys',
                    icon: <XCircleIcon className="h-5 w-5"/>,
                },
                {
                  
                    color:'#A9EEFD',
                    label:'Json path',
                    icon:<CodeBracketIcon  className="h-5 w-5"/>
                },
                {
                    color:'#A9EEFD',
                    label:'Rename keys',
                    icon:<KeyIcon className="h-5 w-5"/>
  
                },
                {
                    color:'#A9EEFD',
                    label:'script',
                    icon:<CodeBracketSquareIcon className="h-5 w-5"/>
                },
                {
                    color:'#A9EEFD',
                    label:'to email',
                    icon:<InboxIcon  className="h-5 w-5"/>
  
                },
            ]
        },
    },
    {
        elements:{
            name:"Action",
            icon:<GlobeAltIcon  className="h-5 w-5"/>,
            children:[
                {
                   
                    color:'#FDA9A9',
                    label:'Assign to customer',
                    icon:<PlusCircleIcon className="h-5 w-5" />
                },{
                   
                    color:'#FDA9A9',
                    label:'clear alarm',
                    icon:<MdOutlineAlarmAdd className="h-5 w-5" />
                },
                {
                    color:'#FDA9A9',
                    label:'copy to view',
                    icon:<DocumentDuplicateIcon className="h-5 w-5" />
                },
                {
                  
                    color:'#FDA9A9',
                    label:'Delay(deprecated)',
                    icon:<AiOutlineHolder className="h-5 w-5" />
                },
                {
                    color:'#FDA9A9',
                    label:'Delete Attributes',
                    icon:<TbForbid className="h-5 w-5" />
  
                },
                {
                   
                    color:'#FDA9A9',
                    label:'Delete relation',
                    icon:<TbForbid className="h-5 w-5" />
  
                },
                {
                   
                    color:'#FDA9A9',
                    label:'Device Profile',
                    icon:<BsDeviceHdd className="h-5 w-5" />
                },
                {
                    color:'#FDA9A9',
                    label:'Log',
                    icon:<AiOutlineLogin className="h-5 w-5" />
                },
                {
                   
                    color:'#FDA9A9',
                    label:'Math function',
                    icon:<BiMath className="h-5 w-5" />
                },
            ]
        },
       
    },
    {
        elements:{
            name:"Enrichment",
            icon:<AiOutlineCode className="h-5 w-5"/>
            ,
            children:[
                {
                   
                    color:'#FDD6A9',
                    label:'Aws cns',
                    icon:<FaAws className="h-5 w-5"/>
                },{
                   
                    color:'#FDD6A9',
                    label:'Aws sqs',
                    icon:<FaAws className="h-5 w-5"/>
                },
                {
                    color:'#FDD6A9',
                    label:'Kafka',
                    icon:<SiApachekafka className="h-5 w-5"/>
                },
                {
                    color:'#FDD6A9',
                    label:'Mqtt',
                    icon:<SiMqtt className="h-5 w-5"/>
                },
  
                {
                    color:'#FDD6A9',
                    label:'Rabbitmq',
                    icon:<SiRabbitmq className="h-5 w-5"/>
                },
                {
                    
                    color:'#FDD6A9',
                    label:'send email',
                    icon:<AiOutlineMail className="h-5 w-5"/>
                },
                {
                    color:'#FDD6A9',
                    label:'send sms',
                    icon:<AiOutlineMail className="h-5 w-5"/>
                },
                {
                    color:'#FDD6A9',
                    label:'rest api',
                    icon:<TbApi className="h-5 w-5"/>
  
                }
            ]
        },
    },
    {
        elements:{
            name:"Flow",
            icon:<TiFlowMerge className="h-5 w-5"/>,
            children:[
                {
                    color:'#E2A9FD',
                    label:'Acknowledge',
                    icon:<TiFlowMerge className="h-5 w-5"/>,
                },{
                    color:'#E2A9FD',
                    label:'Checkpoint',
                    icon:<TiFlowMerge className="h-5 w-5"/>,
                },
                {
                    color:'#E2A9FD',
                    label:'Output',
                    icon:<TiFlowMerge className="h-5 w-5"/>,
                },
  
                {
                    color:'#E2A9FD',
                    label:'Rule chain',
                    icon:<TiFlowMerge className="h-5 w-5"/>,
                },
            ]
        },
    } ])
  const[open,setOpen] = React.useState(0);
  const handleOpen = (i:number)=>{
    setOpen(i)
  }


  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
 const reactFlowWrapper: RefObject<HTMLDivElement> = useRef(null);
 
      const onConnect = useCallback((params:any) =>
      {
        if (!editFlow) return;
       setEdges((eds:any) => addEdge({...params,
      }, eds))}, [editFlow,nodes,edges]);

      const [dropData,setDropData] = React.useState<{
        color:string,
        label:string,
        icon:ReactNode
      } | null>(null);

      const onDragOver = (event:any) => {
        if (!editFlow) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      };
      const onLoad = (_reactFlowInstance:any) => {
        // Set Nodes
      };

      const onDrop =useCallback((event: React.DragEvent) => {
        event.preventDefault();
        
        const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect() || null;
        if (!reactFlowBounds) {
          return;
        }
        let id = getId();
        setNodes((prevNodes) => 
        prevNodes.concat(
          {
            id: id,
            style: {
              background: dropData?.color || '#d20d0d',
              color: '#4E5064',
              boxShadow: '0.5rem 0.5rem 1rem 0px rgba(0,0,0,0.25)',
              border: 'none',
              width: 170,
              height: 40,
              display: 'flex',
              borderRadius: 5,
              cursor: 'pointer',
              padding: 0,
              margin: 0,
            },
            position: {
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            data: {
              label: (
                <div className="w-full h-full px-2">
                  <span className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2 h-6 aspect-square flex justify-center items-center rounded-full" >
                  <TrashIcon className="h-4 w-4 text-red-500 icontrash" onClick={()=>{
                      setNodes((prevNodes) => prevNodes.filter((n) => n.id !== id));
                      setEdges((prevEdges) => prevEdges.filter((e) => e.source !== id && e.target !== id));
                  }} />
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      height: '100%',
                      whiteSpace: 'nowrap',
                      transform: 'translate(-4px,0px)',
                      position: 'relative',
                    }}
                  >
                    <span className="icons-flow whitespace-nowrap">{dropData?.icon}</span>
                    <span className="text-flow whitespace-nowrap">{dropData?.label}</span>
                  </div>
                </div>
              ),
            },
          },
        ));
      }, [dropData, editFlow]);
      const edgeUpdateSuccessful = useRef(true);
      const onEdgeUpdateStart = useCallback(() => {
        if (!editFlow) return;
        edgeUpdateSuccessful.current = false;
    }, [editFlow]);

 
   
    const onSave = useCallback(async() => {
      if (rfInstance) {
        const flow = rfInstance.toObject();
        localStorage.setItem("flow", await stringfyFlatted(flow));
      }
    }, [rfInstance]);
    
    const onEdgeUpdate = useCallback((oldEdge:any, newConnection:any) => {
        if (!editFlow) return;
        edgeUpdateSuccessful.current = true;
        setEdges((els:any) => updateEdge(oldEdge, newConnection, els));
    }, [editFlow]);

    const onEdgeUpdateEnd = useCallback((_:any, edge: Edge) => {
      if (!editFlow) return;
      if (!edgeUpdateSuccessful.current) {
        setEdges((edges) => edges.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    }, [editFlow]);


  


    // useEffect(() => {
    //   const data = localStorage.getItem("flow");
    //   if (data){
    //    console.log(parseFlatted(data));
    //   }
    // }, []);

  return (
    <ReactFlowProvider>
    <div className="flex overflow-x-hidden">
      <div
        className={`fixed top-[4rem] left-2 bottom-2 transition-[width] shadow-xl shadow-blue-gray-900/20 rounded-xl
        overflow-x-hidden overflow-y-auto bg-white
         z-[2] 
         ${
          secondaryMenu ? "w-[20rem]" : "w-12"
        } `}
      >
        <Card
        className="h-full pl-[4rem] min-w-[20rem]
			 "
        shadow={false}
      >
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            Rule chains
          </Typography>
        </div>
        <List>
          {
            widgets.map((ele:any,index:number )=>{
              return (
                <Accordion
                key={index}
                open={open == index}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${
                      open === index ? "rotate-180" : ""
                    }`}
                    onClick={()=>{
                      handleOpen(index);
                    }}
                  />
                }
              >
                <ListItem className="p-0" selected={open === index}>
                  <AccordionHeader
                    onClick={() => handleOpen(index)}
                    className="border-b-0 p-3"
                  >
                    <ListItemPrefix>
                      {ele.elements.icon}
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="mr-auto font-normal text-sm"
                    >
                      {ele.elements.name}
                    </Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1 flex flex-col  gap-2">
                  {
                    (ele?.elements?.children || []).map((dt:{
                      color:string,
                      label:string,
                      icon:ReactNode
                    },index:number)=>{
                      return (
                        <div  key ={index} draggable className={`w-[95%] h-[3rem] border mx-2 flex items-center rounded-[5px] px-2 gap-3 cursor-pointer
                        `} style={{
                          backgroundColor:dt.color
                        }}
                        onDragStart={()=>{
                          setDropData(dt);
                        }}
                        onClick={()=>{
                          if (!editFlow) return ;
                          let id = getId();
                          setNodes((prevNodes) => [
                            ...prevNodes,
                            {
                              id: id,
                              style: {
                                background: dt?.color || '#d20d0d',
                                color: '#4E5064',
                                boxShadow: '0.5rem 0.5rem 1rem 0px rgba(0,0,0,0.25)',
                                border: 'none',
                                width: 170,
                                height: 40,
                                display: 'flex',
                                borderRadius: 5,
                                cursor: 'pointer',
                                padding: 0,
                                margin: 0,
                              },
                              sourcePosition: Position.Right,
                              targetPosition: Position.Left,
                              position: {
                                x:randomNumberBetween(0,100),
                                y:randomNumberBetween(0,100),
                              },
                              data: {
                                label: (
                                  <div className="w-full h-full px-2">
                                    <span className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2">
                                      <TrashIcon className="h-4 w-4 text-red-500 icontrash"
                                        onClick={()=>{
                                          setNodes((prevNodes) => prevNodes.filter((n) => n.id !== id));
                                          setEdges((prevEdges) => prevEdges.filter((e) => e.source !== id && e.target !== id));
                                        }}
                                     />
                                    </span>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        width: '100%',
                                        height: '100%',
                                        whiteSpace: 'nowrap',
                                        transform: 'translate(-4px,0px)',
                                        position: 'relative',
                                      }}
                                    >
                                      <span className="icons-flow whitespace-nowrap">{dt?.icon}</span>
                                      <span className="text-flow whitespace-nowrap">{dt?.label}</span>
                                    </div>
                                  </div>
                                ),
                              },
                            },
                          ]);
                      }}
                        >
                          <span>{dt.icon}</span>
                          <span className="text-l font-bold">{dt.label}</span>
                        </div>
                      )
                    })
                  }
                </AccordionBody>
              </Accordion>
              )
            })
          }
        </List>
      </Card>
      </div>
      <div
        className={`w-full mx-auto max-w-[1920px] h-full transition-[padding] [&>*]:p-2 md:[&>*]:p-4 lg:[&>*]:p-6   pl-[4rem]
          ${
          secondaryMenu && " 2xl:pl-[20.5rem]"
        }`}
        ref={reactFlowWrapper}
      >
        <ReactFlow 
    
          nodes={nodes}
          edges={edges}
          snapGrid={[10, 50]}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          snapToGrid
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onLoad={onLoad}
          minZoom={0.5}
          maxZoom={1}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onInit={setRfInstance}
          className="download-image"
         >
            <Background color="#ccc" variant={BackgroundVariant.Lines} gap={24} size={1}/>
            <Controls 
            showInteractive={false}
            >
            <ControlButton onClick={() =>
                    setEditFlow((prev) => !prev)
            } title="another action">
                <div>
                  {
                    editFlow ? <MdEdit className="h-4 w-4 text-blue-gray-500"/> : <MdEditOff className="h-4 w-4 text-red-500" />
                  }
                </div>
            </ControlButton>
            <ControlButton onClick={onSave}>
              <BookmarkIcon className="h-4 w-4 text-blue-gray-500"/>
            </ControlButton>
            </Controls>
            <Panel position={"top-left"}>
              <DownloadImage/>
            </Panel>
        </ReactFlow>
      </div>
    </div>
    </ReactFlowProvider>
  );
}

export default FlowPage;
