package KOFServer

import (
	"context"
	"testing"
	"time"
)

func TestTimer(t *testing.T) {
	timer := NewTimer(1000)
	go func() {
		cnt := 10
		for cnt != 0 {
			timer._mutex.Lock()
			timer.GetCond().Wait()
			t.Log(cnt)
			cnt--
			timer._mutex.Unlock()
		}
	}()
	timer.Start(context.Background())
	time.Sleep(time.Second * 10)
}
