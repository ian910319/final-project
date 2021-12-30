import './Cell.css'

const Cell = ({ value, columnIndex, play }) => {
    let color = 'whiteCircle'
  
    if (value === 1) { color = 'redCircle'} 
    else if (value === 2) { color = 'yellowCircle'}
  
    return (
        <div
            className="gameCell"
            onClick={() => {
                play(columnIndex)
            }}
        >  
            <div className={color}></div>
        </div>
    )
}

export default Cell