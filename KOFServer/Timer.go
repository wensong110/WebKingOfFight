package KOFServer

import (
	"context"
	"sync"
	"time"
)

type Timer struct {
	_mutex   sync.Mutex
	cond     sync.Cond
	duration time.Duration
}

func NewTimer(millisecond int) *Timer {
	ans := &Timer{
		duration: time.Millisecond * time.Duration(millisecond),
		_mutex:   sync.Mutex{},
	}
	ans.cond = *sync.NewCond(&ans._mutex)
	return ans
}

func (timer *Timer) GetCond() *sync.Cond {
	return &timer.cond
}

func (timer *Timer) Start(ctx context.Context) {
	go func() {
		for {
			select {
			case <-ctx.Done():
				return
			default:
				timer.cond.Broadcast()
				time.Sleep(timer.duration)
			}
		}
	}()
}
