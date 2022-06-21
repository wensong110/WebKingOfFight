package KOFServer

import (
	"encoding/json"
	"testing"
)

func TestMain(t *testing.T) {
	logicFrameTest1 := NewLogicFrame()
	logicFrameTest1.CollectPlayerOptions(NewPlayerOptions(0))
	bytes, err := json.Marshal(logicFrameTest1)
	if err == nil {
		str := string(bytes)
		t.Log(str)
	} else {
		t.Log(err)
	}
}
