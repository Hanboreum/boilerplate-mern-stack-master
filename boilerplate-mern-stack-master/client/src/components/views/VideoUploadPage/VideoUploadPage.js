import React, { useState,useEffect } from 'react'
import { Typography, Button, Form, message, Input, Icon} from 'antd'
import Dropzone from 'react-dropzone'
import Axios from 'axios';
import { useSelector } from "react-redux";

import { responsiveMap } from 'antd/lib/_util/responsiveObserve';
//import TextArea from 'antd/lib/input/TextArea';

const{TextArea} = Input;
const {Title} = Typography;

const PrivateOptions =[
    {value:0, label: "Private"},
    {value: 1, label: "Public"}
];

const CategoryOption =[
    {value:0, label:"학교 시설 정보"},
    {value:1, labe:"학교 일정"},
    {value:2, label:"학생 지원"},
    {value:3, label:"주변 시설"}
];


function VideoUploadPage(props) {
    const user = useSelector(state => state.user);

    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState("Film")
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")
    


    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e)=> {
      setDescription(e.currentTarget.value)
    }

    const onPrivateChange =(e)=>{
      setPrivate(e.currentTarget.value)
    }

    const onCategoryChange = (e) =>{
      setCategory(e.currentTarget.value)
    }

    const onDrop = (files) => {
     let formData  = new FormData();
     formData.append("file", files[0]); //추가
     const config = {
      header: {'content-type': 'multipart/form-data'}
     }
     console.log(files)
     formData.append("file",files[0])
     
     Axios.post('/api/video/uploadfiles',formData, config)
     .then(response => {
      if(response.data.success){
        //console.log(response.data)

        let variable ={
          filePath:response.data.filePath, //url, filename
          fileName: response.data.fileName
        }

        setFilePath(response.data.filePath) //url,filename

        Axios.post('/api/video/thumbnail', variable)
        .then(response => {
          if(response.data.success) {

            setDuration(response.data.fileDuration)
            setThumbnailPath(response.data.thumbsFilePath) //url,filename

            console.log(response.data)
          }else {
            alert('썸네일 생성 실패');
          }
        }); //;추가

      }else{
        alert('비디오 업로드 실패.');
      }
     }); //;
    }; //;

    const onSubmit = (e) => {
      e.preventDefault();

      if (user.userData && !user.userData.isAuth) {
        return alert('Please Log in First')
    }

    if (Title === "" || Description === "" ||
        Category === "" || FilePath === "" ||
        Duration === "" || ThumbnailPath === "") {
        return alert('Please first fill all the fields')
    }

      const variables = {
        writer: user.userData._id,
        title: VideoTitle,
        description: Description,
        privacy: Private,
        filePath: FilePath,
        category: Category,
        duration: Duration,
        thumbnail: ThumbnailPath
    };

      Axios.post('/api/video/uploadVideo',variables)
      .then(response => {
        if (response.data.success) {
          message.success('성공적으로 업로드를 했습니다')

          setTimeout(()=>{
            props.history.push('/')

          }, 2000);
         
        } else {
            alert('비디오 업로드 실패')
        }
    }); //; 
  }; //;



  return (
    <div style={{maxWidth:'700px' , margin:'2rem auto'}}>
        <div style={{ textAlign:'center', marginBottom:'2rem'}} >
            <Title level={2} >Upload Video</Title>

        </div>

        <Form onSubmit={onSubmit}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                     {/**drop zone */}

                     <Dropzone
                     onDrop = {onDrop}
                     multiple ={false}
                     maxSize ={100000000000}
                     >
                     {({ getRootProps, getInputProps}) =>(
                        <div style={{width:'300px', height:'240px', border:'1px solid lightgray', display :'flex',
                         alignItems:'center', justifyContent:'center'}}{...getRootProps()}>
                            <Input {...getInputProps()}/>
                            <Icon type='plus' style={{fontSize:'3rem'}}/>

                        </div>
                     ) }

                        
                    </Dropzone> 
                     
                     {/**thumnail */}

                     {ThumbnailPath !== "" &&
                     <div>
                     <img src={`http://localhost:5000/${ThumbnailPath}`} alt ="thumbnail"/>
                     </div>
                     }
                     
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
       
       <select onChange = {onPrivateChange}> 
                 {PrivateOptions.map((item, index) =>(
                   <option key ={index} value={item.value}>{item.label}</option>
                 ))}
       </select>

        <br/>
        <br/>
       <select onChange = {onCategoryChange}>
            {CategoryOption.map((item, index) => (
                <option key={index} value={item.value}>{item.label}</option>

            ))}
        
       </select>
       <br/>
       <br/>
    
       <Button type="primary" size = "large" onClick={onSubmit}>
        Submit
       </Button>

        </Form>
      
    </div>
  )
}

export default VideoUploadPage
