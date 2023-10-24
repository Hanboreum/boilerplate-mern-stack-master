import React, { useEffect, useState } from 'react'
import { Tooltip, Icon, Input } from 'antd';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)
    let variable = {};
    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
       variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(()=> {      
        Axios.post('/api/like/getLikes', variable)
        .then(response => {
            console.log('getLikes',response.data)

            if (response.data.success) {
                //얼마나 많은 좋아요를 받았는가
               setLikes(response.data.likes.length)

                //이미 좋아요를 눌렀는지
                response.data.likes.map(like => {
                   if (like.userId === props.userId) {
                        setLikeAction('liked')
                    }
                })

            } else {
                alert('좋아요 정보를 가져오지 못했습니다')
            }
        })
        Axios.post('/api/like/getDislikes', variable)
        .then(response => {
           // console.log('getDislike',response.data)
            if (response.data.success) {
                //얼마나 많은 싫어요를 받았는지 
                setDislikes(response.data.dislikes.length)

                //내가 이미 싫어요를 눌렀는지
                response.data.dislikes.map(dislike => {
                    if (dislike.userId === props.userId) {
                        setDislikeAction('disliked')
                    }
                })
            } else {
                alert('싫어요 정보를 가져오지 못했습니다')
            }
        })


    },[])

    const onLike=()=> {
        if (LikeAction === null){
            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        //dislike 가 이미 눌러져있다면 
                        if (DislikeAction !== null) {
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }

                    } else {
                        alert('좋아요를 올리지 못했습니다')
                    }
                })

        } else {

            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes - 1)
                        setLikeAction(null)

                    } else {
                        alert('좋아요를 지우지 못했습니다')
                    }
                })

        }

    }

    const onDisLike=() => {

        if (DislikeAction !== null) {

            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)

                    } else {
                        alert('싫어요를 지우지 못했습니다')
                    }
                })

        } else {

            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')

                        //싫어요 버튼이 이미 눌려있다면
                        if(LikeAction !== null ) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }

                    } else {
                        alert('싫어요를 누르지 못했습니다')
                    }
                })
        }
    }



  return (
    <div>
      <span key="comment-basic-like">
      <Tooltip title="Like">
            <Icon type="like"
                  theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                  onClick ={onLike}  /> 
      </Tooltip>
      <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
      </span>&nbsp;&nbsp;

      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}

                    />
         </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
        
      </span>&nbsp;&nbsp;
    </div>
  )
}

export default LikeDislikes
