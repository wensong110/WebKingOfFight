package KOFServer

type Option int

const (
	UP Option = iota
	DOWN
	LEFT
	RIGHT
)

type LogicOption struct {
	Option Option
	Key    int
}

type PlayerOptions struct {
	PlayerIndex int
	Options     []LogicOption
}

func NewPlayerOptions(index int) *PlayerOptions {
	return &PlayerOptions{
		PlayerIndex: index,
		Options:     make([]LogicOption, 0),
	}
}

type LogicFrame struct {
	LogicFrameCnt int
	Input         []*PlayerOptions
}

var LogicFrameCnt int = 0

func (p *LogicFrame) CollectPlayerOptions(playerOptions *PlayerOptions) {
	p.Input = append(p.Input, playerOptions)
}
func NewLogicFrame() *LogicFrame {
	LogicFrameCnt++
	return &LogicFrame{
		LogicFrameCnt: LogicFrameCnt,
		Input:         make([]*PlayerOptions, 0),
	}
}
