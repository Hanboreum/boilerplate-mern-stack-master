import  React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import { Card, Avatar, Col, Typography, Row } from 'antd';
import moment from 'moment';
import Axios from 'axios';
//import { response } from 'express';

const { Title } = Typography;
const { Meta } = Card;


function LandingPage() {

    const [Video, setVideos] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.videos)
                    setVideos(response.data.videos)
                } else {
                    alert('비디오 가져오기를 실패했습니다')
                }
            })
    }, [])

    
    const renderCards = Video.map((video,index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>
         <a href={`/video/${video._id}`} >
             <div style={{ position: 'relative' }}>
             <img style={{ width: '100%' }} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
             <div className=" duration">
             <span>{minutes} : {seconds}</span>
             </div>
             </div>
             </a>
             <br/>
             <Meta
                avatar={
                    <Avatar src={video.writer.image} />
                }
                title={video.title}
                description=" "
            />
            <span>{video.writer.name} </span><br />
            <span style={{ marginLeft: '3rem' }}> {video.views}</span>
            - <span> {moment(video.createdAt).format("MMM Do YY")} </span>

            
      </Col>

    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
        <Title level={2} > 추천 영상 </Title>
        <hr />
    <Row gutter={[32, 16]}>

   {renderCards}
            
    </Row>
    </div>
    
          
    );
}

export default LandingPage
