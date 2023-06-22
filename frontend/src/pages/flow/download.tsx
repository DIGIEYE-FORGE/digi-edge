import {  useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';


function downloadImage(dataUrl: any) {
    const a = document.createElement('a');
  
    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

function DownloadImage() {
    const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
    toPng(document.querySelector('.react-flow__viewport') as  HTMLElement
    , {
      backgroundColor: '#95a5bc',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth+"",
        height: imageHeight+"",
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };
  return (
    <button className="download-btn  bg-blue-gray-400/100 h-[3rem] rounded-lg p-2" onClick={onClick}>
        Download Image
    </button>
  )
}

export default DownloadImage