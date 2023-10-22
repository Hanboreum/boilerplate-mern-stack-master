import { InputNumber } from 'antd'
import React, { useEffect, useState } from 'react'

import Axios from 'axios';

function Subscribe(props) {
    const userTo = props.userTo
    const userFrom = props.userFrom

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)
    
    useEffect(() => {

        let variable = { userTo : props.userTo}

        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }

        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자수 정보를 받아오지 못함')
                }
            })

        let subscribedrVariable = { userTo: userTo, userFrom: localStorage.getItem('userId') }

        Axios.post('/api/subscribe/subscribed', subscribedrVariable)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subcribed)
                } else {
                    alert('정보를 받아오지 못함')
                }
            })

    }, [])

     const onSubscribe = ( ) => {

        let subscribeVariable = {
                userTo : props.userTo,
                userFrom :props.userFrom
        }

        if(Subscribed) {
            //이미 구독 중 
            Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success){ 
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 실패에 실패')
                    }
                })

        } else {
            // 구독 중 아님  
            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독에 실패')
                    }
                })
        
            }

    }


  return (
     <div>
            <button 
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : ' #0019CF'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}
            onClick={onSubscribe}

            >
                {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
        </div>
  )
}

export default Subscribe
