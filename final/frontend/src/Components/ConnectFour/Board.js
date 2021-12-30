import Cell from './Cell'
const Board = (props) => {
    const { board } = props;
  
    return (
      <div className="board-container">
        {
            board.map((singleRow, index1) => {
                const Id = 'row'+index1.toString() 
                return (
                    <div style = {{display: "flex"}} key = {index1} id={Id}>
                        {singleRow.map((singleBlock, index2) => {
                            return (
                                <Cell />
                            );
                        })}
                    </div>
                );
            })
        }
      </div>
    );
  };
  
  export default Board;