import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd'
import Dropzone from 'react-dropzone'
//import TextArea from 'antd/lib/input/TextArea';

const{TextArea} = Input;
const {Title} = Typography;

const PrivateOptions =[
    {value:0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOption =[
    {value:0, label:"Film"},
    {value:1, labe:"Autos & Vehcles"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"}
]


function VideoUploadPage() {

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film")

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = ()=> {

    }


  return (
    <div style={{maxWidth:'700px' , margin:'2rem auto'}}>
        <div style={{ textAlign:'center', marginBottom:'2rem'}} >
            <Title level={2} >Upload Video</Title>

        </div>

        <Form onSubmit>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                     {/**drop zone */}

                     <Dropzone
                     onDrop
                     multiple
                     maxSize>
                     {({ getRootProps, getInputProps}) =>(
                        <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display :'flex',
                         alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                            <Input {...getInputProps()}/>
                            <Icon type='plus' style={{fontSize:'3rem'}}/>

                        </div>
                     ) }

                        
                    </Dropzone> 
                     
                     {/**thumnail */}
                     <div>
                        <img src alt/>
                     </div>
            </div>

        <br/>
        <br/>
        <label>Title</label>
        <Input
          onChange={onTitleChange}
          value={VideoTitle}
        
        />
        <br/>
        <br/>
        <label>Description</label>
        <TextArea
         onChange={onDescriptionChange}
         value ={Description}
        />
        <br/>
        <br/>
       
       <select onChange> 
                 {PrivateOptions.map((item, index) =>(
                   <option key ={index} value={item.value}>{item.label}</option>
                 ))}
       </select>

        <br/>
        <br/>
       <select onChange>
            {CategoryOption.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>

            ))}
         <option key value></option>
       </select>
       <br/>
       <br/>
    
       <Button type="primary" size = "large" onclick>
        Submit
       </Button>

        </Form>
      
    </div>
  )
}

export default VideoUploadPage
