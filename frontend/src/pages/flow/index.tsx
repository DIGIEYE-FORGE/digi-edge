import { Outlet } from "react-router-dom";
import { AppContext } from "../../App";
import { useProvider } from "../../components/provider";
import { AccordionHeader, Card, List, ListItemPrefix, ListItemSuffix, Typography, ListItem, Accordion, AccordionBody } from "@material-tailwind/react";
import ReactFlow, { Controls, Background, applyEdgeChanges, applyNodeChanges, addEdge, ReactFlowProvider, MarkerType, updateEdge, BackgroundVariant, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import React, { ReactNode, useCallback } from "react";
import { AdjustmentsHorizontalIcon, ArrowPathIcon, BoltIcon, ChevronDownIcon, ChevronRightIcon, ClipboardIcon, CodeBracketIcon, CodeBracketSquareIcon, Cog6ToothIcon, DocumentDuplicateIcon, GlobeAltIcon, InboxIcon, KeyIcon, PowerIcon, PresentationChartBarIcon, RectangleGroupIcon, UserCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import {MdOutlineAlarmAdd} from "react-icons/md"
import {AiOutlineHolder, AiOutlineLogin} from "react-icons/ai"
import {TbForbid} from "react-icons/tb"
import {BiMath} from "react-icons/bi"
import {BsDeviceHdd} from "react-icons/bs"
import {AiOutlineCode,AiOutlineMail} from "react-icons/ai"
import {FaAws} from "react-icons/fa"
import {SiApachekafka, SiMqtt, SiRabbitmq} from "react-icons/si"
import {TbApi} from  "react-icons/tb"
import {TiFlowMerge} from  "react-icons/ti"
const randomNumberBetween = (number1:number, number2:number) => {
  return Math.floor(Math.random() * (number2 - number1 + 1) + number1);
}


let id = 0;
const getId = () => `dndnode_${id++}`;

const connectionLineStyle = {
  strokeWidth: 0.8,
};

const defaultEdgeOptions = {
  style: { strokeWidth: 1 },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
};
function FlowPage() {
  const { secondaryMenu } = useProvider<AppContext>();
  const [widgets,setWidgets] = React.useState<
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

  const [initialNodes,setInitialNodes ]= React.useState<Node[]>([]);
  const [initialEdges,setInitialEdges]  = React.useState<Edge[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);
  const reactFlowWrapper = React.useRef(null);
  const onNodesChange = useCallback(
    (changes:any) =>
     setInitialNodes((nds) =>applyNodeChanges(changes, nds)),
    []
    );
    const onEdgesChange = useCallback(
      (changes:any) => setInitialEdges((eds) => applyEdgeChanges(changes, eds)),
      []
      );
      const onConnect = useCallback((params:any) => setInitialEdges((eds:any) => addEdge({...params, type: 'floating'
      }, eds)), []);
    
  
      // const onDrop = (event) => {
      //   event.preventDefault();

      //   const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect() || null;
      //   const type = event.dataTransfer.getData("application/reactflow");
      //   const position = reactFlowInstance.project({
      //     x: event.clientX - reactFlowBounds.left,
      //     y: event.clientY - reactFlowBounds.top
      //   });
      //   const newNode = {
      //     id: getId(),
      //     type,
      //     position,
      //     sourcePosition: "right",
      //     targetPosition: "left",
      //     data: { label: `${type} node` }
      //   };
    
        
      // };

    
  return (
    <ReactFlowProvider>
    <div className="flex overflow-x-hidden">
      <div
        className={`fixed top-[4rem] left-2 bottom-2 transition-[width] shadow-xl shadow-blue-gray-900/20 rounded-xl overflow-hidden
         z-[2] 
         overflow-y-scroll
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
                    })=>{
                      return (
                        <div draggable className={`w-[95%] h-[3rem] border mx-2 flex items-center rounded-[5px] px-2 gap-3 cursor-pointer
                        `} style={{
                          backgroundColor:dt.color
                        }}
                        onDragStart={(e)=>{
                          console.log(dt);
                          console.log("test",e);
                        }}
                        onClick={()=>{
                          setInitialNodes([...initialNodes,{
                              id: getId(),
                              type:'selectorNode',
                              style: { 
                                  background: dt.color || '#d20d0d', color: '#4E5064', border: '1px solid #4E5064', width: 170, height: 30,
                                  display: 'flex',borderRadius: 5, cursor: 'pointer'
      
                           },
                              position: { x: randomNumberBetween(10,100), y: randomNumberBetween(10,100) },
                              data: { label: <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  width: '100%',
                                  height: '100%',
                                  transform: 'translate(-4px,0px)'
                              }}>
                                 <span className='icons-flow'>{dt.icon}</span>
                                 <span className='text-flow'>{dt.label}</span>
                              </div>},               
                          }])
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
        ref ={reactFlowWrapper}
      >
        <ReactFlow 
          nodes={initialNodes}
          edges={initialEdges}
          snapGrid={[15, 15]}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView={true}
          snapToGrid={true}
          connectionLineStyle={connectionLineStyle}
          defaultEdgeOptions={defaultEdgeOptions}
          onConnect={onConnect}
         >
            <Background color="#ccc" variant={BackgroundVariant.Lines} gap={12} />
            <Controls />
        </ReactFlow>
      </div>
    </div>
    </ReactFlowProvider>
  );
}

export default FlowPage;
