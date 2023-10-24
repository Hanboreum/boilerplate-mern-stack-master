import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment';
import { Button, Input } from 'antd';
const { TextArea } = Input;


function Comment(props) {

    const user = useSelector(state => state.user)
    const [CommentValue, setCommentValue] = useState("")
    const videoId = props.postId


    const handleClick = (e) =>{
        setCommentValue(e.currentTarget.value)


    }
 
    const onSubmit = (e) =>{
        e.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
                    setCommentValue("") //추가
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글 저장에 실패 했습니다')
                }
            })
    }

    
  return (
    <div>
       <br />
            <p> 답글</p>
            <hr />

            {/*Comment list */}
            {console.log(props.CommentLists)}

            {props.commentLists && props.commentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment >
                        <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={videoId}  />
                        <ReplyComment refreshFunction={props.refreshFunction} postId={videoId} parentCommentId={comment._id}  />
                    </React.Fragment> // postId={props.postId}
                )
            ))}

             {/* Root Comment Form */}
             <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange ={handleClick}
                    value={CommentValue}
                    placeholder="코멘트를 작성해 주세요"
                />

                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
            </form>

    </div>
  )
}

export default Comment
