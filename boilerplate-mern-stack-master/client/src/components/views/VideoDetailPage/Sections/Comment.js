import Axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment'


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
                    //setCommentValue("")
                    props.refreshFunction(response.data.result)
                } else {
                    alert('댓글 저장에 실패 했습니다')
                }
            })
    }

    
  return (
    <div>
       <br />
            <p> replies</p>
            <hr />

            {/*Comment list */}

            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment refreshFunction={refreshFunction} comment={comment} postId={props.postId}  />
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
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
