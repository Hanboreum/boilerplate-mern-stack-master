import React from 'react'

function SideVideo() {
  return (
    <div style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
       <div style={{ width:'40%', marginRight:'1rem' }}>
            <a href>
                <img style={{ width: '100%' }} src alt/>
            </a>    
      </div>  
      <div style={{ width:'50%' }}>
            <a href>
                <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}  </span><br />
                <span>{video.writer.name}</span><br />
                <span>{video.views}</span><br />
                <span>{minutes} : {seconds}</span><br />
            </a>
        </div>
    </div> 
  )
}

export default SideVideo
