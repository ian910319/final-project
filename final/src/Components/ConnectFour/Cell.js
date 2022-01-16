import './Cell.css'

const Cell = ({ value, columnIndex, play, gameOver, turn }) => {
    let color = 'whiteCircle'
  
    if (value === 1) { color = 'redCircle'} 
    else if (value === 2) { color = 'yellowCircle'}
  
    return (
        <div
            className="gameCell"
            onClick={() => {
                play(columnIndex)
            }}
            style = {{pointerEvents: (turn||gameOver)?"none":""}}
        >  
            <div className={color}></div>
        </div>
    )
}

export default Cell