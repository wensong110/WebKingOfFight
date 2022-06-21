module main

go 1.13

require (
	KOFServer v0.0.1
	github.com/gorilla/websocket v1.5.0
)

replace KOFServer v0.0.1 => ./KOFServer
