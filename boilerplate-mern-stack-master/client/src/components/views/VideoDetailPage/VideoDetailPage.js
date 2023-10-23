import React, { useEffect, useState } from 'react'
import { List, Avatar, Row, Col, Input, Button } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable ={ videoId:videoId }
    const [Video, setVideo] = useState([])
    const [VideoDetail, setVideoDetail] = useState([])
    //const [Comments, setComments] =useState(intitalState)

    
    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videoDetail) //video,videoDetail로 수정 후 에러 해결
                    setVideoDetail(response.data.videoDetail) //VideoDetail
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다. ')
                }
            })
            
        },[])
        
        if(VideoDetail.writer) {
            console.log(VideoDetail)

            const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId')&& <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
            
            return (
                <Row gutter ={[16,16]}>
                <Col lg ={18} xs = {24}>

                    <div style={{width:'100%', padding:'3rem 4rem'}}>
                        <video style={{width: '100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
            
                        <List.Item
                          actions ={[subscribeButton]} 
                        >
                         <List.Item.Meta
                             avatar={<Avatar src={VideoDetail.writer.image} />}
                             title={VideoDetail.writer.name}
                             description={VideoDetail.description}
                          />
            
                        </List.Item>
            
                        {/*comment*/}
                        <Comment/>
            
                    </div>
            
            
                </Col>
                <Col lg ={6} xs = {24}>
                    <SideVideo/>
                </Col>
            
                </Row>
            
              )            
            
        } else{
            return (
                <div>
                    Loading....
                </div>
            )
        }
    
  }

export default VideoDetailPage
