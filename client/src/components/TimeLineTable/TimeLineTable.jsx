import "./style.css"

export const TimeLineTable = props => {
  return (
    <div className="Table">
      <div>Данные</div>
      <div className="tableTimeLine">
        <div className="item">Статус</div>
        <div className="item">Start</div>
        <div className="item">End</div>
        <div className="item">Time</div>
        {props.statuses &&
          props.statuses.map(element => {
            const className = `item ${element.color}`

            return (
              <>
                <div className={className}>{element.value}</div>
                <div className={className}>
                  {element.start.format("DD-MM-YYYY")}
                </div>
                <div className={className}>
                  {element.end.format("DD-MM-YYYY")}
                </div>
                <div className={className}>{element.time}</div>
              </>
            )
          })}
      </div>
    </div>
  )
}
